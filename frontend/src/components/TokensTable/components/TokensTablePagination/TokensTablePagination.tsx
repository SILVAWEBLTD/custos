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
      <p className="text-muted-foreground text-xs sm:text-sm">
        {currentCount === 0 ? labels.noResults : labels.range}
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onPrevious}
          disabled={isDisabled || !hasPrevious}
          className="rounded-sm border-gray-700 bg-black/80 px-4 text-xs font-semibold tracking-wide text-white hover:bg-gray-900 hover:text-white focus-visible:ring-gray-500 focus-visible:ring-offset-0"
        >
          {labels.previous}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onNext}
          disabled={isDisabled || !hasNext}
          className="rounded-sm border-gray-700 bg-black/80 px-4 text-xs font-semibold tracking-wide text-white hover:bg-gray-900 hover:text-white focus-visible:ring-gray-500 focus-visible:ring-offset-0"
        >
          {labels.next}
        </Button>
      </div>
    </div>
  );
}
