import { SaleStaffSidebar } from './components/SaleStaffSidebar'
import { DashboardMetrics } from './components/DashboardMetrics'
import { HeaderStaff } from '@/components/templates/staff/header/HeaderStaff'
import { NavActions, NavSearch } from '@/components/templates/staff/navbar/NavListStaff'
import { Container } from '@/components'
import SalesChart from '@/components/layout/staff/salestaff/dashboard/components/SalesChart'
import OrderStatusChart from '@/components/layout/staff/salestaff/dashboard/components/OrderStatusChart'
import UrgentOrdersTable from '@/components/layout/staff/salestaff/dashboard/components/UrgentOrdersTable'

export default function SaleStaffDashboard() {
  return (
    <div className="flex h-screen bg-white">
      <SaleStaffSidebar />

      <div className="flex-1 flex flex-col ml-[260px]">
        <HeaderStaff left={<NavSearch />} right={<NavActions userInitials="SL" />} />

        <main className="flex-1 overflow-auto p-6 bg-gray-50">
          <Container>
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Operation Dashboard</h1>
              <p className="text-gray-500">Overview of store performance and daily operations.</p>
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
        </main>
      </div>
    </div>
  )
}
