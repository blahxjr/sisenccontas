'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@lib/api-client';

export interface IAgencia {
  codigo: string;
  nome: string;
  municipio: string;
  uf: string;
}

export interface IMotivo {
  codigo: string;
  descricao: string;
}

/** Carrega os motivos de encerramento disponíveis da API. */
export function useMotivos() {
  const [motivos, setMotivos] = useState<IMotivo[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    apiClient
      .get<{ dados: IMotivo[] }>('/publico/catalogos/motivos')
      .then((r) => setMotivos(r.data.dados))
      .catch(() => setMotivos([]))
      .finally(() => setCarregando(false));
  }, []);

  return { motivos, carregando };
}

/** Carrega a lista de UFs com agências BRF disponíveis. */
export function useUfs() {
  const [ufs, setUfs] = useState<string[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    apiClient
      .get<{ dados: string[] }>('/publico/catalogos/agencias/ufs')
      .then((r) => setUfs(r.data.dados))
      .catch(() => setUfs([]))
      .finally(() => setCarregando(false));
  }, []);

  return { ufs, carregando };
}

/**
 * Carrega agências BRF filtradas pela UF selecionada.
 * Retorna lista vazia se nenhuma UF for fornecida.
 */
export function useAgencias(uf?: string) {
  const [agencias, setAgencias] = useState<IAgencia[]>([]);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    if (!uf) {
      setAgencias([]);
      return;
    }
    setCarregando(true);
    apiClient
      .get<{ dados: IAgencia[] }>(`/publico/catalogos/agencias?uf=${encodeURIComponent(uf)}`)
      .then((r) => setAgencias(r.data.dados))
      .catch(() => setAgencias([]))
      .finally(() => setCarregando(false));
  }, [uf]);

  return { agencias, carregando };
}
