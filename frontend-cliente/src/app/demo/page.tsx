"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  FileText,
  Lock,
  Upload,
  Database,
  Eye,
  Clock,
  Activity,
  CheckCircle,
  Github,
  Shield,
  Globe,
  ArrowRight,
  Check,
  BookOpen,
  Bot,
  Settings2,
  MessageCircle,
  Loader2,
  Play,
  RefreshCw,
  User,
  KeyRound,
} from "lucide-react";

// ─── Dados estáticos de demonstração (standalone — sem API) ───────────────────

const MOTIVOS_DEMO = [
  { codigo: "01", descricao: "Mudança para outra instituição financeira" },
  { codigo: "02", descricao: "Insatisfação com tarifas e encargos" },
  { codigo: "03", descricao: "Pouca utilização da conta" },
  {
    codigo: "04",
    descricao: "Dificuldade de acesso a agências e canais digitais",
  },
  {
    codigo: "05",
    descricao: "Encerramento de atividade profissional ou empresarial",
  },
  {
    codigo: "06",
    descricao: "Falecimento do titular (solicitação por herdeiro)",
  },
  { codigo: "07", descricao: "Outros motivos" },
];

const UFS_DEMO = [
  "AL",
  "BA",
  "CE",
  "MA",
  "MG",
  "PA",
  "PB",
  "PE",
  "PI",
  "RJ",
  "RN",
  "SE",
  "SP",
];

const AGENCIAS_DEMO: Record<
  string,
  { codigo: string; nome: string; municipio: string }[]
> = {
  AL: [
    { codigo: "0031", nome: "Maceió Centro", municipio: "Maceió" },
    { codigo: "0006", nome: "Arapiraca", municipio: "Arapiraca" },
    { codigo: "0229", nome: "Maceió Antares", municipio: "Maceió" },
  ],
  BA: [
    { codigo: "0100", nome: "Salvador Centro", municipio: "Salvador" },
    { codigo: "0112", nome: "Feira de Santana", municipio: "Feira de Santana" },
    {
      codigo: "0115",
      nome: "Vitória da Conquista",
      municipio: "Vitória da Conquista",
    },
  ],
  CE: [
    { codigo: "0210", nome: "Fortaleza Centro", municipio: "Fortaleza" },
    {
      codigo: "0213",
      nome: "Juazeiro do Norte",
      municipio: "Juazeiro do Norte",
    },
    { codigo: "0218", nome: "Sobral", municipio: "Sobral" },
    { codigo: "0221", nome: "Crato", municipio: "Crato" },
  ],
  MA: [
    { codigo: "0081", nome: "Imperatriz", municipio: "Imperatriz" },
    { codigo: "0500", nome: "São Luís Centro", municipio: "São Luís" },
    { codigo: "0082", nome: "Caxias", municipio: "Caxias" },
    { codigo: "0085", nome: "Bacabal", municipio: "Bacabal" },
  ],
  MG: [
    {
      codigo: "0301",
      nome: "Belo Horizonte Centro",
      municipio: "Belo Horizonte",
    },
    { codigo: "0312", nome: "Uberlândia", municipio: "Uberlândia" },
    { codigo: "0318", nome: "Montes Claros", municipio: "Montes Claros" },
  ],
  PA: [
    { codigo: "0401", nome: "Belém Centro", municipio: "Belém" },
    { codigo: "0410", nome: "Marabá", municipio: "Marabá" },
    { codigo: "0415", nome: "Santarém", municipio: "Santarém" },
  ],
  PB: [
    { codigo: "0501", nome: "João Pessoa Centro", municipio: "João Pessoa" },
    { codigo: "0510", nome: "Campina Grande", municipio: "Campina Grande" },
    { codigo: "0515", nome: "Patos", municipio: "Patos" },
  ],
  PE: [
    { codigo: "0601", nome: "Recife Centro", municipio: "Recife" },
    { codigo: "0612", nome: "Caruaru", municipio: "Caruaru" },
    { codigo: "0615", nome: "Petrolina", municipio: "Petrolina" },
    { codigo: "0620", nome: "Olinda", municipio: "Olinda" },
  ],
  PI: [
    { codigo: "0701", nome: "Teresina Centro", municipio: "Teresina" },
    { codigo: "0710", nome: "Parnaíba", municipio: "Parnaíba" },
    { codigo: "0715", nome: "Picos", municipio: "Picos" },
  ],
  RJ: [
    {
      codigo: "0801",
      nome: "Rio de Janeiro Centro",
      municipio: "Rio de Janeiro",
    },
    { codigo: "0815", nome: "Niterói", municipio: "Niterói" },
  ],
  RN: [
    { codigo: "0901", nome: "Natal Centro", municipio: "Natal" },
    { codigo: "0910", nome: "Mossoró", municipio: "Mossoró" },
    { codigo: "0915", nome: "Caicó", municipio: "Caicó" },
  ],
  SE: [
    { codigo: "1001", nome: "Aracaju Centro", municipio: "Aracaju" },
    { codigo: "1010", nome: "Lagarto", municipio: "Lagarto" },
  ],
  SP: [
    { codigo: "1101", nome: "São Paulo Centro", municipio: "São Paulo" },
    { codigo: "1115", nome: "Campinas", municipio: "Campinas" },
  ],
};

const FASES = [
  {
    num: "1",
    titulo: "Catálogos BRF",
    desc: "300 agências reais via API BCB + 7 motivos de encerramento",
    concluida: true,
    data: "05/04/2026",
  },
  {
    num: "2",
    titulo: "Backend NestJS",
    desc: "API REST com Helmet, CORS, ValidationPipe, Swagger",
    concluida: true,
    data: "05/04/2026",
  },
  {
    num: "3",
    titulo: "Banco de Dados",
    desc: "PostgreSQL + Prisma, criptografia AES-256 em repouso",
    concluida: true,
    data: "05/04/2026",
  },
  {
    num: "4",
    titulo: "Frontend Cliente",
    desc: "Next.js 14, formulário multi-etapa + chatbot, consulta de status",
    concluida: true,
    data: "05/04/2026",
  },
  {
    num: "5",
    titulo: "Frontend Interno",
    desc: "Painel operador, auth mock OIDC, dashboard, detalhe",
    concluida: true,
    data: "05/04/2026",
  },
  {
    num: "6",
    titulo: "Documentos + PDF",
    desc: "MinIO, PDF Termo BRF-3303-40-64 oficial (14 seções), upload seguro",
    concluida: true,
    data: "06/04/2026",
  },
  {
    num: "7",
    titulo: "Testes",
    desc: "Jest unitários (22 testes), Playwright E2E (6 fluxos)",
    concluida: true,
    data: "06/04/2026",
  },
  {
    num: "8",
    titulo: "Auth Corporativo",
    desc: "OIDC/SAML BRF real, hardening produção, CI/CD",
    concluida: false,
    data: "",
  },
];

const SEGURANCA = [
  {
    icon: Lock,
    titulo: "AES-256-CBC em repouso",
    desc: "numeroConta, titularNome, emailCliente, contaTransferencia",
  },
  {
    icon: Shield,
    titulo: "HTTPS + HSTS",
    desc: "Headers de segurança via Next.js config (CSP, X-Frame-Options: DENY)",
  },
  {
    icon: Eye,
    titulo: "Minimização LGPD",
    desc: "Dados sensíveis ausentes em rotas públicas — Art. 46",
  },
  {
    icon: Upload,
    titulo: "Upload seguro",
    desc: "Validação magic bytes %PDF, max 10 MB, SHA-256 por arquivo",
  },
  {
    icon: Database,
    titulo: "MinIO + URLs presignadas",
    desc: "S3-compatível, TTL 5 min, sem exposição de chaves",
  },
  {
    icon: Eye,
    titulo: "IP mascarado em logs",
    desc: "Último octeto removido — conformidade LGPD",
  },
  {
    icon: ShieldCheck,
    titulo: "OWASP ASVS Nível 2",
    desc: "Padrão mínimo para sistemas financeiros",
  },
  {
    icon: FileText,
    titulo: "Auditoria completa",
    desc: "Log [AUDITORIA] em cada acesso a dados sensíveis",
  },
  {
    icon: Lock,
    titulo: "Session JWT 8h",
    desc: "Expiração padrão bancário no módulo interno",
  },
  {
    icon: Shield,
    titulo: "Middleware de rotas",
    desc: "100% das rotas internas exigem autenticação",
  },
];

const TECNOLOGIAS = [
  {
    camada: "Frontend Cliente",
    stack: "Next.js 14 · React 18 · TailwindCSS · RHF + Zod · Axios",
    porta: ":3000",
  },
  {
    camada: "Frontend Interno",
    stack: "Next.js 14 · NextAuth v4 · TailwindCSS · Axios",
    porta: ":3001",
  },
  {
    camada: "Backend API",
    stack: "NestJS · TypeScript · Prisma · Multer · pdf-lib · AWS SDK S3",
    porta: ":3333",
  },
  {
    camada: "Banco de Dados",
    stack: "PostgreSQL 16 · Prisma ORM · Migrations versionadas",
    porta: ":5432",
  },
  {
    camada: "Armazenamento",
    stack: "MinIO (S3-compatível) · AES256 server-side · URL presignada",
    porta: ":9000",
  },
  {
    camada: "Cache/Sessão",
    stack: "Redis 7 (reservado para rate-limiting e filas futuras)",
    porta: ":6379",
  },
  {
    camada: "Infraestrutura",
    stack: "Docker Compose · Dev Container · pnpm workspaces",
    porta: "local",
  },
];

const JORNADA = [
  {
    icone: "🖥️",
    titulo: "Acessa o portal",
    desc: "Preenche formulário multi-etapa com seleção de agência em cascata",
  },
  {
    icone: "📋",
    titulo: "Recebe protocolo",
    desc: "Protocolo único ENC-2026-XXXXXX gerado instantaneamente",
  },
  {
    icone: "📄",
    titulo: "Baixa o Termo",
    desc: "PDF gerado no servidor conforme normativo oficial BRF-3303-40-64",
  },
  {
    icone: "✍️",
    titulo: "Assina digitalmente",
    desc: "Via gov.br / ICP-Brasil — certificados A1 ou A3",
  },
  {
    icone: "✅",
    titulo: "Upload + Análise",
    desc: "Operador BRF processa no painel interno com auditoria completa",
  },
];

const AGENTES = [
  {
    titulo: "Agente Arquiteto",
    arquivo: "arquiteto.md",
    desc: "Decisões de design, ADRs e impacto arquitetural. Avalia trade-offs antes de qualquer mudança estrutural.",
  },
  {
    titulo: "Agente Backend",
    arquivo: "dev-backend.md",
    desc: "NestJS, Prisma, criptografia AES-256 e conformidade LGPD. Módulos, DTOs e repositórios.",
  },
  {
    titulo: "Agente Frontend",
    arquivo: "dev-frontend.md",
    desc: "Next.js 14 (App Router), React Hook Form + Zod, TailwindCSS com paleta BRF e acessibilidade WCAG.",
  },
  {
    titulo: "Agente Segurança",
    arquivo: "seguranca.md",
    desc: "OWASP ASVS Nível 2, headers HTTP, validação de uploads, mascaramento de IP e LGPD Art. 46.",
  },
  {
    titulo: "Agente Testes",
    arquivo: "testes.md",
    desc: "Jest (unitários) e Playwright (E2E). Page objects, fixtures e todos os fluxos críticos.",
  },
];

// ─── Componente: Formulário Multi-Etapa (standalone) ─────────────────────────

/** Preview interativo do formulário de 3 etapas conforme normativo BRF-3303-03-11.
 * Completamente autossuficiente — sem chamadas à API. */
function PreviewFormulario() {
  const [etapa, setEtapa] = useState(0);
  const [uf, setUf] = useState("");
  const [agencia, setAgencia] = useState("");
  const [conta, setConta] = useState("");
  const [titular, setTitular] = useState("");
  const [motivo, setMotivo] = useState("");
  const [cheque, setCheque] = useState(false);
  const [saldo, setSaldo] = useState(false);
  const [endereco, setEndereco] = useState("");
  const [aceite, setAceite] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [protocolo, setProtocolo] = useState<string | null>(null);

  const agenciasFiltradas = uf ? (AGENCIAS_DEMO[uf] ?? []) : [];
  const nomeAgencia =
    agenciasFiltradas.find((a) => a.codigo === agencia)?.nome ?? "";
  const municipioAgencia =
    agenciasFiltradas.find((a) => a.codigo === agencia)?.municipio ?? "";

  const podeAvancar1 =
    uf !== "" && agencia !== "" && conta.length >= 3 && titular.length >= 3;
  const podeAvancar2 = endereco.length >= 10;

  const ETAPAS = [
    "Dados da Conta",
    "Informações Complementares",
    "Confirmar e Assinar",
  ];

  const handleEnviar = () => {
    setEnviando(true);
    const timer = setTimeout(() => {
      const num = String(Math.floor(100000 + Math.random() * 900000));
      setProtocolo(`ENC-2026-${num}`);
      setEnviando(false);
    }, 1500);
    return () => clearTimeout(timer);
  };

  const handleReset = () => {
    setEtapa(0);
    setUf("");
    setAgencia("");
    setConta("");
    setTitular("");
    setMotivo("");
    setCheque(false);
    setSaldo(false);
    setEndereco("");
    setAceite(false);
    setProtocolo(null);
    setEnviando(false);
  };

  const HeaderBar = () => (
    <div className="bg-brf-vermelho px-4 py-2.5 flex items-center justify-between">
      <span className="text-white font-bold text-sm">
        Encerramento de Conta Corrente
      </span>
      <span className="text-white/60 text-xs">BRF Digital</span>
    </div>
  );

  // ── Tela de Sucesso ──────────────────────────────────────────────────────
  if (protocolo) {
    return (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <HeaderBar />
        <div className="p-6 space-y-5 text-center">
          <CheckCircle className="h-12 w-12 text-brf-verde mx-auto" />
          <h3 className="text-lg font-bold text-green-800">
            Solicitação Registrada!
          </h3>
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 space-y-1">
            <p className="text-xs text-gray-500">Número do protocolo</p>
            <p className="text-2xl font-bold text-brf-vermelho font-mono tracking-widest">
              {protocolo}
            </p>
            <p className="text-xs text-gray-400">
              Guarde este número para acompanhar sua solicitação
            </p>
          </div>
          <div className="bg-brf-salmao rounded-lg p-3 text-xs text-gray-600 text-left space-y-1">
            <p className="font-semibold text-brf-vermelho">
              📄 Próximos passos:
            </p>
            <ol className="list-decimal list-inside space-y-0.5">
              <li>Gere o PDF do Termo de Encerramento</li>
              <li>
                Assine digitalmente via{" "}
                <strong>gov.br (ICP-Brasil)</strong>
              </li>
              <li>Faça upload do PDF assinado no portal</li>
            </ol>
          </div>
          <div className="flex gap-3 justify-center">
            <button
              onClick={handleReset}
              className="text-xs border border-brf-vermelho text-brf-vermelho px-4 py-2 rounded-lg hover:bg-brf-salmao transition-colors flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" /> Reiniciar demo
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Indicador de Etapas ─────────────────────────────────────────────────
  const IndicadorEtapas = () => (
    <div className="flex bg-white border-b">
      {ETAPAS.map((nome, i) => (
        <div
          key={i}
          className={`flex-1 py-2 px-1 text-center border-b-2 transition-all ${
            i === etapa
              ? "border-brf-vermelho"
              : i < etapa
                ? "border-brf-laranja"
                : "border-transparent"
          }`}
        >
          <div
            className={`w-5 h-5 rounded-full mx-auto flex items-center justify-center text-xs font-bold mb-0.5 ${
              i < etapa
                ? "bg-brf-laranja text-white"
                : i === etapa
                  ? "bg-brf-vermelho text-white"
                  : "bg-gray-100 text-gray-400"
            }`}
          >
            {i < etapa ? "✓" : i + 1}
          </div>
          <p
            className={`text-[9px] leading-tight hidden sm:block ${
              i === etapa
                ? "text-brf-vermelho font-semibold"
                : i < etapa
                  ? "text-brf-laranja"
                  : "text-gray-400"
            }`}
          >
            {nome.split(" ")[0]}
          </p>
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
      <HeaderBar />
      <IndicadorEtapas />

      {/* ── Etapa 1: Dados da Conta ── */}
      {etapa === 0 && (
        <div className="p-5 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">
                Estado (UF) *
              </label>
              <select
                value={uf}
                onChange={(e) => {
                  setUf(e.target.value);
                  setAgencia("");
                }}
                className="w-full border border-gray-200 rounded-lg px-2 py-2 text-sm focus:ring-2 focus:ring-brf-vermelho focus:outline-none"
              >
                <option value="">Selecione...</option>
                {UFS_DEMO.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">
                Agência *
              </label>
              <select
                value={agencia}
                onChange={(e) => setAgencia(e.target.value)}
                disabled={!uf}
                className="w-full border border-gray-200 rounded-lg px-2 py-2 text-sm disabled:bg-gray-50 disabled:text-gray-400 focus:ring-2 focus:ring-brf-vermelho focus:outline-none"
              >
                <option value="">
                  {uf ? "Selecione..." : "Selecione o UF primeiro"}
                </option>
                {agenciasFiltradas.map((ag) => (
                  <option key={ag.codigo} value={ag.codigo}>
                    {ag.codigo} — {ag.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">
                Número da Conta *
              </label>
              <input
                value={conta}
                onChange={(e) => setConta(e.target.value)}
                placeholder="12345-6"
                className="w-full border border-gray-200 rounded-lg px-2 py-2 text-sm focus:ring-2 focus:ring-brf-vermelho focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">
                Nome do Titular *
              </label>
              <input
                value={titular}
                onChange={(e) => setTitular(e.target.value)}
                placeholder="Nome completo"
                className="w-full border border-gray-200 rounded-lg px-2 py-2 text-sm focus:ring-2 focus:ring-brf-vermelho focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">
              Motivo do encerramento
            </label>
            <select
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-2 py-2 text-sm focus:ring-2 focus:ring-brf-vermelho focus:outline-none"
            >
              <option value="">Prefiro não informar</option>
              {MOTIVOS_DEMO.map((m) => (
                <option key={m.codigo} value={m.codigo}>
                  {m.descricao}
                </option>
              ))}
            </select>
          </div>
          {uf && agencia && (
            <div className="bg-brf-salmao rounded-lg p-2 text-xs text-gray-600">
              📍 Agência <strong>{agencia}</strong> — {nomeAgencia},{" "}
              {municipioAgencia}
            </div>
          )}
          <button
            onClick={() => setEtapa(1)}
            disabled={!podeAvancar1}
            className="w-full bg-brf-vermelho text-white py-2 rounded-lg font-semibold text-sm hover:bg-brf-vermelho-escuro transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Próximo →
          </button>
          {!podeAvancar1 && (
            <p className="text-[10px] text-gray-400 text-center">
              * Preencha UF, agência, conta e nome para continuar
            </p>
          )}
        </div>
      )}

      {/* ── Etapa 2: Informações Complementares ── */}
      {etapa === 1 && (
        <div className="p-5 space-y-3">
          <p className="text-xs text-gray-400 uppercase font-semibold tracking-wide">
            Normativo BRF-3303-03-11
          </p>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={cheque}
                onChange={(e) => setCheque(e.target.checked)}
                className="accent-brf-vermelho w-4 h-4"
              />
              <span>Movimentei esta conta através de cheque</span>
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={saldo}
                onChange={(e) => setSaldo(e.target.checked)}
                className="accent-brf-vermelho w-4 h-4"
              />
              <span>A conta possui saldo positivo a ser transferido</span>
            </label>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">
              Endereço completo *
            </label>
            <input
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
              placeholder="Rua, nº, bairro, cidade — UF, CEP"
              className="w-full border border-gray-200 rounded-lg px-2 py-2 text-sm focus:ring-2 focus:ring-brf-vermelho focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">
              E-mail (opcional)
            </label>
            <input
              type="email"
              placeholder="seu@email.com"
              className="w-full border border-gray-200 rounded-lg px-2 py-2 text-sm focus:ring-2 focus:ring-brf-vermelho focus:outline-none"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setEtapa(0)}
              className="flex-1 border border-gray-300 text-gray-500 py-2 rounded-lg font-semibold text-sm hover:bg-gray-50 transition-colors"
            >
              ← Voltar
            </button>
            <button
              onClick={() => setEtapa(2)}
              disabled={!podeAvancar2}
              className="flex-1 bg-brf-vermelho text-white py-2 rounded-lg font-semibold text-sm hover:bg-brf-vermelho-escuro transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Próximo →
            </button>
          </div>
        </div>
      )}

      {/* ── Etapa 3: Confirmar e Assinar ── */}
      {etapa === 2 && (
        <div className="p-5 space-y-3">
          <p className="text-xs text-gray-400 uppercase font-semibold tracking-wide">
            Resumo da Solicitação
          </p>
          <div className="bg-gray-50 rounded-xl p-3 text-xs space-y-1.5 border border-gray-100">
            {(
              [
                ["Estado", uf],
                ["Agência", `${agencia} — ${nomeAgencia}`],
                ["Conta", `***${conta.slice(-3)}`],
                ["Titular", titular],
                [
                  "Motivo",
                  motivo
                    ? (MOTIVOS_DEMO.find((m) => m.codigo === motivo)
                        ?.descricao ?? motivo)
                    : "Não informado",
                ],
                ["Cheque", cheque ? "Sim" : "Não"],
                ["Saldo a transferir", saldo ? "Sim" : "Não"],
              ] as [string, string][]
            ).map(([label, valor]) => (
              <div key={label} className="flex justify-between gap-2">
                <span className="text-gray-400">{label}</span>
                <span className="font-medium text-gray-700 text-right break-all">
                  {valor}
                </span>
              </div>
            ))}
          </div>
          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={aceite}
              onChange={(e) => setAceite(e.target.checked)}
              className="accent-brf-vermelho w-4 h-4 mt-0.5"
            />
            <span className="text-xs text-gray-600 leading-relaxed">
              Li e aceito o Termo de Encerramento conforme{" "}
              <strong>normativo BRF-3303-03-11</strong> e modelo BRF-3303-40-64.
            </span>
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setEtapa(1)}
              className="flex-1 border border-gray-300 text-gray-500 py-2 rounded-lg font-semibold text-sm hover:bg-gray-50 transition-colors"
            >
              ← Voltar
            </button>
            <button
              onClick={handleEnviar}
              disabled={!aceite || enviando}
              className="flex-1 bg-brf-vermelho text-white py-2 rounded-lg font-semibold text-sm hover:bg-brf-vermelho-escuro transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1"
            >
              {enviando ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" /> Enviando...
                </>
              ) : (
                "Confirmar e Enviar"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Componente: Chatbot (simulação animada standalone) ────────────────────────

type MsgChat = { origem: "bot" | "user"; texto: string };

const SCRIPT_CHATBOT: MsgChat[] = [
  {
    origem: "bot",
    texto:
      "Olá! Sou o assistente digital de encerramento de conta do BRF. Vou te guiar pelo processo em poucos passos. Podemos começar?",
  },
  { origem: "user", texto: "Sim, vamos lá! 👍" },
  { origem: "bot", texto: "Em qual estado fica sua agência?" },
  { origem: "user", texto: "MA — Maranhão" },
  { origem: "bot", texto: "Qual é a sua agência no Maranhão?" },
  { origem: "user", texto: "0081 — Imperatriz" },
  { origem: "bot", texto: "Qual é o número da sua conta corrente?" },
  { origem: "user", texto: "12345-6" },
  { origem: "bot", texto: "Confirme o nome completo do titular da conta:" },
  { origem: "user", texto: "Maria Silva Santos" },
  { origem: "bot", texto: "Qual o motivo do encerramento?" },
  { origem: "user", texto: "Mudança para outra instituição financeira" },
  {
    origem: "bot",
    texto: "Você movimentou essa conta através de cheque?",
  },
  { origem: "user", texto: "Não" },
  {
    origem: "bot",
    texto: "Sua conta tem saldo positivo a ser transferido?",
  },
  { origem: "user", texto: "Não, pode fechar" },
  {
    origem: "bot",
    texto: "Informe seu endereço completo e atualizado:",
  },
  {
    origem: "user",
    texto: "Av. Getúlio Vargas, 100, Centro — Imperatriz/MA, 65900-000",
  },
  {
    origem: "bot",
    texto:
      "Seu e-mail de contato (opcional):",
  },
  { origem: "user", texto: "maria.silva@email.com" },
  {
    origem: "bot",
    texto:
      "✅ Solicitação registrada com sucesso!\n\nProtocolo: ENC-2026-347891\n\nGuarde esse número para acompanhar sua solicitação.",
  },
];

/** Simulação animada do chatbot de encerramento — standalone, sem API. */
function PreviewChatbot() {
  const [fase, setFase] = useState<"idle" | "playing" | "done">("idle");
  const [visiveis, setVisiveis] = useState<MsgChat[]>([]);
  const [digitando, setDigitando] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetar = () => {
    setFase("idle");
    setVisiveis([]);
    setDigitando(false);
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const iniciar = () => {
    setFase("playing");
    setVisiveis([]);
    setDigitando(false);
    let i = 0;

    const revelarProximo = () => {
      if (i >= SCRIPT_CHATBOT.length) {
        setDigitando(false);
        setFase("done");
        return;
      }
      const msg = SCRIPT_CHATBOT[i];
      i++;
      if (msg.origem === "bot") {
        setDigitando(true);
        timerRef.current = setTimeout(() => {
          setDigitando(false);
          setVisiveis((prev) => [...prev, msg]);
          timerRef.current = setTimeout(revelarProximo, 500);
        }, 900);
      } else {
        setVisiveis((prev) => [...prev, msg]);
        timerRef.current = setTimeout(revelarProximo, 600);
      }
    };
    revelarProximo();
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [visiveis, digitando]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
      {/* Header */}
      <div className="bg-brf-vermelho px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
            <MessageCircle className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-bold text-sm">Assistente BRF</span>
        </div>
        <div className="flex items-center gap-2">
          {fase !== "idle" && (
            <button
              onClick={resetar}
              title="Reiniciar"
              className="text-white/60 hover:text-white transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}
          <div
            className={`w-2 h-2 rounded-full ${
              fase === "playing"
                ? "bg-brf-amarelo animate-pulse"
                : fase === "done"
                  ? "bg-brf-verde"
                  : "bg-gray-400"
            }`}
          />
          <span className="text-white/60 text-xs">
            {fase === "idle"
              ? "aguardando"
              : fase === "playing"
                ? "conversando..."
                : "concluído"}
          </span>
        </div>
      </div>

      {/* Área de chat */}
      <div
        ref={scrollRef}
        className="h-64 overflow-y-auto p-4 space-y-3 bg-gray-50"
      >
        {fase === "idle" && (
          <div className="h-full flex flex-col items-center justify-center text-center gap-3">
            <MessageCircle className="w-10 h-10 text-gray-300" />
            <p className="text-sm text-gray-500 font-medium">
              Simulação do Chatbot Guiado
            </p>
            <p className="text-xs text-gray-300 max-w-[200px]">
              Clique em &quot;Iniciar demo&quot; para ver o fluxo completo de
              encerramento via chatbot
            </p>
          </div>
        )}
        {visiveis.map((msg, i) =>
          msg.origem === "bot" ? (
            <div key={i} className="flex items-end gap-2">
              <div className="w-6 h-6 rounded-full bg-brf-vermelho flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-3 h-3 text-white" />
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-3 py-2 text-xs text-gray-800 max-w-[80%] whitespace-pre-line shadow-sm">
                {msg.texto}
              </div>
            </div>
          ) : (
            <div key={i} className="flex justify-end">
              <div className="bg-brf-salmao border border-brf-laranja/20 rounded-2xl rounded-br-sm px-3 py-2 text-xs text-gray-800 max-w-[80%]">
                {msg.texto}
              </div>
            </div>
          ),
        )}
        {digitando && (
          <div className="flex items-end gap-2">
            <div className="w-6 h-6 rounded-full bg-brf-vermelho flex items-center justify-center flex-shrink-0">
              <MessageCircle className="w-3 h-3 text-white" />
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-3 py-2 shadow-sm">
              <div className="flex gap-1 items-center h-4">
                {([0, 150, 300] as const).map((delay, idx) => (
                  <span
                    key={idx}
                    className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: `${delay}ms` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Controles */}
      <div className="px-4 py-3 border-t bg-white flex items-center gap-3">
        {fase === "idle" ? (
          <button
            onClick={iniciar}
            className="flex-1 bg-brf-vermelho text-white text-xs font-semibold py-2 rounded-lg flex items-center justify-center gap-1.5 hover:bg-brf-vermelho-escuro transition-colors"
          >
            <Play className="w-3 h-3" /> Iniciar demo do chatbot
          </button>
        ) : fase === "done" ? (
          <button
            onClick={resetar}
            className="flex-1 border border-brf-vermelho text-brf-vermelho text-xs font-semibold py-2 rounded-lg flex items-center justify-center gap-1.5 hover:bg-brf-salmao transition-colors"
          >
            <RefreshCw className="w-3 h-3" /> Reiniciar demo
          </button>
        ) : (
          <div className="flex-1 flex items-center gap-2 text-xs text-gray-400">
            <Loader2 className="w-3 h-3 animate-spin text-brf-vermelho" />
            Reproduzindo conversa...
            <span className="ml-auto text-brf-laranja font-semibold">
              {visiveis.length}/{SCRIPT_CHATBOT.length}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Componente: Dashboard do Operador ────────────────────────────────────────

interface SolicitacaoMock {
  id: string;
  protocolo: string;
  agencia: string;
  titular: string;
  conta: string;
  status: string;
  data: string;
  uf: string;
}

const SOLICITACOES_MOCK: SolicitacaoMock[] = [
  {
    id: "s1",
    protocolo: "ENC-2026-855271",
    agencia: "0081 — Imperatriz",
    titular: "Maria Silva Santos",
    conta: "12345-6",
    status: "PENDENTE",
    data: "07/04/2026",
    uf: "MA",
  },
  {
    id: "s2",
    protocolo: "ENC-2026-312044",
    agencia: "0500 — São Luís Centro",
    titular: "João Carlos Mendes",
    conta: "98765-3",
    status: "EM_ANALISE",
    data: "06/04/2026",
    uf: "MA",
  },
  {
    id: "s3",
    protocolo: "ENC-2026-198023",
    agencia: "0210 — Fortaleza Centro",
    titular: "Ana Beatriz Ferreira",
    conta: "45678-9",
    status: "CONCLUIDO",
    data: "05/04/2026",
    uf: "CE",
  },
  {
    id: "s4",
    protocolo: "ENC-2026-077891",
    agencia: "0081 — Imperatriz",
    titular: "Carlos Eduardo Lima",
    conta: "32109-7",
    status: "PENDENTE",
    data: "04/04/2026",
    uf: "MA",
  },
];

const STATUS_CFG: Record<string, { bg: string; text: string; label: string }> =
  {
    PENDENTE: { bg: "bg-yellow-50", text: "text-amber-700", label: "Pendente" },
    EM_ANALISE: {
      bg: "bg-blue-50",
      text: "text-brf-azul",
      label: "Em Análise",
    },
    CONCLUIDO: {
      bg: "bg-green-50",
      text: "text-brf-verde",
      label: "Concluído",
    },
    CANCELADO: { bg: "bg-gray-100", text: "text-gray-500", label: "Cancelado" },
    REJEITADO: {
      bg: "bg-red-50",
      text: "text-brf-vermelho-escuro",
      label: "Rejeitado",
    },
  };

/** Preview do painel interno com dashboard e detalhe de solicitação interativo.
 * Completamente standalone — sem chamadas à API. */
function PreviewDashboard() {
  const [selecionado, setSelecionado] = useState<string | null>(null);

  const detalheSol = SOLICITACOES_MOCK.find((s) => s.id === selecionado);

  const contadores = {
    PENDENTE: SOLICITACOES_MOCK.filter((s) => s.status === "PENDENTE").length,
    EM_ANALISE: SOLICITACOES_MOCK.filter((s) => s.status === "EM_ANALISE")
      .length,
    CONCLUIDO: SOLICITACOES_MOCK.filter((s) => s.status === "CONCLUIDO").length,
  };

  // ── Painel de Detalhe ──────────────────────────────────────────────────────
  if (selecionado && detalheSol) {
    const cfg = STATUS_CFG[detalheSol.status];
    return (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="bg-brf-vermelho px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelecionado(null)}
              className="text-white/70 hover:text-white transition-colors text-xs flex items-center gap-1"
            >
              ← Voltar
            </button>
            <span className="text-white/30 text-xs">|</span>
            <span className="text-white font-bold text-xs font-mono">
              {detalheSol.protocolo}
            </span>
          </div>
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}
          >
            {cfg.label}
          </span>
        </div>
        <div className="p-5 space-y-4">
          {/* Dados descriptografados (visível apenas para autenticados) */}
          <div className="bg-brf-salmao/50 border border-brf-laranja/30 rounded-xl p-3 space-y-2">
            <p className="text-xs font-semibold text-brf-vermelho flex items-center gap-1">
              <KeyRound className="w-3 h-3" /> Dados Descriptografados
            </p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
              <div>
                <span className="text-gray-400">Titular</span>
                <p className="font-semibold text-gray-700">
                  {detalheSol.titular}
                </p>
              </div>
              <div>
                <span className="text-gray-400">Conta</span>
                <p className="font-semibold text-gray-700 font-mono">
                  {detalheSol.conta}
                </p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
            {[
              ["Agência", detalheSol.agencia],
              ["UF", detalheSol.uf],
              ["Data solicitação", detalheSol.data],
              ["Status atual", cfg.label],
            ].map(([label, valor]) => (
              <div key={label}>
                <span className="text-gray-400">{label}</span>
                <p className="font-medium text-gray-700">{valor}</p>
              </div>
            ))}
          </div>
          {/* Ações do operador */}
          <div className="pt-2 border-t border-gray-100">
            <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide">
              Ações do Operador
            </p>
            <div className="flex gap-2 flex-wrap">
              <button className="text-xs bg-brf-azul text-white px-3 py-1.5 rounded-lg hover:opacity-80 transition-opacity">
                Em Análise
              </button>
              <button className="text-xs bg-brf-verde text-white px-3 py-1.5 rounded-lg hover:opacity-80 transition-opacity">
                Concluir
              </button>
              <button className="text-xs border border-gray-300 text-gray-500 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
                Rejeitar
              </button>
            </div>
          </div>
          {/* Log de auditoria */}
          <div className="bg-gray-900 rounded-lg p-3 text-xs font-mono">
            <p className="text-green-400">
              [AUDITORIA] operador=BRF0001 acessou id={detalheSol.id}
            </p>
            <p className="text-gray-500 text-[10px] mt-0.5">
              {detalheSol.data} | IP: 10.0.10.xxx
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── Dashboard Principal ────────────────────────────────────────────────────
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
      {/* Header */}
      <div className="bg-brf-vermelho px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-brf-amarelo flex items-center justify-center text-xs font-bold text-gray-800">
            AO
          </div>
          <span className="text-white font-bold text-sm">Painel Interno BRF</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-white/70 text-xs hidden sm:block">
            Ana Operadora · BRF0001
          </span>
          <button className="text-white/50 text-xs border border-white/20 px-2 py-0.5 rounded hover:text-white/80 transition-colors">
            Sair
          </button>
        </div>
      </div>
      {/* Métricas */}
      <div className="grid grid-cols-3 gap-px bg-gray-100">
        {[
          {
            label: "Pendentes",
            valor: contadores.PENDENTE,
            cor: "text-amber-600",
            bg: "bg-yellow-50",
            Icon: Clock,
          },
          {
            label: "Em Análise",
            valor: contadores.EM_ANALISE,
            cor: "text-brf-azul",
            bg: "bg-blue-50",
            Icon: Activity,
          },
          {
            label: "Concluídos",
            valor: contadores.CONCLUIDO,
            cor: "text-brf-verde",
            bg: "bg-green-50",
            Icon: CheckCircle,
          },
        ].map(({ label, valor, cor, bg, Icon }) => (
          <div key={label} className={`${bg} px-3 py-3 text-center`}>
            <Icon className={`w-4 h-4 mx-auto mb-1 ${cor}`} />
            <div className={`text-xl font-bold ${cor}`}>{valor}</div>
            <div className="text-xs text-gray-400">{label}</div>
          </div>
        ))}
      </div>
      {/* Lista de solicitações */}
      <div className="divide-y">
        {SOLICITACOES_MOCK.map((s) => {
          const cfg = STATUS_CFG[s.status];
          return (
            <button
              key={s.id}
              onClick={() => setSelecionado(s.id)}
              className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
            >
              <div>
                <p className="font-mono text-xs font-semibold text-brf-vermelho">
                  {s.protocolo}
                </p>
                <p className="text-xs text-gray-400">
                  {s.agencia} · {s.data}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}
                >
                  {cfg.label}
                </span>
                <span className="text-brf-azul text-xs">→</span>
              </div>
            </button>
          );
        })}
      </div>
      <p className="text-center text-[10px] text-gray-300 py-2">
        Clique em uma linha para ver o detalhe ↑
      </p>
    </div>
  );
}

// ─── Página principal ────────────────────────────────────────────────────────

/** Página de demonstração standalone do sistema EncerraDigital BRF */
export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* ══ HERO ════════════════════════════════════════════════════════════ */}
      <section className="bg-gradient-to-br from-brf-vermelho via-brf-vermelho to-brf-laranja text-white">
        <div className="max-w-5xl mx-auto px-6 py-16 text-center">
          {/* Badge pulsante */}
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur px-4 py-1.5 rounded-full text-sm mb-5 animate-pulse">
            <span>🎓</span>
            <span className="font-medium">Apresentação para Aula</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            EncerraDigital
          </h1>
          <p className="text-xl text-white/80 mb-2">
            Sistema Digital de Encerramento de Conta Corrente
          </p>
          <p className="text-sm text-white/60 max-w-xl mx-auto mb-8">
            Digitalização completa do processo presencial, conforme normativo
            BRF-3303-03-11, com padrões bancários de segurança e conformidade
            LGPD.
          </p>
          {/* Badges de conformidade com ícones Lucide */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {[
              { Icon: FileText, texto: "Normativo BRF-3303-03-11" },
              { Icon: ShieldCheck, texto: "OWASP ASVS Nível 2" },
              { Icon: Eye, texto: "LGPD Art. 46" },
              { Icon: Lock, texto: "AES-256-CBC" },
            ].map(({ Icon, texto }) => (
              <span
                key={texto}
                className="inline-flex items-center gap-1.5 bg-white/20 px-4 py-1.5 rounded-full text-xs font-semibold"
              >
                <Icon className="w-3.5 h-3.5" />
                {texto}
              </span>
            ))}
            <span className="inline-flex items-center gap-1.5 bg-brf-amarelo text-gray-800 px-4 py-1.5 rounded-full text-xs font-semibold">
              <Check className="w-3.5 h-3.5" />
              ICP-Brasil / gov.br
            </span>
          </div>
          {/* Linha estatística */}
          <p className="text-sm text-white/80">
            <span className="font-bold text-white">300 agências</span>
            <span className="mx-2 text-brf-laranja font-bold">·</span>
            <span className="font-bold text-white">7 motivos</span>
            <span className="mx-2 text-brf-laranja font-bold">·</span>
            <span className="font-bold text-white">22 testes unitários</span>
            <span className="mx-2 text-brf-laranja font-bold">·</span>
            <span className="font-bold text-white">6 fluxos E2E</span>
          </p>
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

      {/* ══ O PROBLEMA ══════════════════════════════════════════════════════ */}
      <section className="max-w-5xl mx-auto px-6 py-14">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
          O Problema que Resolvemos
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-center">
          {/* Card ANTES */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="h-1.5 bg-brf-vermelho" />
            <div className="p-6">
              <span className="text-xs font-black text-gray-400 tracking-widest block mb-3">
                ANTES
              </span>
              <div className="text-3xl mb-3">🏦</div>
              <h3 className="font-bold text-gray-700 mb-3">
                Processo Presencial
              </h3>
              <ul className="text-sm text-gray-500 space-y-1.5">
                {[
                  "Deslocamento até a agência",
                  "Formulário em papel",
                  "Assinatura manual presencial",
                  "Arquivo físico de documentos",
                  "Sem rastreabilidade do status",
                  "Prazo opaco de 30 dias",
                ].map((t) => (
                  <li key={t} className="flex items-center gap-2">
                    <span className="text-brf-vermelho font-bold text-xs">
                      ✗
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {/* Seta desktop */}
          <div className="hidden md:flex justify-center">
            <div className="bg-white shadow-md rounded-full p-3 border border-gray-100">
              <ArrowRight className="w-6 h-6 text-brf-laranja" />
            </div>
          </div>
          {/* Seta mobile */}
          <div className="flex md:hidden justify-center">
            <div className="bg-white shadow-md rounded-full p-2 border border-gray-100">
              <ArrowRight className="w-5 h-5 text-brf-laranja rotate-90" />
            </div>
          </div>
          {/* Card DEPOIS */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="h-1.5 bg-brf-verde" />
            <div className="p-6">
              <span className="text-xs font-black text-brf-verde tracking-widest block mb-3">
                DEPOIS
              </span>
              <div className="text-3xl mb-3">💻</div>
              <h3 className="font-bold text-gray-700 mb-3">
                EncerraDigital — Canal Digital
              </h3>
              <ul className="text-sm text-gray-500 space-y-1.5">
                {[
                  "Solicitação online 24h/7",
                  "Formulário digital guiado",
                  "Assinatura ICP-Brasil / gov.br",
                  "Documentos no MinIO (S3)",
                  "Consulta de status com protocolo",
                  "Notificação ao operador",
                ].map((t) => (
                  <li key={t} className="flex items-center gap-2">
                    <span className="text-brf-verde font-bold text-xs">✓</span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ══ JORNADA DO CLIENTE ══════════════════════════════════════════════ */}
      <section className="bg-white py-14">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-10 text-center">
            Jornada do Cliente
          </h2>
          {/* Desktop: horizontal */}
          <div className="hidden md:flex items-start">
            {JORNADA.map((etapa, i) => (
              <div key={i} className="flex flex-col items-center flex-1">
                <div className="flex items-center w-full mb-4">
                  {i > 0 && (
                    <div className="flex-1 border-t-2 border-dashed border-brf-laranja" />
                  )}
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-xl flex-shrink-0 shadow-md ${
                      i === JORNADA.length - 1
                        ? "bg-brf-verde"
                        : "bg-brf-vermelho"
                    }`}
                  >
                    {etapa.icone}
                  </div>
                  {i < JORNADA.length - 1 && (
                    <div className="flex-1 border-t-2 border-dashed border-brf-laranja" />
                  )}
                </div>
                <p className="font-bold text-sm text-gray-700 text-center px-1">
                  {etapa.titulo}
                </p>
                <p className="text-xs text-gray-400 text-center px-1 mt-1">
                  {etapa.desc}
                </p>
              </div>
            ))}
          </div>
          {/* Mobile: vertical */}
          <div className="flex md:hidden flex-col gap-0">
            {JORNADA.map((etapa, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-11 h-11 rounded-full flex items-center justify-center text-lg flex-shrink-0 shadow-md ${
                      i === JORNADA.length - 1
                        ? "bg-brf-verde"
                        : "bg-brf-vermelho"
                    }`}
                  >
                    {etapa.icone}
                  </div>
                  {i < JORNADA.length - 1 && (
                    <div className="w-0.5 h-8 border-l-2 border-dashed border-brf-laranja mt-1" />
                  )}
                </div>
                <div className="pb-6">
                  <p className="font-bold text-sm text-gray-700">
                    {etapa.titulo}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{etapa.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ MÓDULO PÚBLICO ══════════════════════════════════════════════════ */}
      <section className="py-14 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-8">
            <span className="bg-brf-salmao text-brf-vermelho text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
              Módulo Público
            </span>
            <h2 className="text-2xl font-bold text-gray-800 mt-3 mb-1">
              Interface do Cliente
            </h2>
            <p className="text-sm text-gray-500">
              <code className="bg-gray-100 px-2 py-0.5 rounded text-brf-vermelho">
                http://localhost:3000
              </code>
            </p>
          </div>
          {/* Previews interativos — Formulário e Chatbot lado a lado */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mb-10">
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">
                Formulário multi-etapa — interativo
              </p>
              <PreviewFormulario />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">
                Chatbot guiado — simulação ao vivo
              </p>
              <PreviewChatbot />
            </div>
          </div>

          {/* Funcionalidades da interface pública */}
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">
              Funcionalidades da interface pública
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                {
                  Icon: Globe,
                  titulo: "Seleção em cascata",
                  desc: "UF → 300 agências BRF (fonte BCB)",
                },
                {
                  Icon: Lock,
                  titulo: "Dados cifrados",
                  desc: "AES-256-CBC em trânsito e repouso",
                },
                {
                  Icon: FileText,
                  titulo: "PDF oficial BRF-3303-40-64",
                  desc: "14 seções obrigatórias, layout BRF",
                },
                {
                  Icon: Check,
                  titulo: "Assinatura gov.br",
                  desc: "Suporte A1 e A3 (ICP-Brasil)",
                },
                {
                  Icon: Upload,
                  titulo: "Upload seguro",
                  desc: "Magic bytes, SHA-256, max 10 MB",
                },
                {
                  Icon: Eye,
                  titulo: "Status por protocolo",
                  desc: "Sem exposição de dados (LGPD)",
                },
              ].map(({ Icon, titulo, desc }) => (
                <div
                  key={titulo}
                  className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex gap-3 items-start"
                >
                  <Icon className="w-5 h-5 text-brf-vermelho mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-sm text-gray-700">
                      {titulo}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ MÓDULO INTERNO ══════════════════════════════════════════════════ */}
      <section className="bg-white py-14">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-8">
            <span className="bg-brf-vermelho/10 text-brf-vermelho text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
              Módulo Restrito
            </span>
            <h2 className="text-2xl font-bold text-gray-800 mt-3 mb-1">
              Painel do Operador
            </h2>
            <p className="text-sm text-gray-500">
              <code className="bg-gray-100 px-2 py-0.5 rounded text-brf-vermelho">
                http://localhost:3001
              </code>{" "}
              — requer autenticação
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">
                Funcionalidades
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    Icon: Lock,
                    titulo: "Autenticação OIDC/SAML",
                    desc: "Mock em dev · OIDC corporativo em prod",
                  },
                  {
                    Icon: Activity,
                    titulo: "Dashboard com métricas",
                    desc: "Pendentes, Em Análise, Concluídos",
                  },
                  {
                    Icon: Eye,
                    titulo: "Dados descriptografados",
                    desc: "Apenas autenticados visualizam conta/nome",
                  },
                  {
                    Icon: FileText,
                    titulo: "PDF via URL presignada",
                    desc: "MinIO TTL 5 min, sem exposição de chaves",
                  },
                  {
                    Icon: Check,
                    titulo: "Atualização de status",
                    desc: "Perfis: Operador e Supervisor",
                  },
                  {
                    Icon: Shield,
                    titulo: "Auditoria completa",
                    desc: "Log [AUDITORIA] em cada acesso sensível",
                  },
                ].map(({ Icon, titulo, desc }) => (
                  <div
                    key={titulo}
                    className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex gap-3 items-start"
                  >
                    <Icon className="w-5 h-5 text-brf-vermelho mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-sm text-gray-700">
                        {titulo}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">
                Preview do dashboard
              </p>
              <PreviewDashboard />
            </div>
          </div>
        </div>
      </section>

      {/* ══ ARQUITETURA TÉCNICA ═════════════════════════════════════════════ */}
      <section className="py-14 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
            Arquitetura Técnica
          </h2>
          {/* Diagrama visual de camadas */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
            <div className="flex gap-3 justify-center mb-2">
              {[
                {
                  label: "🌐 Frontend Cliente",
                  sub: ":3000",
                  border: "border-brf-verde",
                },
                {
                  label: "🔒 Frontend Interno",
                  sub: ":3001",
                  border: "border-brf-verde",
                },
              ].map((b) => (
                <div
                  key={b.label}
                  className={`flex-1 max-w-[220px] border-2 ${b.border} rounded-xl p-3 text-center bg-white shadow-sm`}
                >
                  <p className="font-semibold text-xs text-gray-700">
                    {b.label}
                  </p>
                  <code className="text-brf-verde text-xs font-mono">
                    {b.sub}
                  </code>
                </div>
              ))}
            </div>
            <div className="flex flex-col items-center text-xs text-gray-400 my-2">
              <span>REST / HTTPS</span>
              <span className="text-lg leading-none">↕</span>
            </div>
            <div className="flex justify-center mb-2">
              <div className="border-2 border-brf-vermelho rounded-xl p-3 text-center bg-white shadow-sm w-60">
                <p className="font-semibold text-xs text-gray-700">
                  ⚙️ Backend NestJS
                </p>
                <code className="text-brf-vermelho text-xs font-mono">
                  :3333
                </code>
                <p className="text-xs text-gray-400 mt-0.5">
                  JWT Session · Helmet · CORS
                </p>
              </div>
            </div>
            <div className="flex gap-16 justify-center items-start text-xs text-gray-400 my-2">
              {["Prisma ORM", "S3 SDK", "ioredis"].map((lbl) => (
                <div key={lbl} className="flex flex-col items-center">
                  <span className="text-lg leading-none">↕</span>
                  <span>{lbl}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-3 justify-center">
              {[
                {
                  label: "🗄️ PostgreSQL",
                  sub: ":5432",
                  border: "border-brf-azul",
                },
                { label: "📦 MinIO", sub: ":9000", border: "border-brf-azul" },
                { label: "⚡ Redis", sub: ":6379", border: "border-brf-azul" },
              ].map((b) => (
                <div
                  key={b.label}
                  className={`flex-1 max-w-[160px] border-2 ${b.border} rounded-xl p-3 text-center bg-white shadow-sm`}
                >
                  <p className="font-semibold text-xs text-gray-700">
                    {b.label}
                  </p>
                  <code className="text-brf-azul text-xs font-mono">
                    {b.sub}
                  </code>
                </div>
              ))}
            </div>
          </div>
          {/* Tabela */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-brf-vermelho text-white">
                  {["Camada", "Stack", "Porta"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left font-semibold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TECNOLOGIAS.map((t, i) => (
                  <tr
                    key={t.camada}
                    className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}
                  >
                    <td className="px-4 py-3 font-semibold text-brf-vermelho">
                      {t.camada}
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-xs">
                      {t.stack}
                    </td>
                    <td className="px-4 py-3">
                      <code className="bg-gray-100 text-brf-azul px-2 py-0.5 rounded text-xs">
                        {t.porta}
                      </code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ══ VS CODE · AGENTES E MEMÓRIA ═════════════════════════════════════ */}
      <section className="bg-white py-14">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-10">
            <span className="bg-brf-amarelo/30 text-gray-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
              Diferencial Pedagógico
            </span>
            <h2 className="text-2xl font-bold text-gray-800 mt-3 mb-1">
              Como o Projeto foi Estruturado no VS Code
            </h2>
            <p className="text-sm text-gray-500 max-w-2xl mx-auto">
              GitHub Copilot com Instruções Globais, Agentes Especializados e
              Memória Persistente no repositório.
            </p>
          </div>

          {/* Árvore VS Code */}
          <div className="rounded-xl overflow-hidden shadow-md mb-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-[#3c3c3c]">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="ml-2 text-[#cccccc] text-xs font-mono">
                SISENCCONTAS — Explorer
              </span>
            </div>
            <pre className="bg-[#1e1e1e] text-[#cccccc] text-xs font-mono p-5 overflow-x-auto leading-relaxed whitespace-pre">
              {`📁 .github/
├── 📄 copilot-instructions.md   ← instruções globais (carregadas automaticamente)
└── 📁 agents/
    ├── 🤖 arquiteto.md
    ├── 🤖 dev-backend.md
    ├── 🤖 dev-frontend.md
    ├── 🤖 seguranca.md          ← OWASP ASVS + LGPD
    └── 🤖 testes.md             ← Jest + Playwright

📁 docs/
├── 📄 memoria/contexto-atual.md ← memória persistente do projeto
├── 📄 arquitetura.md
├── 📄 estrategia-agentes-e-memoria.md
└── 📁 adr/                      ← 7 decisões arquiteturais (ADR-001 a ADR-007)

📁 backend/   📁 frontend-cliente/   📁 frontend-interno/
📁 e2e/       📁 data/               📄 docker-compose.dev.yml`}
            </pre>
          </div>

          {/* Legenda 3 colunas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            {[
              {
                icone: "🧠",
                titulo: "Memória Persistente",
                desc: "docs/memoria/contexto-atual.md — atualizado a cada fase, versionado no Git, acessível por qualquer modelo de IA",
              },
              {
                icone: "🤖",
                titulo: "Agentes Especializados",
                desc: ".github/agents/*.md — cada agente tem papel, regras e contexto obrigatório. Ativados por #file: no chat",
              },
              {
                icone: "⚙️",
                titulo: "Instruções Globais",
                desc: ".github/copilot-instructions.md — carregado automaticamente em todo @workspace. Define stack, OWASP e LGPD",
              },
            ].map((c) => (
              <div
                key={c.titulo}
                className="bg-gray-50 rounded-xl p-4 border border-gray-100"
              >
                <p className="text-2xl mb-2">{c.icone}</p>
                <p className="font-bold text-sm text-gray-700 mb-1">
                  {c.titulo}
                </p>
                <p className="text-xs text-gray-400">{c.desc}</p>
              </div>
            ))}
          </div>

          {/* Card copilot-instructions */}
          <div className="bg-white border-l-4 border-brf-azul rounded-xl shadow-sm p-5 mb-8">
            <div className="flex items-start gap-3">
              <Settings2 className="w-5 h-5 text-brf-azul mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <p className="font-bold text-gray-800">
                    Instruções Globais do Copilot
                  </p>
                  <span className="bg-brf-laranja/20 text-amber-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                    Contexto automático em todo o repositório
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-2">
                  <code className="bg-gray-100 px-1.5 py-0.5 rounded text-brf-azul font-mono">
                    .github/copilot-instructions.md
                  </code>
                </p>
                <p className="text-sm text-gray-600">
                  Lido automaticamente pelo GitHub Copilot em{" "}
                  <strong>todas</strong> as interações dentro do repositório.
                  Define: stack obrigatória, padrões de código, regras de
                  segurança (OWASP/LGPD) e referências normativas do BRF.
                  Qualquer sugestão do Copilot já nasce alinhada com o projeto —
                  sem repetir contexto a cada prompt.
                </p>
              </div>
            </div>
          </div>

          {/* Cards dos agentes */}
          <h3 className="font-bold text-gray-700 mb-4 text-sm uppercase tracking-wide">
            Agentes Especializados (.github/agents/)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {AGENTES.map((ag) => (
              <div
                key={ag.titulo}
                className="bg-white border border-gray-100 shadow-sm rounded-xl overflow-hidden"
              >
                <div className="h-0.5 bg-brf-vermelho" />
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Bot className="w-4 h-4 text-brf-vermelho" />
                      <p className="font-bold text-sm text-gray-800">
                        {ag.titulo}
                      </p>
                    </div>
                    <span className="bg-brf-amarelo/40 text-gray-700 text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 whitespace-nowrap">
                      Agent Mode ✦
                    </span>
                  </div>
                  <code className="text-[10px] text-gray-400 font-mono block mb-2">
                    {ag.arquivo}
                  </code>
                  <p className="text-xs text-gray-500">{ag.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Card Memória Persistente */}
          <div className="bg-brf-salmao/40 border border-brf-laranja rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <BookOpen className="w-7 h-7 text-brf-laranja mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-800 mb-0.5">
                  Memória Persistente do Projeto
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Independente do modelo de IA — armazenada no repositório Git
                </p>
                <ul className="space-y-1.5 mb-5 text-sm text-gray-600">
                  {[
                    <>
                      <code className="text-xs bg-white/60 px-1 rounded font-mono">
                        docs/memoria/contexto-atual.md
                      </code>{" "}
                      é atualizado a cada fase concluída
                    </>,
                    <>
                      Registra: o que foi feito, decisões, pendências e
                      bloqueios ativos
                    </>,
                    <>
                      Nova sessão com Copilot, Claude ou GPT: referencie o
                      arquivo e o assistente tem contexto completo
                      instantaneamente
                    </>,
                    <>
                      Não depende do histórico de chat do modelo (que se perde)
                      — vive no próprio Git
                    </>,
                    <>
                      Serve também como onboarding rápido para novos
                      desenvolvedores da equipe
                    </>,
                  ].map((item, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-brf-laranja font-bold mt-0.5">
                        •
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                {/* Comparação */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-white rounded-xl p-4 border border-red-100">
                    <p className="font-bold text-sm text-brf-vermelho mb-2">
                      ❌ Memória do Modelo de IA
                    </p>
                    <ul className="text-xs text-gray-500 space-y-1">
                      {[
                        "Perdida ao fechar o chat",
                        "Limitada à janela de contexto",
                        "Não versionada nem compartilhável",
                        "Depende de plugins externos",
                      ].map((t) => (
                        <li key={t}>• {t}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-green-100">
                    <p className="font-bold text-sm text-brf-verde mb-2">
                      ✅ Memória no Repositório Git
                    </p>
                    <ul className="text-xs text-gray-500 space-y-1">
                      {[
                        "Persiste entre sessões e modelos",
                        "Versionada com o código-fonte",
                        "Compartilhada entre toda a equipe",
                        "Funciona com qualquer IA",
                      ].map((t) => (
                        <li key={t}>• {t}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ SEGURANÇA ═══════════════════════════════════════════════════════ */}
      <section className="py-14 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          {/* Banner gradiente */}
          <div className="bg-gradient-to-r from-brf-verde to-brf-azul rounded-2xl p-5 text-center text-white mb-8 shadow-md">
            <p className="font-bold text-lg">Padrão OWASP ASVS Nível 2</p>
            <p className="text-white/80 text-sm mt-0.5">
              Adequado para aplicações de ecossistema bancário e dados
              financeiros pessoais
            </p>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Segurança e Conformidade
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {SEGURANCA.map(({ icon: Icon, titulo, desc }) => (
              <div
                key={titulo}
                className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex gap-3 items-start border-l-4 border-l-brf-verde"
              >
                <Icon className="w-4 h-4 text-brf-verde mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-sm text-gray-700">
                    {titulo}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ ROADMAP ═════════════════════════════════════════════════════════ */}
      <section className="bg-white py-14">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-10 text-center">
            Roadmap de Desenvolvimento
          </h2>
          <div className="max-w-2xl mx-auto">
            {FASES.map((f, i) => (
              <div key={f.num} className="flex gap-5">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0 shadow-md ${
                      f.concluida
                        ? "bg-brf-vermelho text-white"
                        : "border-2 border-dashed border-brf-laranja bg-white text-brf-laranja"
                    }`}
                  >
                    {f.concluida ? <Check className="w-5 h-5" /> : f.num}
                  </div>
                  {i < FASES.length - 1 && (
                    <div className="w-0.5 flex-1 bg-gray-200 my-1" />
                  )}
                </div>
                <div className="pb-7 flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <p
                      className={`font-bold text-sm ${f.concluida ? "text-gray-800" : "text-gray-400"}`}
                    >
                      Fase {f.num} — {f.titulo}
                    </p>
                    {f.concluida ? (
                      <span className="bg-green-50 text-brf-verde text-xs font-semibold px-2 py-0.5 rounded-full">
                        ✅ Concluído
                      </span>
                    ) : (
                      <span className="bg-brf-laranja/10 text-brf-laranja text-xs font-semibold px-2 py-0.5 rounded-full">
                        🔜 Próximo
                      </span>
                    )}
                    {f.data && (
                      <span className="bg-gray-100 text-gray-400 text-xs px-2 py-0.5 rounded-full font-mono">
                        {f.data}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ DESTAQUE TÉCNICO ════════════════════════════════════════════════ */}
      <section className="py-14 bg-gradient-to-b from-brf-salmao/30 to-white">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
            Por que este Projeto é um Sistema Real?
          </h2>
          <p className="text-center text-sm text-gray-400 mb-8">
            Diferenciais técnicos que elevam além de um projeto acadêmico
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icone: "📜",
                titulo: "Normativo real",
                desc: "Termo BRF-3303-40-64 com 14 seções obrigatórias do modelo oficial BRF",
              },
              {
                icone: "🔐",
                titulo: "Criptografia em repouso",
                desc: "AES-256-CBC em 4 campos sensíveis: conta, titular, email, destino",
              },
              {
                icone: "🧪",
                titulo: "Testes automatizados",
                desc: "22 unitários Jest + 6 fluxos E2E Playwright — todos passando",
              },
              {
                icone: "🏛️",
                titulo: "Fonte de dados oficial",
                desc: "300 agências BRF extraídas da API do Banco Central do Brasil (BCB/ODbL)",
              },
            ].map((c) => (
              <div
                key={c.titulo}
                className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm text-center"
              >
                <p className="text-3xl mb-3">{c.icone}</p>
                <p className="font-bold text-sm text-gray-800 mb-1">
                  {c.titulo}
                </p>
                <p className="text-xs text-gray-400">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FOOTER ══════════════════════════════════════════════════════════ */}
      <footer className="bg-brf-vermelho text-white py-8">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 mb-5">
            <div>
              <p className="font-bold text-lg">
                Banco Regional de Fomento S.A.
              </p>
              <p className="text-white/50 text-xs mt-0.5">
                EncerraDigital — Sistema de Encerramento Digital de Conta
                Corrente
              </p>
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
                { label: "Next.js 14", cor: "text-brf-amarelo" },
                { label: "·", cor: "text-white/30" },
                { label: "NestJS", cor: "text-brf-laranja" },
                { label: "·", cor: "text-white/30" },
                { label: "PostgreSQL", cor: "text-blue-300" },
                { label: "·", cor: "text-white/30" },
                { label: "MinIO", cor: "text-brf-verde" },
                { label: "·", cor: "text-white/30" },
                { label: "Redis", cor: "text-red-300" },
                { label: "·", cor: "text-white/30" },
                { label: "Docker", cor: "text-blue-200" },
                { label: "·", cor: "text-white/30" },
                { label: "pnpm workspaces", cor: "text-yellow-200" },
              ].map((s, i) => (
                <span key={i} className={s.cor}>
                  {s.label}
                </span>
              ))}
            </div>
            <p className="text-center text-xs text-white/40">
              Normativo BRF-3303-03-11 v.020 · OWASP ASVS Nível 2 · LGPD Art. 46
              · ADR-001 a ADR-007
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
