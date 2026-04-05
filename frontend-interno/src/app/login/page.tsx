'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';

/** Página de login do painel interno BNB com autenticação mock SSO. */
export default function LoginPage() {
  const [matricula, setMatricula] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    const resultado = await signIn('credentials', {
      matricula,
      senha,
      callbackUrl: '/dashboard',
      redirect: false,
    });

    setCarregando(false);

    if (resultado?.error) {
      setErro('Matrícula não encontrada. Use BNB0001 ou BNB0002.');
    } else if (resultado?.url) {
      window.location.href = resultado.url;
    }
  }

  return (
    <div className="min-h-screen bg-bnb-azul flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8">
        {/* Logo BNB */}
        <div className="text-center mb-8">
          <div className="inline-block bg-bnb-azul rounded-lg px-6 py-3 mb-4">
            <span className="text-white text-2xl font-bold tracking-wider">
              BN<span className="text-bnb-amarelo">B</span>
            </span>
          </div>
          <h1 className="text-xl font-bold text-bnb-azul">EncerraDigital</h1>
          <p className="text-sm text-gray-500 mt-1">Painel Interno — Acesso Restrito</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="matricula" className="block text-sm font-medium text-gray-700 mb-1">
              Matrícula BNB
            </label>
            <input
              id="matricula"
              type="text"
              value={matricula}
              onChange={(e) => setMatricula(e.target.value)}
              placeholder="BNB0001"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-bnb-azul-claro"
            />
          </div>

          <div>
            <label htmlFor="senha" className="block text-sm font-medium text-gray-700 mb-1">
              Senha
            </label>
            <input
              id="senha"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-bnb-azul-claro"
            />
          </div>

          {erro && (
            <p role="alert" className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
              {erro}
            </p>
          )}

          <button
            type="submit"
            disabled={carregando}
            className="w-full bg-bnb-azul text-white py-3 rounded-lg font-semibold text-sm hover:bg-bnb-azul-claro transition-colors disabled:opacity-60"
          >
            {carregando ? 'Autenticando…' : 'Entrar com SSO BNB'}
          </button>
        </form>

        <div className="mt-6 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-xs text-amber-800 font-medium">Ambiente de desenvolvimento</p>
          <p className="text-xs text-amber-700 mt-1">
            Use matrícula <strong>BNB0001</strong> (operador) ou <strong>BNB0002</strong>{' '}
            (supervisor). Qualquer senha é aceita.
          </p>
        </div>
      </div>
    </div>
  );
}
