import type { Metadata } from 'next';
import { type ReactNode } from 'react';

import { Web3ModalProvider } from '@/components/Providers/Web3ModalProvider';
import { Toaster } from '@/components/ui/sonner';

export const metadata: Metadata = {
  title: 'Custos Portfolio',
  description: 'Portfolio dashboard',
};

export default function PortfolioLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <Web3ModalProvider>{children}</Web3ModalProvider>
      <Toaster />
    </>
  );
}
