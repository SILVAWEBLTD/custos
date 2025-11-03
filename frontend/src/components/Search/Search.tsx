'use client';

import { Search as SearchIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

import type { SearchProps } from './Search.types';

export function Search({ icon, children, className, ...props }: SearchProps) {
  return (
    <div
      className={cn(
        'flex w-full items-center gap-2 rounded-sm border border-gray-700 bg-black/80 px-3 py-2 text-sm text-white transition-colors focus-within:ring-2 focus-within:ring-gray-500 focus-within:ring-offset-0 hover:bg-gray-900',
        className,
      )}
      {...props}
    >
      <span className="text-muted-foreground/80">
        {icon ?? <SearchIcon className="h-4 w-4" aria-hidden />}
      </span>
      <div className="flex-1">{children}</div>
    </div>
  );
}
