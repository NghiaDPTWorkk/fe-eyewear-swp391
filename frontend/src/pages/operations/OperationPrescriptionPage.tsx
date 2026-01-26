import { Link } from 'react-router-dom'
import { Container } from '@/components'
import { OrderTable } from '@/components/staff'

export default function OperationPrescriptionPage() {
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
          <span className="text-primary-500 font-bold">Technical Stations</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Prescription Orders</h1>
      </div>

      <OrderTable hiddenColumns={['WAITING FOR']} filterType="Prescription" />
    </Container>
  )
}
