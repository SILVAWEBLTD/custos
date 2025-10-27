import { toast } from 'sonner';

/**
 * Toast factory for wallet-related notifications
 * Provides a consistent API for showing toast messages throughout the application
 */
export const walletToast = {
  /**
   * Show a loading toast when wallet connection is initiated
   */
  connecting: (walletName?: string) => {
    const cleanName = walletName?.trim();
    const message = cleanName ? `Connecting to ${cleanName}...` : 'Connecting wallet...';

    return toast.loading(message, {
      id: 'wallet-connecting',
      duration: Infinity, // Keep showing until dismissed
    });
  },

  /**
   * Show a success toast when wallet is connected
   */
  connected: (address: string, walletName?: string) => {
    // Dismiss any connecting toast first
    toast.dismiss('wallet-connecting');

    const formattedAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;
    const cleanName = walletName?.trim();
    const message = cleanName ? `${cleanName} connected` : 'Wallet connected';

    return toast.success(message, {
      description: formattedAddress,
      duration: 4000,
    });
  },

  /**
   * Show an info toast when wallet is disconnected
   */
  disconnected: (walletName?: string) => {
    const cleanName = walletName?.trim();
    const message = cleanName ? `${cleanName} disconnected` : 'Wallet disconnected';

    return toast.success(message, {
      duration: 3000,
    });
  },

  /**
   * Show an error toast for wallet connection failures
   */
  error: (message: string) => {
    // Dismiss any connecting toast first
    toast.dismiss('wallet-connecting');

    return toast.error('Connection failed', {
      description: message,
      duration: 5000,
    });
  },

  /**
   * Show a loading toast when switching chains
   */
  switchingChain: (chainName: string) => {
    return toast.loading(`Switching to ${chainName}...`, {
      id: 'chain-switching',
      duration: Infinity,
    });
  },

  /**
   * Show a success toast when chain is switched
   */
  chainSwitched: (chainName: string) => {
    toast.dismiss('chain-switching');

    return toast.success('Network changed', {
      description: `Switched to ${chainName}`,
      duration: 3000,
    });
  },

  /**
   * Show an error toast for chain switching failures
   */
  chainSwitchError: (message: string) => {
    toast.dismiss('chain-switching');

    return toast.error('Network switch failed', {
      description: message,
      duration: 5000,
    });
  },

  /**
   * Show a warning toast for general wallet warnings
   */
  warning: (message: string, description?: string) => {
    return toast.warning(message, {
      description,
      duration: 4000,
    });
  },

  /**
   * Show an info toast for general wallet information
   */
  info: (message: string, description?: string) => {
    return toast.info(message, {
      description,
      duration: 3000,
    });
  },
};

/**
 * Generic toast utilities that can be used anywhere in the app
 */
export const appToast = {
  success: (message: string, description?: string) => {
    return toast.success(message, {
      description,
      duration: 4000,
    });
  },

  error: (message: string, description?: string) => {
    return toast.error(message, {
      description,
      duration: 5000,
    });
  },

  info: (message: string, description?: string) => {
    return toast.info(message, {
      description,
      duration: 3000,
    });
  },

  warning: (message: string, description?: string) => {
    return toast.warning(message, {
      description,
      duration: 4000,
    });
  },

  loading: (message: string, options?: { id?: string }) => {
    return toast.loading(message, {
      id: options?.id,
      duration: Infinity,
    });
  },

  promise: <T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: Error) => string);
    },
  ) => {
    return toast.promise(promise, messages);
  },
};
