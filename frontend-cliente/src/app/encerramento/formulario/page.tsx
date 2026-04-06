import Link from 'next/link';
import { FormularioEncerramento } from '@components/encerramento/FormularioEncerramento';

export default function FormularioPage() {
  return (
    <div className="max-w-xl mx-auto space-y-6">
      <nav className="text-sm text-gray-500">
        <Link href="/" className="hover:text-bnb-vermelho">
          Início
        </Link>
        {' › '}
        <span className="text-gray-700">Encerramento de Conta</span>
      </nav>

      <div>
        <h1 className="text-2xl font-bold text-bnb-vermelho">Solicitação de Encerramento</h1>
        <p className="text-gray-600 mt-1 text-sm">
          Preencha os campos abaixo para registrar sua solicitação de encerramento de conta corrente.
        </p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
        <strong>Atenção:</strong> Certifique-se de que não há débitos, cheques pendentes
        ou tarifas em aberto antes de solicitar o encerramento.
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <FormularioEncerramento />
      </div>
    </div>
  );
}
