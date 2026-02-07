import { Container } from '@/components'
import { BreadcrumbPath } from '@/components/layout/staff/operationstaff/breadcrumbpath'
import { OrderTable } from '@/components/staff'
import { OrderStatus } from '@/shared/utils/enums/order.enum'
import { useOrderCountStore } from '@/store'

export default function OperationCompleteOrdersPage() {
  const { orders } = useOrderCountStore()

  // Filter only completed orders
  const completedOrders = orders.filter((order) => order.currentStatus === OrderStatus.COMPLETED)

  return (
    <Container>
      <div className="mb-8">
        <BreadcrumbPath paths={['Dashboard', 'Complete Orders']} />
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Completed Orders</h1>
        <p className="text-gray-500 mt-1">View all successfully completed and packed orders.</p>
      </div>

      <OrderTable orders={completedOrders} hiddenColumns={['WAITING FOR']} role="operation" />
    </Container>
  )
}
