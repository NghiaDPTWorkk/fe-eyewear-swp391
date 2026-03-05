import { Link } from 'react-router-dom'
import { Container, MetricCard } from '@/components'
import { OrderTable } from '@/components/staff'
import {
  IoClipboardOutline,
  IoFlagOutline,
  IoTicketOutline,
  IoWalletOutline
} from 'react-icons/io5'
import { useOrderCountStore } from '@/store'

function DashboardMetrics() {
  const { counts } = useOrderCountStore()

  const metrics = [
    {
      title: 'Pending Orders',
      value: counts.assigned.toString(),
      icon: <IoClipboardOutline className="text-2xl" />,
      trend: { label: 'from yesterday', value: 12, isPositive: true },
      progress: { value: 45, colorClass: 'bg-orange-500' },
      colorScheme: 'warning' as const
    },
    {
      title: 'Daily Revenue',
      value: '$4,250.00',
      icon: <IoWalletOutline className="text-2xl" />,
      trend: { label: 'vs last week', value: 8.2, isPositive: true },
      progress: { value: 70, colorClass: 'bg-emerald-500' },
      colorScheme: 'success' as const
    },
    {
      title: 'Open Tickets',
      value: '5',
      icon: <IoTicketOutline className="text-2xl" />,
      trend: { label: 'new today', value: -2, isPositive: false },
      progress: { value: 25, colorClass: 'bg-red-500' },
      colorScheme: 'danger' as const
    },
    {
      title: 'Monthly Target',
      value: '85%',
      subValue: '$102k achieved',
      icon: <IoFlagOutline className="text-2xl" />,
      trend: null,
      progress: { value: 85, colorClass: 'bg-blue-600' },
      colorScheme: 'primary' as const
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {metrics.map((metric, index) => (
        <MetricCard
          key={index}
          label={metric.title}
          value={metric.value}
          subValue={metric.subValue}
          trend={metric.trend as any}
          icon={metric.icon}
          colorScheme={metric.colorScheme}
          progress={metric.progress}
        />
      ))}
    </div>
  )
}

export default function OperationDashboardPage() {
  return (
    <Container>
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm mb-2 font-medium">
          <Link
            to="/operationstaff/dashboard"
            className="text-neutral-400 hover:text-primary-500 transition-colors"
          >
            Dashboard
          </Link>
          <span className="text-neutral-300">/</span>
          <span className="text-primary-500 font-bold">Operations</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Operation Hub</h1>
        <p className="text-gray-500 mt-1">Monitor priority orders and technical station status.</p>

        <div className="mt-5">
          <DashboardMetrics />
        </div>
      </div>
      <h4 className="text-primary-600 font-bold text-xl mb-4">Priority Orders</h4>
      <OrderTable hiddenColumns={['WAITING FOR', 'CUSTOMER']} role="operation" />
    </Container>
  )
}
