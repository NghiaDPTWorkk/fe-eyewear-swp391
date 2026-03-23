import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Container, MetricCard } from '@/components'
import { OrderTable } from '@/components/staff'
import { IoClipboardOutline, IoBuildOutline } from 'react-icons/io5'
import { FaBoxesPacking } from 'react-icons/fa6'
import { AiOutlineFileDone } from 'react-icons/ai'
import { useOrderCountStore } from '@/store'
import { OrderStatus } from '@/shared/utils/enums/order.enum'

function DashboardMetrics() {
  const { orders } = useOrderCountStore()

  const todayStr = new Date().toLocaleDateString('en-CA') // YYYY-MM-DD

  const countsToday = useMemo(() => {
    const assigned = orders.filter(
      (o) => o.currentStatus === OrderStatus.ASSIGNED && o.assignedAt?.startsWith(todayStr)
    ).length
    const technical = orders.filter(
      (o) => o.currentStatus === OrderStatus.MAKING && o.assignedAt?.startsWith(todayStr)
    ).length
    const packing = orders.filter(
      (o) => o.currentStatus === OrderStatus.PACKAGING && o.assignedAt?.startsWith(todayStr)
    ).length
    const completed = orders.filter(
      (o) => o.currentStatus === OrderStatus.COMPLETED && o.assignedAt?.startsWith(todayStr)
    ).length

    return { assigned, technical, packing, completed }
  }, [orders, todayStr])

  const metrics = [
    {
      title: 'Pending Orders',
      value: countsToday.assigned.toString(),
      icon: <IoClipboardOutline className="text-2xl" />,
      trend: null,
      progress: { value: 30, colorClass: 'bg-orange-500' },
      colorScheme: 'warning' as const
    },
    {
      title: 'Technical Station',
      value: countsToday.technical.toString(),
      icon: <IoBuildOutline className="text-2xl" />,
      trend: null,
      progress: { value: 50, colorClass: 'bg-emerald-500' },
      colorScheme: 'success' as const
    },
    {
      title: 'Packing Station',
      value: countsToday.packing.toString(),
      icon: <FaBoxesPacking className="text-2xl" />,
      trend: null,
      progress: { value: 20, colorClass: 'bg-red-500' },
      colorScheme: 'danger' as const
    },
    {
      title: 'Completed Today',
      value: countsToday.completed.toString(),
      icon: <AiOutlineFileDone className="text-2xl" />,
      trend: null,
      progress: { value: 100, colorClass: 'bg-blue-600' },
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
          icon={metric.icon}
          colorScheme={metric.colorScheme}
          progress={metric.progress}
        />
      ))}
    </div>
  )
}

export default function OperationDashboardPage() {
  const { orders, isLoading, isError } = useOrderCountStore()

  const prioritizedOrders = useMemo(() => {
    if (!orders) return []

    // 1. Filter: Only keep incomplete orders
    const filtered = orders.filter((o) => o.currentStatus !== OrderStatus.COMPLETED)

    // 2. Sort: Orders with oldest assignedAt or createdAt first
    return [...filtered].sort((a, b) => {
      const timeA = new Date(a.assignedAt || a.createdAt).getTime()
      const timeB = new Date(b.assignedAt || b.createdAt).getTime()
      return timeA - timeB // Ascending sort: older (smaller) time first
    })
  }, [orders])

  return (
    <Container>
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm mb-2 font-medium">
          <Link
            to="/operation-staff/dashboard"
            className="text-neutral-400 hover:text-primary-500 transition-colors"
          >
            Dashboard
          </Link>
          <span className="text-neutral-300">/</span>
          <span className="text-primary-500 font-bold">Operations</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
          Operation Hub
        </h1>
        <p className="text-sm md:text-base text-gray-500 mt-1">
          Monitor priority orders and technical station status.
        </p>

        <div className="mt-5">
          <DashboardMetrics />
        </div>
      </div>
      <h4 className="text-primary-600 font-bold text-xl mb-4">Priority Orders</h4>
      <OrderTable
        orders={prioritizedOrders}
        isLoading={isLoading}
        isError={isError}
        hiddenColumns={['WAITING FOR', 'CUSTOMER']}
        role="operation"
      />
    </Container>
  )
}
