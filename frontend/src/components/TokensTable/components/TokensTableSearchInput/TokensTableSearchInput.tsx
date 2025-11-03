'use client';

import { Loader2 } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

import type { TokensTableSearchInputProps } from './TokensTableSearchInput.types';

export function TokensTableSearchInput({
  value,
  onValueChange,
  isLoading,
  className,
  ...props
}: TokensTableSearchInputProps) {
  return (
    <div className={cn('relative flex-1', className)}>
      <Input
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
        autoComplete="off"
        spellCheck={false}
        aria-label={props['aria-label']}
        className="placeholder:text-muted-foreground/70 border-none bg-transparent px-0 pr-8 text-sm text-white shadow-none focus-visible:border-none focus-visible:ring-0 focus-visible:ring-offset-0"
        {...props}
      />
      {isLoading && (
        <Loader2 className="text-muted-foreground/80 absolute top-1/2 right-2 h-3.5 w-3.5 -translate-y-1/2 animate-spin" />
      )}
    </div>
  );
}
