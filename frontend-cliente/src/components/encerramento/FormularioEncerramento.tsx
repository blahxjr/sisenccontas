'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useMotivos, useUfs, useAgencias } from '@hooks/useCatalogos';
import { apiClient } from '@lib/api-client';

const schema = z.object({
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
  aceitouTermos: z.literal(true, {
    errorMap: () => ({ message: 'Aceite os termos para continuar' }),
  }),
});

type FormData = z.infer<typeof schema>;

interface RespostaCriacao {
  protocolo: string;
  status: string;
  mensagem: string;
}

/** Formulário de solicitação de encerramento de conta corrente BNB. */
export function FormularioEncerramento() {
  const [protocolo, setProtocolo] = useState<string | null>(null);
  const [erroEnvio, setErroEnvio] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  const { motivos, carregando: carregandoMotivos } = useMotivos();
  const { ufs, carregando: carregandoUfs } = useUfs();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const ufSelecionada = watch('uf');
  const { agencias, carregando: carregandoAgencias } = useAgencias(ufSelecionada);

  // Limpa a agência selecionada ao trocar o estado
  useEffect(() => {
    setValue('agencia', '');
  }, [ufSelecionada, setValue]);

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
      };
      const resposta = await apiClient.post<RespostaCriacao>(
        '/publico/solicitacoes',
        payload,
      );
      setProtocolo(resposta.data.protocolo);
    } catch (err) {
      setErroEnvio((err as Error).message);
    } finally {
      setEnviando(false);
    }
  };

  // Tela de sucesso pós-submit
  if (protocolo) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center space-y-5">
        <CheckCircle className="h-14 w-14 text-green-600 mx-auto" />
        <h2 className="text-2xl font-bold text-green-800">Solicitação Registrada!</h2>
        <div className="bg-white border border-green-300 rounded-lg p-5 space-y-1">
          <p className="text-sm text-gray-500">Número do protocolo</p>
          <p className="text-3xl font-bold text-bnb-azul font-mono tracking-widest">
            {protocolo}
          </p>
          <p className="text-xs text-gray-400">
            Guarde este número para acompanhar sua solicitação
          </p>
        </div>
        <p className="text-gray-700 text-sm max-w-md mx-auto">
          <strong>Próximo passo:</strong> Nossa equipe analisará sua solicitação.
          Você receberá um retorno em até 5 dias úteis.
        </p>
        <Link
          href={`/encerramento/status?protocolo=${protocolo}`}
          className="inline-block bg-bnb-azul text-white px-8 py-3 rounded-lg font-medium hover:bg-bnb-azul-claro transition-colors"
        >
          Consultar status da solicitação
        </Link>
        <p>
          <Link href="/" className="text-sm text-gray-500 underline hover:text-gray-700">
            Voltar ao início
          </Link>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      {/* Estado */}
      <div>
        <label htmlFor="uf" className="block text-sm font-medium text-gray-700 mb-1">
          Estado <span className="text-red-500">*</span>
        </label>
        <select
          id="uf"
          {...register('uf')}
          disabled={carregandoUfs}
          className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-bnb-azul focus:border-bnb-azul disabled:bg-gray-100 disabled:text-gray-400"
          aria-invalid={!!errors.uf}
          aria-describedby={errors.uf ? 'uf-erro' : undefined}
        >
          <option value="">
            {carregandoUfs ? 'Carregando estados...' : 'Selecione um estado'}
          </option>
          {ufs.map((uf) => (
            <option key={uf} value={uf}>
              {uf}
            </option>
          ))}
        </select>
        {errors.uf && (
          <p id="uf-erro" className="text-red-600 text-sm mt-1" role="alert">
            {errors.uf.message}
          </p>
        )}
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
          className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-bnb-azul focus:border-bnb-azul disabled:bg-gray-100 disabled:text-gray-400"
          aria-invalid={!!errors.agencia}
          aria-describedby={errors.agencia ? 'agencia-erro' : undefined}
        >
          <option value="">
            {!ufSelecionada
              ? 'Selecione um estado primeiro'
              : carregandoAgencias
              ? 'Carregando agências...'
              : 'Selecione uma agência'}
          </option>
          {agencias.map((ag) => (
            <option key={ag.codigo} value={ag.codigo}>
              {ag.nome} — {ag.municipio}
            </option>
          ))}
        </select>
        {errors.agencia && (
          <p id="agencia-erro" className="text-red-600 text-sm mt-1" role="alert">
            {errors.agencia.message}
          </p>
        )}
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
          className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-bnb-azul focus:border-bnb-azul"
          aria-invalid={!!errors.numeroConta}
          aria-describedby={errors.numeroConta ? 'conta-erro' : undefined}
        />
        {errors.numeroConta && (
          <p id="conta-erro" className="text-red-600 text-sm mt-1" role="alert">
            {errors.numeroConta.message}
          </p>
        )}
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
          className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-bnb-azul focus:border-bnb-azul"
          aria-invalid={!!errors.titularNome}
          aria-describedby={errors.titularNome ? 'nome-erro' : undefined}
        />
        {errors.titularNome && (
          <p id="nome-erro" className="text-red-600 text-sm mt-1" role="alert">
            {errors.titularNome.message}
          </p>
        )}
      </div>

      {/* Motivo do encerramento */}
      <div>
        <label
          htmlFor="motivoEncerramento"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Motivo do Encerramento{' '}
          <span className="text-gray-400 font-normal">(opcional)</span>
        </label>
        <select
          id="motivoEncerramento"
          {...register('motivoEncerramento')}
          disabled={carregandoMotivos}
          className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-bnb-azul focus:border-bnb-azul disabled:bg-gray-100 disabled:text-gray-400"
        >
          <option value="">
            {carregandoMotivos ? 'Carregando...' : 'Selecione um motivo (opcional)'}
          </option>
          {motivos.map((m) => (
            <option key={m.codigo} value={m.codigo}>
              {m.descricao}
            </option>
          ))}
        </select>
      </div>

      {/* Aceite dos termos */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            {...register('aceitouTermos')}
            className="mt-0.5 h-4 w-4 rounded border-gray-300 text-bnb-azul focus:ring-bnb-azul"
            aria-invalid={!!errors.aceitouTermos}
            aria-describedby={errors.aceitouTermos ? 'termos-erro' : undefined}
          />
          <span className="text-sm text-gray-700 leading-relaxed">
            Li e concordo com os{' '}
            <a href="#" className="text-bnb-azul-claro underline hover:text-bnb-azul">
              Termos de Uso
            </a>{' '}
            e a{' '}
            <a href="#" className="text-bnb-azul-claro underline hover:text-bnb-azul">
              Política de Privacidade
            </a>
            . Declaro que as informações acima são verdadeiras e que sou o titular
            da conta informada.
          </span>
        </label>
        {errors.aceitouTermos && (
          <p id="termos-erro" className="text-red-600 text-sm mt-2" role="alert">
            {errors.aceitouTermos.message}
          </p>
        )}
      </div>

      {/* Erro de envio */}
      {erroEnvio && (
        <div
          className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3"
          role="alert"
          aria-live="assertive"
        >
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-red-700 text-sm">{erroEnvio}</p>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={enviando}
        className="w-full bg-bnb-azul text-white font-semibold py-3 px-6 rounded-lg hover:bg-bnb-azul-claro transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base"
      >
        {enviando ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Enviando solicitação...
          </>
        ) : (
          'Solicitar Encerramento de Conta'
        )}
      </button>

      <p className="text-xs text-gray-400 text-center">
        🔒 Seus dados são protegidos por criptografia. Nenhuma informação é armazenada sem seu consentimento.
      </p>
    </form>
  );
}
