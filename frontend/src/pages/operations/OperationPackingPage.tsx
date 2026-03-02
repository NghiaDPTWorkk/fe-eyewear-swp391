import { useState, useMemo } from 'react'
import { Container } from '@/components'
import { OrderTable } from '@/components/staff'
import { BreadcrumbPath } from '@/components/layout/staff/operationstaff/breadcrumbpath'
import { useOrders } from '@/features/staff/hooks/orders/useOrders'
import { transformApiOrderToTableOrder } from '@/features/staff/components/OrderTable/orderTransformers'
import OperationPagination from '@/pages/operations/OperationPagination'

const PAGE_LIMIT = 10

export default function OperationPackingPage() {
  const [currentPage, setCurrentPage] = useState(1)

  // Fetch orders với status PACKAGING từ API — có phân trang
  const { data, isLoading, isError } = useOrders(currentPage, PAGE_LIMIT, 'PACKAGING')

  // Pagination meta từ BE
  const paginationMeta = data?.data?.orders

  // Transform data từ API sang format của OrderTable
  const orders = useMemo(() => {
    if (!paginationMeta?.data) return []
    return paginationMeta.data.map(transformApiOrderToTableOrder)
  }, [paginationMeta])

  return (
    <Container>
      <div className="mb-8">
        <BreadcrumbPath paths={['Dashboard', 'Packing Station']} />
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Packing Station</h1>
        <p className="text-gray-500 mt-1">Package and prepare orders for shipping.</p>
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
