import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Card } from '@/shared/components/ui-core'

export interface MetricCardProps {
  label: string
  value: string | number
  subValue?: string
  trend?: {
    value: number
    label: string
    isPositive: boolean
  }
  icon?: ReactNode
  colorScheme?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'mint'
  className?: string
  progress?: {
    value: number
    colorClass?: string
  }
}

export function MetricCard({
  label,
  value,
  subValue,
  trend,
  icon,
  colorScheme = 'primary',
  className,
  progress
}: MetricCardProps) {
  const getIconBgColor = () => {
    switch (colorScheme) {
      case 'primary':
      case 'mint':
        return 'bg-mint-50 text-mint-700'
      case 'secondary':
        return 'bg-purple-50 text-purple-600'
      case 'success':
        return 'bg-emerald-50 text-emerald-600'
      case 'warning':
        return 'bg-orange-50 text-orange-600'
      case 'danger':
        return 'bg-red-50 text-red-600'
      case 'info':
        return 'bg-sky-50 text-sky-600'
      default:
        return 'bg-gray-50 text-gray-600'
    }
  }

  return (
    <Card
      className={cn(
        'p-7 border border-neutral-100 rounded-[28px] bg-white transition-all',
        className
      )}
    >
      <div className="flex justify-between items-start">
        <div className="space-y-1.5">
          <p className="text-[13px] font-medium text-slate-400 tracking-tight whitespace-nowrap">
            {label}
          </p>
          <h3 className="text-3xl font-bold text-slate-900 font-heading tracking-tight">{value}</h3>
        </div>
        {icon && (
          <div
            className={cn(
              'p-4 rounded-2xl transition-all hover:scale-105 border border-transparent',
              getIconBgColor()
            )}
          >
            {icon}
          </div>
        )}
      </div>

      {(trend || subValue) && (
        <div className="mt-6 flex items-center gap-2 text-[12px]">
          {trend && (
            <div
              className={cn(
                'flex items-center gap-1.5 font-medium',
                trend.isPositive ? 'text-emerald-500' : 'text-rose-500'
              )}
            >
              <span className="opacity-60 text-sm">↗</span>
              <span>{Math.abs(trend.value)}%</span>
            </div>
          )}
          <span className="text-slate-400 font-medium">{trend ? trend.label : subValue}</span>
        </div>
      )}

      {progress && (
        <div className="mt-4 w-full bg-slate-50 rounded-full h-1.5 overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-700',
              progress.colorClass || 'bg-mint-500'
            )}
            style={{ width: `${progress.value}%` }}
          />
        </div>
      )}
    </Card>
  )
}
