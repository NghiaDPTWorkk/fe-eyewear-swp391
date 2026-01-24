import { Container } from '@/components'
import { OrderTable } from '@/components/staff'

export default function OperationPrescriptionPage() {
  return (
    <Container>
      <div className="text-sm text-gray-600 mb-2">Technical Stations / Prescription Orders</div>
      <h1 className="text-xl font-semibold mb-5 text-primary-700">Prescription Orders</h1>
      <OrderTable hiddenColumns={['WAITING FOR']} filterType="Prescription" />
    </Container>
  )
}
