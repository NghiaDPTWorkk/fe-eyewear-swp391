import { Container } from '@/components'
import { OrderTable } from '@/components/staff'
import { BreadcrumbPath } from '@/components/layout/staff/operationstaff/breadcrumbpath'
import { useOrders } from '@/features/staff/hooks/orders/useOrders'
import { transformApiOrderToTableOrder } from '@/features/staff/components/OrderTable/orderTransformers'
import { useMemo } from 'react'

export default function OperationPackingPage() {
  // Fetch orders với status PACKAGING từ API
  const { data, isLoading, isError } = useOrders(1, 100, 'PACKAGING')

  // Transform data từ API sang format của OrderTable
  const orders = useMemo(() => {
    if (!data?.data?.orders?.data) return []
    return data.data.orders.data.map(transformApiOrderToTableOrder)
  }, [data])

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
    </Container>
  )
}
