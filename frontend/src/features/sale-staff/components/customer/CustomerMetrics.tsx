import { Card } from '@/components'
import {
  IoCalendarOutline,
  IoStarOutline,
  IoPeopleOutline,
  IoOptionsOutline
} from 'react-icons/io5'
import type { ReactNode } from 'react'

interface Metric {
  label: string
  value: string
  icon: ReactNode
  color: string
}

const METRICS: Metric[] = [
  { label: 'Total Customers', value: '1,240', icon: <IoPeopleOutline />, color: 'bg-primary-500' },
  { label: 'High Value', value: '84', icon: <IoStarOutline />, color: 'bg-blue-500' },
  { label: 'New This Month', value: '12', icon: <IoCalendarOutline />, color: 'bg-emerald-500' },
  { label: 'On-site Now', value: '5', icon: <IoOptionsOutline />, color: 'bg-amber-500' }
]

interface CustomerCustomerMetricsProps {
  isCompact?: boolean
}

export default function CustomerCustomerMetrics({
  isCompact = false
}: CustomerCustomerMetricsProps) {
  return (
    <div
      className={`grid gap-6 mb-10 transition-all ${isCompact ? 'grid-cols-2 lg:grid-cols-2' : 'grid-cols-2 md:grid-cols-4'}`}
    >
      {METRICS.map((metric) => (
        <Card
          key={metric.label}
          className="bg-white p-6 border-none rounded-2xl shadow-sm flex items-center gap-5 group cursor-pointer hover:shadow-md transition-all"
        >
          <div
            className={`p-4 ${metric.color.replace('bg-', 'bg-opacity-10 text-')} rounded-2xl text-2xl`}
          >
            {metric.icon}
          </div>
          <div>
            <div className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest leading-none mb-1.5">
              {metric.label}
            </div>
            <div className="text-2xl font-semibold text-neutral-800 tracking-tight">
              {metric.value}
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
