'use client';

import { Check } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

import type { TokensTableNetworkFilterProps } from './TokensTableNetworkFilter.types';

export function TokensTableNetworkFilter({
  value,
  onValueChange,
  options,
  isLoading,
  className,
  ariaLabel,
}: TokensTableNetworkFilterProps & { className?: string }) {
  return (
    <Select value={value} onValueChange={onValueChange} disabled={isLoading}>
      <SelectTrigger
        className={cn(
          'border-muted/60 bg-muted/40 text-muted-foreground cursor-pointer text-xs font-medium tracking-wide focus:ring-0 sm:text-sm',
          className,
        )}
        aria-label={ariaLabel}
      >
        <SelectValue>{options.find((option) => option.id === value)?.label ?? ''}</SelectValue>
      </SelectTrigger>
      <SelectContent align="end" className="w-44 border-gray-700 bg-black/95 text-white">
        {options.map((option) => (
          <SelectItem
            key={option.id}
            value={option.id}
            className="flex items-center justify-between"
          >
            <span className="mr-3 truncate text-sm font-medium">{option.label}</span>
            <span className="text-muted-foreground text-xs tabular-nums">{option.count}</span>
            {option.id === value && <Check className="ml-auto h-4 w-4 text-green-500" />}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
