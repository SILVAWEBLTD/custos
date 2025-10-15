import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { appToast } from './toast-factory';
import { coinbaseWallet, walletConnect, injected } from 'wagmi/connectors';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getWalletConnectProjectId = (): string => {
  const projectId = process.env.WALLETCONNECT_PROJECT_ID;

  // If projectId is not defined, throw an error
  if (typeof window !== 'undefined' && !projectId) {
    throw new Error('Project ID is not defined');
  }

  return projectId || process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '';
};

export const createWeb3ModalConnectors = (metadata: any) => {
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
