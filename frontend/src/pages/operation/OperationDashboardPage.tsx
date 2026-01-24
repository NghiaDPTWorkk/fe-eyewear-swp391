import { Container } from '@/components'
import OrderTable from '@/components/staff/ordertable/OrderTable'

export default function OperationDashboardPage() {
  return (
    <Container>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Priority Orders</h1>
        <p className="text-gray-500 mt-1">Orders requiring immediate attention and processing.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-0">
          <OrderTable hiddenColumns={['WAITING FOR']} />
        </div>
      </div>
    </Container>
  )
}
