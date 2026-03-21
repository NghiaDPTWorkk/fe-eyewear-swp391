import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { BreadcrumbPath, Container } from '@/components'
import { OrderTable, FilterButtonList } from '@/components/staff'
import { OrderType } from '@/shared/utils/enums/order.enum'
import { useOrderCountStore } from '@/store'
import { OperationPagination } from '@/shared/components/ui/pagination'
import DateRangeTool from '@/components/layout/staff/operation-staff/daterangetool/DateRangeTool'
import toast from 'react-hot-toast'

const PAGE_LIMIT = 10

export default function OperationPackingPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const typeFilter = searchParams.get('type') ?? 'all'
  const [currentPage, setCurrentPage] = useState(1)

  // Date filter state
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [appliedDateRange, setAppliedDateRange] = useState<{ start: string; end: string } | null>(null)

  const setTypeFilter = (value: string) => {
    setCurrentPage(1)
    if (value === 'all') {
      setSearchParams({})
    } else {
      setSearchParams({ type: value })
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

  // Get data from store
  const { orders: allOrders, isLoading, isError } = useOrderCountStore()

  // Filter and Paginate on Client Side
  const { filteredOrders, total } = useMemo(() => {
    let filtered = allOrders.filter((o) => o.currentStatus === 'PACKAGING')

    // 1. Date Range Filter
    if (appliedDateRange) {
      filtered = filtered.filter((o) => {
        if (!o.assignedAt) return false
        const assignedDate = o.assignedAt.split('T')[0]
        const isAfterStart = !appliedDateRange.start || assignedDate >= appliedDateRange.start
        const isBeforeEnd = !appliedDateRange.end || assignedDate <= appliedDateRange.end
        return isAfterStart && isBeforeEnd
      })
    }

    // 2. Type Filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter((o) => o.orderType === typeFilter)
    }

    return {
      filteredOrders: filtered.slice((currentPage - 1) * PAGE_LIMIT, currentPage * PAGE_LIMIT),
      total: filtered.length
    }
  }, [allOrders, typeFilter, appliedDateRange, currentPage])

  // Badge counts for filter buttons: should also reflect the date filter
  const typeFilteredByDate = useMemo(() => {
    const filtered = allOrders.filter((o) => o.currentStatus === 'PACKAGING')
    if (!appliedDateRange) return filtered
    return filtered.filter((o) => {
      if (!o.assignedAt) return false
      const assignedDate = o.assignedAt.split('T')[0]
      const isAfterStart = !appliedDateRange.start || assignedDate >= appliedDateRange.start
      const isBeforeEnd = !appliedDateRange.end || assignedDate <= appliedDateRange.end
      return isAfterStart && isBeforeEnd
    })
  }, [allOrders, appliedDateRange])

  // Badge counts cho filter buttons
  // Badge counts
  const counts = {
    all: typeFilteredByDate.length,
    normal: typeFilteredByDate.filter((o) => o.orderType === OrderType.NORMAL).length,
    preOrder: typeFilteredByDate.filter((o) => o.orderType === OrderType.PRE_ORDER).length,
    manufacturing: typeFilteredByDate.filter((o) => o.orderType === OrderType.MANUFACTURING).length
  }

  const filterButtons = [
    { label: 'All', count: counts.all, value: 'all' },
    { label: 'Normal', count: counts.normal, value: OrderType.NORMAL },
    { label: 'Pre-order', count: counts.preOrder, value: OrderType.PRE_ORDER },
    { label: 'Manufacturing', count: counts.manufacturing, value: OrderType.MANUFACTURING }
  ]

  const totalPages = Math.max(1, Math.ceil(total / PAGE_LIMIT))

  return (
    <Container>
      <div className="mb-4">
        <BreadcrumbPath paths={['Dashboard', 'Packing Station']} />
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Packing Station</h1>
        <p className="text-gray-500 mt-1">Package and prepare orders for shipping.</p>
      </div>

      <FilterButtonList
        buttons={filterButtons}
        selectedValue={typeFilter}
        onChange={setTypeFilter}
        className="mb-6"
      />

      <DateRangeTool
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onSearch={handleSearch}
        onClear={handleClearDates}
        isFiltered={!!appliedDateRange}
      />

      <OrderTable
        orders={filteredOrders}
        isLoading={isLoading}
        isError={isError}
        hiddenColumns={['CUSTOMER']}
        role="operation"
      />

      <OperationPagination
        page={currentPage}
        totalPages={totalPages}
        total={total}
        limit={PAGE_LIMIT}
        itemsOnPage={filteredOrders.length}
        onPageChange={setCurrentPage}
      />
    </Container>
  )
}
