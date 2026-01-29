import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Container, MetricCard } from '@/components'
import { OrderTable } from '@/components/staff'
import { Pagination } from '@/shared/components/ui/pagination'
import { useGetOrderWithPagination } from '@/shared/hooks/orders/useGetOrderWithPagination'
import {
  IoClipboardOutline,
  IoFlagOutline,
  IoTicketOutline,
  IoWalletOutline
} from 'react-icons/io5'
// import type { Product } from '@/shared/types'
// import {  } from '@/shared/types'

const METRICS = [
  {
    title: 'Pending Orders',
    value: '24',
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

function DashboardMetrics() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {METRICS.map((metric, index) => (
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
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const { orders, total, totalPages } = useGetOrderWithPagination(currentPage, itemsPerPage)

  // Mapping Backend Order to UI OrderTableRow
  const mappedOrders = orders.map((order: any) => ({
    id: order._id || order.id,
    orderType: order.type,
    customer: order.customerInfo?.fullName || 'Khách vãng lai',
    item: `Order #${(order._id || order.id)?.slice(-6) || '...'}`,
    waitingFor: '-',
    currentStatus: order.status,
    timeElapsed: 'Just now',
    statusColor: 'bg-blue-100 text-blue-600',
    isNextActive: true
  }))

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

      <OrderTable hiddenColumns={['WAITING FOR']} role="operation" orders={mappedOrders} />

      <div className="mt-6">
        <Pagination
          currentPage={currentPage}
          totalItems={total}
          itemsPerPage={itemsPerPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </Container>
  )
}
