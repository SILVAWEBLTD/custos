'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { createWeb3Modal } from '@web3modal/wagmi/react';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config, projectId } from './config';

// Create queryClient
const queryClient = new QueryClient();

// Track if Web3Modal has been created
let modalCreated = false;

export function Web3ModalProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Create Web3Modal only once on client mount
    if (!modalCreated) {
      createWeb3Modal({
        wagmiConfig: config,
        projectId,
        enableAnalytics: true,
        themeMode: 'dark',
        // Featured wallets to show first (dialog will be scrollable with many wallets)
        featuredWalletIds: [
          'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96', // MetaMask
          '971e689d0a5be527bac79629b4ee9b925e82208e5168b733496a09c0faed0709', // OKEx Wallet
          '19177a98252e07ddfc9af2083ba8e07ef627cb6103467ffebb3f8f4205fd7927', // Ledger
          'f2436c67184f158d1beda5df53298ee84abfc367581e4505134b5bcf5f46697d', // Binance
          'c03dfee351b6fcc421b4494ea33b9d4b92a984f87aa76d1663bb28705e95034a', // Uniswap Wallet
        ],
        // Exclude WalletConnect from appearing in the list
        excludeWalletIds: [
          '2a3c89040ac3b723a1972a33a125b1db11e258a6975d3a61252cd64e6ea5ea01', // WalletConnect (old)
          'fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa', // WalletConnect (new)
          '38f5d18bd8522c244bdd70cb4a68e0e718865155811c043f052fb9f1c51de662', // WalletConnect v2
        ],
        // Hide help button and customize appearance
        enableOnramp: false,
        themeVariables: {
          '--w3m-font-family': '"Geist", "Geist Fallback"',
          '--w3m-accent': '#6C47FF',
          '--w3m-border-radius-master': '1px',
        },
      });
      modalCreated = true;
    }
    setMounted(true);
  }, []);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {mounted ? children : null}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
