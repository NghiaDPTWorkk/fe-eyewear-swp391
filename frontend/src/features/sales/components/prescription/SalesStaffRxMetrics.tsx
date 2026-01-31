import React from 'react'
import { Card } from '@/components'
import {
  IoFlaskOutline,
  IoSync,
  IoCheckboxOutline,
  IoCheckmarkDoneCircleOutline
} from 'react-icons/io5'

export const SalesStaffRxMetrics: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <MetricItem title="Pending Lab" value="12" icon={<IoFlaskOutline />} color="orange" />
      <MetricItem title="In Grinding" value="8" icon={<IoSync />} color="blue" />
      <MetricItem title="Ready for QA" value="5" icon={<IoCheckboxOutline />} color="purple" />
      <MetricItem
        title="Completed Today"
        value="24"
        icon={<IoCheckmarkDoneCircleOutline />}
        color="emerald"
      />
    </div>
  )
}

function MetricItem({
  title,
  value,
  icon,
  color
}: {
  title: string
  value: string
  icon: React.ReactNode
  color: string
}) {
  const colorMap: any = {
    orange: 'bg-orange-50 text-orange-500',
    blue: 'bg-blue-50 text-blue-500',
    purple: 'bg-purple-50 text-purple-500',
    emerald: 'bg-emerald-50 text-emerald-500'
  }
  return (
    <Card className="p-5 border border-neutral-100 flex flex-col justify-between shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">{title}</p>
          <h3 className="text-3xl font-semibold text-neutral-900 mt-2">{value}</h3>
        </div>
        <div className={`p-2 rounded-lg ${colorMap[color]}`}>{icon}</div>
      </div>
    </Card>
  )
}
