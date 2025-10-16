'use client';

import { http, createConfig } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { coinbaseWallet, walletConnect, injected } from 'wagmi/connectors';
import { cookieStorage, createStorage } from 'wagmi';

const metadata = {
  name: 'Custos',
  description: 'DeFi platform',
  url: 'https://silvaweb.org',
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
};

const chains = [mainnet, sepolia] as const;

export const WALLET_CONNECT_PROJECT_ID =
  process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '';

// Only create connectors on the client side
const getConnectors = () => {
  if (typeof window === 'undefined') {
    return [];
  }

  return [
    walletConnect({
      projectId: WALLET_CONNECT_PROJECT_ID,
      metadata,
      showQrModal: true,
    }),
    injected({ shimDisconnect: true }),
    coinbaseWallet({
      appName: metadata.name,
      appLogoUrl: metadata.icons[0],
    }),
  ];
};

export const config = createConfig({
  chains,
  connectors: getConnectors(),
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});
