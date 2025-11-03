'use client';

import { useId } from 'react';
import { Area, AreaChart, ResponsiveContainer } from 'recharts';

import type { TokensTableSparklineCellProps } from './TokensTableSparklineCell.types';

const POSITIVE_COLOR = '#22c55e';
const NEGATIVE_COLOR = '#ef4444';

export function TokensTableSparklineCell({ points, isPositive }: TokensTableSparklineCellProps) {
  const gradientId = useId();
  if (!points.length) {
    return <span className="text-muted-foreground text-xs">—</span>;
  }

  const stroke = isPositive ? POSITIVE_COLOR : NEGATIVE_COLOR;

  return (
    <div className="h-12 w-32">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={points} margin={{ top: 6, bottom: 0, left: 0, right: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
              <stop offset="5%" stopColor={stroke} stopOpacity={0.4} />
              <stop offset="95%" stopColor={stroke} stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="close"
            stroke={stroke}
            fill={`url(#${gradientId})`}
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
