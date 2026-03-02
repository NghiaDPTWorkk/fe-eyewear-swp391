import { Container } from '@/components'
import { AdminStatCard } from './components/dashboard/AdminStatCard'
import { SystemOverview } from './components/dashboard/SystemOverview'
import { RecentActivities } from './components/dashboard/RecentActivities'
import { StaffDistribution } from './components/dashboard/StaffDistribution'
import { IoPeopleOutline, IoPersonOutline, IoCartOutline, IoWalletOutline } from 'react-icons/io5'

export default function AdminDashboardPage() {
  return (
    <Container className="max-w-none px-2 pt-2 pb-8">
      <div className="mb-6 px-4">
        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight font-heading">
          Admin Dashboard
        </h1>
        <p className="text-gray-500 text-sm font-normal leading-relaxed">
          System overview & management
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-10 px-4">
        {/* Left: Stats */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
          <AdminStatCard
            label="Total Users"
            value="8,234"
            variant="indigo"
            trend={{ value: '12.5%', isPositive: true }}
            icon={<IoPeopleOutline />}
          />
          <AdminStatCard
            label="Total Staff"
            value="30"
            trend={{ value: '3.2%', isPositive: true }}
            icon={<IoPersonOutline />}
          />
          <AdminStatCard
            label="Total Orders"
            value="12,840"
            variant="indigo"
            trend={{ value: '8.1%', isPositive: true }}
            icon={<IoCartOutline />}
          />
          <AdminStatCard
            label="Total Revenue"
            value="$245,000"
            trend={{ value: '2.4%', isPositive: false }}
            icon={<IoWalletOutline />}
          />
        </div>

        {/* Right: Staff Distribution */}
        <div className="lg:col-span-2">
          <StaffDistribution />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 px-4">
        {/* Left: System Overview */}
        <div className="lg:col-span-3">
          <SystemOverview />
        </div>
        {/* Right: Recent Activities */}
        <div className="lg:col-span-2">
          <RecentActivities />
        </div>
      </div>
    </Container>
  )
}
