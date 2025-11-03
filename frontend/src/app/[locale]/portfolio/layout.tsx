import type { Metadata } from 'next';
import { type ReactNode } from 'react';

import { Toaster } from '@/components/ui/sonner';

export const metadata: Metadata = {
  title: 'Custos Portfolio',
  description: 'Portfolio dashboard',
};

export default function PortfolioLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <Toaster />
    </>
  );
}
