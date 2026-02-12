import { Container } from '@/components'
import { BreadcrumbPath } from '@/components/layout/staff/operationstaff/breadcrumbpath'
import { OrderTable } from '@/components/staff'
import { OrderStatus } from '@/shared/utils/enums/order.enum'
import { useOrders } from '@/features/staff/hooks/orders/useOrders'
import { transformApiOrderToTableOrder } from '@/features/staff/components/OrderTable/orderTransformers'
import { useMemo } from 'react'

export default function OperationCompleteOrdersPage() {
  // Fetch orders với status COMPLETED từ API
  const { data, isLoading, isError } = useOrders(1, 100, OrderStatus.COMPLETED)

  // Transform data từ API sang format của OrderTable
  const orders = useMemo(() => {
    if (!data?.data?.orders?.data) return []
    return data.data.orders.data.map(transformApiOrderToTableOrder)
  }, [data])

  return (
    <Container>
      <div className="mb-8">
        <BreadcrumbPath paths={['Dashboard', 'Complete Orders']} />
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Completed Orders</h1>
        <p className="text-gray-500 mt-1">View all successfully completed and packed orders.</p>
      </div>

      <OrderTable
        orders={orders}
        isLoading={isLoading}
        isError={isError}
        hiddenColumns={['WAITING FOR', 'CUSTOMER']}
        role="operation"
      />
    </Container>
  )
}
