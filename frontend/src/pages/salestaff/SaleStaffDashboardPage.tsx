import { DashboardMetrics } from '@/components/layout/staff/salestaff/dashboard/DashboardMetrics'
import { Container } from '@/components'
import SalesChart from '@/components/layout/staff/salestaff/dashboard/SalesChart'
import OrderStatusChart from '@/components/layout/staff/salestaff/dashboard/OrderStatusChart'
import UrgentOrdersTable from '@/components/layout/staff/salestaff/dashboard/UrgentOrdersTable'

export default function SaleStaffDashboardPage() {
  return (
    <Container>
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm mb-2">
          <span className="text-primary-500 font-bold">Dashboard</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Sales Overview</h1>
        <p className="text-gray-500 mt-1">
          Overview of store performance and daily sales operations.
        </p>
      </div>

      <DashboardMetrics />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <SalesChart />
        </div>
        <div className="lg:col-span-1">
          <OrderStatusChart />
        </div>
      </div>

      <UrgentOrdersTable />
    </Container>
  )
}
