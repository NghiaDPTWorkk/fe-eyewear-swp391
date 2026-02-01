import { Container } from '@/components'
import { OrderTable } from '@/components/staff'
import { BreadcrumbPath } from '@/components/layout/staff/operationstaff/breadcrumbpath'

export default function OperationPreOrdersPage() {
  return (
    <Container>
      <div className="mb-8">
        <BreadcrumbPath paths={['Dashboard', 'Logistics Waiting Station']} />
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Pre-order Tracking</h1>
      </div>

      <OrderTable filterType="Pre-order" pageType="logistics" />
    </Container>
  )
}
