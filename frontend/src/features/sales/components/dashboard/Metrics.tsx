/**
 * Metrics Component
 * Displays key performance metrics for the dashboard
 */
import { MetricCard } from '@/shared/components/ui/metric-card'
import {
  IoClipboardOutline,
  IoWalletOutline,
  IoTicketOutline,
  IoFlagOutline
} from 'react-icons/io5'
import type { ReactNode } from 'react'

interface Metric {
  title: string
  value: string
  subValue?: string
  icon: ReactNode
  trend?: { label: string; value: number; isPositive: boolean }
  progress?: { value: number; colorClass: string }
  colorScheme: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info'
}

const METRICS: Metric[] = [
  {
    title: 'Pending Orders',
    value: '24',
    icon: <IoClipboardOutline className="text-2xl" />,
    trend: { label: 'from yesterday', value: 12, isPositive: true },
    progress: { value: 45, colorClass: 'bg-orange-500' },
    colorScheme: 'warning'
  },
  {
    title: 'Daily Revenue',
    value: '$4,250.00',
    icon: <IoWalletOutline className="text-2xl" />,
    trend: { label: 'vs last week', value: 8.2, isPositive: true },
    progress: { value: 70, colorClass: 'bg-emerald-500' },
    colorScheme: 'success'
  },
  {
    title: 'Open Tickets',
    value: '5',
    icon: <IoTicketOutline className="text-2xl" />,
    trend: { label: 'new today', value: -2, isPositive: false },
    progress: { value: 25, colorClass: 'bg-red-500' },
    colorScheme: 'danger'
  },
  {
    title: 'Monthly Target',
    value: '85%',
    subValue: '$102k achieved',
    icon: <IoFlagOutline className="text-2xl" />,
    progress: { value: 85, colorClass: 'bg-blue-600' },
    colorScheme: 'primary'
  }
]

export default function Metrics() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {METRICS.map((metric, index) => (
        <MetricCard
          key={index}
          label={metric.title}
          value={metric.value}
          subValue={metric.subValue}
          trend={metric.trend}
          icon={metric.icon}
          colorScheme={metric.colorScheme}
          progress={metric.progress}
        />
      ))}
    </div>
  )
}
