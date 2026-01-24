import { Container } from '@/components'
import OrderTable from '@/components/common/staff/ordertable/OrderTable'

export default function HomePageOperation() {
  return (
    <Container>
      <div className="text-sm text-gray-600 mb-2">Dashboard / Order Management</div>
      <h1 className="text-xl font-semibold mb-5 text-primary-700">Priority Orders</h1>
      <OrderTable hiddenColumns={['WAITING FOR']} />
    </Container>
  )
}
