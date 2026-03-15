import { Container } from '@/components'
import { AdminStatCard } from './components/dashboard/AdminStatCard'
import { SystemOverview } from './components/dashboard/SystemOverview'
import { RecentActivities } from './components/dashboard/RecentActivities'
import { StaffDistribution } from './components/dashboard/StaffDistribution'
import { IoPeopleOutline, IoPersonOutline, IoCartOutline, IoWalletOutline } from 'react-icons/io5'
import { Link, Outlet, useNavigate } from 'react-router-dom'

export default function AdminDashboardPage() {
  const navigate = useNavigate()

  return (
    <Container className="max-w-none px-2 pt-2 pb-8">
      <div className="mb-6 px-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 tracking-tight font-heading">
              Admin Dashboard
            </h1>
            <p className="text-gray-500 text-sm font-normal leading-relaxed">
              System overview & management
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/admin/users"
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:border-indigo-200 hover:text-indigo-600"
            >
              Manage users
            </Link>
            <Link
              to="/admin/orders"
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:border-indigo-200 hover:text-indigo-600"
            >
              View orders
            </Link>
            <button
              type="button"
              onClick={() => navigate('/admin/settings')}
              className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700"
            >
              Admin settings
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-10 px-4">
        {}
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

        {}
        <div className="lg:col-span-2">
          <StaffDistribution />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 px-4">
        {}
        <div className="lg:col-span-3">
          <SystemOverview />
        </div>
        {}
        <div className="lg:col-span-2">
          <RecentActivities />
        </div>
      </div>

      <div className="mt-8 px-4">
        <Outlet />
      </div>
    </Container>
  )
}
