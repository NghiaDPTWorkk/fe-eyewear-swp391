import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { BreadcrumbPath, Container } from '@/components'
import { OrderTable, FilterButtonList } from '@/components/staff'
import { useOrders } from '@/features/staff/hooks/orders/useOrders'
import { transformApiOrderToTableOrder } from '@/shared/components/staff/staff-core/order-table/order-utils'
import { OperationPagination } from '@/shared/components/ui/pagination'
import { OrderType, OrderStatus } from '@/shared/utils/enums/order.enum'
import { useOrderCountStore } from '@/store'

const PAGE_LIMIT = 10

export default function OperationPackingPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const typeFilter = searchParams.get('type') ?? 'all'
  const [currentPage, setCurrentPage] = useState(1)

  const setTypeFilter = (value: string) => {
    setCurrentPage(1)
    if (value === 'all') {
      setSearchParams({})
    } else {
      setSearchParams({ type: value })
    }
  }

  const { data, isLoading, isError } = useOrders(
    currentPage,
    PAGE_LIMIT,
    OrderStatus.PACKAGING,
    typeFilter === 'all' ? undefined : typeFilter
  )

  const { orders: allOrdersForCounts } = useOrderCountStore()

  const packingOrdersInStore = useMemo(() => {
    return allOrdersForCounts.filter((o) => o.currentStatus === OrderStatus.PACKAGING)
  }, [allOrdersForCounts])

  const counts = {
    all: packingOrdersInStore.length,
    normal: packingOrdersInStore.filter((o) => o.orderType === OrderType.NORMAL).length,
    preOrder: packingOrdersInStore.filter((o) => o.orderType === OrderType.PRE_ORDER).length,
    manufacturing: packingOrdersInStore.filter((o) => o.orderType === OrderType.MANUFACTURING)
      .length
  }

  const filterButtons = [
    { label: 'All', count: counts.all, value: 'all' },
    { label: 'Normal', count: counts.normal, value: OrderType.NORMAL },
    { label: 'Pre-order', count: counts.preOrder, value: OrderType.PRE_ORDER },
    { label: 'Manufacturing', count: counts.manufacturing, value: OrderType.MANUFACTURING }
  ]

  const paginationMeta = data?.data?.orders

  const orders = useMemo(() => {
    if (!paginationMeta?.data) return []
    return paginationMeta.data.map(transformApiOrderToTableOrder)
  }, [paginationMeta])

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

      <OrderTable
        orders={orders}
        isLoading={isLoading}
        isError={isError}
        hiddenColumns={['CUSTOMER']}
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
