import { SaleStaffSidebar } from './components/SaleStaffSidebar'
import { DashboardMetrics } from './components/DashboardMetrics'
import { HeaderStaff } from '@/components/templates/staff/header/HeaderStaff'
import { NavActions, NavSearch } from '@/components/templates/staff/navbar/NavListStaff'
import { Container } from '@/components'
import SalesChart from '@/components/layout/staff/salestaff/dashboard/components/SalesChart'
import OrderStatusChart from '@/components/layout/staff/salestaff/dashboard/components/OrderStatusChart'
import { useLayoutStore } from '@/store/layout.store'
import { cn } from '@/lib/utils'
import UrgentOrdersTable from '@/components/layout/staff/salestaff/dashboard/components/UrgentOrdersTable_BAK'

export default function SaleStaffDashboard() {
  const { sidebarCollapsed } = useLayoutStore()

  return (
    <div className="flex h-screen bg-white">
      <SaleStaffSidebar />

      <div
        className={cn(
          'flex-1 flex flex-col transition-all duration-300',
          sidebarCollapsed ? 'ml-20' : 'ml-65'
        )}
      >
        <HeaderStaff
          left={<NavSearch />}
          right={
            <NavActions userName="Dr. Sarah L." userRole="Head Optometrist" userInitials="SL" />
          }
        />

        <main className="flex-1 overflow-auto p-6 bg-gray-50/50">
          <Container>
            <div className="mb-8">
              <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                <span>Dashboard</span>
                <span>/</span>
                <span className="text-gray-600 font-medium">Operation Staff</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                Operation Dashboard
              </h1>
              <p className="text-gray-500 mt-1">
                Overview of store performance and daily operations.
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
        </main>
      </div>
    </div>
  )
}
