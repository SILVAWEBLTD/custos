import type { TokensApiMeta } from '@/types/token-table';

const DEFAULT_CURRENCY = 'USD';
export const DEFAULT_PAGE_SIZE = 20;
export const SEARCH_DEBOUNCE_MS = 300;
export const REFRESH_INTERVAL_MS = 5 * 60 * 1000;

export function formatCurrency(value: number | null, options?: Intl.NumberFormatOptions) {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return '—';
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: DEFAULT_CURRENCY,
    maximumFractionDigits: value < 1 ? 4 : 2,
    ...options,
  }).format(value);
}

export function formatNumber(value: number | null, options?: Intl.NumberFormatOptions) {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return '—';
  }

  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 2,
    ...options,
  }).format(value);
}

export function formatPercentage(value: number | null, fractionDigits = 2) {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return '—';
  }

  const formatted = value.toFixed(fractionDigits);
  return `${value > 0 ? '+' : ''}${formatted}%`;
}

export function isPositiveChange(value: number | null): boolean {
  return typeof value === 'number' && !Number.isNaN(value) && value > 0;
}

export function buildNetworkOptions(meta: TokensApiMeta | null, allLabel: string) {
  const baseOptions = meta?.availableNetworks ?? [];
  return [
    { id: 'all', label: allLabel, count: baseOptions.reduce((acc, item) => acc + item.count, 0) },
    ...baseOptions,
  ];
}

export function formatLastUpdated(timestamp: string | undefined | null) {
  if (!timestamp) {
    return null;
  }

  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

export function clampCursor(value: number, limit: number) {
  if (value <= 0) {
    return 0;
  }
  const remainder = value % limit;
  return remainder === 0 ? value : value - remainder;
}
