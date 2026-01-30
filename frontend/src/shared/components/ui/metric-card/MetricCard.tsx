import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Card } from '@/shared/components/ui/card'

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
  colorScheme?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info'
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
        return 'bg-blue-50 text-blue-600'
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
    <Card className={cn('p-6', className)}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <h3 className="text-2xl font-bold mt-2 text-gray-900">{value}</h3>
        </div>
        {icon && <div className={cn('p-3 rounded-lg', getIconBgColor())}>{icon}</div>}
      </div>

      {(trend || subValue) && (
        <div className="mt-4 flex items-center gap-2 text-sm">
          {trend && (
            <span
              className={cn(
                'font-medium flex items-center',
                trend.isPositive ? 'text-emerald-600' : 'text-red-600'
              )}
            >
              {trend.isPositive ? '↗' : '↘'} {Math.abs(trend.value)}%
            </span>
          )}
          <span className="text-gray-500">{trend ? trend.label : subValue}</span>
        </div>
      )}

      {progress && (
        <div className="mt-3 w-full bg-gray-100 rounded-full h-1.5">
          <div
            className={cn('h-1.5 rounded-full', progress.colorClass || 'bg-blue-600')}
            style={{ width: `${progress.value}%` }}
          />
        </div>
      )}

      {!progress && label.includes('Target') && subValue && (
        <div className="mt-3 w-full bg-gray-100 rounded-full h-1.5">
          <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '85%' }}></div>
        </div>
      )}
    </Card>
  )
}
