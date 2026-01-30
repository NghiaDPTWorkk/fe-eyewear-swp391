/**
 * SupportMetrics Component
 * Displays support ticket metrics
 */
import { Card } from '@/components'
import {
  IoTicketOutline,
  IoChatbubblesOutline,
  IoHourglassOutline,
  IoCheckmarkDoneCircleOutline
} from 'react-icons/io5'

const METRICS = [
  {
    label: 'Total Tickets',
    value: '142',
    icon: <IoTicketOutline className="text-xl" />,
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-500'
  },
  {
    label: 'Open Tickets',
    value: '28',
    icon: <IoChatbubblesOutline className="text-xl" />,
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-500'
  },
  {
    label: 'Pending Response',
    value: '12',
    icon: <IoHourglassOutline className="text-xl" />,
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-500'
  },
  {
    label: 'Resolved Today',
    value: '15',
    icon: <IoCheckmarkDoneCircleOutline className="text-xl" />,
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-500'
  }
]

export default function SupportMetrics() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {METRICS.map((metric) => (
        <Card
          key={metric.label}
          className="p-5 border border-neutral-100 flex flex-col justify-between"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                {metric.label}
              </p>
              <h3 className="text-3xl font-bold text-neutral-900 mt-2">{metric.value}</h3>
            </div>
            <div className={`p-2 ${metric.bgColor} rounded-lg ${metric.textColor}`}>
              {metric.icon}
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
