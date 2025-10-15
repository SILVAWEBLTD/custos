import { createConfig, http } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';
// import { coinbaseWallet } from 'wagmi/connectors';
import { walletConnect } from 'wagmi/connectors';

// Get projectId from environment variable
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

if (!projectId) {
  throw new Error(
    'NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not defined in environment variables'
  );
}

export const config = createConfig({
  chains: [mainnet, sepolia],
  connectors: [
    injected(),
    walletConnect({
      projectId,
      metadata: {
        name: 'Custos',
        description: 'Web3 DApp',
        url: 'https://silvaweb.org',
        icons: ['https://silvaweb.org/favicon.ico'],
      },
      showQrModal: true,
    }),
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});
