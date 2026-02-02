/**
 * LabMetricsCard Component
 * Displays lab-related metrics (In Production, Urgent/Late, Ready for QC)
 */
import { Card } from '@/components'
import { IoFlaskOutline, IoWarningOutline, IoCheckmarkCircleOutline } from 'react-icons/io5'

const METRICS = [
  {
    label: 'In Production',
    value: '42',
    icon: <IoFlaskOutline size={20} />,
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-500'
  },
  {
    label: 'Urgent / Late',
    value: '8',
    icon: <IoWarningOutline size={20} />,
    bgColor: 'bg-red-50',
    textColor: 'text-red-500'
  },
  {
    label: 'Ready for QC',
    value: '12',
    icon: <IoCheckmarkCircleOutline size={20} />,
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-500'
  }
]

export default function LabMetricsCards() {
  return (
    <div className="space-y-4">
      {METRICS.map((metric) => (
        <Card
          key={metric.label}
          className="p-4 border border-neutral-100 flex items-center justify-between"
        >
          <div>
            <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
              {metric.label}
            </p>
            <h3 className="text-2xl font-semibold text-neutral-900 mt-1">{metric.value}</h3>
          </div>
          <div className={`p-2 ${metric.bgColor} ${metric.textColor} rounded-lg`}>
            {metric.icon}
          </div>
        </Card>
      ))}
    </div>
  )
}
