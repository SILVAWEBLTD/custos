'use client';

import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';

import { cn } from '@/lib/utils';

import type { TokensTablePriceChangeIndicatorProps } from './TokensTablePriceChangeIndicator.types';
import { formatPercentage, isPositiveChange } from '../../utils/tokenTableUtils';

export function TokensTablePriceChangeIndicator({ value }: TokensTablePriceChangeIndicatorProps) {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return <span className="text-muted-foreground text-xs">—</span>;
  }

  if (value === 0) {
    return (
      <span className="text-muted-foreground flex items-center gap-1 text-xs font-medium">
        <Minus className="h-3 w-3" aria-hidden />
        {formatPercentage(value)}
      </span>
    );
  }

  const positive = isPositiveChange(value);

  return (
    <span
      className={cn(
        'flex items-center gap-1 text-xs font-semibold',
        positive ? 'text-emerald-400' : 'text-rose-400',
      )}
    >
      {positive ? (
        <ArrowUpRight className="h-3 w-3" aria-hidden />
      ) : (
        <ArrowDownRight className="h-3 w-3" aria-hidden />
      )}
      {formatPercentage(value)}
    </span>
  );
}
