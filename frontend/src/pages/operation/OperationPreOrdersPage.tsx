import { Container } from '@/components'
import OrderTable from '@/components/staff/ordertable/OrderTable'

export default function PreOrder() {
  return (
    <Container>
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
          <span>Logistics Waiting Station</span>
          <span>/</span>
          <span className="text-gray-600 font-medium">Pre-Orders</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Pre-Orders</h1>
        <p className="text-gray-500 mt-1">
          Manage items waiting for stock or advanced fulfillment.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-0">
          <OrderTable filterType="Pre-order" />
        </div>
      </div>
    </Container>
  )
}
