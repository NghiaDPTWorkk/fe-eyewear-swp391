import { Container } from '@/components'
import { OrderTable } from '@/components/staff'
import { BreadcrumbPath } from '@/components/layout/staff/operationstaff/breadcrumbpath'
import { OrderType } from '@/shared/utils/enums/order.enum'
import { useOrders } from '@/features/staff/hooks/orders/useOrders'
import { transformApiOrderToTableOrder } from '@/features/staff/components/OrderTable/orderTransformers'
import { useMemo } from 'react'

export default function OperationPreOrdersPage() {
  // Fetch orders với type PRE-ORDER từ API
  const { data, isLoading, isError } = useOrders(1, 100, undefined, OrderType.PRE_ORDER)

  // Transform data từ API sang format của OrderTable
  const orders = useMemo(() => {
    if (!data?.data?.orders?.data) return []
    return data.data.orders.data.map(transformApiOrderToTableOrder)
  }, [data])

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
    </Container>
  )
}
