import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { BreadcrumbPath, Container } from '@/components'
import { OrderTable, FilterButtonList } from '@/components/staff'
import { useOrders } from '@/features/staff/hooks/orders/useOrders'
import { OperationPagination } from '@/shared/components/ui/pagination'
import { OrderType, OrderStatus } from '@/shared/utils/enums/order.enum'
import { useOrderCountStore } from '@/store'
import { transformApiOrderToTableOrder } from '@/shared/components/staff/staff-core/order-table/order-utils'

const PAGE_LIMIT = 10

export default function OperationTechnicalPage() {
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
    OrderStatus.MAKING,
    typeFilter === 'all' ? undefined : typeFilter
  )

  const { orders: allOrdersForCounts } = useOrderCountStore()

  const technicalOrdersInStore = useMemo(() => {
    return allOrdersForCounts.filter((o) => o.currentStatus === OrderStatus.MAKING)
  }, [allOrdersForCounts])

  const counts = {
    all: technicalOrdersInStore.length,
    preOrder: technicalOrdersInStore.filter((o) => o.orderType === OrderType.PRE_ORDER).length,
    manufacturing: technicalOrdersInStore.filter((o) => o.orderType === OrderType.MANUFACTURING)
      .length
  }

  const filterButtons = [
    { label: 'All', count: counts.all, value: 'all' },
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
