import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Container } from '@/components'
import { OrderTable } from '@/components/staff'
import { Pagination } from '@/shared/components/ui/pagination'
import { useGetOrderWithType } from '@/shared/hooks/orders/useGetOrderWithType'

export default function OperationPreOrdersPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const { orders, total, totalPages } = useGetOrderWithType(currentPage, itemsPerPage, 'Pre-order')

  const mappedOrders = orders.map((order: any) => ({
    id: order._id || order.id,
    orderType: 'Pre-order',
    customer: order.customerInfo?.fullName || 'Khách hàng',
    item: `Order #${(order._id || order.id)?.slice(-6) || '...'}`,
    waitingFor: '-',
    currentStatus: order.status || 'Pending',
    timeElapsed: '2h',
    statusColor: 'bg-amber-50 text-amber-600',
    isNextActive: true
  }))

  return (
    <Container>
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm mb-2 font-medium">
          <Link
            to="/operationstaff/dashboard"
            className="text-neutral-400 hover:text-primary-500 transition-colors"
          >
            Dashboard
          </Link>
          <span className="text-neutral-300">/</span>
          <span className="text-primary-500 font-bold">Logistics Waiting Station</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Pre-order Tracking</h1>
      </div>

      <OrderTable filterType="Pre-order" orders={mappedOrders} />

      <div className="mt-6">
        <Pagination
          currentPage={currentPage}
          totalItems={total}
          itemsPerPage={itemsPerPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </Container>
  )
}
