import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="space-y-10">
      <section className="text-center space-y-3">
        <h1 className="text-3xl font-bold text-bnb-azul">
          Encerramento de Conta Corrente
        </h1>
        <p className="text-gray-600 max-w-xl mx-auto">
          Solicite o encerramento da sua conta de forma digital, sem precisar ir à agência.
          Escolha como prefere continuar:
        </p>
      </section>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Formulário */}
        <Link
          href="/encerramento/formulario"
          className="group block bg-white border-2 border-bnb-azul rounded-xl p-8 hover:bg-bnb-azul hover:text-white transition-all duration-200 shadow-sm hover:shadow-lg"
        >
          <div className="space-y-3">
            <div className="text-4xl">📋</div>
            <h2 className="text-xl font-semibold text-bnb-azul group-hover:text-white">
              Formulário Digital
            </h2>
            <p className="text-gray-600 group-hover:text-blue-100 text-sm">
              Preencha os campos com suas informações e solicite o encerramento diretamente.
              Ideal para quem prefere preencher no próprio ritmo.
            </p>
            <span className="inline-block mt-2 text-sm font-medium text-bnb-azul-claro group-hover:text-white">
              Acessar formulário →
            </span>
          </div>
        </Link>

        {/* Chatbot — Fase 5 */}
        <div className="block bg-white border-2 border-gray-200 rounded-xl p-8 shadow-sm opacity-60 cursor-not-allowed">
          <div className="space-y-3">
            <div className="text-4xl">🤖</div>
            <h2 className="text-xl font-semibold text-gray-500">
              Assistente Virtual
            </h2>
            <p className="text-gray-400 text-sm">
              Seja guiado passo a passo por um assistente conversacional que facilita
              o preenchimento dos dados de encerramento.
            </p>
            <span className="inline-block mt-2 text-xs font-medium bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
              Em breve
            </span>
          </div>
        </div>
      </div>

      <section className="bg-blue-50 border border-blue-100 rounded-xl p-6 text-sm text-gray-700 space-y-2">
        <p className="font-semibold text-bnb-azul">ℹ️ Como funciona o processo?</p>
        <ol className="list-decimal list-inside space-y-1 text-gray-600">
          <li>Preencha o formulário com os dados da sua conta</li>
          <li>Aceite os termos de uso e política de privacidade</li>
          <li>Receba o número de protocolo para acompanhamento</li>
          <li>Nossa equipe processará sua solicitação em até 5 dias úteis</li>
        </ol>
      </section>
    </div>
  );
}
