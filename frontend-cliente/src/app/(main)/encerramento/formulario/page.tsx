"use client";

import { useState } from "react";
import Link from "next/link";
import { MessageCircle, FileText } from "lucide-react";
import { FormularioEncerramento } from "@components/encerramento/FormularioEncerramento";
import { ChatbotEncerramento } from "@components/encerramento/ChatbotEncerramento";

export default function FormularioPage() {
  const [modo, setModo] = useState<"chatbot" | "formulario">("chatbot");

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <nav className="text-sm text-gray-500">
        <Link href="/" className="hover:text-brf-vermelho">
          Início
        </Link>
        {" › "}
        <span className="text-gray-700">Encerramento de Conta</span>
      </nav>

      <div>
        <h1 className="text-2xl font-bold text-brf-vermelho">
          Solicitação de Encerramento
        </h1>
        <p className="text-gray-600 mt-1 text-sm">
          Preencha os campos abaixo para registrar sua solicitação de
          encerramento de conta corrente.
        </p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
        <strong>Atenção:</strong> Certifique-se de que não há débitos, cheques
        pendentes ou tarifas em aberto antes de solicitar o encerramento.
      </div>

      {/* Toggle chatbot / formulário */}
      <div className="flex items-center gap-2 mb-6 p-1 bg-gray-100 rounded-full w-fit mx-auto">
        <button
          onClick={() => setModo("chatbot")}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
            modo === "chatbot"
              ? "bg-brf-vermelho text-white shadow-sm"
              : "text-gray-600 hover:text-brf-vermelho"
          }`}
        >
          <MessageCircle className="w-4 h-4" />
          Assistente
        </button>
        <button
          onClick={() => setModo("formulario")}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
            modo === "formulario"
              ? "bg-brf-vermelho text-white shadow-sm"
              : "text-gray-600 hover:text-brf-vermelho"
          }`}
        >
          <FileText className="w-4 h-4" />
          Formulário
        </button>
      </div>
      <p className="text-center text-xs text-gray-400 mb-4">
        Prefere preencher manualmente? Use o formulário tradicional.
      </p>

      {modo === "chatbot" ? (
        <ChatbotEncerramento />
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <FormularioEncerramento />
        </div>
      )}
    </div>
  );
}
