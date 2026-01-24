import { Container } from '@/components'
import OrderTable from '@/components/common/staff/ordertable/OrderTable'

export default function DisplayAllOrder() {
  return (
    <Container>
      <div className="text-sm text-gray-600 mb-2">Order Management / All Orders</div>
      <h1 className="text-xl font-semibold mb-5 text-primary-700">All Orders</h1>
      <OrderTable hiddenColumns={['WAITING FOR']} />
    </Container>
  )
}
