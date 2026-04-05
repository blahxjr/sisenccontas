'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { ArrowLeft, AlertCircle, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { apiInterno } from '@/lib/api-interno';
import type { UsuarioInterno } from '@/lib/auth';
import type { Session } from 'next-auth';

type UsuarioSessao = Session['user'] & Partial<UsuarioInterno>;
type StatusSolicitacao = 'PENDENTE' | 'EM_ANALISE' | 'CONCLUIDO' | 'CANCELADO' | 'REJEITADO';

interface SolicitacaoDetalhe {
  id: string;
  numeroProtocolo: string;
  agencia: string;
  numeroConta: string;
  titularNome: string;
  motivoEncerramento: string | null;
  status: StatusSolicitacao;
  aceiteTermosVersao: string;
  aceiteTermosTimestamp: string;
  criadoEm: string;
  atualizadoEm: string;
}

const STATUS_LABEL: Record<StatusSolicitacao, string> = {
  PENDENTE: 'Pendente',
  EM_ANALISE: 'Em Análise',
  CONCLUIDO: 'Concluído',
  CANCELADO: 'Cancelado',
  REJEITADO: 'Rejeitado',
};

/** Campo de detalhe exibido na tela interna. */
function Campo({ label, valor }: { label: string; valor: string }) {
  return (
    <div>
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label}</p>
      <p className="text-base font-medium text-gray-800 mt-0.5">{valor || '—'}</p>
    </div>
  );
}

interface Props {
  params: { id: string };
}

/** Tela de detalhe de solicitação com dados descriptografados — uso interno restrito. */
export default function DetalhesSolicitacaoPage({ params }: Props) {
  const { data: sessao } = useSession();
  const usuario = sessao?.user as UsuarioSessao | undefined;
  const perfil = (usuario as UsuarioSessao)?.perfil ?? 'operador';

  const [solicitacao, setSolicitacao] = useState<SolicitacaoDetalhe | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [atualizando, setAtualizando] = useState(false);
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    async function carregar() {
      try {
        const resp = await apiInterno.get<SolicitacaoDetalhe>(
          `/interno/solicitacoes/${params.id}`,
        );
        setSolicitacao(resp.data);
      } catch (e: unknown) {
        setErro(e instanceof Error ? e.message : 'Erro ao carregar solicitação.');
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, [params.id]);

  async function atualizarStatus(novoStatus: StatusSolicitacao) {
    if (!solicitacao) return;
    setAtualizando(true);
    setMensagem('');
    try {
      await apiInterno.patch(`/interno/solicitacoes/${solicitacao.id}/status`, {
        status: novoStatus,
      });
      setSolicitacao((s) => s && { ...s, status: novoStatus });
      setMensagem(`Status atualizado para "${STATUS_LABEL[novoStatus]}" com sucesso.`);
    } catch (e: unknown) {
      setMensagem(e instanceof Error ? e.message : 'Erro ao atualizar status.');
    } finally {
      setAtualizando(false);
    }
  }

  if (carregando) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-bnb-azul" size={40} />
      </div>
    );
  }

  if (erro || !solicitacao) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <AlertCircle className="text-red-500" size={48} />
        <p className="text-red-600 font-medium">{erro || 'Solicitação não encontrada.'}</p>
        <Link href="/dashboard" className="text-bnb-azul-claro hover:underline">
          ← Voltar ao Dashboard
        </Link>
      </div>
    );
  }

  const podeAlterar = perfil === 'supervisor';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-bnb-azul text-white shadow-md">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg text-sm transition-colors"
          >
            <ArrowLeft size={16} /> Dashboard
          </Link>
          <h1 className="font-semibold text-lg">Detalhe da Solicitação</h1>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        {/* Protocolo + status */}
        <div className="bg-white rounded-xl shadow-sm p-6 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">Protocolo</p>
            <p className="text-2xl font-mono font-bold text-bnb-azul">
              {solicitacao.numeroProtocolo}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Status</p>
            <span className="inline-block bg-bnb-azul text-white px-4 py-1.5 rounded-full font-semibold text-sm">
              {STATUS_LABEL[solicitacao.status]}
            </span>
          </div>
        </div>

        {/* Dados descritografados */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="font-bold text-bnb-azul mb-4 flex items-center gap-2">
            <span className="w-1.5 h-5 bg-bnb-amarelo rounded-full inline-block" />
            Dados do Titular
            <span className="text-xs font-normal text-red-600 ml-2 bg-red-50 px-2 py-0.5 rounded">
              CONFIDENCIAL — Uso interno
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Campo label="Titular" valor={solicitacao.titularNome} />
            <Campo label="Número da Conta" valor={solicitacao.numeroConta} />
            <Campo label="Agência" valor={solicitacao.agencia} />
            <Campo label="Motivo" valor={solicitacao.motivoEncerramento ?? '—'} />
          </div>
        </div>

        {/* Histórico / Datas */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="font-bold text-bnb-azul mb-4">Histórico</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Campo
              label="Solicitado em"
              valor={new Date(solicitacao.criadoEm).toLocaleString('pt-BR')}
            />
            <Campo
              label="Última atualização"
              valor={new Date(solicitacao.atualizadoEm).toLocaleString('pt-BR')}
            />
            <Campo
              label="Aceite dos termos"
              valor={`v${solicitacao.aceiteTermosVersao} — ${new Date(solicitacao.aceiteTermosTimestamp).toLocaleString('pt-BR')}`}
            />
          </div>
        </div>

        {/* Ações de status */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="font-bold text-bnb-azul mb-4">Ações</h2>
          {!podeAlterar && (
            <p className="text-sm text-gray-400 mb-4">
              Apenas supervisores podem alterar o status da solicitação.
            </p>
          )}

          {mensagem && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-green-50 text-green-700 text-sm flex items-center gap-2">
              <CheckCircle2 size={16} />
              {mensagem}
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => atualizarStatus('EM_ANALISE')}
              disabled={!podeAlterar || atualizando || solicitacao.status === 'EM_ANALISE'}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-40 transition-colors"
            >
              {atualizando ? <Loader2 size={14} className="animate-spin" /> : null}
              Iniciar Análise
            </button>
            <button
              onClick={() => atualizarStatus('CONCLUIDO')}
              disabled={!podeAlterar || atualizando || solicitacao.status === 'CONCLUIDO'}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-40 transition-colors"
            >
              {atualizando ? <Loader2 size={14} className="animate-spin" /> : null}
              <CheckCircle2 size={14} /> Concluir
            </button>
            <button
              onClick={() => atualizarStatus('CANCELADO')}
              disabled={!podeAlterar || atualizando || solicitacao.status === 'CANCELADO'}
              className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-600 disabled:opacity-40 transition-colors"
            >
              {atualizando ? <Loader2 size={14} className="animate-spin" /> : null}
              <XCircle size={14} /> Cancelar
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
