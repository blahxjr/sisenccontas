import Link from 'next/link';

/**
 * Layout principal da aplicação pública — inclui header BNB, container max-w-4xl e footer.
 * Aplicado apenas às rotas do grupo (main): home e encerramento.
 */
export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
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
        <span className="mx-2">·</span>
        <Link href="/demo" className="text-bnb-cinza hover:text-bnb-vermelho underline transition-colors">
          Ver demonstração técnica do sistema →
        </Link>
      </footer>
    </>
  );
}
