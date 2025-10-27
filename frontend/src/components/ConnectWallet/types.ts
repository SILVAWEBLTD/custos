import type { ReactNode } from 'react';

export type WalletStatus = 'idle' | 'installing' | 'installed';

export interface WalletProvider {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export interface ConnectWalletProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: ReactNode;
}
