import React from 'react'
import { MetricCard } from '@/shared/components/staff/staff-core/metric-card'
import { cn } from '@/lib/utils'
interface OrderMetricsProps {
  metrics: {
    type: string
    label: string
    value: number
    icon: React.ReactNode
    colorScheme: 'primary' | 'secondary' | 'info' | 'danger' | 'mint'
    trend: { label: string; value: number; isPositive: boolean }
  }[]
  orderTypeFilter: string
  onOrderTypeChange: (type: string) => void
}

export const OrderMetrics: React.FC<OrderMetricsProps> = ({
  metrics,
  orderTypeFilter,
  onOrderTypeChange
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 px-4">
      {metrics.map((m, i) => (
        <div
          key={i}
          className="cursor-pointer transition-transform active:scale-95"
          onClick={() => onOrderTypeChange(m.type)}
        >
          <MetricCard
            label={m.label}
            value={m.value}
            icon={m.icon}
            colorScheme={m.colorScheme}
            trend={m.trend}
            className={cn(
              'transition-all duration-300',
              orderTypeFilter === m.type
                ? 'border-mint-500 bg-mint-50/10 shadow-sm'
                : 'hover:border-neutral-200'
            )}
          />
        </div>
      ))}
    </div>
  )
}
