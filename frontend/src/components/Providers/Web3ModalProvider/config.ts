import { http, createConfig } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { coinbaseWallet, walletConnect, injected } from 'wagmi/connectors';
import { cookieStorage, createStorage } from 'wagmi';

export const projectId: string =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '';

console.log('Project ID:', process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID);

// Check if API is avail
if (typeof window !== 'undefined' && !projectId)
  throw new Error('Project ID is not defined');

const metadata = {
  name: 'Custos',
  description: 'DeFi platform',
  url: 'https://silvaweb.org',
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
};

const chains = [mainnet, sepolia] as const;

// Only create connectors on the client side
const getConnectors = () => {
  if (typeof window === 'undefined') {
    return [];
  }

  return [
    walletConnect({
      projectId,
      metadata,
      showQrModal: false,
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
