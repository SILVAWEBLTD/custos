'use client';

import { Search as SearchIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

import type { SearchProps } from './Search.types';

export function Search({ icon, children, className, ...props }: SearchProps) {
  return (
    <div
      className={cn(
        'bg-muted/40 text-muted-foreground border-muted/60 flex items-center gap-2 rounded-full border px-4 py-2 backdrop-blur-sm transition-colors hover:border-white/40 hover:text-white',
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
