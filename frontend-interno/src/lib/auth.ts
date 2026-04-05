import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

/** Operadores mock para desenvolvimento — substituir por OIDC/SAML corporativo em produção. */
const OPERADORES_MOCK = [
  { id: 'op001', nome: 'Ana Operadora', matricula: 'BNB0001', perfil: 'operador' as const },
  { id: 'sup001', nome: 'Carlos Supervisor', matricula: 'BNB0002', perfil: 'supervisor' as const },
];

export type PerfilUsuario = 'operador' | 'supervisor';

export interface UsuarioInterno {
  id: string;
  nome: string;
  matricula: string;
  perfil: PerfilUsuario;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'SSO BNB (Mock Dev)',
      credentials: {
        matricula: { label: 'Matrícula', type: 'text', placeholder: 'BNB0001' },
        senha: { label: 'Senha (qualquer em dev)', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.matricula) return null;
        const operador = OPERADORES_MOCK.find(
          (o) => o.matricula === credentials.matricula.toUpperCase(),
        );
        if (!operador) return null;
        return {
          id: operador.id,
          name: operador.nome,
          email: `${operador.matricula}@bnb.gov.br`,
        };
      },
    }),
  ],
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.sub = user.id;
      return token;
    },
    async session({ session, token }) {
      const operador = OPERADORES_MOCK.find((o) => o.id === token.sub);
      if (operador && session.user) {
        (session.user as UsuarioInterno & { email: string; name: string }).matricula =
          operador.matricula;
        (session.user as UsuarioInterno & { email: string; name: string }).perfil =
          operador.perfil;
      }
      return session;
    },
  },
  /** 8 horas — padrão de sessão bancária. */
  session: { strategy: 'jwt', maxAge: 8 * 60 * 60 },
};
