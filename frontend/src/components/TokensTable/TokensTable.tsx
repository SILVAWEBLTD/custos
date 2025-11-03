'use client';

import { RotateCcw } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Search } from '@/components/Search';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

import { Skeleton } from '@/components/ui/skeleton';
import { TokensTableNetworkFilter } from './components/TokensTableNetworkFilter';
import { TokensTablePagination } from './components/TokensTablePagination';
import { TokensTablePriceChangeIndicator } from './components/TokensTablePriceChangeIndicator';
import { TokensTableSearchInput } from './components/TokensTableSearchInput';
import { TokensTableSparklineCell } from './components/TokensTableSparklineCell';
import { useTokensData } from './TokensTable.hooks';
import type { TokensTableProps } from './TokensTable.types';
import {
  buildNetworkOptions,
  formatCurrency,
  formatLastUpdated,
  formatNumber,
} from './utils/tokenTableUtils';

export function TokensTable({
  className,
  pageSize,
  initialNetwork,
  refreshIntervalMs,
}: TokensTableProps) {
  const t = useTranslations('ExploreTokens');
  const {
    tokens,
    meta,
    isLoading,
    isFetching,
    error,
    search,
    setSearch,
    network,
    setNetwork,
    goToNextPage,
    goToPreviousPage,
    hasNextPage,
    hasPreviousPage,
    refresh,
    currentCursor,
    pageLimit,
  } = useTokensData({ pageSize, initialNetwork, refreshIntervalMs });

  const errorMessage = error;
  const isInitialLoading = isLoading && tokens.length === 0;
  const showSkeleton = isInitialLoading;
  const processing = isFetching;
  const networkOptions = buildNetworkOptions(meta, t('networkAll'));
  const lastUpdated = formatLastUpdated(meta?.lastSyncTimestamp);
  const paginationStart = tokens.length === 0 ? 0 : currentCursor + 1;
  const paginationEnd = currentCursor + tokens.length;
  const paginationLabels = {
    noResults: t('pagination.noResults'),
    range:
      tokens.length === 0
        ? ''
        : t('pagination.range', { start: paginationStart, end: paginationEnd }),
    previous: t('pagination.previous'),
    next: t('pagination.next'),
  };

  const renderSkeleton = (displaySparkline: boolean) => {
    const skeletonWidths = displaySparkline
      ? ['w-6', 'w-28', 'w-24', 'w-24', 'w-28', 'w-32', 'w-24']
      : ['w-6', 'w-28', 'w-24', 'w-24', 'w-28', 'w-32'];

    return (
      <Table>
        <TableBody>
          {Array.from({ length: pageLimit }).map((_, rowIndex) => (
            <TableRow key={`skeleton-${rowIndex}`} className="border-white/5">
              {skeletonWidths.map((width, cellIndex) => (
                <TableCell key={cellIndex} className="py-3">
                  <Skeleton className={cn('h-4', width)} />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  const renderError = (message: string) => (
    <div className="flex flex-col items-start gap-3 rounded-lg border border-rose-500/40 bg-rose-500/10 p-6 text-rose-200">
      <div>
        <p className="text-sm font-semibold">{t('errorTitle')}</p>
        <p className="text-xs opacity-80">{message}</p>
      </div>
      <Button size="sm" variant="secondary" onClick={refresh} disabled={processing}>
        {t('errorRetry')}
      </Button>
    </div>
  );

  const renderEmpty = () => (
    <div className="border-muted/50 text-muted-foreground flex flex-col items-center justify-center gap-2 rounded-lg border p-8 text-center">
      <p className="font-medium">{t('emptyTitle')}</p>
      <p className="text-xs opacity-80">{t('emptySubtitle')}</p>
    </div>
  );

  const showSparklineColumn = tokens.some((token) => token.sparkline?.length);

  const renderTable = (displaySparkline: boolean) => (
    <Table>
      <TableHeader>
        <TableRow className="border-white/5">
          <TableHead className="w-10">{t('columns.rank')}</TableHead>
          <TableHead>{t('columns.token')}</TableHead>
          <TableHead className="text-right">{t('columns.price')}</TableHead>
          <TableHead className="text-right">{t('columns.change24h')}</TableHead>
          <TableHead className="text-right">{t('columns.volume')}</TableHead>
          <TableHead className="text-right">{t('columns.marketCap')}</TableHead>
          {displaySparkline && (
            <TableHead className="text-right">{t('columns.sparkline')}</TableHead>
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {tokens.map((token) => (
          <TableRow key={token.symbol} className="border-white/5">
            <TableCell className="text-muted-foreground text-xs font-semibold">
              {token.rank}
            </TableCell>
            <TableCell>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-white">{token.symbol}</span>
                <span className="text-muted-foreground text-xs">{token.name}</span>
              </div>
            </TableCell>
            <TableCell className="text-right text-sm font-medium text-white">
              {formatCurrency(token.price)}
            </TableCell>
            <TableCell className="text-right">
              <TokensTablePriceChangeIndicator value={token.priceChange24h} />
            </TableCell>
            <TableCell className="text-right text-sm font-medium text-white">
              {formatNumber(token.volume24h)}
            </TableCell>
            <TableCell className="text-right text-sm font-medium text-white">
              {formatNumber(token.marketCap)}
            </TableCell>
            {displaySparkline && (
              <TableCell className="text-right">
                <TokensTableSparklineCell
                  points={token.sparkline}
                  isPositive={token.priceChange24h ? token.priceChange24h >= 0 : undefined}
                />
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <Card className={cn('border-white/10 bg-black/40 backdrop-blur-xl', className)}>
      <CardHeader className="space-y-6">
        <div className="space-y-1">
          <CardTitle className="text-foreground text-lg font-semibold sm:text-xl">
            {t('title')}
          </CardTitle>
          <CardDescription>{t('description')}</CardDescription>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Search className="sm:max-w-xs md:max-w-sm">
            <TokensTableSearchInput
              value={search}
              onValueChange={setSearch}
              placeholder={t('searchPlaceholder')}
              isLoading={isFetching && !isInitialLoading}
              aria-label={t('searchAriaLabel')}
            />
          </Search>
          <div className="flex items-center gap-3">
            {lastUpdated && (
              <div className="text-muted-foreground text-xs">
                {t('lastUpdated', { value: lastUpdated })}
              </div>
            )}
            <Button
              size="icon"
              variant="ghost"
              onClick={refresh}
              disabled={processing}
              aria-label={t('refreshLabel')}
            >
              <RotateCcw className={cn('h-4 w-4', processing && 'animate-spin')} />
            </Button>
            <TokensTableNetworkFilter
              value={network}
              onValueChange={setNetwork}
              options={networkOptions}
              isLoading={processing}
              ariaLabel={t('networkAriaLabel')}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {showSkeleton
          ? renderSkeleton(showSparklineColumn)
          : errorMessage
            ? renderError(errorMessage)
            : tokens.length === 0
              ? renderEmpty()
              : renderTable(showSparklineColumn)}
      </CardContent>
      <CardFooter>
        <TokensTablePagination
          hasNext={hasNextPage}
          hasPrevious={hasPreviousPage}
          onNext={goToNextPage}
          onPrevious={goToPreviousPage}
          isDisabled={processing || Boolean(errorMessage)}
          currentCursor={currentCursor}
          currentCount={tokens.length}
          labels={paginationLabels}
        />
      </CardFooter>
    </Card>
  );
}
