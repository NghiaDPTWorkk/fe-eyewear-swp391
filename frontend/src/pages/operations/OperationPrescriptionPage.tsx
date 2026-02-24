import { Container } from '@/components'
import { OrderTable } from '@/components/staff'
import { BreadcrumbPath } from '@/components/layout/staff/operationstaff/breadcrumbpath'
import { OrderType } from '@/shared/utils/enums/order.enum'
import { useOrders } from '@/features/staff/hooks/orders/useOrders'
import { transformApiOrderToTableOrder } from '@/features/staff/components/OrderTable/orderTransformers'
import { useMemo } from 'react'

export default function OperationPrescriptionPage() {
  // Fetch orders với type MANUFACTURING và status MAKING từ API to display
  const { data, isLoading, isError } = useOrders(1, 100, 'MAKING', OrderType.MANUFACTURING)

  // Transform data từ API sang format của OrderTable, chỉ hiện đơn MAKING
  const orders = useMemo(() => {
    if (!data?.data?.orders?.data) return []
    return data.data.orders.data
      .filter((o) => o.status === 'MAKING')
      .map(transformApiOrderToTableOrder)
  }, [data])

  return (
    <Container>
      <div className="mb-8">
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
        hiddenColumns={['WAITING FOR']}
        filterType={OrderType.MANUFACTURING}
        role="operation"
      />
    </Container>
  )
}
