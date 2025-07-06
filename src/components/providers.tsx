'use client';

import { SessionProvider } from 'next-auth/react';
import type { ReactNode } from 'react';

type Props = {
  readonly children: ReactNode;
};

export default function Providers({ children }: Props) {
  return <SessionProvider>{children}</SessionProvider>;
}
