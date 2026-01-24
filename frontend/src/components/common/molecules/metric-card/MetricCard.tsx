import { type ReactNode } from 'react'
import { Card } from '@/shared/components/atoms/card'
import { cn } from '@/lib/utils'

export interface MetricCardProps {
  title: string
  value: string | number
  icon?: ReactNode
  trend?: {
    value?: string
    label: string
    isPositive?: boolean
  }
  progress?: {
    value: number
    colorClass?: string
  }
  variant?: 'default' | 'primary'
  className?: string
  action?: ReactNode
}

export function MetricCard({
  title,
  value,
  icon,
  trend,
  progress,
  variant = 'default',
  className,
  action
}: MetricCardProps) {
  const isPrimary = variant === 'primary'

  return (
    <Card
      className={cn(
        'relative overflow-hidden p-6',
        isPrimary &&
          'bg-gradient-to-br from-emerald-400 to-emerald-500 text-white shadow-lg shadow-emerald-500/20 border-none',
        className
      )}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <p
            className={cn(
              'text-sm font-medium mb-1',
              isPrimary ? 'text-emerald-100' : 'text-gray-500'
            )}
          >
            {title}
          </p>
          <h3 className={cn('text-2xl font-bold', isPrimary ? 'text-white' : 'text-gray-900')}>
            {value}
          </h3>
        </div>
        {(icon || action) && (
          <div
            className={cn(
              'p-2 rounded-lg',
              isPrimary ? 'bg-emerald-400/20 text-white' : 'bg-gray-50 text-gray-500'
            )}
          >
            {action || icon}
          </div>
        )}
      </div>

      {/* Trend Section */}
      {trend && (
        <div className="flex items-center gap-2 mb-4 text-sm">
          {trend.value && (
            <span
              className={cn(
                'font-medium px-1.5 py-0.5 rounded',
                isPrimary
                  ? 'bg-white/20 text-white'
                  : trend.isPositive
                    ? 'bg-emerald-100 text-emerald-600'
                    : 'bg-rose-100 text-rose-600'
              )}
            >
              {trend.value}
            </span>
          )}
          <span className={cn(isPrimary ? 'text-emerald-100' : 'text-gray-500')}>
            {trend.label}
          </span>
        </div>
      )}

      {/* Progress Bar */}
      {progress && (
        <div className="mt-auto">
          <div
            className={cn(
              'h-1.5 w-full rounded-full overflow-hidden',
              isPrimary ? 'bg-black/10' : 'bg-gray-100'
            )}
          >
            <div
              className={cn(
                'h-full rounded-full transition-all duration-500',
                progress.colorClass || (isPrimary ? 'bg-white' : 'bg-emerald-500')
              )}
              style={{ width: `${progress.value}%` }}
            />
          </div>
        </div>
      )}
    </Card>
  )
}
