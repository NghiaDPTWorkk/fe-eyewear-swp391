import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { BreadcrumbPath } from '@/components/layout/staff/operation-staff/breadcrumb-path'
import { Container } from '@/components'
import { OrderTable, FilterButtonList } from '@/components/staff'
import { OrderStatus, OrderType } from '@/shared/utils/enums/order.enum'
import { useOrders } from '@/features/staff/hooks/orders/useOrders'
import { transformApiOrderToTableOrder } from '@/features/staff/components/order-table/orderTransformers'
import { OperationPagination } from '@/shared/components/ui/pagination'
import { useOrderCountStore } from '@/store'

const PAGE_LIMIT = 10

export default function OperationCompleteOrdersPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const typeFilter = searchParams.get('type') ?? 'all'
  const statusFilter = searchParams.get('status') ?? OrderStatus.COMPLETED
  const [currentPage, setCurrentPage] = useState(1)

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


  // Fetch orders với statusFilter và typeFilter từ API — có phân trang
  const { data, isLoading, isError } = useOrders(
    currentPage,
    PAGE_LIMIT,
    statusFilter,
    typeFilter === 'all' ? undefined : typeFilter
  )

  // Lấy dữ liệu từ store để tính counts cho badges
  const { orders: allOrdersForCounts } = useOrderCountStore()

  // Badge counts cho Type Filter (dựa trên status hiện tại)
  const typeCounts = {
    all: allOrdersForCounts.filter((o) => o.currentStatus === statusFilter).length,
    normal: allOrdersForCounts.filter(
      (o) => o.currentStatus === statusFilter && o.orderType === OrderType.NORMAL
    ).length,
    preOrder: allOrdersForCounts.filter(
      (o) => o.currentStatus === statusFilter && o.orderType === OrderType.PRE_ORDER
    ).length,
    manufacturing: allOrdersForCounts.filter(
      (o) => o.currentStatus === statusFilter && o.orderType === OrderType.MANUFACTURING
    ).length
  }

  const typeButtons = [
    { label: 'All Types', count: typeCounts.all, value: 'all' },
    { label: 'Normal', count: typeCounts.normal, value: OrderType.NORMAL },
    { label: 'Pre-order', count: typeCounts.preOrder, value: OrderType.PRE_ORDER },
    { label: 'Manufacturing', count: typeCounts.manufacturing, value: OrderType.MANUFACTURING }
  ]



  // Pagination meta từ BE
  const paginationMeta = data?.data?.orders

  // Transform data từ API sang format của OrderTable
  const orders = useMemo(() => {
    if (!paginationMeta?.data) return []
    return paginationMeta.data.map(transformApiOrderToTableOrder)
  }, [paginationMeta])

  return (
    <Container>
      <div className="mb-4">
        <BreadcrumbPath paths={['Dashboard', 'Complete Orders']} />
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Completed Orders</h1>
        <p className="text-gray-500 mt-1">View all successfully completed and packed orders.</p>
      </div>

      <div className="flex flex-col gap-4 mb-1">
        <FilterButtonList
          buttons={typeButtons}
          selectedValue={typeFilter}
          onChange={setTypeFilter}
        />
      </div>

      <OrderTable
        orders={orders}
        isLoading={isLoading}
        isError={isError}
        hiddenColumns={['WAITING FOR', 'CUSTOMER']}
        role="operation"
      />

      {paginationMeta && orders.length > 0 && (
        <OperationPagination
          page={paginationMeta.page}
          totalPages={paginationMeta.totalPages}
          total={paginationMeta.total}
          limit={paginationMeta.limit}
          itemsOnPage={orders.length}
          onPageChange={setCurrentPage}
        />
      )}
    </Container>
  )
}
