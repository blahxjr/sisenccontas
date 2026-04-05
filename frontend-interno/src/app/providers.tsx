'use client';

import { SessionProvider } from 'next-auth/react';

/** Wrapper de providers client-side para o App Router do Next.js. */
export function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
