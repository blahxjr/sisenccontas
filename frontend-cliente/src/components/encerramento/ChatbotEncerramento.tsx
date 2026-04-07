"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import {
  MessageCircle,
  Loader2,
  CheckCircle,
  AlertCircle,
  FileText,
  ExternalLink,
} from "lucide-react";
import { useMotivos, useUfs, useAgencias } from "@hooks/useCatalogos";
import { apiClient } from "@lib/api-client";
import type { EnccerramentoFormData } from "@lib/encerramento-schema";
import { UploadTermoAssinado } from "./UploadTermoAssinado";

// ─── Tipos internos ────────────────────────────────────────────────────────────

type TipoInput =
  | "button-group"
  | "select"
  | "text"
  | "checkbox-group"
  | "confirm";

interface PassoChatbot {
  id: string;
  field: keyof EnccerramentoFormData | null;
  message: string | ((respostas: Partial<EnccerramentoFormData>) => string);
  inputType: TipoInput;
  options?: { label: string; value: string | boolean }[];
  /** Retorna mensagem de erro ou null se válido. */
  validar?: (valor: string) => string | null;
  /** Se retornar false, o passo é ignorado na sequência. */
  condicao?: (respostas: Partial<EnccerramentoFormData>) => boolean;
}

interface MensagemChat {
  origem: "bot" | "usuario";
  texto: string;
  timestamp: Date;
  /** Índice do passo no array passos (apenas para mensagens do usuário, para edição). */
  passoIndex?: number;
}

interface RespostaCriacao {
  protocolo: string;
  solicitacaoId: string;
  status: string;
  mensagem: string;
}

// ─── Sub-componentes de UI ─────────────────────────────────────────────────────

/** Bolha de mensagem do bot, com animação de entrada. */
function BolhaBot({ texto }: { texto: string }) {
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setVisivel(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div
      className={`flex items-start gap-2 transition-all duration-200 ease-out ${
        visivel ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      }`}
    >
      <div className="flex-shrink-0 w-8 h-8 bg-brf-vermelho rounded-full flex items-center justify-center">
        <MessageCircle className="w-4 h-4 text-white" />
      </div>
      <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm p-3 text-sm text-gray-800 max-w-[85%]">
        {texto}
      </div>
    </div>
  );
}

/** Bolha de mensagem do usuário, com botão de edição no hover. */
function BolhaUsuario({
  texto,
  onEditar,
}: {
  texto: string;
  onEditar?: () => void;
}) {
  return (
    <div className="flex justify-end">
      <div className="flex items-center gap-1 group">
        {onEditar && (
          <button
            onClick={onEditar}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-gray-400 flex items-center gap-0.5 shrink-0"
          >
            ✏️ Editar
          </button>
        )}
        <div className="bg-brf-salmao border border-brf-laranja/30 rounded-2xl rounded-tr-sm p-3 text-sm text-gray-800 max-w-[85%]">
          {texto}
        </div>
      </div>
    </div>
  );
}

/** Indicador de digitação com três pontos animados em bounce encadeado. */
function DigitandoIndicador() {
  return (
    <div className="flex items-start gap-2">
      <div className="flex-shrink-0 w-8 h-8 bg-brf-vermelho rounded-full flex items-center justify-center">
        <MessageCircle className="w-4 h-4 text-white" />
      </div>
      <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm p-3">
        <div className="flex gap-1 items-center h-5">
          {([0, 150, 300] as const).map((delay, i) => (
            <span
              key={i}
              className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
              style={{ animationDelay: `${delay}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Componentes de input ──────────────────────────────────────────────────────

interface InputBotaoGrupoProps {
  options: { label: string; value: string | boolean }[];
  onSelecionar: (valor: string | boolean) => void;
}

/** Grupo de botões de resposta rápida para o chatbot. */
function InputBotaoGrupo({ options, onSelecionar }: InputBotaoGrupoProps) {
  const [selecionado, setSelecionado] = useState<string | boolean | null>(null);

  const handleClick = (valor: string | boolean) => {
    if (selecionado !== null) return;
    setSelecionado(valor);
    // Breve feedback visual antes de acionar o passo
    setTimeout(() => onSelecionar(valor), 200);
  };

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {options.map((opt) => {
        const isSelected = selecionado === opt.value;
        const isOther = selecionado !== null && !isSelected;
        return (
          <button
            key={String(opt.value)}
            onClick={() => handleClick(opt.value)}
            disabled={isOther}
            className={`rounded-full border px-4 py-2 min-h-[44px] text-sm font-medium transition-colors duration-150 ${
              isSelected
                ? "bg-brf-vermelho border-brf-vermelho text-white"
                : isOther
                  ? "border-brf-vermelho text-brf-vermelho opacity-40 pointer-events-none"
                  : "border-brf-vermelho text-brf-vermelho hover:bg-brf-vermelho hover:text-white"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

interface InputSelectProps {
  options: { label: string; value: string | boolean }[];
  onConfirmar: (valor: string) => void;
  carregando?: boolean;
}

/** Select nativo estilizado com botão de confirmação. */
function InputSelect({ options, onConfirmar, carregando }: InputSelectProps) {
  const [valor, setValor] = useState("");

  return (
    <div className="flex flex-col gap-2 mt-2">
      <select
        value={valor}
        onChange={(e) => setValor(e.target.value)}
        disabled={carregando}
        className="w-full border border-gray-300 rounded-lg p-2 text-base focus:ring-2 focus:ring-brf-vermelho focus:border-brf-vermelho disabled:bg-gray-100 disabled:text-gray-400"
      >
        <option value="" disabled>
          {carregando ? "Carregando..." : "Selecione uma opção..."}
        </option>
        {options
          .filter((o) => typeof o.value === "string")
          .map((opt) => (
            <option key={String(opt.value)} value={String(opt.value)}>
              {opt.label}
            </option>
          ))}
      </select>
      <button
        onClick={() => {
          if (valor) onConfirmar(valor);
        }}
        disabled={!valor}
        className="bg-brf-vermelho text-white rounded-lg px-4 py-2 min-h-[44px] text-sm font-medium hover:bg-brf-vermelho-escuro transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Confirmar →
      </button>
    </div>
  );
}

interface InputTextoProps {
  onConfirmar: (valor: string) => void;
  validar?: (valor: string) => string | null;
  onPular?: () => void;
}

/** Campo de texto livre com validação, envio por Enter e botão Pular opcional. */
function InputTexto({ onConfirmar, validar, onPular }: InputTextoProps) {
  const [valor, setValor] = useState("");
  const [erro, setErro] = useState<string | null>(null);

  const confirmar = () => {
    const msg = validar ? validar(valor) : null;
    if (msg) {
      setErro(msg);
      return;
    }
    setErro(null);
    onConfirmar(valor);
  };

  return (
    <div className="flex flex-col gap-1 mt-2">
      <input
        type="text"
        value={valor}
        autoFocus
        onChange={(e) => {
          setValor(e.target.value);
          if (erro) setErro(null);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") confirmar();
        }}
        className="w-full border border-gray-300 rounded-lg p-2 text-base focus:ring-2 focus:ring-brf-vermelho focus:border-brf-vermelho"
      />
      {erro && <p className="text-red-600 text-xs mt-1">{erro}</p>}
      <div className={onPular ? "flex gap-2" : ""}>
        <button
          onClick={confirmar}
          className="flex-1 bg-brf-vermelho text-white rounded-lg px-4 py-2 min-h-[44px] text-sm font-medium hover:bg-brf-vermelho-escuro transition-colors"
        >
          Confirmar →
        </button>
        {onPular && (
          <button
            onClick={onPular}
            className="border border-gray-300 text-gray-500 rounded-lg px-4 py-2 min-h-[44px] text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Pular
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Card de resumo ────────────────────────────────────────────────────────────

interface CardResumoProps {
  respostas: Partial<EnccerramentoFormData>;
  nomeAgencia: string;
  descricaoMotivo: string;
}

/** Exibe resumo mascarado dos dados coletados antes do aceite e envio. */
function CardResumo({
  respostas,
  nomeAgencia,
  descricaoMotivo,
}: CardResumoProps) {
  const contaMascarada = respostas.numeroConta
    ? `***${respostas.numeroConta.slice(-3)}`
    : "—";

  const linhas: { label: string; valor: string }[] = [
    { label: "Estado", valor: respostas.uf ?? "—" },
    { label: "Agência", valor: nomeAgencia || respostas.agencia || "—" },
    { label: "Conta", valor: contaMascarada },
    { label: "Titular", valor: respostas.titularNome ?? "—" },
    { label: "Motivo", valor: descricaoMotivo || "Não informado" },
    { label: "Cheque", valor: respostas.possuiCheque ? "Sim" : "Não" },
    {
      label: "Saldo a transferir",
      valor: respostas.possuiSaldoPositivo ? "Sim" : "Não",
    },
    { label: "Endereço", valor: respostas.enderecoCliente ?? "—" },
    { label: "E-mail", valor: respostas.emailCliente || "Não informado" },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 text-sm space-y-2">
      {linhas.map(({ label, valor }) => (
        <div key={label} className="flex justify-between gap-2 flex-wrap">
          <span className="text-gray-500 shrink-0">{label}</span>
          <span className="font-medium text-gray-800 text-right break-all">
            {valor}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Input de confirmação final ────────────────────────────────────────────────

interface InputConfirmProps {
  respostas: Partial<EnccerramentoFormData>;
  nomeAgencia: string;
  descricaoMotivo: string;
  onEnviar: () => void;
  enviando: boolean;
}

/** Card de resumo + checkbox de aceite + botão de envio final. */
function InputConfirm({
  respostas,
  nomeAgencia,
  descricaoMotivo,
  onEnviar,
  enviando,
}: InputConfirmProps) {
  const [aceitou, setAceitou] = useState(false);

  return (
    <div className="flex flex-col gap-4 mt-2">
      <CardResumo
        respostas={respostas}
        nomeAgencia={nomeAgencia}
        descricaoMotivo={descricaoMotivo}
      />

      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={aceitou}
          onChange={(e) => setAceitou(e.target.checked)}
          className="mt-0.5 w-4 h-4 accent-brf-vermelho"
        />
        <span className="text-xs text-gray-600 leading-relaxed">
          Li e aceito o Termo de Encerramento conforme normativo BNB 3303-03-11.{" "}
          <Link
            href="/privacidade"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-brf-laranja hover:text-brf-vermelho"
          >
            Ver Política de Privacidade
          </Link>
        </span>
      </label>

      <button
        onClick={onEnviar}
        disabled={!aceitou || enviando}
        className="w-full bg-brf-vermelho text-white rounded-lg py-3 min-h-[44px] font-semibold hover:bg-brf-vermelho-escuro transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {enviando ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Enviando...
          </>
        ) : (
          "Confirmar e Enviar Solicitação"
        )}
      </button>
    </div>
  );
}

// ─── Componente principal ──────────────────────────────────────────────────────

/**
 * Chatbot guiado de encerramento de conta corrente BRF.
 * Implementa os passos 0–10 conforme normativo BRF-3303-03-11.
 */
export function ChatbotEncerramento() {
  const [respostas, setRespostas] = useState<Partial<EnccerramentoFormData>>(
    {},
  );
  const [passoAtual, setPassoAtual] = useState(0);
  const [historico, setHistorico] = useState<MensagemChat[]>([]);
  const [mostrandoDigitando, setMostrandoDigitando] = useState(false);
  const [exibirInput, setExibirInput] = useState(false);
  const [aguardandoDuvida, setAguardandoDuvida] = useState(false);

  // Estados de envio e sucesso
  const [enviando, setEnviando] = useState(false);
  const [erroEnvio, setErroEnvio] = useState<string | null>(null);
  const [protocolo, setProtocolo] = useState<string | null>(null);
  const [solicitacaoId, setSolicitacaoId] = useState<string | null>(null);
  const [gerandoPdf, setGerandoPdf] = useState(false);
  const [urlPdf, setUrlPdf] = useState<string | null>(null);

  const montadoRef = useRef(true);
  const fimRef = useRef<HTMLDivElement>(null);

  const { motivos, carregando: carregandoMotivos } = useMotivos();
  const { ufs, carregando: carregandoUfs } = useUfs();
  const { agencias, carregando: carregandoAgencias } = useAgencias(
    respostas.uf ?? "",
  );

  // ── Definição de todos os passos ─────────────────────────────────────────────
  const passos = useMemo<PassoChatbot[]>(
    () => [
      {
        id: "boas-vindas",
        field: null,
        message:
          "Olá! Sou o assistente de encerramento de conta. Vou te guiar pelo processo em poucos cliques. Podemos começar?",
        inputType: "button-group",
        options: [
          { label: "Sim, vamos lá! 👍", value: "sim" },
          { label: "Tenho uma dúvida primeiro", value: "duvida" },
        ],
      },
      {
        id: "uf",
        field: "uf",
        message: "Em qual estado fica sua agência?",
        inputType: "select",
        options: ufs.map((uf) => ({ label: uf, value: uf })),
      },
      {
        id: "agencia",
        field: "agencia",
        message: (r) => `Qual é a sua agência em ${r.uf}?`,
        inputType: "select",
        options: agencias.map((ag) => ({
          label: `${ag.nome} — ${ag.municipio}`,
          value: ag.codigo,
        })),
      },
      {
        id: "numero-conta",
        field: "numeroConta",
        message: "Qual é o número da sua conta corrente?",
        inputType: "text",
        validar: (v) =>
          /^[\d-]+$/.test(v) && v.length >= 3 && v.length <= 20
            ? null
            : "Informe apenas números e traço (ex: 12345-6)",
      },
      {
        id: "titular",
        field: "titularNome",
        message: "Confirme o nome completo do titular da conta:",
        inputType: "text",
        validar: (v) =>
          v.trim().length >= 3 ? null : "Mínimo de 3 caracteres",
      },
      {
        id: "motivo",
        field: "motivoEncerramento",
        message: "Qual o motivo do encerramento?",
        inputType: "button-group",
        options: [
          ...motivos.map((m) => ({ label: m.descricao, value: m.codigo })),
          { label: "Prefiro não informar", value: "" },
        ],
      },
      // ── Passos 6–10 ──────────────────────────────────────────────────────────
      {
        id: "possui-cheque",
        field: "possuiCheque",
        message: "Você movimentou essa conta através de cheque?",
        inputType: "button-group",
        options: [
          { label: "Sim", value: true },
          { label: "Não", value: false },
        ],
      },
      {
        id: "numero-cheque",
        field: "numeroChequeDevolvido",
        message:
          "Informe o(s) número(s) do(s) cheque(s) devolvido(s) ou inutilizado(s):",
        inputType: "text",
        condicao: (r) => r.possuiCheque === true,
      },
      {
        id: "possui-saldo",
        field: "possuiSaldoPositivo",
        message: "Sua conta possui saldo positivo que precisa ser transferido?",
        inputType: "button-group",
        options: [
          { label: "Sim, tenho saldo 💰", value: true },
          { label: "Não, pode fechar", value: false },
        ],
      },
      {
        id: "banco-transferencia",
        field: "bancoTransferencia",
        message: "Qual banco vai receber o saldo?",
        inputType: "text",
        condicao: (r) => r.possuiSaldoPositivo === true,
      },
      {
        id: "agencia-transferencia",
        field: "agenciaTransferencia",
        message: "Número da agência de destino:",
        inputType: "text",
        condicao: (r) => r.possuiSaldoPositivo === true,
      },
      {
        id: "conta-transferencia",
        field: "contaTransferencia",
        message: "Número da conta de destino:",
        inputType: "text",
        condicao: (r) => r.possuiSaldoPositivo === true,
      },
      {
        id: "endereco",
        field: "enderecoCliente",
        message: "Informe seu endereço completo e atualizado:",
        inputType: "text",
        validar: (v) =>
          v.trim().length >= 10
            ? null
            : "Informe endereço completo (rua, número, bairro, cidade – UF, CEP)",
      },
      {
        id: "email",
        field: "emailCliente",
        message:
          "Seu e-mail de contato: (opcional — toque em Pular se preferir)",
        inputType: "text",
      },
      {
        id: "resumo-aceite",
        field: "aceitouTermos",
        message: "Perfeito! Confira os dados da sua solicitação:",
        inputType: "confirm",
      },
    ],
    [ufs, agencias, motivos],
  );

  // ── Estado derivado: nome da agência selecionada ─────────────────────────────
  const nomeAgenciaSelecionada = useMemo(() => {
    if (!respostas.agencia) return "";
    const ag = agencias.find((a) => a.codigo === respostas.agencia);
    return ag ? `${ag.nome} — ${ag.municipio}` : respostas.agencia;
  }, [agencias, respostas.agencia]);

  // ── Estado derivado: descrição do motivo selecionado ─────────────────────────
  const descricaoMotivo = useMemo(() => {
    if (!respostas.motivoEncerramento) return "";
    const m = motivos.find((mo) => mo.codigo === respostas.motivoEncerramento);
    return m ? m.descricao : respostas.motivoEncerramento;
  }, [motivos, respostas.motivoEncerramento]);

  // ── Estado derivado: carregando opções do passo atual ────────────────────────
  const isCarregandoOpcoes = useMemo(() => {
    if (passoAtual >= passos.length) return false;
    const passo = passos[passoAtual];
    if (passo.id === "uf") return carregandoUfs;
    if (passo.id === "agencia") return carregandoAgencias;
    if (passo.id === "motivo") return carregandoMotivos;
    return false;
  }, [
    passos,
    passoAtual,
    carregandoUfs,
    carregandoAgencias,
    carregandoMotivos,
  ]);

  // ── Efeito: exibir primeira pergunta ao montar ───────────────────────────────
  useEffect(() => {
    montadoRef.current = true;
    setMostrandoDigitando(true);

    const timer = setTimeout(() => {
      if (!montadoRef.current) return;
      setMostrandoDigitando(false);
      setHistorico([
        {
          origem: "bot",
          texto:
            "Olá! Sou o assistente de encerramento de conta. Vou te guiar pelo processo em poucos cliques. Podemos começar?",
          timestamp: new Date(),
        },
      ]);
      setExibirInput(true);
    }, 500);

    return () => {
      montadoRef.current = false;
      clearTimeout(timer);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Efeito: rolar para o final após cada mudança no histórico ────────────────
  useEffect(() => {
    fimRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [historico, mostrandoDigitando, exibirInput]);

  // ── Avançar para o próximo passo válido (respeitando condicoes) ───────────────
  const avancarParaPasso = (
    proximoIdx: number,
    respostasAtuais: Partial<EnccerramentoFormData>,
    passosList: PassoChatbot[],
  ) => {
    // Encontra o próximo passo que satisfaz a condicao
    let idx = proximoIdx;
    while (
      idx < passosList.length &&
      passosList[idx].condicao &&
      !passosList[idx].condicao!(respostasAtuais)
    ) {
      idx++;
    }

    if (idx >= passosList.length) return; // sequência concluída

    setPassoAtual(idx);
    setExibirInput(false);
    setMostrandoDigitando(true);

    const proxPasso = passosList[idx];
    setTimeout(() => {
      if (!montadoRef.current) return;
      setMostrandoDigitando(false);
      const texto =
        typeof proxPasso.message === "function"
          ? proxPasso.message(respostasAtuais)
          : proxPasso.message;
      setHistorico((h) => [
        ...h,
        { origem: "bot", texto, timestamp: new Date() },
      ]);
      setExibirInput(true);
    }, 500);
  };

  // ── Processar resposta do usuário ────────────────────────────────────────────
  const responderPasso = (valor: string | boolean) => {
    const passo = passos[passoAtual];

    // Texto a exibir na bolha do usuário
    const labelOpcao =
      passo.options?.find((o) => o.value === valor)?.label ?? String(valor);

    // Nunca exibir numeroConta completa na bolha
    const textoExibir =
      passo.field === "numeroConta"
        ? `***${String(valor).slice(-3)}`
        : labelOpcao;

    setExibirInput(false);

    // Caso especial: passo 0 com "duvida"
    if (passo.id === "boas-vindas" && valor === "duvida") {
      setHistorico((h) => [
        ...h,
        {
          origem: "usuario",
          texto: textoExibir,
          timestamp: new Date(),
          passoIndex: passoAtual,
        },
      ]);
      setMostrandoDigitando(true);
      setTimeout(() => {
        if (!montadoRef.current) return;
        setMostrandoDigitando(false);
        setHistorico((h) => [
          ...h,
          {
            origem: "bot",
            texto:
              "Para dúvidas, ligue para nossa central ou visite uma agência.",
            timestamp: new Date(),
          },
        ]);
        setAguardandoDuvida(true);
      }, 500);
      return;
    }

    // Acumula a resposta no estado
    let novasRespostas = respostas;
    if (passo.field) {
      novasRespostas = { ...respostas, [passo.field]: valor };
      setRespostas(novasRespostas);
    }

    setHistorico((h) => [
      ...h,
      {
        origem: "usuario",
        texto: textoExibir,
        timestamp: new Date(),
        passoIndex: passoAtual,
      },
    ]);

    avancarParaPasso(passoAtual + 1, novasRespostas, passos);
  };

  // ── Pular passo de e-mail ────────────────────────────────────────────────────
  const pularEmail = () => {
    setExibirInput(false);
    const novasRespostas = { ...respostas, emailCliente: "" };
    setRespostas(novasRespostas);
    setHistorico((h) => [
      ...h,
      {
        origem: "usuario",
        texto: "Pular",
        timestamp: new Date(),
        passoIndex: passoAtual,
      },
    ]);
    avancarParaPasso(passoAtual + 1, novasRespostas, passos);
  };

  // ── Continuar após mensagem de dúvida ────────────────────────────────────────
  const continuarAposDuvida = () => {
    setAguardandoDuvida(false);
    avancarParaPasso(1, respostas, passos);
  };

  // ── Editar uma resposta anterior ─────────────────────────────────────────────
  const editarResposta = (passoIndex: number) => {
    // Corta o histórico antes da bolha do usuário deste passo
    const cutIdx = historico.findIndex(
      (m) => m.passoIndex === passoIndex && m.origem === "usuario",
    );
    const novoHistorico =
      cutIdx === -1 ? historico : historico.slice(0, cutIdx);

    // Limpa respostas deste passo em diante
    const novasRespostas = { ...respostas };
    for (let i = passoIndex; i < passos.length; i++) {
      const f = passos[i].field;
      if (f) delete novasRespostas[f];
    }

    setHistorico(novoHistorico);
    setRespostas(novasRespostas);
    setPassoAtual(passoIndex);
    setExibirInput(false);
    setAguardandoDuvida(false);
    setErroEnvio(null);
    setMostrandoDigitando(true);

    const passo = passos[passoIndex];
    setTimeout(() => {
      if (!montadoRef.current) return;
      setMostrandoDigitando(false);
      const texto =
        typeof passo.message === "function"
          ? passo.message(novasRespostas)
          : passo.message;
      setHistorico((h) => [
        ...h,
        { origem: "bot", texto, timestamp: new Date() },
      ]);
      setExibirInput(true);
    }, 500);
  };

  // ── Enviar solicitação ────────────────────────────────────────────────────────
  const enviarSolicitacao = async () => {
    setEnviando(true);
    setErroEnvio(null);
    setExibirInput(false);
    setMostrandoDigitando(true);

    await new Promise<void>((r) => setTimeout(r, 500));
    if (!montadoRef.current) return;
    setMostrandoDigitando(false);
    setHistorico((h) => [
      ...h,
      {
        origem: "bot",
        texto: "Enviando sua solicitação...",
        timestamp: new Date(),
      },
    ]);

    try {
      const payload = {
        agencia: (respostas.agencia ?? "").padStart(4, "0"),
        numeroConta: respostas.numeroConta,
        titularNome: respostas.titularNome,
        motivoEncerramento: respostas.motivoEncerramento || undefined,
        aceiteTermosVersao: "1.0",
        aceiteTermosTimestamp: new Date().toISOString(),
        aceitouTermos: true,
        enderecoCliente: respostas.enderecoCliente,
        emailCliente: respostas.emailCliente || undefined,
        possuiCheque: respostas.possuiCheque ?? false,
        numeroChequeDevolvido: respostas.possuiCheque
          ? respostas.numeroChequeDevolvido
          : undefined,
        possuiSaldoPositivo: respostas.possuiSaldoPositivo ?? false,
        bancoTransferencia: respostas.possuiSaldoPositivo
          ? respostas.bancoTransferencia
          : undefined,
        agenciaTransferencia: respostas.possuiSaldoPositivo
          ? respostas.agenciaTransferencia
          : undefined,
        contaTransferencia: respostas.possuiSaldoPositivo
          ? respostas.contaTransferencia
          : undefined,
      };
      const resposta = await apiClient.post<RespostaCriacao>(
        "/publico/solicitacoes",
        payload,
      );
      if (!montadoRef.current) return;
      setProtocolo(resposta.data.protocolo);
      setSolicitacaoId(resposta.data.solicitacaoId);
    } catch (err) {
      if (!montadoRef.current) return;
      const msg = (err as Error).message ?? "Erro desconhecido";
      setErroEnvio(msg);
      setHistorico((h) => [
        ...h,
        {
          origem: "bot",
          texto: `Não consegui enviar sua solicitação. ${msg}. Deseja tentar novamente?`,
          timestamp: new Date(),
        },
      ]);
      setExibirInput(true);
    } finally {
      if (montadoRef.current) setEnviando(false);
    }
  };

  // ── Gerar PDF (tela de sucesso) ───────────────────────────────────────────────
  const gerarPdf = async () => {
    if (!solicitacaoId) return;
    setGerandoPdf(true);
    try {
      const resposta = await apiClient.post<{ id: string; url: string }>(
        `/publico/solicitacoes/${solicitacaoId}/documentos/gerar-termo`,
      );
      setUrlPdf(resposta.data.url);
      window.open(resposta.data.url, "_blank", "noopener,noreferrer");
    } catch {
      setErroEnvio("Não foi possível gerar o PDF. Tente novamente.");
    } finally {
      setGerandoPdf(false);
    }
  };

  // ── Renderização do input ativo ───────────────────────────────────────────────
  const renderInput = () => {
    if (aguardandoDuvida) {
      return (
        <button
          onClick={continuarAposDuvida}
          className="rounded-full border border-brf-vermelho text-brf-vermelho px-5 py-2 min-h-[44px] text-sm font-medium hover:bg-brf-vermelho hover:text-white transition-colors duration-150"
        >
          Entendi, quero continuar
        </button>
      );
    }

    // Botão "Tentar novamente" após erro de envio
    if (erroEnvio && exibirInput) {
      return (
        <button
          onClick={() => {
            setErroEnvio(null);
            const resumoIdx = passos.findIndex((p) => p.id === "resumo-aceite");
            if (resumoIdx !== -1) {
              setPassoAtual(resumoIdx);
            }
            setExibirInput(true);
          }}
          className="rounded-full border border-brf-vermelho text-brf-vermelho px-5 py-2 min-h-[44px] text-sm font-medium hover:bg-brf-vermelho hover:text-white transition-colors duration-150"
        >
          Tentar novamente
        </button>
      );
    }

    if (!exibirInput) return null;

    const passo = passos[passoAtual];

    switch (passo.inputType) {
      case "button-group":
        return (
          <InputBotaoGrupo
            key={passo.id}
            options={passo.options ?? []}
            onSelecionar={responderPasso}
          />
        );
      case "select":
        return (
          <InputSelect
            key={passo.id}
            options={passo.options ?? []}
            onConfirmar={(v) => responderPasso(v)}
            carregando={isCarregandoOpcoes}
          />
        );
      case "text":
        return (
          <InputTexto
            key={passo.id}
            onConfirmar={(v) => responderPasso(v)}
            validar={passo.validar}
            onPular={passo.id === "email" ? pularEmail : undefined}
          />
        );
      case "confirm":
        return (
          <InputConfirm
            key={passo.id}
            respostas={respostas}
            nomeAgencia={nomeAgenciaSelecionada}
            descricaoMotivo={descricaoMotivo}
            onEnviar={enviarSolicitacao}
            enviando={enviando}
          />
        );
      default:
        return null;
    }
  };

  const inputAtivo = renderInput();

  // ── TELA DE SUCESSO ───────────────────────────────────────────────────────────
  if (protocolo) {
    return (
      <div className="w-full max-w-2xl mx-auto space-y-6">
        <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center space-y-5">
          <CheckCircle className="h-14 w-14 text-green-600 mx-auto" />
          <h2 className="text-2xl font-bold text-green-800">
            Solicitação Registrada!
          </h2>
          <div className="bg-white border border-green-300 rounded-lg p-5 space-y-1">
            <p className="text-sm text-gray-500">Número do protocolo</p>
            <p
              data-testid="protocolo"
              className="text-3xl font-bold text-brf-vermelho font-mono tracking-widest"
            >
              {protocolo}
            </p>
            <p className="text-xs text-gray-400">
              Guarde este número para acompanhar sua solicitação
            </p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
          <h3 className="text-lg font-bold text-brf-vermelho flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Próximo passo: Assinar o Termo de Encerramento
          </h3>

          <ol className="space-y-3 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brf-vermelho text-white text-xs font-bold flex items-center justify-center">
                1
              </span>
              <span>
                Gere o PDF do Termo de Encerramento abaixo e baixe o arquivo.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brf-vermelho text-white text-xs font-bold flex items-center justify-center">
                2
              </span>
              <span>
                Acesse o{" "}
                <a
                  href="https://www.gov.br/iti/pt-br"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brf-laranja underline hover:text-brf-vermelho inline-flex items-center gap-1"
                >
                  Verificador ICP-Brasil (gov.br){" "}
                  <ExternalLink className="h-3 w-3" />
                </a>{" "}
                e assine o documento digitalmente.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brf-vermelho text-white text-xs font-bold flex items-center justify-center">
                3
              </span>
              <span>Faça o upload do PDF assinado no campo abaixo.</span>
            </li>
          </ol>

          <button
            type="button"
            onClick={gerarPdf}
            disabled={gerandoPdf}
            className="flex items-center gap-2 bg-brf-vermelho text-white px-6 py-3 rounded-lg font-medium hover:bg-brf-vermelho-escuro transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {gerandoPdf ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Gerando PDF...
              </>
            ) : (
              <>
                <FileText className="h-4 w-4" /> Gerar PDF para Assinatura
              </>
            )}
          </button>

          {urlPdf && (
            <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 flex-shrink-0" />
              PDF gerado com sucesso. Abriu em nova aba. Se não abriu,{" "}
              <a
                href={urlPdf}
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-medium"
              >
                clique aqui para baixar
              </a>
              .
            </p>
          )}

          {erroEnvio && (
            <div
              className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3"
              role="alert"
            >
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{erroEnvio}</p>
            </div>
          )}
        </div>

        {solicitacaoId && <UploadTermoAssinado solicitacaoId={solicitacaoId} />}

        <div className="text-center space-y-2">
          <Link
            href={`/encerramento/status?protocolo=${protocolo}`}
            className="inline-block border border-brf-vermelho text-brf-vermelho px-6 py-2 rounded-lg font-medium hover:bg-brf-salmao transition-colors text-sm"
          >
            Consultar status da solicitação
          </Link>
          <p>
            <Link
              href="/"
              className="text-sm text-gray-500 underline hover:text-gray-700"
            >
              Voltar à página inicial
            </Link>
          </p>
        </div>
      </div>
    );
  }

  // ── Render do componente ──────────────────────────────────────────────────────
  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col rounded-2xl shadow-xl overflow-hidden border border-gray-100 bg-white">
      {/* Header */}
      <div className="bg-brf-vermelho p-3 sm:p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-semibold text-white leading-tight">
              Assistente de Encerramento
            </p>
            <p className="text-xs text-white/70">BRF Digital</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs text-green-200">Online</span>
        </div>
      </div>

      {/* Área de chat */}
      <div className="overflow-y-auto bg-gray-50 min-h-[400px] max-h-[55vh] sm:max-h-[60vh] p-4 space-y-4">
        {historico.map((msg, i) =>
          msg.origem === "bot" ? (
            <BolhaBot key={i} texto={msg.texto} />
          ) : (
            <BolhaUsuario
              key={i}
              texto={msg.texto}
              onEditar={
                msg.passoIndex !== undefined
                  ? () => editarResposta(msg.passoIndex!)
                  : undefined
              }
            />
          ),
        )}
        {mostrandoDigitando && <DigitandoIndicador />}
        <div ref={fimRef} />
      </div>

      {/* Área de input */}
      {inputAtivo && (
        <div className="border-t border-gray-200 px-4 py-3 bg-white">
          {inputAtivo}
        </div>
      )}
    </div>
  );
}
