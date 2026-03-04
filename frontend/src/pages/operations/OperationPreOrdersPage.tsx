import { useState, useMemo } from 'react'
import { Container } from '@/components'
import { OrderTable } from '@/components/staff'
import { BreadcrumbPath } from '@/components/layout/staff/operationstaff/breadcrumbpath'
import { OrderType } from '@/shared/utils/enums/order.enum'
import { useOrders } from '@/features/staff/hooks/orders/useOrders'
import { transformApiOrderToTableOrder } from '@/features/staff/components/OrderTable/orderTransformers'
import { OperationPagination } from '@/shared/components/ui/pagination'

const PAGE_LIMIT = 10

export default function OperationPreOrdersPage() {
  const [currentPage, setCurrentPage] = useState(1)

  // Fetch orders với type PRE-ORDER từ API — có phân trang
  const { data, isLoading, isError } = useOrders(
    currentPage,
    PAGE_LIMIT,
    undefined,
    OrderType.PRE_ORDER
  )

  // Pagination meta từ BE
  const paginationMeta = data?.data?.orders

  // Transform data từ API sang format của OrderTable
  const orders = useMemo(() => {
    if (!paginationMeta?.data) return []
    return paginationMeta.data
      .filter((o) =>
        Array.isArray(o.type)
          ? o.type.includes(OrderType.PRE_ORDER)
          : o.type === OrderType.PRE_ORDER
      )
      .map(transformApiOrderToTableOrder)
  }, [paginationMeta])

  return (
    <Container>
      <div className="mb-8">
        <BreadcrumbPath paths={['Dashboard', 'Logistics Waiting Station']} />
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Pre-order Tracking</h1>
        <p className="text-gray-500 mt-1">Monitor pre-orders waiting for product availability.</p>
      </div>

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
