import { Container } from '@/components'
import { OrderTable } from '@/components/staff'

export default function OperationDeliveryPage() {
  return (
    <Container>
      <div className="text-sm text-gray-600 mb-2">Delivery / Delivery Handover</div>
      <h1 className="text-xl font-semibold mb-5 text-primary-700">Delivery Handover</h1>
      <OrderTable hiddenColumns={['WAITING FOR']} />
    </Container>
  )
}
