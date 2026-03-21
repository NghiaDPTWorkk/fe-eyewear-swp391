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

  // Get data from store
  const { orders: allOrders, isLoading, isError } = useOrderCountStore()

  // Filter and Paginate on Client Side
  const { filteredOrders, total } = useMemo(() => {
    // Technical/Manufacturing: only MAKING status + MANUFACTURING type
    let result = allOrders.filter(
      (o) => o.currentStatus === 'MAKING' && o.orderType === OrderType.MANUFACTURING
    )

    // 1. Date Range Filter
    if (appliedDateRange) {
      result = result.filter((o) => {
        if (!o.assignedAt) return false
        const assignedDate = o.assignedAt.split('T')[0]
        const isAfterStart = !appliedDateRange.start || assignedDate >= appliedDateRange.start
        const isBeforeEnd = !appliedDateRange.end || assignedDate <= appliedDateRange.end
        return isAfterStart && isBeforeEnd
      })
    }

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

      <OrderTable
        orders={filteredOrders}
        isLoading={isLoading}
        isError={isError}
        hiddenColumns={['CUSTOMER']}
        filterType={OrderType.MANUFACTURING}
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
