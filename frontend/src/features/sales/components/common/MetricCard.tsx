import { Card } from '@/components'
import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'
import { STYLES } from '../../constants/saleStaffDesignSystem'

interface MetricCardProps {
  label: string
  value: string | number
  icon: ReactNode
  iconBg?: string
  iconColor?: string
  trend?: string
  trendColor?: string
  className?: string
}

export default function MetricCard({
  label,
  value,
  icon,
  iconBg = 'bg-gray-50',
  iconColor = 'text-gray-500',
  trend,
  trendColor = 'text-gray-400',
  className
}: MetricCardProps) {
  return (
    <Card className={cn(STYLES.metricCard, className)}>
      <div className="flex justify-between items-start">
        <div>
          <p className={STYLES.metricLabel}>{label}</p>
          <h3 className={STYLES.metricValue}>{value}</h3>
        </div>
        <div className={cn('p-2 rounded-lg', iconBg, iconColor)}>{icon}</div>
      </div>
      {trend && <div className={cn('mt-4 text-xs font-medium', trendColor)}>{trend}</div>}
    </Card>
  )
}
