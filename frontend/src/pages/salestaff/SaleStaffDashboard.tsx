import DashboardHeader from '@/components/layout/staff/salestaff/dashboard/components/DashboardHeader'
import DashboardSidebar from '@/components/layout/staff/salestaff/dashboard/components/DashboardSidebar'
import OrderStatusChart from '@/components/layout/staff/salestaff/dashboard/components/OrderStatusChart'
import SalesChart from '@/components/layout/staff/salestaff/dashboard/components/SalesChart'
import UrgentOrdersTable from '@/components/layout/staff/salestaff/dashboard/components/UrgentOrdersTable'
import { METRICS } from '@/components/layout/staff/salestaff/dashboard/constants'
import { HeaderStaff } from '@/components/templates/staff/header/HeaderStaff'
import { NavActions, NavSearch } from '@/components/templates/staff/navbar/NavListStaff'
import { MetricCard } from '@/shared/components/molecules/metric-card'

export default function SaleStaffDashboard() {
  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col ml-[260px]">
        <HeaderStaff left={<NavSearch />} right={<NavActions userInitials="SJ" />} />

        <main className="flex-1 overflow-auto p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            <DashboardHeader />

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {METRICS.map((metric, i) => (
                <MetricCard key={i} {...metric} />
              ))}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <SalesChart />
              <OrderStatusChart />
            </div>

            {/* Urgent Orders Table */}
            <UrgentOrdersTable />
          </div>
        </main>
      </div>
    </div>
  )
}
