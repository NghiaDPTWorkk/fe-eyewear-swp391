import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { BreadcrumbPath, Container } from '@/components'
import { OrderTable, FilterButtonList } from '@/components/staff'
import { OrderType } from '@/shared/utils/enums/order.enum'
import { useOrderCountStore } from '@/store'
import { OperationPagination } from '@/shared/components/ui/pagination'
import DateRangeTool from '@/components/layout/staff/operation-staff/daterangetool/DateRangeTool'
import toast from 'react-hot-toast'

const PAGE_LIMIT = 10

export default function OperationTechnicalPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const typeFilter = searchParams.get('type') ?? 'all'
  const [currentPage, setCurrentPage] = useState(1)

  // Date filter state
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [appliedDateRange, setAppliedDateRange] = useState<{ start: string; end: string } | null>(
    null
  )

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

  // ═══════════════════════════════════════════════════
  // DATA FLOW:
  // 1. Khi app khởi động, OperationDashboardPage gọi API lấy toàn bộ orders
  //    rồi lưu vào Zustand store (useOrderCountStore) qua setOrders().
  // 2. Trang này đọc thẳng từ store → không cần gọi API riêng.
  // 3. useMemo() filter client-side → truyền vào <OrderTable> và <OperationPagination>.
  // ═══════════════════════════════════════════════════
  const { orders: allOrders, isLoading, isError } = useOrderCountStore()

  // ─── Bước 1: Filter client-side ───────────────────
  // Lọc từ allOrders (Zustand) theo status + date range + type
  // Không gọi API → tức thời, không giật lag
  const { filteredOrders, total } = useMemo(() => {
    let ordersForStation = allOrders.filter((o) => o.currentStatus === 'MAKING')

    // Lọc theo khoảng ngày assignedAt (ngày được giao việc)
    if (appliedDateRange) {
      ordersForStation = ordersForStation.filter((o) => {
        if (!o.assignedAt) return false
        const assignedDate = o.assignedAt.split('T')[0]
        const isAfterStart = !appliedDateRange.start || assignedDate >= appliedDateRange.start
        const isBeforeEnd = !appliedDateRange.end || assignedDate <= appliedDateRange.end
        return isAfterStart && isBeforeEnd
      })
    }

    // Lọc theo loại đơn hàng (type)
    if (typeFilter !== 'all') {
      ordersForStation = ordersForStation.filter((o) => o.orderType === typeFilter)
    }

    // Bước 2: Phân trang client-side (cắt mảng theo page)
    return {
      filteredOrders: ordersForStation.slice(
        (currentPage - 1) * PAGE_LIMIT,
        currentPage * PAGE_LIMIT
      ),
      total: ordersForStation.length
    }
  }, [allOrders, typeFilter, appliedDateRange, currentPage])

  // Badge counts trên các nút filter (All / Pre-order / Manufacturing)
  // Cũng tính lại khi date range thay đổi để số hiển thị luôn chính xác
  const typeFilteredByDate = useMemo(() => {
    const ordersByDate = allOrders.filter((o) => o.currentStatus === 'MAKING')
    if (!appliedDateRange) return ordersByDate
    return ordersByDate.filter((o) => {
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
    preOrder: typeFilteredByDate.filter((o) => o.orderType === OrderType.PRE_ORDER).length,
    manufacturing: typeFilteredByDate.filter((o) => o.orderType === OrderType.MANUFACTURING).length
  }

  const filterButtons = [
    { label: 'All', count: counts.all, value: 'all' },
    { label: 'Pre-order', count: counts.preOrder, value: OrderType.PRE_ORDER },
    { label: 'Manufacturing', count: counts.manufacturing, value: OrderType.MANUFACTURING }
  ]

  const totalPages = Math.max(1, Math.ceil(total / PAGE_LIMIT))

  return (
    <Container>
      <div className="mb-4">
        <BreadcrumbPath paths={['Dashboard', 'Technical Station']} />
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Technical Station</h1>
        <p className="text-gray-500 mt-1">
          Maintenance and technical support for optical equipment.
        </p>
      </div>

      <FilterButtonList
        buttons={filterButtons}
        selectedValue={typeFilter}
        onChange={setTypeFilter}
        className="mb-4"
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

      <div className="mt-[10px]" />

      {/* Bước 3: Truyền dữ liệu đã lọc vào OrderTable */}
      <OrderTable
        orders={filteredOrders}
        isLoading={isLoading}
        isError={isError}
        hiddenColumns={['CUSTOMER']}
        role="operation"
      />

      {/* Bước 4: Truyền thông tin phân trang vào OperationPagination */}
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
