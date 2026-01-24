import { MetricCard } from '@/components/molecules/metric-card'
import {
  IoClipboardOutline,
  IoWalletOutline,
  IoTicketOutline,
  IoFlagOutline
} from 'react-icons/io5'

export function DashboardMetrics() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <MetricCard
        label="Pending Orders"
        value="24"
        trend={{ value: 12, label: 'from yesterday', isPositive: true }}
        icon={<IoClipboardOutline className="text-2xl" />}
        colorScheme="warning"
        progress={{ value: 45, colorClass: 'bg-orange-500' }}
      />
      <MetricCard
        label="Daily Revenue"
        value="$4,250.00"
        trend={{ value: 8.2, label: 'vs last week', isPositive: true }}
        icon={<IoWalletOutline className="text-2xl" />}
        colorScheme="success"
        progress={{ value: 70, colorClass: 'bg-emerald-500' }}
      />
      <MetricCard
        label="Open Tickets"
        value="5"
        trend={{ value: -2, label: 'new today', isPositive: false }}
        icon={<IoTicketOutline className="text-2xl" />}
        colorScheme="danger"
        progress={{ value: 25, colorClass: 'bg-red-500' }}
      />
      <MetricCard
        label="Monthly Target"
        value="85%"
        subValue="$102k achieved"
        icon={<IoFlagOutline className="text-2xl" />}
        colorScheme="primary"
        progress={{ value: 85, colorClass: 'bg-blue-600' }}
      />
    </div>
  )
}
