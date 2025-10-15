'use client';

import * as React from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

type WalletStatus = 'idle' | 'installing' | 'installed';

interface WalletProvider {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

const walletProviders: WalletProvider[] = [
  {
    id: 'metamask',
    name: 'MetaMask',
    description: 'Connect to your MetaMask wallet',
    icon: '/WalletProviders/metamask.svg.png',
    color: 'bg-gray-800',
  },
  {
    id: 'walletconnect',
    name: 'WalletConnect',
    description: 'Scan with WalletConnect to connect',
    icon: '/WalletProviders/walletconnect.svg',
    color: 'bg-gray-800',
  },
  {
    id: 'coinbase',
    name: 'Coinbase Wallet',
    description: 'Connect to your Coinbase wallet',
    icon: '/WalletProviders/coinbase.svg',
    color: 'bg-gray-800',
  },
  {
    id: 'ledger',
    name: 'Ledger',
    description: 'Connect to your Ledger hardware wallet',
    icon: '/WalletProviders/ledger.svg',
    color: 'bg-gray-800',
  },
  {
    id: 'uniswap',
    name: 'Uniswap Wallet',
    description: 'Connect to your Uniswap wallet',
    icon: '/WalletProviders/uniswap.svg',
    color: 'bg-pink-200',
  },
];

interface ConnectWalletProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
}

export default function ConnectWallet({
  open,
  onOpenChange,
  trigger,
}: ConnectWalletProps) {
  const [walletStatuses, setWalletStatuses] = React.useState<
    Record<string, WalletStatus>
  >({});

  const handleConnect = (walletId: string) => {
    // Simulate connection flow
    setWalletStatuses((prev) => ({ ...prev, [walletId]: 'installing' }));

    setTimeout(() => {
      setWalletStatuses((prev) => ({ ...prev, [walletId]: 'installed' }));
    }, 1500);
  };

  const getButtonText = (walletId: string): string => {
    const status = walletStatuses[walletId] || 'idle';
    switch (status) {
      case 'installing':
        return 'Installing...';
      case 'installed':
        return 'Installed';
      default:
        return 'Connect';
    }
  };

  const getButtonVariant = (
    walletId: string
  ): 'default' | 'outline' | 'secondary' => {
    const status = walletStatuses[walletId] || 'idle';
    if (status === 'installed') return 'secondary';
    return 'outline';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger}
      <DialogContent className="max-w-md bg-black border-gray-700">
        {/* Header with title and close button */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-700">
          <DialogTitle className="text-white text-xl font-semibold">
            Connect Wallet
          </DialogTitle>
        </div>

        {/* Wallet providers list */}
        <div className="space-y-3 py-4">
          {walletProviders.map((wallet) => (
            <div
              key={wallet.id}
              className="flex items-center justify-between p-4 border border-gray-700 rounded-lg bg-black hover:bg-gray-800/50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-10 h-10 rounded-full ${wallet.color} flex items-center justify-center text-white font-bold`}
                >
                  {wallet.icon.startsWith('/') ? (
                    <Image
                      src={wallet.icon}
                      alt={wallet.name}
                      width={24}
                      height={24}
                      className="w-6 h-6"
                    />
                  ) : (
                    wallet.icon
                  )}
                </div>
                <div>
                  <div className="font-medium text-white">{wallet.name}</div>
                  <div className="text-sm text-gray-400">
                    {wallet.description}
                  </div>
                </div>
              </div>
              <Button
                variant={getButtonVariant(wallet.id)}
                size="sm"
                onClick={() => handleConnect(wallet.id)}
                disabled={walletStatuses[wallet.id] === 'installing'}
                className="border-gray-700 bg-black text-gray-200 hover:bg-gray-800 hover:text-white"
              >
                {getButtonText(wallet.id)}
              </Button>
            </div>
          ))}
        </div>

        {/* Footer with request new wallet button */}
        <div className="pt-4 border-t border-gray-700">
          <Button
            variant="outline"
            className="w-full border-gray-700 bg-black text-gray-200 hover:bg-gray-800 hover:text-white"
            onClick={() => {
              console.log('Request new wallet clicked');
            }}
          >
            Request new wallet
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
