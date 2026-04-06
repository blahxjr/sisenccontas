import axios from 'axios';

/**
 * Cliente HTTP centralizado para chamadas à API do EncerraDigital.
 * Nunca expõe stack trace ou detalhes internos ao usuário.
 */
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3333/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => response,
  (erro) => {
    const status = erro.response?.status as number | undefined;
    const mensagemApi = erro.response?.data?.message;

    if (status === 400) {
      const detalhe = Array.isArray(mensagemApi)
        ? mensagemApi.join(', ')
        : (mensagemApi ?? 'Dados inválidos. Verifique o formulário.');
      return Promise.reject(new Error(detalhe));
    }
    if (status === 404) {
      return Promise.reject(new Error('Solicitação não encontrada. Verifique o número de protocolo.'));
    }
    if (status === 429) {
      return Promise.reject(new Error('Muitas tentativas. Aguarde alguns minutos e tente novamente.'));
    }
    if (status !== undefined && status >= 500) {
      return Promise.reject(new Error('Serviço temporariamente indisponível. Tente mais tarde.'));
    }
    return Promise.reject(new Error('Não foi possível completar a operação. Verifique sua conexão.'));
  },
);
