import { Container } from '@/components'
import { OrderTable } from '@/components/staff'
import { BreadcrumbPath } from '@/components/layout/staff/operationstaff/breadcrumbpath'

export default function OperationPrescriptionPage() {
  return (
    <Container>
      <div className="mb-8">
        <BreadcrumbPath paths={['Dashboard', 'Technical']} />
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Prescription Orders</h1>
        <p className="text-gray-500 mt-1">
          Manage technical specifications and lens processing status.
        </p>
      </div>

      <OrderTable
        hiddenColumns={['WAITING FOR']}
        filterType="Prescription"
        role="operation"
        pageType="technical"
      />
    </Container>
  )
}
