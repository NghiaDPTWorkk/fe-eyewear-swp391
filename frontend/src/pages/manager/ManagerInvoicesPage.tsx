import { Link } from 'react-router-dom'
import { Container } from '@/components'

export default function ManagerInvoicesPage() {
  return (
    <Container>
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm mb-2 font-medium">
          <Link to="/manager" className="text-neutral-400 hover:text-primary-500 transition-colors">
            Dashboard
          </Link>
          <span className="text-neutral-300">/</span>
          <span className="text-primary-500 font-bold">Invoices</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Invoice List</h1>
        <p className="text-gray-500 mt-1">View and open invoices to see their orders.</p>
      </div>

      <div className="rounded-2xl border border-neutral-100 bg-white p-6">
        <div className="text-sm text-neutral-500">Chưa implement dữ liệu invoice ở bước này.</div>
      </div>
    </Container>
  )
}
