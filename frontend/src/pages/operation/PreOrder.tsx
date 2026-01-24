import { Container } from '@/components'
import OrderTable from '@/components/common/staff/ordertable/OrderTable'

export default function PreOrder() {
  return (
    <Container>
      <div className="text-sm text-gray-600 mb-2">Logistics Waiting Station / Pre-Orders</div>
      <h1 className="text-xl font-semibold mb-5 text-primary-700">Pre-Orders</h1>
      <OrderTable filterType="Pre-order" />
    </Container>
  )
}
