import { useState, useMemo } from 'react'
import { Container } from '@/components'
import { OrderTable } from '@/components/staff'
import { BreadcrumbPath } from '@/components/layout/staff/operation-staff/breadcrumb-path'
import { OrderType } from '@/shared/utils/enums/order.enum'
import { useOrders } from '@/features/staff/hooks/orders/useOrders'
import { transformApiOrderToTableOrder } from '@/shared/components/staff/staff-core/order-table/order-utils'
import { OperationPagination } from '@/shared/components/ui/pagination'

const PAGE_LIMIT = 10

export default function OperationPrescriptionPage() {
  const [currentPage, setCurrentPage] = useState(1)

  const { data, isLoading, isError } = useOrders(
    currentPage,
    PAGE_LIMIT,
    'MAKING',
    OrderType.MANUFACTURING
  )

  const paginationMeta = data?.data?.orders

  const orders = useMemo(() => {
    if (!paginationMeta?.data) return []
    return paginationMeta.data
      .filter((o) => o.status === 'MAKING')
      .map(transformApiOrderToTableOrder)
  }, [paginationMeta])

  return (
    <Container>
      <div className="mb-4">
        <BreadcrumbPath paths={['Dashboard', 'Technical']} />
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Manufacturing Orders</h1>
        <p className="text-gray-500 mt-1">
          Manage technical specifications and lens processing status.
        </p>
      </div>

      <OrderTable
        orders={orders}
        isLoading={isLoading}
        isError={isError}
        hiddenColumns={['CUSTOMER']}
        filterType={OrderType.MANUFACTURING}
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
