import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Container, MetricCard } from '@/components'
import { OrderTable } from '@/components/staff'
import { IoClipboardOutline, IoBuildOutline } from 'react-icons/io5'
import { FaBoxesPacking } from 'react-icons/fa6'
import { AiOutlineFileDone } from 'react-icons/ai'
import { useOrderCountStore } from '@/store'
import { OrderType, OrderStatus } from '@/shared/utils/enums/order.enum'
import DateRangeTool from '@/components/layout/staff/operation-staff/daterangetool/DateRangeTool'
import toast from 'react-hot-toast'

function DashboardMetrics({
  appliedDateRange
}: {
  appliedDateRange: { start: string; end: string } | null
}) {
  const { counts, orders } = useOrderCountStore()

  const metrics = useMemo(() => {
    // If no filter, use static counts from store
    if (!appliedDateRange) {
      return [
        {
          title: 'Pending Orders',
          value: counts.assigned.toString(),
          icon: <IoClipboardOutline className="text-2xl" />,
          trend: null,
          progress: { value: 30, colorClass: 'bg-orange-500' },
          colorScheme: 'warning' as const
        },
        {
          title: 'Technical Station',
          value: counts.technical.toString(),
          icon: <IoBuildOutline className="text-2xl" />,
          trend: null,
          progress: { value: 50, colorClass: 'bg-emerald-500' },
          colorScheme: 'success' as const
        },
        {
          title: 'Packing Station',
          value: counts.packing.toString(),
          icon: <FaBoxesPacking className="text-2xl" />,
          trend: null,
          progress: { value: 20, colorClass: 'bg-red-500' },
          colorScheme: 'danger' as const
        },
        {
          title: 'Completed',
          value: counts.completed.toString(),
          icon: <AiOutlineFileDone className="text-2xl" />,
          trend: null,
          progress: { value: 100, colorClass: 'bg-blue-600' },
          colorScheme: 'primary' as const
        }
      ]
    }

    // If filter applied, calculate from current orders array manually
    const filtered = orders.filter((o) => {
      const date = (o.assignedAt || o.createdAt).split('T')[0]
      const isAfterStart = !appliedDateRange.start || date >= appliedDateRange.start
      const isBeforeEnd = !appliedDateRange.end || date <= appliedDateRange.end
      return isAfterStart && isBeforeEnd
    })

    const assigned = filtered.filter((o) => o.currentStatus === OrderStatus.ASSIGNED).length
    const technical = filtered.filter(
      (o) => o.orderType === OrderType.MANUFACTURING && o.currentStatus === OrderStatus.MAKING
    ).length
    const packing = filtered.filter((o) => o.currentStatus === OrderStatus.PACKAGING).length
    const completed = filtered.filter((o) => o.currentStatus === OrderStatus.COMPLETED).length

    return [
      {
        title: 'Pending Orders',
        value: assigned.toString(),
        icon: <IoClipboardOutline className="text-2xl" />,
        trend: null,
        progress: { value: 30, colorClass: 'bg-orange-500' },
        colorScheme: 'warning' as const
      },
      {
        title: 'Technical Station',
        value: technical.toString(),
        icon: <IoBuildOutline className="text-2xl" />,
        trend: null,
        progress: { value: 50, colorClass: 'bg-emerald-500' },
        colorScheme: 'success' as const
      },
      {
        title: 'Packing Station',
        value: packing.toString(),
        icon: <FaBoxesPacking className="text-2xl" />,
        trend: null,
        progress: { value: 20, colorClass: 'bg-red-500' },
        colorScheme: 'danger' as const
      },
      {
        title: 'Completed',
        value: completed.toString(),
        icon: <AiOutlineFileDone className="text-2xl" />,
        trend: null,
        progress: { value: 100, colorClass: 'bg-blue-600' },
        colorScheme: 'primary' as const
      }
    ]
  }, [appliedDateRange, counts, orders])

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

  // Date filter state
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [appliedDateRange, setAppliedDateRange] = useState<{ start: string; end: string } | null>(
    null
  )

  const handleSearch = () => {
    if (!startDate && !endDate) {
      setAppliedDateRange(null)
      return
    }
    if (startDate && endDate && startDate > endDate) {
      toast.error('Start date cannot be later than end date')
      return
    }
    setAppliedDateRange({ start: startDate, end: endDate })
  }

  const handleClearDates = () => {
    setStartDate('')
    setEndDate('')
    setAppliedDateRange(null)
  }

  const prioritizedOrders = useMemo(() => {
    if (!orders) return []

    // 1. Filter: Only keep incomplete orders
    let filtered = orders.filter((o) => o.currentStatus !== OrderStatus.COMPLETED)

    // 2. Filter by date if applied
    if (appliedDateRange) {
      filtered = filtered.filter((o) => {
        const date = (o.assignedAt || o.createdAt).split('T')[0]
        const isAfterStart = !appliedDateRange.start || date >= appliedDateRange.start
        const isBeforeEnd = !appliedDateRange.end || date <= appliedDateRange.end
        return isAfterStart && isBeforeEnd
      })
    }

    // 3. Sort: Orders with oldest assignedAt or createdAt first
    return [...filtered].sort((a, b) => {
      const timeA = new Date(a.assignedAt || a.createdAt).getTime()
      const timeB = new Date(b.assignedAt || b.createdAt).getTime()
      return timeA - timeB // Ascending sort: older (smaller) time first
    })
  }, [orders, appliedDateRange])

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
          <DashboardMetrics appliedDateRange={appliedDateRange} />
        </div>
      </div>
      <DateRangeTool
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onSearch={handleSearch}
        onClear={handleClearDates}
        isFiltered={!!appliedDateRange}
      />
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
