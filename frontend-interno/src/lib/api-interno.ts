import axios from 'axios';
import { getSession } from 'next-auth/react';

/**
 * Cliente axios configurado para as rotas internas do backend.
 * Em produção, o header x-interno-token será substituído por Bearer JWT do OIDC corporativo.
 */
export const apiInterno = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3333/api',
  timeout: 15_000,
  withCredentials: true,
});

apiInterno.interceptors.request.use(async (config) => {
  const sessao = await getSession();
  if (sessao) {
    config.headers['x-interno-token'] = 'mock-token-dev';
  }
  return config;
});

apiInterno.interceptors.response.use(
  (r) => r,
  (erro) => {
    if (typeof window !== 'undefined') {
      if (erro.response?.status === 401) window.location.href = '/login';
      if (erro.response?.status === 403) window.location.href = '/sem-permissao';
    }
    return Promise.reject(new Error(erro.response?.data?.message ?? 'Erro na operação.'));
  },
);
