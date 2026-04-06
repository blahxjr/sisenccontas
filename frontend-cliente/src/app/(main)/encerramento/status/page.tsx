'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Loader2, CheckCircle, Clock, XCircle, Search } from 'lucide-react';
import { apiClient } from '@lib/api-client';

interface StatusSolicitacao {
  protocolo: string;
  status: string;
  agencia: string;
  motivoEncerramento: string | null;
  criadoEm: string;
  atualizadoEm: string;
}

const LABELS_STATUS: Record<string, { texto: string; cor: string; icone: 'ok' | 'clock' | 'x' }> =
  {
    PENDENTE: { texto: 'Pendente', cor: 'text-yellow-700 bg-yellow-50 border-yellow-200', icone: 'clock' },
    EM_ANALISE: { texto: 'Em Análise', cor: 'text-blue-700 bg-blue-50 border-blue-200', icone: 'clock' },
    CONCLUIDO: { texto: 'Concluído', cor: 'text-green-700 bg-green-50 border-green-200', icone: 'ok' },
    CANCELADO: { texto: 'Cancelado', cor: 'text-gray-700 bg-gray-50 border-gray-200', icone: 'x' },
    REJEITADO: { texto: 'Rejeitado', cor: 'text-red-700 bg-red-50 border-red-200', icone: 'x' },
  };

function formatarData(iso: string) {
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** Conteúdo da página de status — lê ?protocolo= da URL. */
function ConsultaStatusContent() {
  const searchParams = useSearchParams();
  const protocolo = searchParams.get('protocolo') ?? '';

  const [dados, setDados] = useState<StatusSolicitacao | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    if (!protocolo) return;
    setCarregando(true);
    setErro(null);
    apiClient
      .get<StatusSolicitacao>(`/publico/solicitacoes/${encodeURIComponent(protocolo)}/status`)
      .then((r) => setDados(r.data))
      .catch((err: Error) => setErro(err.message))
      .finally(() => setCarregando(false));
  }, [protocolo]);

  if (!protocolo) {
    return (
      <div className="text-center space-y-4 py-12">
        <Search className="h-12 w-12 text-gray-300 mx-auto" />
        <p className="text-gray-500">
          Nenhum protocolo informado. Acesse o link enviado por e-mail ou volte ao formulário.
        </p>
        <Link href="/encerramento/formulario" className="text-brf-laranja underline text-sm">
          Ir para o formulário
        </Link>
      </div>
    );
  }

  if (carregando) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 text-brf-vermelho animate-spin" />
      </div>
    );
  }

  if (erro) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center space-y-3">
        <XCircle className="h-10 w-10 text-red-500 mx-auto" />
        <p className="text-red-700 font-medium">{erro}</p>
        <Link href="/" className="text-sm text-gray-500 underline">
          Voltar ao início
        </Link>
      </div>
    );
  }

  if (!dados) return null;

  const info = LABELS_STATUS[dados.status] ?? {
    texto: dados.status,
    cor: 'text-gray-700 bg-gray-50 border-gray-200',
    icone: 'clock' as const,
  };

  return (
    <div className="space-y-6">
      {/* Badge de status */}
      <div
        className={`border rounded-xl p-5 flex items-center gap-4 ${info.cor}`}
      >
        {info.icone === 'ok' && <CheckCircle className="h-8 w-8 flex-shrink-0" />}
        {info.icone === 'clock' && <Clock className="h-8 w-8 flex-shrink-0" />}
        {info.icone === 'x' && <XCircle className="h-8 w-8 flex-shrink-0" />}
        <div>
          <p className="text-sm font-medium opacity-75">Status da Solicitação</p>
          <p className="text-xl font-bold">{info.texto}</p>
        </div>
      </div>

      {/* Detalhes */}
      <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100">
        <Row label="Protocolo" value={<span className="font-mono font-semibold">{dados.protocolo}</span>} />
        <Row label="Agência" value={dados.agencia} />
        {dados.motivoEncerramento && (
          <Row label="Motivo" value={dados.motivoEncerramento} />
        )}
        <Row label="Data da solicitação" value={formatarData(dados.criadoEm)} />
        <Row label="Última atualização" value={formatarData(dados.atualizadoEm)} />
      </div>

      <div className="text-xs text-gray-400 text-center">
        Por segurança, número de conta e nome do titular não são exibidos nesta consulta.
      </div>

      <div className="text-center">
        <Link href="/" className="text-sm text-brf-laranja underline hover:text-brf-vermelho">
          ← Voltar ao início
        </Link>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between items-center px-5 py-3 text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="text-gray-800 font-medium text-right">{value}</span>
    </div>
  );
}

export default function StatusPage() {
  return (
    <div className="max-w-xl mx-auto space-y-6">
      <nav className="text-sm text-gray-500">
        <Link href="/" className="hover:text-brf-vermelho">
          Início
        </Link>
        {' › '}
        <span className="text-gray-700">Consultar Status</span>
      </nav>

      <h1 className="text-2xl font-bold text-brf-vermelho">Consultar Solicitação</h1>

      <Suspense
        fallback={
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 text-brf-vermelho animate-spin" />
          </div>
        }
      >
        <ConsultaStatusContent />
      </Suspense>
    </div>
  );
}
