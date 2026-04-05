'use client';

import { useState, useRef } from 'react';
import { Upload, CheckCircle, AlertCircle, FileText, Loader2, X } from 'lucide-react';
import { apiClient } from '@lib/api-client';

type Estado = 'idle' | 'selecionado' | 'enviando' | 'sucesso' | 'erro';

interface Props {
  /** ID (UUID) da solicitação — necessário para montar a URL de upload. */
  solicitacaoId: string;
}

const TAMANHO_MAX_MB = 10;
const TAMANHO_MAX_BYTES = TAMANHO_MAX_MB * 1024 * 1024;

/**
 * Componente de upload do Termo de Encerramento assinado pelo cliente.
 * Aceita apenas PDF. Valida tamanho no frontend e exibe progresso de envio.
 */
export function UploadTermoAssinado({ solicitacaoId }: Props) {
  const [estado, setEstado] = useState<Estado>('idle');
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [progresso, setProgresso] = useState(0);
  const [documentoId, setDocumentoId] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function selecionarArquivo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setErro(null);

    if (file.type !== 'application/pdf') {
      setErro('Apenas arquivos PDF são aceitos.');
      return;
    }
    if (file.size > TAMANHO_MAX_BYTES) {
      setErro(`O arquivo excede o tamanho máximo de ${TAMANHO_MAX_MB} MB.`);
      return;
    }

    setArquivo(file);
    setEstado('selecionado');
  }

  function removerArquivo() {
    setArquivo(null);
    setEstado('idle');
    setErro(null);
    setProgresso(0);
    if (inputRef.current) inputRef.current.value = '';
  }

  async function enviar() {
    if (!arquivo) return;

    setEstado('enviando');
    setProgresso(0);
    setErro(null);

    const formData = new FormData();
    formData.append('arquivo', arquivo);

    try {
      const resposta = await apiClient.post<{ mensagem: string; documentoId: string }>(
        `/publico/solicitacoes/${solicitacaoId}/documentos/upload`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (event) => {
            if (event.total) {
              setProgresso(Math.round((event.loaded * 100) / event.total));
            }
          },
        },
      );
      setDocumentoId(resposta.data.documentoId);
      setEstado('sucesso');
    } catch (e: unknown) {
      setEstado('erro');
      setErro(e instanceof Error ? e.message : 'Erro ao enviar o arquivo. Tente novamente.');
    }
  }

  if (estado === 'sucesso') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center space-y-3">
        <CheckCircle className="h-10 w-10 text-green-600 mx-auto" />
        <p className="font-semibold text-green-800">Termo recebido com sucesso!</p>
        <p className="text-sm text-gray-600">Aguarde a análise da nossa equipe.</p>
        {documentoId && (
          <p className="text-xs text-gray-400 font-mono">ID: {documentoId}</p>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
      <h3 className="font-semibold text-bnb-azul flex items-center gap-2">
        <Upload size={18} />
        Enviar Termo Assinado
      </h3>

      <p className="text-sm text-gray-600">
        Após assinar o termo via <strong>gov.br</strong>, faça o upload do PDF assinado aqui.
        Apenas PDF, máximo de {TAMANHO_MAX_MB} MB.
      </p>

      {/* Área de seleção */}
      {estado === 'idle' && (
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-8 cursor-pointer hover:border-bnb-azul-claro hover:bg-gray-50 transition-colors">
          <Upload className="text-gray-400 mb-2" size={32} />
          <span className="text-sm font-medium text-gray-600">
            Clique para selecionar o PDF assinado
          </span>
          <span className="text-xs text-gray-400 mt-1">Máximo {TAMANHO_MAX_MB} MB</span>
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            onChange={selecionarArquivo}
            className="hidden"
            aria-label="Selecionar arquivo PDF do termo assinado"
          />
        </label>
      )}

      {/* Arquivo selecionado */}
      {(estado === 'selecionado' || estado === 'enviando') && arquivo && (
        <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
          <div className="flex items-center gap-3">
            <FileText className="text-bnb-azul" size={20} />
            <div>
              <p className="text-sm font-medium text-gray-800 truncate max-w-xs">
                {arquivo.name}
              </p>
              <p className="text-xs text-gray-400">
                {(arquivo.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          {estado === 'selecionado' && (
            <button
              onClick={removerArquivo}
              className="text-gray-400 hover:text-red-500 transition-colors"
              aria-label="Remover arquivo selecionado"
            >
              <X size={18} />
            </button>
          )}
        </div>
      )}

      {/* Barra de progresso */}
      {estado === 'enviando' && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Enviando…</span>
            <span>{progresso}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-bnb-azul-claro h-2 rounded-full transition-all duration-200"
              style={{ width: `${progresso}%` }}
              role="progressbar"
              aria-valuenow={progresso}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        </div>
      )}

      {/* Erro */}
      {erro && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          <AlertCircle size={16} />
          {erro}
        </div>
      )}

      {/* Botão de enviar */}
      {estado === 'selecionado' && (
        <button
          onClick={enviar}
          className="w-full bg-bnb-azul text-white py-3 px-6 rounded-lg font-medium hover:bg-bnb-azul-claro transition-colors flex items-center justify-center gap-2"
        >
          <Upload size={18} />
          Enviar Termo Assinado
        </button>
      )}

      {estado === 'enviando' && (
        <button disabled className="w-full bg-bnb-azul/50 text-white py-3 px-6 rounded-lg font-medium flex items-center justify-center gap-2 cursor-not-allowed">
          <Loader2 size={18} className="animate-spin" />
          Enviando…
        </button>
      )}

      {estado === 'erro' && (
        <button
          onClick={removerArquivo}
          className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          Tentar novamente
        </button>
      )}
    </div>
  );
}
