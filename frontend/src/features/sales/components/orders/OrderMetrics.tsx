import React from 'react'
import { MetricCard } from '@/shared/components/staff/staff-core/metric-card'
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
            className={orderTypeFilter === m.type ? 'ring-2 ring-mint-500 ring-offset-2' : ''}
          />
        </div>
      ))}
    </div>
  )
}
