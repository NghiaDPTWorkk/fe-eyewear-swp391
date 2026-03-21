import { useState, useMemo } from 'react'
import { Container } from '@/components'
import { OrderTable } from '@/components/staff'
import { BreadcrumbPath } from '@/components/layout/staff/operation-staff/breadcrumb-path'
import { OrderType } from '@/shared/utils/enums/order.enum'
import { useOrderCountStore } from '@/store'
import { OperationPagination } from '@/shared/components/ui/pagination'
import DateRangeTool from '@/components/layout/staff/operation-staff/daterangetool/DateRangeTool'
import toast from 'react-hot-toast'

const PAGE_LIMIT = 10

export default function OperationPrescriptionPage() {
  const [currentPage, setCurrentPage] = useState(1)

  // Date filter state
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [appliedDateRange, setAppliedDateRange] = useState<{ start: string; end: string } | null>(null)

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
  // 3. useMemo() filter client-side theo status MAKING + type MANUFACTURING
  //    + date range (assignedAt) → truyền vào <OrderTable> và <OperationPagination>.
  // ═══════════════════════════════════════════════════
  const { orders: allOrders, isLoading, isError } = useOrderCountStore()

  // ─── Bước 1: Filter client-side ───────────────────
  // Chỉ lấy đơn status=MAKING và type=MANUFACTURING (đơn cần mài kính)
  const { filteredOrders, total } = useMemo(() => {
    let result = allOrders.filter(
      (o) => o.currentStatus === 'MAKING' && o.orderType === OrderType.MANUFACTURING
    )

    // Lọc thêm theo khoảng ngày (assignedAt)
    if (appliedDateRange) {
      result = result.filter((o) => {
        if (!o.assignedAt) return false
        const assignedDate = o.assignedAt.split('T')[0]
        const isAfterStart = !appliedDateRange.start || assignedDate >= appliedDateRange.start
        const isBeforeEnd = !appliedDateRange.end || assignedDate <= appliedDateRange.end
        return isAfterStart && isBeforeEnd
      })
    }

    // Bước 2: Phân trang client-side
    return {
      filteredOrders: result.slice((currentPage - 1) * PAGE_LIMIT, currentPage * PAGE_LIMIT),
      total: result.length
    }
  }, [allOrders, appliedDateRange, currentPage])

  const totalPages = Math.max(1, Math.ceil(total / PAGE_LIMIT))

  return (
    <Container>
      <div className="mb-4">
        <BreadcrumbPath paths={['Dashboard', 'Technical']} />
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Manufacturing Orders</h1>
        <p className="text-gray-500 mt-1">
          Manage technical specifications and lens processing status.
        </p>
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

      {/* Bước 3: Truyền dữ liệu đã lọc vào OrderTable */}
      <OrderTable
        orders={filteredOrders}
        isLoading={isLoading}
        isError={isError}
        hiddenColumns={['CUSTOMER']}
        filterType={OrderType.MANUFACTURING}
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
