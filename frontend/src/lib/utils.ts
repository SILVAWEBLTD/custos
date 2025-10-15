import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { appToast } from './toast-factory';
import { coinbaseWallet, walletConnect, injected } from 'wagmi/connectors';

type TMetadata = {
  name: string;
  description: string;
  url: string;
  icons: string[];
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getWalletConnectProjectId = (): string => {
  return (
    process.env.WALLETCONNECT_PROJECT_ID ||
    process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ||
    ''
  );
};

export const createWeb3ModalConnectors = (metadata: TMetadata) => {
  const projectId = getWalletConnectProjectId();
  if (!projectId) {
    throw new Error('WalletConnect Project ID is not defined');
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

/**
 * Copy text to clipboard and show a toast notification
 */
export async function copyToClipboard(text: string, successMessage?: string) {
  try {
    await navigator.clipboard.writeText(text);
    appToast.success(successMessage || 'Copied!', text);
  } catch {
    appToast.error('Failed to copy to clipboard');
  }
}
