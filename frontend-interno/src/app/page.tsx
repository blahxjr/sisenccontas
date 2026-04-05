import { redirect } from 'next/navigation';

/** Redireciona a raiz para o dashboard (middleware garante autenticação). */
export default function Home() {
  redirect('/dashboard');
}
