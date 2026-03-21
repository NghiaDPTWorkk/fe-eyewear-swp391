import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Container } from '@/components'
import { OrderTable, FilterButtonList } from '@/components/staff'
import { BreadcrumbPath } from '@/components/layout/staff/operation-staff/breadcrumb-path'
import { useOrderCountStore } from '@/store'
import type { Order } from '@/features/staff/components/order-table/OrderTable'
import { OrderType } from '@/shared/utils/enums/order.enum'
import { OperationPagination } from '@/shared/components/ui/pagination'
import DateRangeTool from '@/components/layout/staff/operation-staff/daterangetool/DateRangeTool'
import toast from 'react-hot-toast'

const PAGE_LIMIT = 10

export default function OperationAllOrdersPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const filter = searchParams.get('filter') ?? 'all'
  const [currentPage, setCurrentPage] = useState(1)

  // Date filter state
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [appliedDateRange, setAppliedDateRange] = useState<{ start: string; end: string } | null>(null)

  const setFilter = (value: string) => {
    setCurrentPage(1) // Reset to page 1 when filter changes
    if (value === 'all') {
      setSearchParams({})
    } else {
      setSearchParams({ filter: value })
    }
  }

  const handleSearch = () => {
    setCurrentPage(1)
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
    setCurrentPage(1)
  }

  // Get orders from Zustand store (fetched entirely in OperationLayout)
  const { orders, isLoading, isError } = useOrderCountStore()

  // Filter by date range and order type
  const filteredOrders = useMemo(() => {
    let result = orders

    // 1. Date Range Filter (based on assignedAt)
    if (appliedDateRange) {
      result = result.filter((o: Order) => {
        if (!o.assignedAt) return false
        const assignedDate = o.assignedAt.split('T')[0] // Get YYYY-MM-DD
        const isAfterStart = !appliedDateRange.start || assignedDate >= appliedDateRange.start
        const isBeforeEnd = !appliedDateRange.end || assignedDate <= appliedDateRange.end
        return isAfterStart && isBeforeEnd
      })
    }

    // 2. Type Filter
    if (filter !== 'all') {
      result = result.filter((o: Order) => o.orderType === filter)
    }

    return result
  }, [orders, filter, appliedDateRange])

  // FE-side pagination: slice data theo currentPage
  const total = filteredOrders.length
  const totalPages = Math.max(1, Math.ceil(total / PAGE_LIMIT))
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * PAGE_LIMIT,
    currentPage * PAGE_LIMIT
  )

  // Badge counts for filter buttons: count directly from filtered orders list in Layout
  // Badge counts for filter buttons: should also reflect the date filter for consistency
  const typeFilteredByDate = useMemo(() => {
    if (!appliedDateRange) return orders
    return orders.filter((o: Order) => {
      if (!o.assignedAt) return false
      const assignedDate = o.assignedAt.split('T')[0]
      const isAfterStart = !appliedDateRange.start || assignedDate >= appliedDateRange.start
      const isBeforeEnd = !appliedDateRange.end || assignedDate <= appliedDateRange.end
      return isAfterStart && isBeforeEnd
    })
  }, [orders, appliedDateRange])

  const allCount = typeFilteredByDate.length
  const preOrderCount = typeFilteredByDate.filter((o: Order) => o.orderType === OrderType.PRE_ORDER).length
  const normalCount = typeFilteredByDate.filter((o: Order) => o.orderType === OrderType.NORMAL).length
  const prescriptionCount = typeFilteredByDate.filter(
    (o: Order) => o.orderType === OrderType.MANUFACTURING
  ).length

  const filterButtons = [
    { label: 'All', count: allCount, value: 'all' },
    { label: 'Pre-order', count: preOrderCount, value: OrderType.PRE_ORDER },
    { label: 'Normal', count: normalCount, value: OrderType.NORMAL },
    { label: 'Manufacturing', count: prescriptionCount, value: OrderType.MANUFACTURING }
  ]

  return (
    <Container>
      <div className="mb-4">
        <BreadcrumbPath paths={['Dashboard', 'All Orders']} />
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Order List</h1>
        <p className="text-sm md:text-base text-gray-500 mt-1">
          Manage the entire database of orders in the system.
        </p>

        <DateRangeTool
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onSearch={handleSearch}
          onClear={handleClearDates}
          isFiltered={!!appliedDateRange}
        />
      </div>

      <FilterButtonList
        buttons={filterButtons}
        selectedValue={filter}
        onChange={setFilter}
        className="mb-6"
      />

      <OrderTable
        orders={paginatedOrders}
        isLoading={isLoading}
        isError={isError}
        hiddenColumns={['CUSTOMER']}
        filterType={filter === 'all' ? undefined : filter}
        role="operation"
      />

      <OperationPagination
        page={currentPage}
        totalPages={totalPages}
        total={total}
        limit={PAGE_LIMIT}
        itemsOnPage={paginatedOrders.length}
        onPageChange={setCurrentPage}
      />
    </Container>
  )
}
