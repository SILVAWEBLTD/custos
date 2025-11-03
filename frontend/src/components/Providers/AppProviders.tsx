'use client';

import { type ReactNode, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { Web3ModalProvider } from './Web3ModalProvider';

export function AppProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <Web3ModalProvider>{children}</Web3ModalProvider>
    </QueryClientProvider>
  );
}
