import { Container, MetricCard, Button } from '@/shared/components/ui'
import { SystemOverview } from './components/dashboard/SystemOverview'
import { RecentActivities } from './components/dashboard/RecentActivities'
import { StaffDistribution } from './components/dashboard/StaffDistribution'
import { IoPeopleOutline, IoPersonOutline } from 'react-icons/io5'
import { Outlet, useNavigate } from 'react-router-dom'
import { BreadcrumbPath } from '@/components/layout/staff/operation-staff/breadcrumb-path'

export default function AdminDashboardPage() {
  const navigate = useNavigate()

  return (
    <Container>
      {/* Header */}
      <div className="mb-8">
        <BreadcrumbPath paths={['Dashboard', 'System Overview']} />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
              Admin Dashboard
            </h1>
            <p className="text-sm md:text-base text-gray-500 mt-1">System overview & management</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              onClick={() => navigate('/admin/users')}
              className="px-6 py-3 text-sm font-bold border-mint-400 text-mint-600 hover:border-mint-700 hover:bg-mint-50/50 hover:shadow-lg hover:shadow-mint-100/50 transition-all duration-300 active:scale-95 rounded-xl"
            >
              Manage Users
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/admin/staff')}
              className="px-6 py-3 text-sm font-bold border-mint-400 text-mint-600 hover:border-mint-700 hover:bg-mint-50/50 hover:shadow-lg hover:shadow-mint-100/50 transition-all duration-300 active:scale-95 rounded-xl"
            >
              Manage Staffs
            </Button>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-10">
        {/* Left: Stats */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <MetricCard
            label="TOTAL USERS"
            value="40"
            colorScheme="mint"
            trend={{ value: 12.5, label: 'vs last month', isPositive: true }}
            icon={<IoPeopleOutline size={22} />}
          />
          <MetricCard
            label="TOTAL STAFF"
            value="30"
            colorScheme="info"
            trend={{ value: 3.2, label: 'vs last month', isPositive: true }}
            icon={<IoPersonOutline size={22} />}
          />
          <div className="lg:col-span-3">
            <SystemOverview />
          </div>
        </div>

        {/* Right: Staff Distribution */}
        <div className="lg:col-span-2">
          <StaffDistribution />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Right: Recent Activities */}
        <div className="lg:col-span-full">
          <RecentActivities />
        </div>
      </div>

      <div className="mt-8">
        <Outlet />
      </div>
    </Container>
  )
}
