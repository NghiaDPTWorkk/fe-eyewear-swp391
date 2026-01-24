import { Container } from '@/components'
import OrderTable from '@/components/common/staff/ordertable/OrderTable'

export default function PackingPage() {
  return (
    <Container>
      <div className="text-sm text-gray-600 mb-2">Cardboard / Packing Station</div>
      <h1 className="text-xl font-semibold mb-5 text-primary-700">Packing Station</h1>
      <OrderTable hiddenColumns={['WAITING FOR']} />
    </Container>
  )
}
