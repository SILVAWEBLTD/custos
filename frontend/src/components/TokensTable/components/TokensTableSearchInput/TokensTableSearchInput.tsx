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
        className="border-transparent bg-transparent pr-8 pl-0 text-sm focus-visible:border-transparent focus-visible:ring-0"
        {...props}
      />
      {isLoading && (
        <Loader2 className="text-muted-foreground absolute top-1/2 right-2 h-3.5 w-3.5 -translate-y-1/2 animate-spin" />
      )}
    </div>
  );
}
