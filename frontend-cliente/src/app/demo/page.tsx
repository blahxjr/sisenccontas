'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck, FileText, Lock, Upload, Database, Eye,
  Clock, Activity, CheckCircle, Github, Shield, Server,
  Globe, ArrowRight, Check, BookOpen, Bot, Settings2,
} from 'lucide-react';

// â”€â”€â”€ Dados estÃ¡ticos de demonstraÃ§Ã£o â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const FASES = [
  { num: '1', titulo: 'CatÃ¡logos BNB', desc: '300 agÃªncias reais via API BCB + 7 motivos de encerramento', concluida: true, data: '05/04/2026' },
  { num: '2', titulo: 'Backend NestJS', desc: 'API REST com Helmet, CORS, ValidationPipe, Swagger', concluida: true, data: '05/04/2026' },
  { num: '3', titulo: 'Banco de Dados', desc: 'PostgreSQL + Prisma, criptografia AES-256 em repouso', concluida: true, data: '05/04/2026' },
  { num: '4', titulo: 'Frontend Cliente', desc: 'Next.js 14, formulÃ¡rio multi-etapa, consulta de status', concluida: true, data: '05/04/2026' },
  { num: '5', titulo: 'Frontend Interno', desc: 'Painel operador, auth mock OIDC, dashboard, detalhe', concluida: true, data: '05/04/2026' },
  { num: '6', titulo: 'Documentos + PDF', desc: 'MinIO, PDF Termo 3303-40-64 oficial, upload seguro', concluida: true, data: '05/04/2026' },
  { num: '7', titulo: 'Testes', desc: 'Jest unitÃ¡rios (22 testes), Playwright E2E (6 fluxos)', concluida: true, data: '05/04/2026' },
  { num: '8', titulo: 'Auth Corporativo', desc: 'OIDC/SAML BNB real, hardening produÃ§Ã£o, CI/CD', concluida: false, data: '' },
];

const SEGURANCA = [
  { icon: Lock,        titulo: 'AES-256-CBC em repouso',      desc: 'numeroConta, titularNome, emailCliente, contaTransferencia' },
  { icon: Shield,      titulo: 'HTTPS + HSTS',                desc: 'Headers de seguranÃ§a via Next.js config (CSP, X-Frame-Options: DENY)' },
  { icon: Eye,         titulo: 'MinimizaÃ§Ã£o LGPD',            desc: 'Dados sensÃ­veis ausentes em rotas pÃºblicas â€” Art. 46' },
  { icon: Upload,      titulo: 'Upload seguro',               desc: 'ValidaÃ§Ã£o magic bytes %PDF, max 10 MB, SHA-256 por arquivo' },
  { icon: Database,    titulo: 'MinIO + URLs presignadas',    desc: 'S3-compatÃ­vel, TTL 5 min, sem exposiÃ§Ã£o de chaves' },
  { icon: Eye,         titulo: 'IP mascarado em logs',        desc: 'Ãšltimo octeto removido â€” conformidade LGPD' },
  { icon: ShieldCheck, titulo: 'OWASP ASVS NÃ­vel 2',         desc: 'PadrÃ£o mÃ­nimo para sistemas financeiros' },
  { icon: FileText,    titulo: 'Auditoria completa',          desc: 'Log [AUDITORIA] em cada acesso a dados sensÃ­veis' },
  { icon: Lock,        titulo: 'Session JWT 8h',              desc: 'ExpiraÃ§Ã£o padrÃ£o bancÃ¡rio no mÃ³dulo interno' },
  { icon: Shield,      titulo: 'Middleware de rotas',         desc: '100% das rotas internas exigem autenticaÃ§Ã£o' },
];

const TECNOLOGIAS = [
  { camada: 'Frontend Cliente', stack: 'Next.js 14 Â· React 18 Â· TailwindCSS Â· RHF + Zod Â· Axios', porta: ':3000' },
  { camada: 'Frontend Interno', stack: 'Next.js 14 Â· NextAuth v4 Â· TailwindCSS Â· Axios', porta: ':3001' },
  { camada: 'Backend API', stack: 'NestJS Â· TypeScript Â· Prisma Â· Multer Â· pdf-lib Â· AWS SDK S3', porta: ':3333' },
  { camada: 'Banco de Dados', stack: 'PostgreSQL 16 Â· Prisma ORM Â· Migrations versionadas', porta: ':5432' },
  { camada: 'Armazenamento', stack: 'MinIO (S3-compatÃ­vel) Â· AES256 server-side Â· URL presignada', porta: ':9000' },
  { camada: 'Cache/SessÃ£o', stack: 'Redis 7 (reservado para rate-limiting e filas futuras)', porta: ':6379' },
  { camada: 'Infraestrutura', stack: 'Docker Compose Â· Dev Container Â· pnpm workspaces', porta: 'local' },
];

const JORNADA = [
  { icone: 'ðŸ–¥ï¸', titulo: 'Acessa o portal',      desc: 'Preenche formulÃ¡rio multi-etapa com seleÃ§Ã£o de agÃªncia em cascata' },
  { icone: 'ðŸ“‹', titulo: 'Recebe protocolo',      desc: 'Protocolo Ãºnico ENC-2026-XXXXXX gerado instantaneamente' },
  { icone: 'ðŸ“„', titulo: 'Baixa o Termo',         desc: 'PDF gerado no servidor conforme normativo oficial 3303-40-64' },
  { icone: 'âœï¸', titulo: 'Assina digitalmente',   desc: 'Via gov.br / ICP-Brasil â€” certificados A1 ou A3' },
  { icone: 'âœ…', titulo: 'Upload + AnÃ¡lise',      desc: 'Operador BNB processa no painel interno com auditoria completa' },
];

const AGENTES = [
  {
    titulo: 'Agente Arquiteto',
    arquivo: 'arquiteto.md',
    desc: 'DecisÃµes de design, ADRs e impacto arquitetural. Avalia trade-offs antes de qualquer mudanÃ§a estrutural.',
  },
  {
    titulo: 'Agente Backend',
    arquivo: 'dev-backend.md',
    desc: 'NestJS, Prisma, criptografia AES-256 e conformidade LGPD. MÃ³dulos, DTOs e repositÃ³rios.',
  },
  {
    titulo: 'Agente Frontend',
    arquivo: 'dev-frontend.md',
    desc: 'Next.js 14 (App Router), React Hook Form + Zod, TailwindCSS com paleta BNB e acessibilidade WCAG.',
  },
  {
    titulo: 'Agente SeguranÃ§a',
    arquivo: 'seguranca.md',
    desc: 'OWASP ASVS NÃ­vel 2, headers HTTP, validaÃ§Ã£o de uploads, mascaramento de IP e LGPD Art. 46.',
  },
  {
    titulo: 'Agente Testes',
    arquivo: 'testes.md',
    desc: 'Jest (unitÃ¡rios) e Playwright (E2E). Page objects, fixtures e todos os fluxos crÃ­ticos.',
  },
];

// â”€â”€â”€ Componente: Abas do FormulÃ¡rio â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

/** Preview interativo com abas clicÃ¡veis do formulÃ¡rio multi-etapa */
function PreviewFormulario() {
  const [aba, setAba] = useState(0);
  const abas = ['Etapa 1 Â· AgÃªncia', 'Etapa 2 Â· Dados', 'Etapa 3 Â· Complementar', 'Etapa 4 Â· Confirmar'];

  const conteudo = [
    <div key="e1" className="space-y-3">
      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Selecione a AgÃªncia</p>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-bnb-cinza font-semibold block mb-1">Estado (UF)</label>
          <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
            <option>MaranhÃ£o (MA)</option><option>CearÃ¡ (CE)</option><option>PiauÃ­ (PI)</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-bnb-cinza font-semibold block mb-1">AgÃªncia</label>
          <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
            <option>0081 â€” Imperatriz</option><option>0500 â€” SÃ£o LuÃ­s</option>
          </select>
        </div>
      </div>
      <div className="bg-bnb-salmao rounded-lg p-3 text-xs text-gray-600">
        ðŸ“ <strong>300 agÃªncias BNB</strong> em 13 estados. Fonte: API oficial BCB.
      </div>
    </div>,

    <div key="e2" className="space-y-3">
      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Dados da Conta Corrente</p>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-bnb-cinza font-semibold block mb-1">NÃºmero com DV</label>
          <input type="text" placeholder="12345-6" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-xs text-bnb-cinza font-semibold block mb-1">Nome do Titular</label>
          <input type="text" placeholder="Nome completo" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
        </div>
      </div>
      <div>
        <label className="text-xs text-bnb-cinza font-semibold block mb-1">Motivo (facultativo)</label>
        <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
          <option>MudanÃ§a de banco</option><option>Dificuldades financeiras</option><option>Falecimento do titular</option>
        </select>
      </div>
    </div>,

    <div key="e3" className="space-y-3">
      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">InformaÃ§Ãµes Complementares â€” Normativo 3303-03-11</p>
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" className="accent-bnb-vermelho w-4 h-4" />
          <span>Movimentei a conta atravÃ©s de cheque</span>
        </label>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" className="accent-bnb-vermelho w-4 h-4" />
          <span>A conta possui saldo positivo</span>
        </label>
      </div>
      <input type="text" placeholder="EndereÃ§o atualizado completo" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
      <input type="email" placeholder="E-mail (opcional)" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
    </div>,

    <div key="e4" className="space-y-3">
      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Confirmar e Assinar via gov.br</p>
      <label className="flex items-start gap-2 text-xs cursor-pointer">
        <input type="checkbox" className="accent-bnb-vermelho w-4 h-4 mt-0.5" />
        <span className="text-gray-600">
          Li e aceito os termos conforme <strong>normativo BNB 3303-03-11</strong> e modelo 3303-40-64.
        </span>
      </label>
      <div className="bg-bnb-salmao rounded-lg p-3 space-y-1">
        <p className="text-xs font-semibold text-bnb-vermelho">ðŸ“„ PrÃ³ximos passos:</p>
        <ol className="text-xs text-gray-600 list-decimal list-inside space-y-0.5">
          <li>Clique em &quot;Gerar PDF&quot; e baixe o Termo</li>
          <li>Assine digitalmente via gov.br (ICP-Brasil)</li>
          <li>FaÃ§a upload do documento assinado</li>
        </ol>
      </div>
      <button className="w-full bg-bnb-vermelho text-white font-semibold py-2 rounded-lg text-sm">
        ðŸ“„ Gerar PDF para Assinatura
      </button>
    </div>,
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
      <div className="bg-bnb-vermelho px-4 py-2.5 flex items-center justify-between">
        <span className="text-white font-bold text-sm">Encerramento de Conta Corrente</span>
        <span className="text-white/60 text-xs">BNB Digital</span>
      </div>
      <div className="flex border-b overflow-x-auto">
        {abas.map((nome, i) => (
          <button
            key={i}
            onClick={() => setAba(i)}
            aria-selected={i === aba}
            role="tab"
            className={`flex-shrink-0 px-3 py-2 text-xs font-medium border-b-2 transition-all ${
              i === aba
                ? 'border-bnb-vermelho bg-bnb-salmao text-bnb-vermelho'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            {nome}
          </button>
        ))}
      </div>
      <div className="p-5 min-h-[200px]">{conteudo[aba]}</div>
    </div>
  );
}

// â”€â”€â”€ Componente: Dashboard do Operador â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

/** Preview do painel interno com header, mÃ©tricas e row cards estilizados */
function PreviewDashboard() {
  const solicitacoes = [
    { protocolo: 'ENC-2026-855271', agencia: '0081 â€” Imperatriz', status: 'PENDENTE',   data: '05/04/2026' },
    { protocolo: 'ENC-2026-312044', agencia: '0500 â€” SÃ£o LuÃ­s',   status: 'EM_ANALISE', data: '04/04/2026' },
    { protocolo: 'ENC-2026-198023', agencia: '0210 â€” Fortaleza',  status: 'CONCLUIDO',  data: '03/04/2026' },
    { protocolo: 'ENC-2026-077891', agencia: '0081 â€” Imperatriz', status: 'PENDENTE',   data: '02/04/2026' },
  ];

  const statusCfg: Record<string, { bg: string; text: string; label: string }> = {
    PENDENTE:   { bg: 'bg-yellow-50',  text: 'text-amber-700',  label: 'Pendente'   },
    EM_ANALISE: { bg: 'bg-blue-50',    text: 'text-bnb-azul',   label: 'Em AnÃ¡lise' },
    CONCLUIDO:  { bg: 'bg-green-50',   text: 'text-bnb-verde',  label: 'ConcluÃ­do'  },
    CANCELADO:  { bg: 'bg-gray-100',   text: 'text-gray-500',   label: 'Cancelado'  },
    REJEITADO:  { bg: 'bg-red-50',     text: 'text-bnb-vermelho-escuro', label: 'Rejeitado' },
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
      {/* Header com avatar */}
      <div className="bg-bnb-vermelho px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-bnb-amarelo flex items-center justify-center text-xs font-bold text-gray-800">AO</div>
          <span className="text-white font-bold text-sm">Painel Interno BNB</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-white/70 text-xs hidden sm:block">Ana Operadora Â· BNB0001</span>
          <button className="text-white/50 text-xs border border-white/20 px-2 py-0.5 rounded hover:text-white/80 transition-colors">Sair</button>
        </div>
      </div>
      {/* 3 Metric cards */}
      <div className="grid grid-cols-3 gap-px bg-gray-100">
        {[
          { label: 'Pendentes',  valor: '2', cor: 'text-amber-600', bg: 'bg-yellow-50', Icon: Clock },
          { label: 'Em AnÃ¡lise', valor: '1', cor: 'text-bnb-azul',  bg: 'bg-blue-50',   Icon: Activity },
          { label: 'ConcluÃ­dos', valor: '1', cor: 'text-bnb-verde', bg: 'bg-green-50',  Icon: CheckCircle },
        ].map(({ label, valor, cor, bg, Icon }) => (
          <div key={label} className={`${bg} px-3 py-3 text-center`}>
            <Icon className={`w-4 h-4 mx-auto mb-1 ${cor}`} />
            <div className={`text-xl font-bold ${cor}`}>{valor}</div>
            <div className="text-xs text-gray-400">{label}</div>
          </div>
        ))}
      </div>
      {/* Row cards */}
      <div className="divide-y">
        {solicitacoes.map((s) => {
          const cfg = statusCfg[s.status];
          return (
            <div key={s.protocolo} className="px-4 py-2.5 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer">
              <div>
                <p className="font-mono text-xs font-semibold text-bnb-vermelho">{s.protocolo}</p>
                <p className="text-xs text-gray-400">{s.agencia} Â· {s.data}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}>{cfg.label}</span>
                <span className="text-bnb-azul text-xs">â†’</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// â”€â”€â”€ PÃ¡gina principal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

/** PÃ¡gina de demonstraÃ§Ã£o standalone do sistema EncerraDigital BNB */
export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* â•â• HERO â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <section className="bg-gradient-to-br from-bnb-vermelho via-bnb-vermelho to-bnb-laranja text-white">
        <div className="max-w-5xl mx-auto px-6 py-16 text-center">
          {/* Badge pulsante */}
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur px-4 py-1.5 rounded-full text-sm mb-5 animate-pulse">
            <span>ðŸŽ“</span>
            <span className="font-medium">ApresentaÃ§Ã£o para Aula</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">EncerraDigital</h1>
          <p className="text-xl text-white/80 mb-2">Sistema Digital de Encerramento de Conta Corrente</p>
          <p className="text-sm text-white/60 max-w-xl mx-auto mb-8">
            DigitalizaÃ§Ã£o completa do processo presencial, conforme normativo 3303-03-11,
            com padrÃµes bancÃ¡rios de seguranÃ§a e conformidade LGPD.
          </p>
          {/* Badges de conformidade com Ã­cones Lucide */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {[
              { Icon: FileText,    texto: 'Normativo 3303-03-11' },
              { Icon: ShieldCheck, texto: 'OWASP ASVS NÃ­vel 2' },
              { Icon: Eye,         texto: 'LGPD Art. 46' },
              { Icon: Lock,        texto: 'AES-256-CBC' },
            ].map(({ Icon, texto }) => (
              <span key={texto} className="inline-flex items-center gap-1.5 bg-white/20 px-4 py-1.5 rounded-full text-xs font-semibold">
                <Icon className="w-3.5 h-3.5" />
                {texto}
              </span>
            ))}
            <span className="inline-flex items-center gap-1.5 bg-bnb-amarelo text-gray-800 px-4 py-1.5 rounded-full text-xs font-semibold">
              <Check className="w-3.5 h-3.5" />
              ICP-Brasil / gov.br
            </span>
          </div>
          {/* Linha estatÃ­stica */}
          <p className="text-sm text-white/80">
            <span className="font-bold text-white">300 agÃªncias</span>
            <span className="mx-2 text-bnb-laranja font-bold">Â·</span>
            <span className="font-bold text-white">7 motivos</span>
            <span className="mx-2 text-bnb-laranja font-bold">Â·</span>
            <span className="font-bold text-white">22 testes unitÃ¡rios</span>
            <span className="mx-2 text-bnb-laranja font-bold">Â·</span>
            <span className="font-bold text-white">6 fluxos E2E</span>
          </p>
          <div className="mt-8">
            <Link href="/" className="text-xs text-white/50 hover:text-white/80 underline transition-colors">
              â† Voltar para o sistema
            </Link>
          </div>
        </div>
      </section>

      {/* â•â• O PROBLEMA â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <section className="max-w-5xl mx-auto px-6 py-14">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">O Problema que Resolvemos</h2>
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-center">
          {/* Card ANTES */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="h-1.5 bg-bnb-vermelho" />
            <div className="p-6">
              <span className="text-xs font-black text-gray-400 tracking-widest block mb-3">ANTES</span>
              <div className="text-3xl mb-3">ðŸ¦</div>
              <h3 className="font-bold text-gray-700 mb-3">Processo Presencial</h3>
              <ul className="text-sm text-gray-500 space-y-1.5">
                {['Deslocamento atÃ© a agÃªncia','FormulÃ¡rio em papel','Assinatura manual presencial','Arquivo fÃ­sico de documentos','Sem rastreabilidade do status','Prazo opaco de 30 dias'].map((t) => (
                  <li key={t} className="flex items-center gap-2"><span className="text-bnb-vermelho font-bold text-xs">âœ—</span>{t}</li>
                ))}
              </ul>
            </div>
          </div>
          {/* Seta desktop */}
          <div className="hidden md:flex justify-center">
            <div className="bg-white shadow-md rounded-full p-3 border border-gray-100">
              <ArrowRight className="w-6 h-6 text-bnb-laranja" />
            </div>
          </div>
          {/* Seta mobile */}
          <div className="flex md:hidden justify-center">
            <div className="bg-white shadow-md rounded-full p-2 border border-gray-100">
              <ArrowRight className="w-5 h-5 text-bnb-laranja rotate-90" />
            </div>
          </div>
          {/* Card DEPOIS */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="h-1.5 bg-bnb-verde" />
            <div className="p-6">
              <span className="text-xs font-black text-bnb-verde tracking-widest block mb-3">DEPOIS</span>
              <div className="text-3xl mb-3">ðŸ’»</div>
              <h3 className="font-bold text-gray-700 mb-3">EncerraDigital â€” Canal Digital</h3>
              <ul className="text-sm text-gray-500 space-y-1.5">
                {['SolicitaÃ§Ã£o online 24h/7','FormulÃ¡rio digital guiado','Assinatura ICP-Brasil / gov.br','Documentos no MinIO (S3)','Consulta de status com protocolo','NotificaÃ§Ã£o ao operador'].map((t) => (
                  <li key={t} className="flex items-center gap-2"><span className="text-bnb-verde font-bold text-xs">âœ“</span>{t}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* â•â• JORNADA DO CLIENTE â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <section className="bg-white py-14">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-10 text-center">Jornada do Cliente</h2>
          {/* Desktop: horizontal */}
          <div className="hidden md:flex items-start">
            {JORNADA.map((etapa, i) => (
              <div key={i} className="flex flex-col items-center flex-1">
                <div className="flex items-center w-full mb-4">
                  {i > 0 && <div className="flex-1 border-t-2 border-dashed border-bnb-laranja" />}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl flex-shrink-0 shadow-md ${
                    i === JORNADA.length - 1 ? 'bg-bnb-verde' : 'bg-bnb-vermelho'
                  }`}>
                    {etapa.icone}
                  </div>
                  {i < JORNADA.length - 1 && <div className="flex-1 border-t-2 border-dashed border-bnb-laranja" />}
                </div>
                <p className="font-bold text-sm text-gray-700 text-center px-1">{etapa.titulo}</p>
                <p className="text-xs text-gray-400 text-center px-1 mt-1">{etapa.desc}</p>
              </div>
            ))}
          </div>
          {/* Mobile: vertical */}
          <div className="flex md:hidden flex-col gap-0">
            {JORNADA.map((etapa, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center text-lg flex-shrink-0 shadow-md ${
                    i === JORNADA.length - 1 ? 'bg-bnb-verde' : 'bg-bnb-vermelho'
                  }`}>{etapa.icone}</div>
                  {i < JORNADA.length - 1 && <div className="w-0.5 h-8 border-l-2 border-dashed border-bnb-laranja mt-1" />}
                </div>
                <div className="pb-6">
                  <p className="font-bold text-sm text-gray-700">{etapa.titulo}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{etapa.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* â•â• MÃ“DULO PÃšBLICO â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <section className="py-14 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-8">
            <span className="bg-bnb-salmao text-bnb-vermelho text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">MÃ³dulo PÃºblico</span>
            <h2 className="text-2xl font-bold text-gray-800 mt-3 mb-1">Interface do Cliente</h2>
            <p className="text-sm text-gray-500"><code className="bg-gray-100 px-2 py-0.5 rounded text-bnb-vermelho">http://localhost:3000</code></p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">Preview interativo â€” clique nas abas</p>
              <PreviewFormulario />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">Funcionalidades</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { Icon: Globe,    titulo: 'SeleÃ§Ã£o em cascata',    desc: 'UF â†’ 300 agÃªncias BNB (fonte BCB)' },
                  { Icon: Lock,     titulo: 'Dados cifrados',        desc: 'AES-256-CBC em trÃ¢nsito e repouso' },
                  { Icon: FileText, titulo: 'PDF oficial 3303-40-64',desc: '14 seÃ§Ãµes obrigatÃ³rias, layout BNB' },
                  { Icon: Check,    titulo: 'Assinatura gov.br',     desc: 'Suporte A1 e A3 (ICP-Brasil)' },
                  { Icon: Upload,   titulo: 'Upload seguro',         desc: 'Magic bytes, SHA-256, max 10 MB' },
                  { Icon: Eye,      titulo: 'Status por protocolo',  desc: 'Sem exposiÃ§Ã£o de dados (LGPD)' },
                ].map(({ Icon, titulo, desc }) => (
                  <div key={titulo} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex gap-3 items-start">
                    <Icon className="w-5 h-5 text-bnb-vermelho mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-sm text-gray-700">{titulo}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* â•â• MÃ“DULO INTERNO â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <section className="bg-white py-14">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-8">
            <span className="bg-bnb-vermelho/10 text-bnb-vermelho text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">MÃ³dulo Restrito</span>
            <h2 className="text-2xl font-bold text-gray-800 mt-3 mb-1">Painel do Operador</h2>
            <p className="text-sm text-gray-500"><code className="bg-gray-100 px-2 py-0.5 rounded text-bnb-vermelho">http://localhost:3001</code> â€” requer autenticaÃ§Ã£o</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">Funcionalidades</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { Icon: Lock,     titulo: 'AutenticaÃ§Ã£o OIDC/SAML',    desc: 'Mock em dev Â· OIDC corporativo em prod' },
                  { Icon: Activity, titulo: 'Dashboard com mÃ©tricas',     desc: 'Pendentes, Em AnÃ¡lise, ConcluÃ­dos' },
                  { Icon: Eye,      titulo: 'Dados descriptografados',    desc: 'Apenas autenticados visualizam conta/nome' },
                  { Icon: FileText, titulo: 'PDF via URL presignada',     desc: 'MinIO TTL 5 min, sem exposiÃ§Ã£o de chaves' },
                  { Icon: Check,    titulo: 'AtualizaÃ§Ã£o de status',      desc: 'Perfis: Operador e Supervisor' },
                  { Icon: Shield,   titulo: 'Auditoria completa',         desc: 'Log [AUDITORIA] em cada acesso sensÃ­vel' },
                ].map(({ Icon, titulo, desc }) => (
                  <div key={titulo} className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex gap-3 items-start">
                    <Icon className="w-5 h-5 text-bnb-vermelho mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-sm text-gray-700">{titulo}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">Preview do dashboard</p>
              <PreviewDashboard />
            </div>
          </div>
        </div>
      </section>

      {/* â•â• ARQUITETURA TÃ‰CNICA â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <section className="py-14 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Arquitetura TÃ©cnica</h2>
          {/* Diagrama visual de camadas */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
            <div className="flex gap-3 justify-center mb-2">
              {[
                { label: 'ðŸŒ Frontend Cliente', sub: ':3000', border: 'border-bnb-verde' },
                { label: 'ðŸ”’ Frontend Interno',  sub: ':3001', border: 'border-bnb-verde' },
              ].map((b) => (
                <div key={b.label} className={`flex-1 max-w-[220px] border-2 ${b.border} rounded-xl p-3 text-center bg-white shadow-sm`}>
                  <p className="font-semibold text-xs text-gray-700">{b.label}</p>
                  <code className="text-bnb-verde text-xs font-mono">{b.sub}</code>
                </div>
              ))}
            </div>
            <div className="flex flex-col items-center text-xs text-gray-400 my-2">
              <span>REST / HTTPS</span>
              <span className="text-lg leading-none">â†•</span>
            </div>
            <div className="flex justify-center mb-2">
              <div className="border-2 border-bnb-vermelho rounded-xl p-3 text-center bg-white shadow-sm w-60">
                <p className="font-semibold text-xs text-gray-700">âš™ï¸ Backend NestJS</p>
                <code className="text-bnb-vermelho text-xs font-mono">:3333</code>
                <p className="text-xs text-gray-400 mt-0.5">JWT Session Â· Helmet Â· CORS</p>
              </div>
            </div>
            <div className="flex gap-16 justify-center items-start text-xs text-gray-400 my-2">
              {['Prisma ORM', 'S3 SDK', 'ioredis'].map((lbl) => (
                <div key={lbl} className="flex flex-col items-center">
                  <span className="text-lg leading-none">â†•</span>
                  <span>{lbl}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-3 justify-center">
              {[
                { label: 'ðŸ—„ï¸ PostgreSQL', sub: ':5432', border: 'border-bnb-azul' },
                { label: 'ðŸ“¦ MinIO',      sub: ':9000', border: 'border-bnb-azul' },
                { label: 'âš¡ Redis',      sub: ':6379', border: 'border-bnb-azul' },
              ].map((b) => (
                <div key={b.label} className={`flex-1 max-w-[160px] border-2 ${b.border} rounded-xl p-3 text-center bg-white shadow-sm`}>
                  <p className="font-semibold text-xs text-gray-700">{b.label}</p>
                  <code className="text-bnb-azul text-xs font-mono">{b.sub}</code>
                </div>
              ))}
            </div>
          </div>
          {/* Tabela */}
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
                    <td className="px-4 py-3"><code className="bg-gray-100 text-bnb-azul px-2 py-0.5 rounded text-xs">{t.porta}</code></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* â•â• VS CODE Â· AGENTES E MEMÃ“RIA â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <section className="bg-white py-14">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-10">
            <span className="bg-bnb-amarelo/30 text-gray-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">Diferencial PedagÃ³gico</span>
            <h2 className="text-2xl font-bold text-gray-800 mt-3 mb-1">Como o Projeto foi Estruturado no VS Code</h2>
            <p className="text-sm text-gray-500 max-w-2xl mx-auto">
              GitHub Copilot com InstruÃ§Ãµes Globais, Agentes Especializados e MemÃ³ria Persistente no repositÃ³rio.
            </p>
          </div>

          {/* Ãrvore VS Code */}
          <div className="rounded-xl overflow-hidden shadow-md mb-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-[#3c3c3c]">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="ml-2 text-[#cccccc] text-xs font-mono">SISENCCONTAS â€” Explorer</span>
            </div>
            <pre className="bg-[#1e1e1e] text-[#cccccc] text-xs font-mono p-5 overflow-x-auto leading-relaxed whitespace-pre">
{`ðŸ“ .github/
â”œâ”€â”€ ðŸ“„ copilot-instructions.md   â† instruÃ§Ãµes globais (carregadas automaticamente)
â””â”€â”€ ðŸ“ agents/
    â”œâ”€â”€ ðŸ¤– arquiteto.md
    â”œâ”€â”€ ðŸ¤– dev-backend.md
    â”œâ”€â”€ ðŸ¤– dev-frontend.md
    â”œâ”€â”€ ðŸ¤– seguranca.md          â† OWASP ASVS + LGPD
    â””â”€â”€ ðŸ¤– testes.md             â† Jest + Playwright

ðŸ“ docs/
â”œâ”€â”€ ðŸ“„ memoria/contexto-atual.md â† memÃ³ria persistente do projeto
â”œâ”€â”€ ðŸ“„ arquitetura.md
â”œâ”€â”€ ðŸ“„ estrategia-agentes-e-memoria.md
â””â”€â”€ ðŸ“ adr/                      â† 7 decisÃµes arquiteturais (ADR-001 a ADR-007)

ðŸ“ backend/   ðŸ“ frontend-cliente/   ðŸ“ frontend-interno/
ðŸ“ e2e/       ðŸ“ data/               ðŸ“„ docker-compose.dev.yml`}
            </pre>
          </div>

          {/* Legenda 3 colunas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            {[
              { icone: 'ðŸ§ ', titulo: 'MemÃ³ria Persistente',    desc: 'docs/memoria/contexto-atual.md â€” atualizado a cada fase, versionado no Git, acessÃ­vel por qualquer modelo de IA' },
              { icone: 'ðŸ¤–', titulo: 'Agentes Especializados', desc: '.github/agents/*.md â€” cada agente tem papel, regras e contexto obrigatÃ³rio. Ativados por #file: no chat' },
              { icone: 'âš™ï¸', titulo: 'InstruÃ§Ãµes Globais',     desc: '.github/copilot-instructions.md â€” carregado automaticamente em todo @workspace. Define stack, OWASP e LGPD' },
            ].map((c) => (
              <div key={c.titulo} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <p className="text-2xl mb-2">{c.icone}</p>
                <p className="font-bold text-sm text-gray-700 mb-1">{c.titulo}</p>
                <p className="text-xs text-gray-400">{c.desc}</p>
              </div>
            ))}
          </div>

          {/* Card copilot-instructions */}
          <div className="bg-white border-l-4 border-bnb-azul rounded-xl shadow-sm p-5 mb-8">
            <div className="flex items-start gap-3">
              <Settings2 className="w-5 h-5 text-bnb-azul mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <p className="font-bold text-gray-800">InstruÃ§Ãµes Globais do Copilot</p>
                  <span className="bg-bnb-laranja/20 text-amber-700 text-xs font-semibold px-2 py-0.5 rounded-full">Contexto automÃ¡tico em todo o repositÃ³rio</span>
                </div>
                <p className="text-xs text-gray-500 mb-2">
                  <code className="bg-gray-100 px-1.5 py-0.5 rounded text-bnb-azul font-mono">.github/copilot-instructions.md</code>
                </p>
                <p className="text-sm text-gray-600">
                  Lido automaticamente pelo GitHub Copilot em <strong>todas</strong> as interaÃ§Ãµes dentro do repositÃ³rio.
                  Define: stack obrigatÃ³ria, padrÃµes de cÃ³digo, regras de seguranÃ§a (OWASP/LGPD) e referÃªncias normativas do BNB.
                  Qualquer sugestÃ£o do Copilot jÃ¡ nasce alinhada com o projeto â€” sem repetir contexto a cada prompt.
                </p>
              </div>
            </div>
          </div>

          {/* Cards dos agentes */}
          <h3 className="font-bold text-gray-700 mb-4 text-sm uppercase tracking-wide">Agentes Especializados (.github/agents/)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {AGENTES.map((ag) => (
              <div key={ag.titulo} className="bg-white border border-gray-100 shadow-sm rounded-xl overflow-hidden">
                <div className="h-0.5 bg-bnb-vermelho" />
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Bot className="w-4 h-4 text-bnb-vermelho" />
                      <p className="font-bold text-sm text-gray-800">{ag.titulo}</p>
                    </div>
                    <span className="bg-bnb-amarelo/40 text-gray-700 text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 whitespace-nowrap">Agent Mode âœ¦</span>
                  </div>
                  <code className="text-[10px] text-gray-400 font-mono block mb-2">{ag.arquivo}</code>
                  <p className="text-xs text-gray-500">{ag.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Card MemÃ³ria Persistente */}
          <div className="bg-bnb-salmao/40 border border-bnb-laranja rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <BookOpen className="w-7 h-7 text-bnb-laranja mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-800 mb-0.5">MemÃ³ria Persistente do Projeto</h3>
                <p className="text-sm text-gray-500 mb-4">Independente do modelo de IA â€” armazenada no repositÃ³rio Git</p>
                <ul className="space-y-1.5 mb-5 text-sm text-gray-600">
                  {[
                    <><code className="text-xs bg-white/60 px-1 rounded font-mono">docs/memoria/contexto-atual.md</code> Ã© atualizado a cada fase concluÃ­da</>,
                    <>Registra: o que foi feito, decisÃµes, pendÃªncias e bloqueios ativos</>,
                    <>Nova sessÃ£o com Copilot, Claude ou GPT: referencie o arquivo e o assistente tem contexto completo instantaneamente</>,
                    <>NÃ£o depende do histÃ³rico de chat do modelo (que se perde) â€” vive no prÃ³prio Git</>,
                    <>Serve tambÃ©m como onboarding rÃ¡pido para novos desenvolvedores da equipe</>,
                  ].map((item, i) => (
                    <li key={i} className="flex gap-2"><span className="text-bnb-laranja font-bold mt-0.5">â€¢</span><span>{item}</span></li>
                  ))}
                </ul>
                {/* ComparaÃ§Ã£o */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-white rounded-xl p-4 border border-red-100">
                    <p className="font-bold text-sm text-bnb-vermelho mb-2">âŒ MemÃ³ria do Modelo de IA</p>
                    <ul className="text-xs text-gray-500 space-y-1">
                      {['Perdida ao fechar o chat','Limitada Ã  janela de contexto','NÃ£o versionada nem compartilhÃ¡vel','Depende de plugins externos'].map((t) => (
                        <li key={t}>â€¢ {t}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-green-100">
                    <p className="font-bold text-sm text-bnb-verde mb-2">âœ… MemÃ³ria no RepositÃ³rio Git</p>
                    <ul className="text-xs text-gray-500 space-y-1">
                      {['Persiste entre sessÃµes e modelos','Versionada com o cÃ³digo-fonte','Compartilhada entre toda a equipe','Funciona com qualquer IA'].map((t) => (
                        <li key={t}>â€¢ {t}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* â•â• SEGURANÃ‡A â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <section className="py-14 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          {/* Banner gradiente */}
          <div className="bg-gradient-to-r from-bnb-verde to-bnb-azul rounded-2xl p-5 text-center text-white mb-8 shadow-md">
            <p className="font-bold text-lg">PadrÃ£o OWASP ASVS NÃ­vel 2</p>
            <p className="text-white/80 text-sm mt-0.5">Adequado para aplicaÃ§Ãµes de ecossistema bancÃ¡rio e dados financeiros pessoais</p>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">SeguranÃ§a e Conformidade</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {SEGURANCA.map(({ icon: Icon, titulo, desc }) => (
              <div key={titulo} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex gap-3 items-start border-l-4 border-l-bnb-verde">
                <Icon className="w-4 h-4 text-bnb-verde mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-sm text-gray-700">{titulo}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* â•â• ROADMAP â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <section className="bg-white py-14">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-10 text-center">Roadmap de Desenvolvimento</h2>
          <div className="max-w-2xl mx-auto">
            {FASES.map((f, i) => (
              <div key={f.num} className="flex gap-5">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0 shadow-md ${
                    f.concluida
                      ? 'bg-bnb-vermelho text-white'
                      : 'border-2 border-dashed border-bnb-laranja bg-white text-bnb-laranja'
                  }`}>
                    {f.concluida ? <Check className="w-5 h-5" /> : f.num}
                  </div>
                  {i < FASES.length - 1 && <div className="w-0.5 flex-1 bg-gray-200 my-1" />}
                </div>
                <div className="pb-7 flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <p className={`font-bold text-sm ${f.concluida ? 'text-gray-800' : 'text-gray-400'}`}>
                      Fase {f.num} â€” {f.titulo}
                    </p>
                    {f.concluida ? (
                      <span className="bg-green-50 text-bnb-verde text-xs font-semibold px-2 py-0.5 rounded-full">âœ… ConcluÃ­do</span>
                    ) : (
                      <span className="bg-bnb-laranja/10 text-bnb-laranja text-xs font-semibold px-2 py-0.5 rounded-full">ðŸ”œ PrÃ³ximo</span>
                    )}
                    {f.data && (
                      <span className="bg-gray-100 text-gray-400 text-xs px-2 py-0.5 rounded-full font-mono">{f.data}</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* â•â• DESTAQUE TÃ‰CNICO â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <section className="py-14 bg-gradient-to-b from-bnb-salmao/30 to-white">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Por que este Projeto Ã© um Sistema Real?</h2>
          <p className="text-center text-sm text-gray-400 mb-8">Diferenciais tÃ©cnicos que elevam alÃ©m de um projeto acadÃªmico</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icone: 'ðŸ“œ', titulo: 'Normativo real',          desc: 'Termo 3303-40-64 com 14 seÃ§Ãµes obrigatÃ³rias do modelo oficial BNB' },
              { icone: 'ðŸ”', titulo: 'Criptografia em repouso', desc: 'AES-256-CBC em 4 campos sensÃ­veis: conta, titular, email, destino' },
              { icone: 'ðŸ§ª', titulo: 'Testes automatizados',    desc: '22 unitÃ¡rios Jest + 6 fluxos E2E Playwright â€” todos passando' },
              { icone: 'ðŸ›ï¸', titulo: 'Fonte de dados oficial',  desc: '300 agÃªncias BNB extraÃ­das da API do Banco Central do Brasil (BCB/ODbL)' },
            ].map((c) => (
              <div key={c.titulo} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm text-center">
                <p className="text-3xl mb-3">{c.icone}</p>
                <p className="font-bold text-sm text-gray-800 mb-1">{c.titulo}</p>
                <p className="text-xs text-gray-400">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* â•â• FOOTER â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <footer className="bg-bnb-vermelho text-white py-8">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 mb-5">
            <div>
              <p className="font-bold text-lg">Banco do Nordeste do Brasil S/A</p>
              <p className="text-white/60 text-xs">CNPJ: 07.237.373/0001-20</p>
              <p className="text-white/50 text-xs mt-0.5">EncerraDigital â€” Sistema de Encerramento Digital de Conta Corrente</p>
            </div>
            <a
              href="https://github.com/blahxjr/sisenccontas"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm transition-colors border border-white/20"
            >
              <Github className="w-4 h-4" />
              github.com/blahxjr/sisenccontas
            </a>
          </div>
          <div className="border-t border-white/20 pt-4">
            <div className="flex flex-wrap items-center justify-center gap-x-1 gap-y-0.5 text-xs mb-2">
              {[
                { label: 'Next.js 14',      cor: 'text-bnb-amarelo' },
                { label: 'Â·',               cor: 'text-white/30' },
                { label: 'NestJS',          cor: 'text-bnb-laranja' },
                { label: 'Â·',               cor: 'text-white/30' },
                { label: 'PostgreSQL',      cor: 'text-blue-300' },
                { label: 'Â·',               cor: 'text-white/30' },
                { label: 'MinIO',           cor: 'text-bnb-verde' },
                { label: 'Â·',               cor: 'text-white/30' },
                { label: 'Redis',           cor: 'text-red-300' },
                { label: 'Â·',               cor: 'text-white/30' },
                { label: 'Docker',          cor: 'text-blue-200' },
                { label: 'Â·',               cor: 'text-white/30' },
                { label: 'pnpm workspaces', cor: 'text-yellow-200' },
              ].map((s, i) => (
                <span key={i} className={s.cor}>{s.label}</span>
              ))}
            </div>
            <p className="text-center text-xs text-white/40">
              Normativo 3303-03-11 v.020 Â· OWASP ASVS NÃ­vel 2 Â· LGPD Art. 46 Â· ADR-001 a ADR-007
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
