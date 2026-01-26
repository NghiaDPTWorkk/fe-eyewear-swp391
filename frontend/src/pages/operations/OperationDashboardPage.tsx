import { Container } from '@/components'
import { OrderTable } from '@/components/staff'

export default function OperationDashboardPage() {
  return (
    <Container>
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm mb-2 font-medium">
          <span className="text-primary-500 font-bold">Dashboard</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Operations Overview</h1>
        <p className="text-gray-500 mt-1">Monitor priority orders and station status.</p>
      </div>

      <OrderTable hiddenColumns={['WAITING FOR']} />
    </Container>
  )
}
