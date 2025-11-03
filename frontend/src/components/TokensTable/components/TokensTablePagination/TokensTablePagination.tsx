'use client';

import { Button } from '@/components/ui/button';

import type { TokensTablePaginationProps } from './TokensTablePagination.types';

export function TokensTablePagination({
  hasNext,
  hasPrevious,
  onNext,
  onPrevious,
  isDisabled,
  currentCursor,
  currentCount,
  labels,
}: TokensTablePaginationProps) {
  const _start = currentCount === 0 ? 0 : currentCursor + 1;
  const _end = currentCursor + currentCount;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-muted-foreground text-xs tracking-wide uppercase sm:text-sm">
        {currentCount === 0 ? labels.noResults : labels.range}
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onPrevious}
          disabled={isDisabled || !hasPrevious}
        >
          {labels.previous}
        </Button>
        <Button variant="ghost" size="sm" onClick={onNext} disabled={isDisabled || !hasNext}>
          {labels.next}
        </Button>
      </div>
    </div>
  );
}
