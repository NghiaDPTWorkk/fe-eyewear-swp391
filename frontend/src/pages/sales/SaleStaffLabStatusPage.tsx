import { Link } from 'react-router-dom'
import { Container, Card } from '@/components'

export default function SaleStaffLabStatusPage() {
  return (
    <Container>
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm mb-2 font-medium">
          <Link
            to="/salestaff/dashboard"
            className="text-neutral-400 hover:text-primary-500 transition-colors"
          >
            Dashboard
          </Link>
          <span className="text-neutral-300">/</span>
          <span className="text-primary-500 font-bold">Lab Status</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Lab Integration</h1>
        <p className="text-gray-500 mt-1">Track lens processing and lab status updates.</p>
      </div>

      <Card className="p-12 text-center border-dashed bg-neutral-50/50">
        <h3 className="text-lg font-medium text-neutral-600">Lab Status Placeholder</h3>
        <p className="text-neutral-400 mt-2">
          Integration with technical lab systems will appear here.
        </p>
      </Card>
    </Container>
  )
}
