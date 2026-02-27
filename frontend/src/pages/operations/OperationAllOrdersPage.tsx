import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Container } from '@/components'
import { OrderTable, FilterButtonList } from '@/components/staff'
import { BreadcrumbPath } from '@/components/layout/staff/operationstaff/breadcrumbpath'
import { useOrderCountStore } from '@/store'
import type { Order } from '@/features/staff/components/OrderTable/OrderTable'
import { OrderType } from '@/shared/utils/enums/order.enum'
import OperationPagination from '@/pages/operations/OperationPagination'

const PAGE_LIMIT = 10

export default function OperationAllOrdersPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const filter = searchParams.get('filter') ?? 'all'
  const [currentPage, setCurrentPage] = useState(1)

  const setFilter = (value: string) => {
    setCurrentPage(1) // Reset về trang 1 khi đổi filter
    if (value === 'all') {
      setSearchParams({})
    } else {
      setSearchParams({ filter: value })
    }
  }

  // Lấy orders từ Zustand store (đã fetch toàn bộ ở OperationLayout)
  const { orders, isLoading, isError } = useOrderCountStore()

  // Filter theo loại đơn nếu có
  const filteredOrders =
    filter === 'all' ? orders : orders.filter((o: Order) => o.orderType === filter)

  // FE-side pagination: slice data theo currentPage
  const total = filteredOrders.length
  const totalPages = Math.max(1, Math.ceil(total / PAGE_LIMIT))
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * PAGE_LIMIT,
    currentPage * PAGE_LIMIT
  )

  // Badge counts cho filter buttons
  const allCount = orders.length
  const preOrderCount = orders.filter((o: Order) => o.orderType === OrderType.PRE_ORDER).length
  const normalCount = orders.filter((o: Order) => o.orderType === OrderType.NORMAL).length
  const prescriptionCount = orders.filter(
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
      <div className="mb-8">
        <BreadcrumbPath paths={['Dashboard', 'All Orders']} />
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Order List</h1>
        <p className="text-gray-500 mt-1">Manage the entire database of orders in the system.</p>
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
        hiddenColumns={['WAITING FOR', 'CUSTOMER']}
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
