import type { InputHTMLAttributes } from 'react';

import type { TokenSparklinePoint, TokenTableRow, TokensApiMeta } from '@/types/token-table';

export interface TokensTableProps {
  className?: string;
  pageSize?: number;
  initialNetwork?: string;
  refreshIntervalMs?: number;
}

export interface UseTokensDataOptions {
  pageSize?: number;
  initialNetwork?: string;
  refreshIntervalMs?: number;
}

export interface UseTokensDataResult {
  tokens: TokenTableRow[];
  meta: TokensApiMeta | null;
  status: 'idle' | 'loading' | 'success' | 'error';
  isLoading: boolean;
  isFetching: boolean;
  isRefetching: boolean;
  isPaginating: boolean;
  error: string | null;
  search: string;
  setSearch: (value: string) => void;
  network: string;
  setNetwork: (value: string) => void;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  refresh: () => void;
  currentCursor: number;
  pageLimit: number;
}

export interface TokensTableSearchInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  value: string;
  onValueChange: (value: string) => void;
  isLoading?: boolean;
}

export interface TokensTableNetworkFilterProps {
  value: string;
  onValueChange: (value: string) => void;
  options: Array<{ id: string; label: string; count: number }>;
  isLoading?: boolean;
  ariaLabel?: string;
}

export interface TokensTablePaginationProps {
  hasNext: boolean;
  hasPrevious: boolean;
  onNext: () => void;
  onPrevious: () => void;
  isDisabled?: boolean;
  currentCursor: number;
  currentCount: number;
  labels: {
    noResults: string;
    range: string;
    previous: string;
    next: string;
  };
}

export interface TokensTableSparklineCellProps {
  points: TokenSparklinePoint[];
  isPositive?: boolean;
}

export interface TokensTablePriceChangeIndicatorProps {
  value: number | null;
}
