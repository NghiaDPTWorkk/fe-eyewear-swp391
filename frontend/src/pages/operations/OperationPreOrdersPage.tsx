import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { BreadcrumbPath, Container } from '@/components'
import { OrderTable, FilterButtonList } from '@/components/staff'
import { OrderType, OrderStatus } from '@/shared/utils/enums/order.enum'
import { useOrders } from '@/features/staff/hooks/orders/useOrders'
import { transformApiOrderToTableOrder } from '@/features/staff/components/order-table/orderTransformers'
import { OperationPagination } from '@/shared/components/ui/pagination'
import { useOrderCountStore } from '@/store'

const PAGE_LIMIT = 10

export default function OperationPreOrdersPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const statusFilter = searchParams.get('status') ?? 'all'
  const [currentPage, setCurrentPage] = useState(1)

  const setStatusFilter = (value: string) => {
    setCurrentPage(1)
    if (value === 'all') {
      setSearchParams({})
    } else {
      setSearchParams({ status: value })
    }
  }

  // Fetch orders with PRE-ORDER type and statusFilter from API — with pagination
  const { data, isLoading, isError } = useOrders(
    currentPage,
    PAGE_LIMIT,
    statusFilter === 'all' ? undefined : statusFilter,
    OrderType.PRE_ORDER
  )

  // Get data from store to calculate counts for badges
  const { orders: allOrdersForCounts } = useOrderCountStore()

  // Filter to get list of PRE_ORDER orders (removing WAITING_STOCK according to general logic)
  const preOrdersInStore = useMemo(() => {
    return allOrdersForCounts.filter(
      (o) => o.orderType === OrderType.PRE_ORDER && o.currentStatus !== 'WAITING_STOCK'
    )
  }, [allOrdersForCounts])

  // Badge counts cho filter buttons
  const counts = {
    all: preOrdersInStore.length,
    assigned: preOrdersInStore.filter((o) => o.currentStatus === OrderStatus.ASSIGNED).length,
    making: preOrdersInStore.filter((o) => o.currentStatus === OrderStatus.MAKING).length,
    packaging: preOrdersInStore.filter((o) => o.currentStatus === OrderStatus.PACKAGING).length,
    completed: preOrdersInStore.filter((o) => o.currentStatus === OrderStatus.COMPLETED).length
  }

  const filterButtons = [
    { label: 'All', count: counts.all, value: 'all' },
    { label: 'Assigned', count: counts.assigned, value: OrderStatus.ASSIGNED },
    { label: 'Making', count: counts.making, value: OrderStatus.MAKING },
    { label: 'Packing', count: counts.packaging, value: OrderStatus.PACKAGING },
    { label: 'Completed', count: counts.completed, value: OrderStatus.COMPLETED }
  ]

  // Pagination meta from BE
  const paginationMeta = data?.data?.orders

  // Transform data from API to OrderTable format
  const orders = useMemo(() => {
    if (!paginationMeta?.data) return []
    // Note: API already filters by status if provided.
    // We just filter out WAITING_STOCK if it's "all" status (though Layout already did this for the store,
    // the direct API call might still return them if we don't handle it, but here we explicitly ask for PRE_ORDER)
    return paginationMeta.data
      .filter((o: any) => o.status !== 'WAITING_STOCK')
      .map(transformApiOrderToTableOrder)
  }, [paginationMeta])

  return (
    <Container>
      <div className="mb-4">
        <BreadcrumbPath paths={['Dashboard', 'Logistics Waiting Station']} />
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Pre-order Tracking</h1>
        <p className="text-gray-500 mt-1">Monitor pre-orders waiting for product availability.</p>
      </div>

      <FilterButtonList
        buttons={filterButtons}
        selectedValue={statusFilter}
        onChange={setStatusFilter}
        className="mb-6"
      />

      <OrderTable
        orders={orders}
        isLoading={isLoading}
        isError={isError}
        hiddenColumns={['CUSTOMER']}
        filterType={OrderType.PRE_ORDER}
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
