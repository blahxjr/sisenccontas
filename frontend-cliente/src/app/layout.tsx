import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Encerramento de Conta — Banco Regional de Fomento',
  description:
    'Solicite o encerramento da sua conta corrente no Banco Regional de Fomento de forma digital, rápida e segura.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-gray-50 min-h-screen font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
