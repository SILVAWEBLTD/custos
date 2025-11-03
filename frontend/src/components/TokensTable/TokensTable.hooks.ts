'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import type { TokensApiResponse } from '@/types/token-table';

import type { UseTokensDataOptions, UseTokensDataResult } from './TokensTable.types';
import {
  DEFAULT_PAGE_SIZE,
  REFRESH_INTERVAL_MS,
  SEARCH_DEBOUNCE_MS,
  clampCursor,
} from './utils/tokenTableUtils';

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL ?? '/api').replace(/\/$/, '');

function useDebouncedValue<T>(value: T, delay: number) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const handle = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(handle);
  }, [value, delay]);

  return debounced;
}

const parseCursorValue = (cursor: string | null) => {
  if (!cursor) {
    return 0;
  }
  const numeric = Number(cursor);
  if (Number.isNaN(numeric) || numeric < 0) {
    return 0;
  }
  return Math.floor(numeric);
};

export function useTokensData(options: UseTokensDataOptions = {}): UseTokensDataResult {
  const pageLimit = options.pageSize ?? DEFAULT_PAGE_SIZE;
  const refreshInterval = options.refreshIntervalMs ?? REFRESH_INTERVAL_MS;

  const [search, setSearch] = useState('');
  const [network, setNetwork] = useState(options.initialNetwork ?? 'all');
  const [cursor, setCursor] = useState<string | null>(null);
  const currentCursor = parseCursorValue(cursor);
  const debouncedSearch = useDebouncedValue(search.trim(), SEARCH_DEBOUNCE_MS);

  const queryKey = [
    'tokens',
    {
      limit: pageLimit,
      cursor,
      search: debouncedSearch,
      network,
    },
  ];

  const fetchTokens = useCallback(async () => {
    const params = new URLSearchParams();
    params.set('limit', String(pageLimit));
    if (cursor) {
      params.set('cursor', cursor);
    }
    if (debouncedSearch) {
      params.set('search', debouncedSearch);
    }
    if (network && network !== 'all') {
      params.set('network', network);
    }

    const queryString = params.toString();
    const endpoint = `${API_BASE_URL}/tokens${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(endpoint);
    if (!response.ok) {
      let message = `Request failed (${response.status})`;
      try {
        const payload = await response.json();
        message = payload?.error ?? payload?.message ?? message;
      } catch {
        const text = await response.text();
        if (text) {
          message = text;
        }
      }
      throw new Error(message);
    }

    return (await response.json()) as TokensApiResponse;
  }, [cursor, debouncedSearch, network, pageLimit]);

  const { data, error, status, isLoading, isFetching, isRefetching, isPaused, refetch } = useQuery<
    TokensApiResponse,
    Error
  >({
    queryKey,
    queryFn: fetchTokens,
    staleTime: refreshInterval,
    refetchInterval: refreshInterval || false,
    retry: 1,
  });

  const tokens = useMemo(() => data?.data ?? [], [data]);
  const meta = useMemo(() => data?.meta ?? null, [data]);
  const isPaginating = Boolean(cursor) && isFetching && !isLoading;
  const effectiveStatus: UseTokensDataResult['status'] = status === 'pending' ? 'loading' : status;

  const goToNextPage = useCallback(() => {
    const next = meta?.nextCursor ?? null;
    if (next) {
      setCursor(next);
    }
  }, [meta]);

  const goToPreviousPage = useCallback(() => {
    if (currentCursor === 0) {
      return;
    }
    const previous = clampCursor(currentCursor - pageLimit, pageLimit);
    setCursor(previous === 0 ? null : String(previous));
  }, [currentCursor, pageLimit]);

  const hasNextPage = Boolean(meta?.nextCursor);
  const hasPreviousPage = currentCursor > 0;

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setCursor(null);
  }, []);

  const handleNetworkChange = useCallback((value: string) => {
    setNetwork(value);
    setCursor(null);
  }, []);

  const refresh = useCallback(() => {
    refetch({ cancelRefetch: false });
  }, [refetch]);

  return useMemo<UseTokensDataResult>(
    () => ({
      tokens,
      meta,
      status: effectiveStatus,
      isLoading,
      isFetching,
      isRefetching,
      isPaginating,
      error: error ? error.message : null,
      search,
      setSearch: handleSearchChange,
      network,
      setNetwork: handleNetworkChange,
      goToNextPage,
      goToPreviousPage,
      hasNextPage,
      hasPreviousPage,
      refresh,
      currentCursor,
      pageLimit,
    }),
    [
      tokens,
      meta,
      effectiveStatus,
      isLoading,
      isFetching,
      isRefetching,
      isPaginating,
      error,
      search,
      handleSearchChange,
      network,
      handleNetworkChange,
      goToNextPage,
      goToPreviousPage,
      hasNextPage,
      hasPreviousPage,
      refresh,
      currentCursor,
      pageLimit,
    ],
  );
}
