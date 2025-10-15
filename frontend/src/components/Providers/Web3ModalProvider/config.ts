import { http, createConfig } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { createWeb3ModalConnectors } from '@/lib/utils';
import { cookieStorage, createStorage } from 'wagmi';

const metadata = {
  name: 'Custos',
  description: 'DeFi platform',
  url: 'https://silvaweb.org',
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
};

const chains = [mainnet, sepolia] as const;

export const config = createConfig({
  chains,
  connectors: createWeb3ModalConnectors(metadata),
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});
