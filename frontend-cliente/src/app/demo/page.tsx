'use client';

import { useState } from 'react';
import Link from 'next/link';

// ─── Dados estáticos de demonstração ───────────────────────────────────────

const FASES = [
  { num: '1', titulo: 'Catálogos BNB', desc: '300 agências reais via API BCB + 7 motivos de encerramento', concluida: true },
  { num: '2', titulo: 'Backend NestJS', desc: 'API REST com Helmet, CORS, ValidationPipe, Swagger', concluida: true },
  { num: '3', titulo: 'Banco de Dados', desc: 'PostgreSQL + Prisma, criptografia AES-256 em repouso', concluida: true },
  { num: '4', titulo: 'Frontend Cliente', desc: 'Next.js 14, formulário multi-etapa, consulta de status', concluida: true },
  { num: '5', titulo: 'Frontend Interno', desc: 'Painel operador, auth mock OIDC, dashboard, detalhe', concluida: true },
  { num: '6', titulo: 'Documentos + PDF', desc: 'MinIO, PDF Termo 3303-40-64 oficial, upload seguro', concluida: true },
  { num: '7', titulo: 'Testes', desc: 'Jest unitários (22 testes), Playwright E2E (6 fluxos)', concluida: false },
  { num: '8', titulo: 'Auth Corporativo', desc: 'OIDC/SAML BNB real, hardening produção, CI/CD', concluida: false },
];

const SEGURANCA = [
  { item: 'Criptografia AES-256-CBC em repouso', desc: 'numeroConta, titularNome, emailCliente, contaTransferencia' },
  { item: 'HTTPS + HSTS obrigatório', desc: 'Headers de segurança via Next.js config (CSP, X-Frame-Options: DENY)' },
  { item: 'Dados sensíveis ausentes em rotas públicas', desc: 'Conformidade LGPD Art. 46 — minimização de exposição' },
  { item: 'Upload seguro de documentos', desc: 'Validação magic bytes %PDF, max 10 MB, SHA-256 por arquivo' },
  { item: 'Armazenamento MinIO com AES256', desc: 'S3-compatível, URLs presignadas de 5 minutos, sem exposição de chaves' },
  { item: 'IP mascarado em logs', desc: 'Último octeto removido — conformidade LGPD' },
  { item: 'OWASP ASVS Nível 2', desc: 'Padrão mínimo para sistemas financeiros' },
  { item: 'Auditoria em módulo interno', desc: 'Log [AUDITORIA] em cada acesso a dados sensíveis' },
  { item: 'Session JWT 8h', desc: 'Expiração padrão bancário no módulo interno' },
  { item: 'Middleware de proteção de rotas', desc: '100% das rotas internas exigem autenticação' },
];

const TECNOLOGIAS = [
  { camada: 'Frontend Cliente', stack: 'Next.js 14 · React 18 · TailwindCSS · RHF + Zod · Axios', porta: ':3000' },
  { camada: 'Frontend Interno', stack: 'Next.js 14 · NextAuth v4 · TailwindCSS · Axios', porta: ':3001' },
  { camada: 'Backend API', stack: 'NestJS · TypeScript · Prisma · Multer · pdf-lib · AWS SDK S3', porta: ':3333' },
  { camada: 'Banco de Dados', stack: 'PostgreSQL 16 · Prisma ORM · Migrations versionadas', porta: ':5432' },
  { camada: 'Armazenamento', stack: 'MinIO (S3-compatível) · AES256 server-side · URL presignada', porta: ':9000' },
  { camada: 'Cache/Sessão', stack: 'Redis 7 (reservado para rate-limiting e filas futuras)', porta: ':6379' },
  { camada: 'Infraestrutura', stack: 'Docker Compose · Dev Container · pnpm workspaces', porta: 'local' },
];

// ─── Componentes internos ─────────────────────────────────────────────────

/** Preview interativo do formulário multi-etapa do cliente */
function PreviewFormulario() {
  const [etapa, setEtapa] = useState(1);
  const etapas = ['Agência', 'Dados da Conta', 'Complementar', 'Confirmar'];

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
      {/* Header simulado */}
      <div className="bg-bnb-vermelho px-6 py-3 flex items-center justify-between">
        <span className="text-white font-bold text-sm">Encerramento de Conta Corrente</span>
        <span className="text-white/70 text-xs">BNB Digital</span>
      </div>
      {/* Barra de progresso */}
      <div className="flex border-b">
        {etapas.map((nome, i) => (
          <button
            key={i}
            onClick={() => setEtapa(i + 1)}
            className={`flex-1 py-2 text-xs font-medium transition-all ${
              i + 1 === etapa
                ? 'bg-bnb-vermelho text-white'
                : i + 1 < etapa
                ? 'bg-bnb-laranja text-white'
                : 'bg-gray-100 text-gray-400'
            }`}
          >
            {i + 1}. {nome}
          </button>
        ))}
      </div>
      {/* Conteúdo por etapa */}
      <div className="p-6 min-h-[200px]">
        {etapa === 1 && (
          <div className="space-y-3">
            <p className="text-xs text-gray-500 font-medium">ETAPA 1 — Selecione a agência</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-bnb-cinza font-semibold block mb-1">Estado (UF)</label>
                <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-bnb-vermelho outline-none">
                  <option>Maranhão (MA)</option>
                  <option>Ceará (CE)</option>
                  <option>Piauí (PI)</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-bnb-cinza font-semibold block mb-1">Agência</label>
                <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-bnb-vermelho outline-none">
                  <option>0081 — Imperatriz</option>
                  <option>0500 — São Luís Centro</option>
                </select>
              </div>
            </div>
            <div className="bg-bnb-salmao rounded-lg p-3 text-xs text-gray-600">
              📍 <strong>300 agências BNB</strong> disponíveis em 13 estados do Nordeste.
              Fonte: API oficial do Banco Central do Brasil.
            </div>
          </div>
        )}
        {etapa === 2 && (
          <div className="space-y-3">
            <p className="text-xs text-gray-500 font-medium">ETAPA 2 — Dados da conta corrente</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-bnb-cinza font-semibold block mb-1">Número da Conta com DV</label>
                <input type="text" placeholder="12345-6" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-bnb-vermelho outline-none" />
              </div>
              <div>
                <label className="text-xs text-bnb-cinza font-semibold block mb-1">Nome do Titular</label>
                <input type="text" placeholder="Nome completo" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-bnb-vermelho outline-none" />
              </div>
            </div>
            <div>
              <label className="text-xs text-bnb-cinza font-semibold block mb-1">Motivo do Encerramento (facultativo)</label>
              <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-bnb-vermelho outline-none">
                <option>Mudança de banco</option>
                <option>Dificuldades financeiras</option>
                <option>Falecimento do titular</option>
              </select>
            </div>
          </div>
        )}
        {etapa === 3 && (
          <div className="space-y-3">
            <p className="text-xs text-gray-500 font-medium">ETAPA 3 — Informações complementares (Normativo 3303-03-11)</p>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" className="accent-bnb-vermelho w-4 h-4" />
                <span>Movimentei a conta através de cheque</span>
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" className="accent-bnb-vermelho w-4 h-4" />
                <span>A conta possui saldo positivo (informar conta para transferência)</span>
              </label>
            </div>
            <div className="grid grid-cols-1 gap-2">
              <input type="text" placeholder="Endereço atualizado completo" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
              <input type="email" placeholder="E-mail (opcional)" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
            </div>
          </div>
        )}
        {etapa === 4 && (
          <div className="space-y-3">
            <p className="text-xs text-gray-500 font-medium">ETAPA 4 — Confirmar e assinar via gov.br</p>
            <label className="flex items-start gap-2 text-xs cursor-pointer">
              <input type="checkbox" className="accent-bnb-vermelho w-4 h-4 mt-0.5" />
              <span className="text-gray-600">
                Li e aceito os termos do <strong>Termo de Encerramento de Conta</strong> conforme
                normativo BNB 3303-03-11 e modelo 3303-40-64.
              </span>
            </label>
            <div className="bg-bnb-salmao rounded-lg p-3 space-y-2">
              <p className="text-xs font-semibold text-bnb-vermelho">📄 Próximos passos:</p>
              <ol className="text-xs text-gray-600 space-y-1 list-decimal list-inside">
                <li>Clique em &quot;Gerar PDF&quot; para baixar o Termo de Encerramento</li>
                <li>Assine digitalmente via gov.br (ICP-Brasil)</li>
                <li>Faça o upload do documento assinado abaixo</li>
              </ol>
            </div>
            <button className="w-full bg-bnb-vermelho hover:bg-bnb-vermelho-escuro text-white font-semibold py-2 rounded-lg text-sm transition-colors">
              📄 Gerar PDF para Assinatura
            </button>
          </div>
        )}
      </div>
      {/* Navegação */}
      <div className="px-6 pb-4 flex justify-between">
        <button
          onClick={() => setEtapa(Math.max(1, etapa - 1))}
          disabled={etapa === 1}
          className="px-4 py-1.5 text-xs border border-bnb-cinza text-bnb-cinza rounded-lg disabled:opacity-30 hover:bg-gray-50 transition-colors"
        >
          ← Anterior
        </button>
        <button
          onClick={() => setEtapa(Math.min(4, etapa + 1))}
          disabled={etapa === 4}
          className="px-4 py-1.5 text-xs bg-bnb-vermelho text-white rounded-lg disabled:opacity-30 hover:bg-bnb-vermelho-escuro transition-colors"
        >
          Próximo →
        </button>
      </div>
    </div>
  );
}

/** Preview interativo do painel do operador interno */
function PreviewDashboard() {
  const [selecionado, setSelecionado] = useState<number | null>(null);
  const solicitacoes = [
    { protocolo: 'ENC-2026-855271', agencia: '0081 — Imperatriz', status: 'PENDENTE', data: '05/04/2026' },
    { protocolo: 'ENC-2026-312044', agencia: '0500 — São Luís', status: 'EM_ANALISE', data: '04/04/2026' },
    { protocolo: 'ENC-2026-198023', agencia: '0210 — Fortaleza', status: 'CONCLUIDO', data: '03/04/2026' },
    { protocolo: 'ENC-2026-077891', agencia: '0081 — Imperatriz', status: 'PENDENTE', data: '02/04/2026' },
  ];
  const statusCor: Record<string, string> = {
    PENDENTE: 'bg-bnb-amarelo text-gray-800',
    EM_ANALISE: 'bg-bnb-azul text-white',
    CONCLUIDO: 'bg-bnb-verde text-white',
    CANCELADO: 'bg-bnb-cinza text-white',
    REJEITADO: 'bg-bnb-vermelho-escuro text-white',
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
      {/* Header do painel interno */}
      <div className="bg-bnb-vermelho px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-bnb-amarelo"></div>
          <span className="text-white font-bold text-sm">Painel Interno — BNB</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">Ana Operadora · BNB0001</span>
          <span className="text-white/60 text-xs">Sair</span>
        </div>
      </div>
      {/* Cards de resumo */}
      <div className="grid grid-cols-3 gap-px bg-gray-100">
        {[
          { label: 'Pendentes', valor: '2', cor: 'text-bnb-amarelo' },
          { label: 'Em Análise', valor: '1', cor: 'text-bnb-azul' },
          { label: 'Concluídos', valor: '1', cor: 'text-bnb-verde' },
        ].map((c) => (
          <div key={c.label} className="bg-white px-4 py-3 text-center">
            <div className={`text-2xl font-bold ${c.cor}`}>{c.valor}</div>
            <div className="text-xs text-gray-400">{c.label}</div>
          </div>
        ))}
      </div>
      {/* Tabela */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="bg-gray-50 border-b">
            <tr>
              {['Protocolo', 'Agência', 'Status', 'Data', 'Ações'].map((h) => (
                <th key={h} className="px-3 py-2 text-left text-gray-500 font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {solicitacoes.map((s, i) => (
              <tr
                key={s.protocolo}
                className={`border-b hover:bg-bnb-salmao/30 cursor-pointer transition-colors ${selecionado === i ? 'bg-bnb-salmao/50' : ''}`}
                onClick={() => setSelecionado(i)}
              >
                <td className="px-3 py-2 font-mono font-medium text-bnb-vermelho">{s.protocolo}</td>
                <td className="px-3 py-2 text-gray-600">{s.agencia}</td>
                <td className="px-3 py-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusCor[s.status]}`}>
                    {s.status}
                  </span>
                </td>
                <td className="px-3 py-2 text-gray-400">{s.data}</td>
                <td className="px-3 py-2">
                  <button className="text-bnb-azul hover:underline text-xs">Ver detalhe →</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selecionado !== null && (
        <div className="bg-bnb-salmao/40 border-t px-4 py-3 flex gap-2 flex-wrap items-center">
          <span className="text-xs text-gray-500">Ações para {solicitacoes[selecionado].protocolo}:</span>
          <button className="text-xs bg-bnb-vermelho text-white px-3 py-1 rounded-full hover:bg-bnb-vermelho-escuro transition-colors">📄 Gerar Termo PDF</button>
          <button className="text-xs bg-bnb-azul text-white px-3 py-1 rounded-full transition-colors">🔍 Ver documentos</button>
          <button className="text-xs bg-bnb-verde text-white px-3 py-1 rounded-full transition-colors">✓ Concluir</button>
        </div>
      )}
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────

/** Página de demonstração standalone do sistema EncerraDigital BNB */
export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* HERO */}
      <section className="bg-gradient-to-br from-bnb-vermelho via-bnb-vermelho to-bnb-laranja text-white">
        <div className="max-w-5xl mx-auto px-6 py-16 text-center">
          <div className="inline-block bg-white/10 backdrop-blur px-4 py-1 rounded-full text-sm mb-4">
            Banco do Nordeste do Brasil S/A
          </div>
          <h1 className="text-4xl font-bold mb-3">EncerraDigital</h1>
          <p className="text-xl text-white/80 mb-2">Sistema Digital de Encerramento de Conta Corrente</p>
          <p className="text-sm text-white/60 max-w-xl mx-auto mb-8">
            Digitalização completa do processo presencial, conforme normativo 3303-03-11,
            com padrões bancários de segurança e conformidade LGPD.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { t: 'Normativo 3303-03-11', c: 'bg-white/20 text-white' },
              { t: 'OWASP ASVS Nível 2', c: 'bg-white/20 text-white' },
              { t: 'LGPD Art. 46', c: 'bg-white/20 text-white' },
              { t: 'ICP-Brasil / gov.br', c: 'bg-bnb-amarelo text-gray-800' },
              { t: 'AES-256-CBC', c: 'bg-white/20 text-white' },
            ].map((b) => (
              <span key={b.t} className={`px-4 py-1.5 rounded-full text-xs font-semibold ${b.c}`}>✓ {b.t}</span>
            ))}
          </div>
          <div className="mt-8">
            <Link
              href="/"
              className="text-xs text-white/50 hover:text-white/80 underline transition-colors"
            >
              ← Voltar para o sistema
            </Link>
          </div>
        </div>
      </section>

      {/* SEÇÃO 1 — O Problema */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">O Problema que Resolvemos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 border border-red-100 shadow-sm">
            <div className="text-3xl mb-3">🏦</div>
            <h3 className="font-bold text-gray-700 mb-2">Processo Atual (Presencial)</h3>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>❌ Cliente deve ir à agência pessoalmente</li>
              <li>❌ Formulário físico em papel</li>
              <li>❌ Assinatura manual presencial</li>
              <li>❌ Arquivamento físico de documentos</li>
              <li>❌ Sem rastreabilidade do status</li>
              <li>❌ Prazo de 30 dias sem notificação digital</li>
            </ul>
          </div>
          <div className="bg-white rounded-xl p-6 border border-green-100 shadow-sm">
            <div className="text-3xl mb-3">💻</div>
            <h3 className="font-bold text-gray-700 mb-2">EncerraDigital (Canal Digital)</h3>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>✅ Solicitação online 24 horas, 7 dias</li>
              <li>✅ Formulário digital guiado multi-etapa</li>
              <li>✅ Assinatura ICP-Brasil via gov.br</li>
              <li>✅ Documentos no MinIO (S3-compatível)</li>
              <li>✅ Consulta de status com protocolo</li>
              <li>✅ Notificação automática ao operador</li>
            </ul>
          </div>
        </div>
      </section>

      {/* SEÇÃO 2 — Módulo Cliente */}
      <section className="bg-white py-12">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-8">
            <span className="bg-bnb-salmao text-bnb-vermelho text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">Módulo Público</span>
            <h2 className="text-2xl font-bold text-gray-800 mt-3 mb-1">Interface do Cliente</h2>
            <p className="text-sm text-gray-500">
              Acesso em: <code className="bg-gray-100 px-2 py-0.5 rounded text-bnb-vermelho">http://localhost:3000</code>
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div>
              <h3 className="font-bold text-gray-700 mb-3 text-sm">Preview Interativo — clique nas etapas</h3>
              <PreviewFormulario />
            </div>
            <div className="space-y-4">
              <h3 className="font-bold text-gray-700 text-sm">Funcionalidades</h3>
              {[
                { icon: '🗺️', titulo: 'Seleção de agência em cascata', desc: 'UF → Agência (300 agências reais BNB, fonte BCB)' },
                { icon: '🔒', titulo: 'Dados protegidos em trânsito e repouso', desc: 'HTTPS + AES-256-CBC para conta e titular' },
                { icon: '📄', titulo: 'PDF Termo oficial 3303-40-64', desc: '14 seções obrigatórias, layout BNB, gerado no servidor' },
                { icon: '✍️', titulo: 'Assinatura via ICP-Brasil / gov.br', desc: 'Compatível com certificados A1 e A3' },
                { icon: '⬆️', titulo: 'Upload seguro do termo assinado', desc: 'Validação magic bytes, SHA-256, max 10 MB' },
                { icon: '🔍', titulo: 'Consulta de status por protocolo', desc: 'Sem exposição de dados pessoais (LGPD)' },
              ].map((f) => (
                <div key={f.titulo} className="flex gap-3 items-start">
                  <span className="text-xl">{f.icon}</span>
                  <div>
                    <p className="font-semibold text-sm text-gray-700">{f.titulo}</p>
                    <p className="text-xs text-gray-400">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 3 — Módulo Interno */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-8">
            <span className="bg-bnb-vermelho/10 text-bnb-vermelho text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">Módulo Restrito</span>
            <h2 className="text-2xl font-bold text-gray-800 mt-3 mb-1">Painel do Operador</h2>
            <p className="text-sm text-gray-500">
              Acesso em: <code className="bg-gray-100 px-2 py-0.5 rounded text-bnb-vermelho">http://localhost:3001</code> (requer autenticação)
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="space-y-4">
              <h3 className="font-bold text-gray-700 text-sm">Funcionalidades</h3>
              {[
                { icon: '🔐', titulo: 'Autenticação OIDC/SAML', desc: 'Mock em dev (BNB0001/BNB0002) | OIDC corporativo em produção' },
                { icon: '📊', titulo: 'Dashboard com métricas', desc: 'Contadores de Pendentes, Em Análise e Concluídos' },
                { icon: '🔍', titulo: 'Dados descriptografados', desc: 'Apenas operadores autenticados visualizam conta e nome' },
                { icon: '📄', titulo: 'Geração e download de PDF', desc: 'URL presignada MinIO (5 min), sem exposição de chaves' },
                { icon: '📋', titulo: 'Atualização de status', desc: 'Operador: Em Análise | Supervisor: Concluir/Rejeitar' },
                { icon: '🔎', titulo: 'Auditoria completa', desc: 'Log [AUDITORIA] em cada acesso a dados sensíveis' },
              ].map((f) => (
                <div key={f.titulo} className="flex gap-3 items-start">
                  <span className="text-xl">{f.icon}</span>
                  <div>
                    <p className="font-semibold text-sm text-gray-700">{f.titulo}</p>
                    <p className="text-xs text-gray-400">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div>
              <h3 className="font-bold text-gray-700 mb-3 text-sm">Preview do Dashboard — clique em uma linha</h3>
              <PreviewDashboard />
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 4 — Arquitetura */}
      <section className="bg-white py-12">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Arquitetura Técnica</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-bnb-vermelho text-white">
                  {['Camada', 'Stack', 'Porta'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TECNOLOGIAS.map((t, i) => (
                  <tr key={t.camada} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="px-4 py-3 font-semibold text-bnb-vermelho">{t.camada}</td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{t.stack}</td>
                    <td className="px-4 py-3">
                      <code className="bg-gray-100 text-bnb-azul px-2 py-0.5 rounded text-xs">{t.porta}</code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Diagrama de fluxo */}
          <div className="mt-8 bg-gray-50 rounded-xl p-6">
            <h3 className="text-sm font-bold text-gray-600 mb-4 text-center">Fluxo de Dados</h3>
            <div className="flex items-center justify-center gap-2 flex-wrap text-xs text-center">
              {[
                { label: 'Cliente\n:3000', bg: 'bg-bnb-salmao border-bnb-laranja' },
                { label: '→', bg: '' },
                { label: 'Backend API\n:3333', bg: 'bg-bnb-vermelho/10 border-bnb-vermelho' },
                { label: '→', bg: '' },
                { label: 'PostgreSQL\n:5432', bg: 'bg-blue-50 border-blue-300' },
                { label: '→', bg: '' },
                { label: 'MinIO\n:9000', bg: 'bg-green-50 border-green-300' },
              ].map((n, i) =>
                n.label === '→' ? (
                  <span key={i} className="text-gray-400 text-lg font-bold">→</span>
                ) : (
                  <div key={i} className={`border-2 rounded-lg px-4 py-2 font-mono whitespace-pre-line ${n.bg}`}>
                    {n.label}
                  </div>
                )
              )}
            </div>
            <div className="flex items-center justify-center gap-2 mt-3 flex-wrap text-xs text-center">
              {[
                { label: 'Operador\n:3001', bg: 'bg-bnb-vermelho/10 border-bnb-vermelho' },
                { label: '→', bg: '' },
                { label: 'Backend API\n:3333\n(rota /interno)', bg: 'bg-bnb-vermelho/10 border-bnb-vermelho' },
                { label: '→', bg: '' },
                { label: 'Decrypt\nAES-256', bg: 'bg-yellow-50 border-yellow-300' },
                { label: '→', bg: '' },
                { label: 'Log\nAuditoria', bg: 'bg-gray-100 border-gray-300' },
              ].map((n, i) =>
                n.label === '→' ? (
                  <span key={i} className="text-gray-400 text-lg font-bold">→</span>
                ) : (
                  <div key={i} className={`border-2 rounded-lg px-4 py-2 font-mono whitespace-pre-line ${n.bg}`}>
                    {n.label}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 5 — Segurança */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Segurança e Conformidade</h2>
          <p className="text-center text-sm text-gray-400 mb-8">Padrão OWASP ASVS Nível 2 — adequado para ecossistema bancário</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {SEGURANCA.map((s) => (
              <div key={s.item} className="bg-white rounded-xl p-4 border border-gray-100 flex gap-3 items-start shadow-sm">
                <span className="mt-0.5 text-bnb-verde font-bold text-sm flex-shrink-0">✓</span>
                <div>
                  <p className="font-semibold text-sm text-gray-700">{s.item}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO 6 — Roadmap */}
      <section className="bg-white py-12">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Roadmap de Desenvolvimento</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {FASES.map((f) => (
              <div
                key={f.num}
                className={`rounded-xl p-4 border-2 ${
                  f.concluida
                    ? 'border-bnb-verde bg-green-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mb-2 ${
                  f.concluida ? 'bg-bnb-verde text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {f.concluida ? '✓' : f.num}
                </div>
                <p className={`font-bold text-sm mb-1 ${f.concluida ? 'text-gray-700' : 'text-gray-400'}`}>
                  {f.titulo}
                </p>
                <p className="text-xs text-gray-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-bnb-vermelho text-white py-6">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <div>
            <p className="font-bold">Banco do Nordeste do Brasil S/A</p>
            <p className="text-white/60 text-xs">CNPJ: 07.237.373/0001-20</p>
          </div>
          <div className="text-xs text-white/60 text-center">
            <p>EncerraDigital — Sistema de Encerramento Digital de Conta Corrente</p>
            <p>Normativo 3303-03-11 v.020 · OWASP ASVS Nível 2 · LGPD</p>
          </div>
          <div className="text-xs text-white/60 text-right">
            <p>Stack: Next.js 14 + NestJS</p>
            <p>PostgreSQL + MinIO + Redis</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
