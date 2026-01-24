import { Container } from '@/components'
import { Card } from '@/components/atoms/card'
import OrderTable from '@/components/staff/ordertable/OrderTable'

export default function SaleStaffOrderPage() {
  return (
    <Container>
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-neutral-400 mb-2">
          <a href="/salestaff/dashboard" className="hover:text-mint-600 transition-colors">
            Dashboard
          </a>
          <span>/</span>
          <span className="text-mint-600 font-bold">Orders</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Order Management</h1>
        <p className="text-gray-500 mt-1">View and manage customer orders.</p>
      </div>

      <Card className="p-0 overflow-hidden border border-neutral-200 shadow-sm">
        <OrderTable />
      </Card>
    </Container>
  )
}
