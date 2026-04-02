import React from 'react';
import { clsx } from 'clsx';

interface KPICardProps {
  icon?: React.ReactNode;
  label: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down';
  className?: string;
}

export function KPICard({
  icon,
  label,
  value,
  change,
  trend = 'up',
  className,
}: KPICardProps) {
  const isPositive = trend === 'up' ? change && change >= 0 : change && change < 0;

  return (
    <div className={clsx('card', className)}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{label}</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{value}</p>
        </div>
        {icon && <div className="text-2xl">{icon}</div>}
      </div>
      {change !== undefined && (
        <div
          className={clsx(
            'text-sm font-medium',
            isPositive
              ? 'text-green-600 dark:text-green-400'
              : 'text-red-600 dark:text-red-400'
          )}
        >
          {isPositive ? '↑' : '↓'} {Math.abs(change)}% from last month
        </div>
      )}
    </div>
  );
}
