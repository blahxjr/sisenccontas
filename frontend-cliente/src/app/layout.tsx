import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Encerramento de Conta — Banco do Nordeste',
  description:
    'Solicite o encerramento da sua conta corrente no Banco do Nordeste de forma digital, rápida e segura.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-gray-50 min-h-screen font-sans antialiased">
        <header className="bg-bnb-vermelho text-white shadow-md">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
            <div className="w-8 h-8 bg-bnb-amarelo rounded-full flex items-center justify-center font-bold text-bnb-vermelho text-sm">
              BNB
            </div>
            <span className="font-semibold text-lg tracking-wide">Banco do Nordeste</span>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-4 py-8">{children}</main>
        <footer className="mt-16 border-t border-gray-200 py-6 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Banco do Nordeste do Brasil S.A. — CNPJ 07.237.373/0001-20
        </footer>
      </body>
    </html>
  );
}
