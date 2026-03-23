import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { BreadcrumbPath } from '@/components/layout/staff/operation-staff/breadcrumb-path'
import { Container } from '@/components'
import { OrderTable, FilterButtonList } from '@/components/staff'
import { OrderStatus, OrderType } from '@/shared/utils/enums/order.enum'
import { useOrderCountStore } from '@/store'
import { OperationPagination } from '@/shared/components/ui/pagination'
import DateRangeTool from '@/components/layout/staff/operation-staff/daterangetool/DateRangeTool'
import toast from 'react-hot-toast'

const PAGE_LIMIT = 10

export default function OperationCompleteOrdersPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const typeFilter = searchParams.get('type') ?? 'all'
  const statusFilter = searchParams.get('status') ?? OrderStatus.COMPLETED
  const [currentPage, setCurrentPage] = useState(1)

  // Date filter state
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [appliedDateRange, setAppliedDateRange] = useState<{ start: string; end: string } | null>(
    null
  )

  const setTypeFilter = (value: string) => {
    setCurrentPage(1)
    setSearchParams(
      (prev) => {
        if (value === 'all') prev.delete('type')
        else prev.set('type', value)
        return prev
      },
      { replace: true }
    )
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

  // ═══════════════════════════════════════════════════
  // DATA FLOW:
  // 1. OperationDashboardPage gọi API → lưu vào Zustand store (useOrderCountStore).
  // 2. Trang này ĐỌC THẲNG từ store → không cần fetch API riêng.
  // 3. useMemo() filter theo statusFilter (COMPLETED / CANCELED...) + date range
  //    → truyền vào <OrderTable> và <OperationPagination>.
  // ═══════════════════════════════════════════════════
  const { orders: allOrders, isLoading, isError } = useOrderCountStore()

  // ─── Bước 1: Filter client-side ───────────────────
  // Lọc đơn theo statusFilter (lấy từ URL params) + date range + type
  const { filteredOrders, total } = useMemo(() => {
    let filtered = allOrders.filter((o) => o.currentStatus === statusFilter)

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
  }, [allOrders, statusFilter, typeFilter, appliedDateRange, currentPage])

  // Badge counts trên các nút filter (cũng tính lại theo date range)
  const typeFilteredByDate = useMemo(() => {
    const filtered = allOrders.filter((o) => o.currentStatus === statusFilter)
    if (!appliedDateRange) return filtered
    return filtered.filter((o) => {
      if (!o.assignedAt) return false
      const assignedDate = o.assignedAt.split('T')[0]
      const isAfterStart = !appliedDateRange.start || assignedDate >= appliedDateRange.start
      const isBeforeEnd = !appliedDateRange.end || assignedDate <= appliedDateRange.end
      return isAfterStart && isBeforeEnd
    })
  }, [allOrders, statusFilter, appliedDateRange])

  // Badge counts for Type Filter (based on current status)
  const typeCounts = {
    all: typeFilteredByDate.length,
    normal: typeFilteredByDate.filter((o) => o.orderType === OrderType.NORMAL).length,
    preOrder: typeFilteredByDate.filter((o) => o.orderType === OrderType.PRE_ORDER).length,
    manufacturing: typeFilteredByDate.filter((o) => o.orderType === OrderType.MANUFACTURING).length
  }

  const typeButtons = [
    { label: 'All Types', count: typeCounts.all, value: 'all' },
    { label: 'Normal', count: typeCounts.normal, value: OrderType.NORMAL },
    { label: 'Pre-order', count: typeCounts.preOrder, value: OrderType.PRE_ORDER },
    { label: 'Manufacturing', count: typeCounts.manufacturing, value: OrderType.MANUFACTURING }
  ]

  const totalPages = Math.max(1, Math.ceil(total / PAGE_LIMIT))

  return (
    <Container>
      <div className="mb-4">
        <BreadcrumbPath paths={['Dashboard', 'Complete Orders']} />
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Completed Orders</h1>
        <p className="text-gray-500 mt-1">View all successfully completed and packed orders.</p>
      </div>

      <div className="flex flex-col gap-4 mb-0">
        <FilterButtonList
          buttons={typeButtons}
          selectedValue={typeFilter}
          onChange={setTypeFilter}
        />
      </div>
      <div style={{ marginTop: '-25px' }}>
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
      <OrderTable
        orders={filteredOrders}
        isLoading={isLoading}
        isError={isError}
        hiddenColumns={['WAITING FOR', 'CUSTOMER']}
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
