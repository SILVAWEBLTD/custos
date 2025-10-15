import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { appToast } from './toast-factory';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function copyToClipboard(text: string, successMessage?: string) {
  try {
    await navigator.clipboard.writeText(text);
    appToast.success(successMessage || 'Copied!', text);
  } catch {
    appToast.error('Failed to copy to clipboard');
  }
}
