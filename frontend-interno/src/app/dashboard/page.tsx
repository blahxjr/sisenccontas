'use client';

import { useEffect, useState, useCallback } from 'react';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { LogOut, FileText, Clock, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { apiInterno } from '@/lib/api-interno';
import type { UsuarioInterno } from '@/lib/auth';
import type { Session } from 'next-auth';

type UsuarioSessao = Session['user'] & Partial<UsuarioInterno>;

type StatusSolicitacao = 'PENDENTE' | 'EM_ANALISE' | 'CONCLUIDO' | 'CANCELADO' | 'REJEITADO';

interface Solicitacao {
  id: string;
  numeroProtocolo: string;
  agencia: string;
  status: StatusSolicitacao;
  motivoEncerramento: string | null;
  criadoEm: string;
}

interface ListagemResponse {
  total: number;
  pagina: number;
  itensPorPagina: number;
  totalPaginas: number;
  itens: Solicitacao[];
}

/** Mapeamento de cores para badges de status. */
const STATUS_CONFIG: Record<StatusSolicitacao, { label: string; classes: string }> = {
  PENDENTE: { label: 'Pendente', classes: 'bg-yellow-100 text-yellow-800' },
  EM_ANALISE: { label: 'Em AnÃ¡lise', classes: 'bg-blue-100 text-blue-800' },
  CONCLUIDO: { label: 'ConcluÃ­do', classes: 'bg-green-100 text-green-800' },
  CANCELADO: { label: 'Cancelado', classes: 'bg-gray-100 text-gray-600' },
  REJEITADO: { label: 'Rejeitado', classes: 'bg-red-100 text-red-700' },
};

/** Dashboard principal do operador interno BRF. */
export default function DashboardPage() {
  const { data: sessao } = useSession();
  const usuario = sessao?.user as UsuarioSessao | undefined;

  const [dados, setDados] = useState<ListagemResponse | null>(null);
  const [pagina, setPagina] = useState(1);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro('');
    try {
      const resp = await apiInterno.get<ListagemResponse>(
        `/interno/solicitacoes?pagina=${pagina}`,
      );
      setDados(resp.data);
    } catch (e: unknown) {
      setErro(e instanceof Error ? e.message : 'Erro ao carregar solicitaÃ§Ãµes.');
    } finally {
      setCarregando(false);
    }
  }, [pagina]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const pendentes = dados?.itens.filter((s) => s.status === 'PENDENTE').length ?? 0;
  const emAnalise = dados?.itens.filter((s) => s.status === 'EM_ANALISE').length ?? 0;
  const concluidos = dados?.itens.filter((s) => s.status === 'CONCLUIDO').length ?? 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-brf-vermelho text-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white rounded px-3 py-1">
              <span className="text-brf-vermelho font-bold text-lg">
                BN<span className="text-brf-amarelo">B</span>
              </span>
            </div>
            <span className="font-semibold text-lg">EncerraDigital â€” Painel Interno</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium">{usuario?.name ?? 'Operador'}</p>
              <p className="text-xs text-blue-200 capitalize">
                {(usuario as UsuarioSessao)?.perfil ?? 'operador'} Â·{' '}
                {(usuario as UsuarioSessao)?.matricula}
              </p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg text-sm transition-colors"
            >
              <LogOut size={16} />
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-brf-vermelho mb-6">SolicitaÃ§Ãµes de Encerramento</h1>

        {/* Cards de resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4 border-l-4 border-yellow-400">
            <Clock className="text-yellow-500" size={32} />
            <div>
              <p className="text-sm text-gray-500">Pendentes (pÃ¡g. atual)</p>
              <p className="text-3xl font-bold text-gray-800">{pendentes}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4 border-l-4 border-blue-500">
            <FileText className="text-blue-500" size={32} />
            <div>
              <p className="text-sm text-gray-500">Em AnÃ¡lise (pÃ¡g. atual)</p>
              <p className="text-3xl font-bold text-gray-800">{emAnalise}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4 border-l-4 border-green-500">
            <CheckCircle className="text-green-500" size={32} />
            <div>
              <p className="text-sm text-gray-500">ConcluÃ­dos (pÃ¡g. atual)</p>
              <p className="text-3xl font-bold text-gray-800">{concluidos}</p>
            </div>
          </div>
        </div>

        {/* Tabela */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {carregando ? (
            <div className="p-12 text-center text-gray-400">Carregando solicitaÃ§Ãµesâ€¦</div>
          ) : erro ? (
            <div className="p-12 text-center text-red-500">{erro}</div>
          ) : !dados || dados.itens.length === 0 ? (
            <div className="p-12 text-center text-gray-400">Nenhuma solicitaÃ§Ã£o encontrada.</div>
          ) : (
            <>
              <table className="w-full text-sm">
                <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                  <tr>
                    <th className="text-left px-6 py-3">Protocolo</th>
                    <th className="text-left px-6 py-3">AgÃªncia</th>
                    <th className="text-left px-6 py-3">Status</th>
                    <th className="text-left px-6 py-3">Data</th>
                    <th className="text-left px-6 py-3">AÃ§Ã£o</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {dados.itens.map((sol) => {
                    const cfg = STATUS_CONFIG[sol.status] ?? STATUS_CONFIG.PENDENTE;
                    return (
                      <tr key={sol.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-mono font-medium text-brf-vermelho">
                          {sol.numeroProtocolo}
                        </td>
                        <td className="px-6 py-4">{sol.agencia}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg.classes}`}
                          >
                            {cfg.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-500">
                          {new Date(sol.criadoEm).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="px-6 py-4">
                          <Link
                            href={`/dashboard/solicitacoes/${sol.id}`}
                            className="text-brf-laranja hover:underline font-medium"
                          >
                            Ver detalhe
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* PaginaÃ§Ã£o */}
              {dados.totalPaginas > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                  <p className="text-sm text-gray-500">
                    {dados.total} solicitaÃ§Ãµes Â· PÃ¡gina {dados.pagina} de {dados.totalPaginas}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPagina((p) => Math.max(1, p - 1))}
                      disabled={pagina === 1}
                      className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40"
                      aria-label="PÃ¡gina anterior"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      onClick={() => setPagina((p) => Math.min(dados.totalPaginas, p + 1))}
                      disabled={pagina === dados.totalPaginas}
                      className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40"
                      aria-label="PrÃ³xima pÃ¡gina"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
