import { http, createConfig } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { createWeb3ModalConnectors } from '@/lib/utils';
import { cookieStorage, createStorage } from 'wagmi';

// export const walletConnectProjectId: string =
//   process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ||
//   process.env.WALLETCONNECT_PROJECT_ID ||
//   '';

// console.log(
//   'WalletConnect Project without public ID:',
//   process.env.PUBLIC_WALLETCONNECT_PROJECT_ID
// );

// Check if API is reachable from window and walletConnectProjectId is not defined
// if (typeof window !== 'undefined' && !walletConnectProjectId)
//   throw new Error('Project ID is not defined');

const metadata = {
  name: 'Custos',
  description: 'DeFi platform',
  url: 'https://silvaweb.org',
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
};

const chains = [mainnet, sepolia] as const;

// Only create connectors on the client side
const connectors = createWeb3ModalConnectors(metadata);

export const config = createConfig({
  chains,
  connectors: connectors,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});
