'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { createWeb3Modal } from '@web3modal/wagmi/react';
import { WagmiProvider, useAccount, useAccountEffect, useChainId } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config, WALLET_CONNECT_PROJECT_ID } from './config';
import { walletToast } from '@/lib/toast-factory';
import { toast } from 'sonner';

// Create queryClient
const queryClient = new QueryClient();

// Track if Web3Modal has been created
let modalCreated = false;

// Chain name mapping
const CHAIN_NAMES: Record<number, string> = {
  1: 'Ethereum Mainnet',
  11155111: 'Sepolia Testnet',
};

// Internal component to handle wallet connection events
function WalletConnectionListener() {
  const { isConnected, isConnecting, connector } = useAccount();
  const chainId = useChainId();
  const [previousChainId, setPreviousChainId] = useState<number | undefined>();
  const [wasConnected, setWasConnected] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [lastConnectorName, setLastConnectorName] = useState<
    string | undefined
  >();
  const [isModalInViewport, setIsModalInViewport] = useState(false);

  // Track previous connection state
  useEffect(() => {
    setWasConnected(isConnected);
  }, [isConnected]);

  // Set hasInteracted to true after a short delay (means initial load is done)
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasInteracted(true);
    }, 1000); // Wait 1 second after mount before considering interactions

    return () => clearTimeout(timer);
  }, []);

  // Detect Web3Modal in viewport (only after user has interacted)
  useEffect(() => {
    if (!hasInteracted) return;

    const checkModalInViewport = () => {
      // Check for Web3Modal elements that are actually visible
      const modalSelectors = ['[data-w3m-modal]', 'w3m-modal'];

      let modalExists = false;

      for (const selector of modalSelectors) {
        const element = document.querySelector(selector);
        if (element) {
          // Check if element is actually visible (not hidden)
          const style = window.getComputedStyle(element);
          const isVisible = style.opacity !== '0';

          if (isVisible) {
            modalExists = true;
            break;
          }
        }
      }

      // Update state and log
      setIsModalInViewport(modalExists);
    };

    // Check immediately
    checkModalInViewport();

    // Set up interval to check periodically
    const interval = setInterval(checkModalInViewport, 500);

    return () => {
      clearInterval(interval);
    };
  }, [hasInteracted]);

  // Dismiss connecting toast when modal is closed
  useEffect(() => {
    if (hasInteracted && !isModalInViewport && !isConnected) {
      toast.dismiss('wallet-connecting');
    }
  }, [isModalInViewport, isConnected, hasInteracted]);

  // Handle connection state changes - only show connecting toast for user-initiated actions
  useEffect(() => {
    // Only show connecting toast if:
    // 1. User has interacted (past initial load)
    // 2. Currently connecting
    // 3. Was not previously connected (to avoid showing on auto-reconnect)
    if (hasInteracted && isConnecting && !wasConnected) {
      walletToast.connecting(connector?.name);
    }
  }, [isConnecting, connector?.name, hasInteracted, wasConnected]);

  // Handle account changes (connect/disconnect/switch)
  useAccountEffect({
    onConnect(data) {
      if (data.address) {
        const connectorName = data.connector?.name;
        walletToast.connected(data.address, connectorName);
        setLastConnectorName(connectorName);
      }
    },
    onDisconnect() {
      walletToast.disconnected(lastConnectorName);
      setPreviousChainId(undefined);
      setLastConnectorName(undefined);
    },
  });

  // Handle chain switching
  useEffect(() => {
    if (
      isConnected &&
      chainId !== undefined &&
      previousChainId !== undefined &&
      chainId !== previousChainId
    ) {
      const chainName = CHAIN_NAMES[chainId] || `Chain ${chainId}`;
      walletToast.chainSwitched(chainName);
    }
    if (isConnected && chainId !== undefined) {
      setPreviousChainId(chainId);
    }
  }, [chainId, isConnected, previousChainId]);

  return null;
}

export function Web3ModalProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Create Web3Modal only once on client mount
    if (!modalCreated) {
      createWeb3Modal({
        wagmiConfig: config,
        projectId: '1f7ec19a11311c8e148ab385a70b35ce',
        enableAnalytics: true,
        themeMode: 'dark',
        featuredWalletIds: [
          'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96', // MetaMask
          '971e689d0a5be527bac79629b4ee9b925e82208e5168b733496a09c0faed0709', // OKEx Wallet
          '19177a98252e07ddfc9af2083ba8e07ef627cb6103467ffebb3f8f4205fd7927', // Ledger
          'f2436c67184f158d1beda5df53298ee84abfc367581e4505134b5bcf5f46697d', // Binance
          'c03dfee351b6fcc421b4494ea33b9d4b92a984f87aa76d1663bb28705e95034a', // Uniswap Wallet
        ],
        enableOnramp: false,
        themeVariables: {
          '--w3m-font-family': '"Geist", "Geist Fallback"',
          '--w3m-accent': '#FFF',
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
        <WalletConnectionListener />
        {mounted ? children : null}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
