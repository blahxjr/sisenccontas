'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { Loader2, CheckCircle, AlertCircle, FileText, ExternalLink, ChevronRight, ChevronLeft } from 'lucide-react';
import { useMotivos, useUfs, useAgencias } from '@hooks/useCatalogos';
import { apiClient } from '@lib/api-client';
import { UploadTermoAssinado } from './UploadTermoAssinado';

const schema = z.object({
  // Etapa 1 — Dados da conta
  uf: z.string().min(2, 'Selecione um estado'),
  agencia: z.string().regex(/^\d+$/, 'Selecione uma agência'),
  numeroConta: z
    .string()
    .min(3, 'Número de conta muito curto')
    .max(20, 'Número de conta muito longo')
    .regex(/^[\d-]+$/, 'Apenas números e traço são permitidos'),
  titularNome: z
    .string()
    .min(3, 'Nome deve ter pelo menos 3 caracteres')
    .max(150, 'Nome muito longo'),
  motivoEncerramento: z.string().optional(),
  // Etapa 2 — Informações complementares (3303-03-11)
  enderecoCliente: z.string().min(10, 'Informe seu endereço completo').max(200),
  emailCliente: z.string().email('E-mail inválido').optional().or(z.literal('')),
  possuiCheque: z.boolean(),
  numeroChequeDevolvido: z.string().optional(),
  possuiSaldoPositivo: z.boolean(),
  bancoTransferencia: z.string().optional(),
  agenciaTransferencia: z.string().max(10).optional(),
  contaTransferencia: z.string().max(20).optional(),
  // Etapa 3 — Aceite
  aceitouTermos: z.literal(true, {
    errorMap: () => ({ message: 'Aceite os termos para continuar' }),
  }),
});

type FormData = z.infer<typeof schema>;

interface RespostaCriacao {
  protocolo: string;
  solicitacaoId: string;
  status: string;
  mensagem: string;
}

const ETAPAS = ['Dados da Conta', 'Informações Complementares', 'Confirmar e Assinar'];

/** Formulário multi-etapa de solicitação de encerramento de conta corrente BNB
 * conforme normativo 3303-03-11.
 */
export function FormularioEncerramento() {
  const [etapaAtual, setEtapaAtual] = useState(0);
  const [protocolo, setProtocolo] = useState<string | null>(null);
  const [solicitacaoId, setSolicitacaoId] = useState<string | null>(null);
  const [erroEnvio, setErroEnvio] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [gerandoPdf, setGerandoPdf] = useState(false);
  const [urlPdf, setUrlPdf] = useState<string | null>(null);

  const { motivos, carregando: carregandoMotivos } = useMotivos();
  const { ufs, carregando: carregandoUfs } = useUfs();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      possuiCheque: false,
      possuiSaldoPositivo: false,
    },
  });

  const ufSelecionada = watch('uf');
  const possuiCheque = watch('possuiCheque');
  const possuiSaldoPositivo = watch('possuiSaldoPositivo');
  const { agencias, carregando: carregandoAgencias } = useAgencias(ufSelecionada);

  useEffect(() => {
    setValue('agencia', '');
  }, [ufSelecionada, setValue]);

  const camposEtapa1: (keyof FormData)[] = ['uf', 'agencia', 'numeroConta', 'titularNome'];
  const camposEtapa2: (keyof FormData)[] = ['enderecoCliente'];

  const avancarEtapa = async () => {
    const campos = etapaAtual === 0 ? camposEtapa1 : camposEtapa2;
    const valido = await trigger(campos);
    if (valido) setEtapaAtual((e) => e + 1);
  };

  const onSubmit = async (dados: FormData) => {
    setEnviando(true);
    setErroEnvio(null);
    try {
      const payload = {
        agencia: dados.agencia.padStart(4, '0'),
        numeroConta: dados.numeroConta,
        titularNome: dados.titularNome,
        motivoEncerramento: dados.motivoEncerramento || undefined,
        aceiteTermosVersao: '1.0',
        aceiteTermosTimestamp: new Date().toISOString(),
        aceitouTermos: dados.aceitouTermos,
        enderecoCliente: dados.enderecoCliente,
        emailCliente: dados.emailCliente || undefined,
        possuiCheque: dados.possuiCheque,
        numeroChequeDevolvido: dados.possuiCheque ? dados.numeroChequeDevolvido : undefined,
        possuiSaldoPositivo: dados.possuiSaldoPositivo,
        bancoTransferencia: dados.possuiSaldoPositivo ? dados.bancoTransferencia : undefined,
        agenciaTransferencia: dados.possuiSaldoPositivo ? dados.agenciaTransferencia : undefined,
        contaTransferencia: dados.possuiSaldoPositivo ? dados.contaTransferencia : undefined,
      };
      const resposta = await apiClient.post<RespostaCriacao>('/publico/solicitacoes', payload);
      setProtocolo(resposta.data.protocolo);
      setSolicitacaoId(resposta.data.solicitacaoId);
    } catch (err) {
      setErroEnvio((err as Error).message);
    } finally {
      setEnviando(false);
    }
  };

  const gerarPdf = async () => {
    if (!solicitacaoId) return;
    setGerandoPdf(true);
    try {
      const resposta = await apiClient.post<{ id: string; url: string }>(
        `/publico/solicitacoes/${solicitacaoId}/documentos/gerar-termo`,
      );
      setUrlPdf(resposta.data.url);
      window.open(resposta.data.url, '_blank', 'noopener,noreferrer');
    } catch {
      setErroEnvio('Não foi possível gerar o PDF. Tente novamente.');
    } finally {
      setGerandoPdf(false);
    }
  };

  // ── TELA DE SUCESSO ────────────────────────────────────────────────────────
  if (protocolo) {
    return (
      <div className="space-y-6">
        <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center space-y-5">
          <CheckCircle className="h-14 w-14 text-green-600 mx-auto" />
          <h2 className="text-2xl font-bold text-green-800">Solicitação Registrada!</h2>
          <div className="bg-white border border-green-300 rounded-lg p-5 space-y-1">
            <p className="text-sm text-gray-500">Número do protocolo</p>
            <p
              data-testid="protocolo"
              className="text-3xl font-bold text-bnb-vermelho font-mono tracking-widest"
            >
              {protocolo}
            </p>
            <p className="text-xs text-gray-400">Guarde este número para acompanhar sua solicitação</p>
          </div>
        </div>

        {/* Etapa: Gerar PDF → Assinar → Upload */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
          <h3 className="text-lg font-bold text-bnb-vermelho flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Próximo passo: Assinar o Termo de Encerramento
          </h3>

          <ol className="space-y-3 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-bnb-vermelho text-white text-xs font-bold flex items-center justify-center">1</span>
              <span>Gere o PDF do Termo de Encerramento abaixo e baixe o arquivo.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-bnb-vermelho text-white text-xs font-bold flex items-center justify-center">2</span>
              <span>
                Acesse o{' '}
                <a
                  href="https://www.gov.br/iti/pt-br"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-bnb-laranja underline hover:text-bnb-vermelho inline-flex items-center gap-1"
                >
                  Verificador ICP-Brasil (gov.br) <ExternalLink className="h-3 w-3" />
                </a>{' '}
                e assine o documento digitalmente.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-bnb-vermelho text-white text-xs font-bold flex items-center justify-center">3</span>
              <span>Faça o upload do PDF assinado no campo abaixo.</span>
            </li>
          </ol>

          <button
            type="button"
            onClick={gerarPdf}
            disabled={gerandoPdf}
            className="flex items-center gap-2 bg-bnb-vermelho text-white px-6 py-3 rounded-lg font-medium hover:bg-bnb-vermelho-escuro transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {gerandoPdf ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Gerando PDF...</>
            ) : (
              <><FileText className="h-4 w-4" /> Gerar PDF para Assinatura</>
            )}
          </button>

          {urlPdf && (
            <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 flex-shrink-0" />
              PDF gerado com sucesso. Abriu em nova aba. Se não abriu,{' '}
              <a href={urlPdf} target="_blank" rel="noopener noreferrer" className="underline font-medium">
                clique aqui para baixar
              </a>.
            </p>
          )}

          {erroEnvio && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3" role="alert">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{erroEnvio}</p>
            </div>
          )}
        </div>

        {solicitacaoId && <UploadTermoAssinado solicitacaoId={solicitacaoId} />}

        <div className="text-center space-y-2">
          <Link
            href={`/encerramento/status?protocolo=${protocolo}`}
            className="inline-block border border-bnb-vermelho text-bnb-vermelho px-6 py-2 rounded-lg font-medium hover:bg-bnb-salmao transition-colors text-sm"
          >
            Consultar status da solicitação
          </Link>
          <p>
            <Link href="/" className="text-sm text-gray-500 underline hover:text-gray-700">
              Voltar ao início
            </Link>
          </p>
        </div>
      </div>
    );
  }

  // ── INDICADOR DE PROGRESSO ─────────────────────────────────────────────────
  const IndicadorEtapas = () => (
    <nav aria-label="Progresso do formulário" className="mb-8">
      <ol className="flex items-center gap-0">
        {ETAPAS.map((nome, idx) => {
          const concluida = idx < etapaAtual;
          const ativa = idx === etapaAtual;
          return (
            <li key={idx} className="flex-1 flex items-center">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    concluida
                      ? 'bg-bnb-laranja text-white'
                      : ativa
                      ? 'bg-bnb-vermelho text-white'
                      : 'bg-bnb-cinza-claro border border-bnb-cinza text-bnb-cinza'
                  }`}
                >
                  {concluida ? '✓' : idx + 1}
                </div>
                <span className={`text-xs mt-1 text-center hidden sm:block ${ativa ? 'text-bnb-vermelho font-semibold' : 'text-gray-500'}`}>
                  {nome}
                </span>
              </div>
              {idx < ETAPAS.length - 1 && (
                <div className={`h-0.5 flex-1 mx-1 ${idx < etapaAtual ? 'bg-bnb-laranja' : 'bg-gray-200'}`} />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      <IndicadorEtapas />

      {/* ── ETAPA 1 — Dados da Conta ─────────────────────────────────────────── */}
      {etapaAtual === 0 && (
        <div className="space-y-5">
          {/* Estado */}
          <div>
            <label htmlFor="uf" className="block text-sm font-medium text-gray-700 mb-1">
              Estado <span className="text-red-500">*</span>
            </label>
            <select
              id="uf"
              {...register('uf')}
              disabled={carregandoUfs}
              className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-bnb-vermelho focus:border-bnb-vermelho disabled:bg-gray-100 disabled:text-gray-400"
              aria-invalid={!!errors.uf}
            >
              <option value="">{carregandoUfs ? 'Carregando estados...' : 'Selecione um estado'}</option>
              {ufs.map((uf) => <option key={uf} value={uf}>{uf}</option>)}
            </select>
            {errors.uf && <p className="text-red-600 text-sm mt-1" role="alert">{errors.uf.message}</p>}
          </div>

          {/* Agência */}
          <div>
            <label htmlFor="agencia" className="block text-sm font-medium text-gray-700 mb-1">
              Agência <span className="text-red-500">*</span>
            </label>
            <select
              id="agencia"
              {...register('agencia')}
              disabled={!ufSelecionada || carregandoAgencias}
              className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-bnb-vermelho focus:border-bnb-vermelho disabled:bg-gray-100 disabled:text-gray-400"
              aria-invalid={!!errors.agencia}
            >
              <option value="">
                {!ufSelecionada ? 'Selecione um estado primeiro' : carregandoAgencias ? 'Carregando agências...' : 'Selecione uma agência'}
              </option>
              {agencias.map((ag) => (
                <option key={ag.codigo} value={ag.codigo}>{ag.nome} — {ag.municipio}</option>
              ))}
            </select>
            {errors.agencia && <p className="text-red-600 text-sm mt-1" role="alert">{errors.agencia.message}</p>}
          </div>

          {/* Número da conta */}
          <div>
            <label htmlFor="numeroConta" className="block text-sm font-medium text-gray-700 mb-1">
              Número da Conta <span className="text-red-500">*</span>
            </label>
            <input
              id="numeroConta"
              type="text"
              inputMode="text"
              autoComplete="off"
              {...register('numeroConta')}
              placeholder="Ex: 12345-6"
              className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-bnb-vermelho focus:border-bnb-vermelho"
              aria-invalid={!!errors.numeroConta}
            />
            {errors.numeroConta && <p className="text-red-600 text-sm mt-1" role="alert">{errors.numeroConta.message}</p>}
          </div>

          {/* Nome do titular */}
          <div>
            <label htmlFor="titularNome" className="block text-sm font-medium text-gray-700 mb-1">
              Nome do Titular <span className="text-red-500">*</span>
            </label>
            <input
              id="titularNome"
              type="text"
              autoComplete="name"
              {...register('titularNome')}
              placeholder="Nome completo conforme cadastro no banco"
              className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-bnb-vermelho focus:border-bnb-vermelho"
              aria-invalid={!!errors.titularNome}
            />
            {errors.titularNome && <p className="text-red-600 text-sm mt-1" role="alert">{errors.titularNome.message}</p>}
          </div>

          {/* Motivo do encerramento */}
          <div>
            <label htmlFor="motivoEncerramento" className="block text-sm font-medium text-gray-700 mb-1">
              Motivo do Encerramento <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <select
              id="motivoEncerramento"
              {...register('motivoEncerramento')}
              disabled={carregandoMotivos}
              className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-bnb-vermelho focus:border-bnb-vermelho disabled:bg-gray-100 disabled:text-gray-400"
            >
              <option value="">{carregandoMotivos ? 'Carregando...' : 'Selecione um motivo (opcional)'}</option>
              {motivos.map((m) => <option key={m.codigo} value={m.codigo}>{m.descricao}</option>)}
            </select>
          </div>

          <button
            type="button"
            onClick={avancarEtapa}
            className="w-full bg-bnb-vermelho text-white font-semibold py-3 px-6 rounded-lg hover:bg-bnb-vermelho-escuro transition-colors flex items-center justify-center gap-2"
          >
            Continuar <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* ── ETAPA 2 — Informações Complementares ─────────────────────────────── */}
      {etapaAtual === 1 && (
        <div className="space-y-5">
          <p className="text-sm text-gray-600 bg-bnb-salmao border border-bnb-laranja/30 rounded-lg p-3">
            Conforme normativo BNB 3303-03-11, estas informações são necessárias para o processamento do encerramento.
          </p>

          {/* Possui cheque */}
          <div className="space-y-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                {...register('possuiCheque')}
                className="h-4 w-4 rounded border-gray-300 text-bnb-vermelho focus:ring-bnb-vermelho"
              />
              <span className="text-sm text-gray-700 font-medium">Movimentei a conta através de cheque</span>
            </label>
            {possuiCheque && (
              <div className="ml-7">
                <label htmlFor="numeroCheque" className="block text-sm text-gray-600 mb-1">
                  Número(s) do(s) cheque(s) devolvido(s)/inutilizado(s):
                </label>
                <input
                  id="numeroCheque"
                  type="text"
                  {...register('numeroChequeDevolvido')}
                  placeholder="Ex: 000123, 000124"
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-bnb-vermelho focus:border-bnb-vermelho text-sm"
                />
              </div>
            )}
          </div>

          {/* Possui saldo positivo */}
          <div className="space-y-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                {...register('possuiSaldoPositivo')}
                className="h-4 w-4 rounded border-gray-300 text-bnb-vermelho focus:ring-bnb-vermelho"
              />
              <span className="text-sm text-gray-700 font-medium">A conta possui saldo positivo</span>
            </label>
            {possuiSaldoPositivo && (
              <div className="ml-7 space-y-3">
                <p className="text-xs text-gray-500">Informe a conta de destino para transferência do saldo:</p>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Banco de destino</label>
                  <input
                    type="text"
                    {...register('bancoTransferencia')}
                    placeholder="Nome ou código do banco"
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-bnb-vermelho focus:border-bnb-vermelho text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Agência</label>
                    <input
                      type="text"
                      {...register('agenciaTransferencia')}
                      placeholder="0000"
                      className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-bnb-vermelho focus:border-bnb-vermelho text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Conta</label>
                    <input
                      type="text"
                      {...register('contaTransferencia')}
                      placeholder="00000-0"
                      className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-bnb-vermelho focus:border-bnb-vermelho text-sm"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Endereço atualizado */}
          <div>
            <label htmlFor="enderecoCliente" className="block text-sm font-medium text-gray-700 mb-1">
              Endereço atualizado <span className="text-red-500">*</span>
            </label>
            <input
              id="enderecoCliente"
              type="text"
              {...register('enderecoCliente')}
              placeholder="Rua, número, bairro, cidade – UF, CEP"
              className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-bnb-vermelho focus:border-bnb-vermelho"
              aria-invalid={!!errors.enderecoCliente}
            />
            {errors.enderecoCliente && <p className="text-red-600 text-sm mt-1" role="alert">{errors.enderecoCliente.message}</p>}
          </div>

          {/* E-mail */}
          <div>
            <label htmlFor="emailCliente" className="block text-sm font-medium text-gray-700 mb-1">
              E-mail <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <input
              id="emailCliente"
              type="email"
              autoComplete="email"
              {...register('emailCliente')}
              placeholder="seu@email.com.br"
              className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-bnb-vermelho focus:border-bnb-vermelho"
              aria-invalid={!!errors.emailCliente}
            />
            {errors.emailCliente && <p className="text-red-600 text-sm mt-1" role="alert">{errors.emailCliente.message}</p>}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setEtapaAtual(0)}
              className="flex-1 border border-bnb-vermelho text-bnb-vermelho font-semibold py-3 px-6 rounded-lg hover:bg-bnb-salmao transition-colors flex items-center justify-center gap-2"
            >
              <ChevronLeft className="h-5 w-5" /> Voltar
            </button>
            <button
              type="button"
              onClick={avancarEtapa}
              className="flex-1 bg-bnb-vermelho text-white font-semibold py-3 px-6 rounded-lg hover:bg-bnb-vermelho-escuro transition-colors flex items-center justify-center gap-2"
            >
              Continuar <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* ── ETAPA 3 — Confirmar e Assinar ────────────────────────────────────── */}
      {etapaAtual === 2 && (
        <div className="space-y-5">
          {/* Aceite dos termos */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                {...register('aceitouTermos')}
                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-bnb-vermelho focus:ring-bnb-vermelho"
                aria-invalid={!!errors.aceitouTermos}
              />
              <span className="text-sm text-gray-700 leading-relaxed">
                Li e aceito os termos do <strong>Termo de Encerramento de Conta Corrente</strong>,
                conforme normativo BNB 3303-03-11. Declaro que as informações são verdadeiras
                e que sou o titular da conta informada. Concordo com a{' '}
                <a href="#" className="text-bnb-laranja underline hover:text-bnb-vermelho">
                  Política de Privacidade
                </a>.
              </span>
            </label>
            {errors.aceitouTermos && (
              <p className="text-red-600 text-sm mt-2" role="alert">{errors.aceitouTermos.message}</p>
            )}
          </div>

          {erroEnvio && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3" role="alert" aria-live="assertive">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{erroEnvio}</p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setEtapaAtual(1)}
              className="flex-1 border border-bnb-vermelho text-bnb-vermelho font-semibold py-3 px-6 rounded-lg hover:bg-bnb-salmao transition-colors flex items-center justify-center gap-2"
            >
              <ChevronLeft className="h-5 w-5" /> Voltar
            </button>
            <button
              type="submit"
              disabled={enviando}
              className="flex-1 bg-bnb-vermelho text-white font-semibold py-3 px-6 rounded-lg hover:bg-bnb-vermelho-escuro transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {enviando ? (
                <><Loader2 className="h-5 w-5 animate-spin" /> Enviando...</>
              ) : (
                'Solicitar Encerramento de Conta'
              )}
            </button>
          </div>

          <p className="text-xs text-gray-400 text-center">
            🔒 Seus dados são protegidos por criptografia AES-256. Apenas operadores autorizados do BNB têm acesso.
          </p>
        </div>
      )}
    </form>
  );
}

