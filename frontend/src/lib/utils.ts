import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { appToast } from './toast-factory';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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
