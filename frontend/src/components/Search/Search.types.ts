import type { HTMLAttributes, ReactNode } from 'react';

export interface SearchProps extends HTMLAttributes<HTMLDivElement> {
  icon?: ReactNode;
  children: ReactNode;
}
