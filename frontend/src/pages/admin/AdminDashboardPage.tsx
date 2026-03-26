import { useQuery } from '@tanstack/react-query'
import { Container, MetricCard, Button } from '@/shared/components/ui'
import { SystemOverview } from './components/dashboard/SystemOverview'
import { RecentActivities } from './components/dashboard/RecentActivities'
import { StaffDistribution } from './components/dashboard/StaffDistribution'
import {
  IoPeopleOutline,
  IoPersonOutline,
  IoCartOutline,
  IoCalendarOutline,
} from 'react-icons/io5'
import { Outlet, useNavigate } from 'react-router-dom'
import { BreadcrumbPath } from '@/components/layout/staff/operation-staff/breadcrumb-path'
import { adminAccountService } from '@/shared/services/admin/adminAccountService'
import { customerService } from '@/shared/services/admin/customerService'
import { useRevenueStats } from '@/features/manager/hooks/useRevenueStats'
import { useState } from 'react'
export default function AdminDashboardPage() {
  const navigate = useNavigate()

  // Fetch totals for MetricCards
  const { data: staffData, isLoading: isStaffLoading } = useQuery({
    queryKey: ['admin-accounts-stats'],
    queryFn: () => adminAccountService.getAdminAccounts({ limit: 1 })
  })

  const { data: customerData, isLoading: isCustomerLoading } = useQuery({
    queryKey: ['admin-customers-stats'],
    queryFn: () => customerService.getCustomers({ limit: 1 })
  })

  const [period, setPeriod] = useState('month')
  const [fromDate, setFromDate] = useState('2026-03-01')
  const [toDate, setToDate] = useState('2026-03-27')
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  // Sync dates when period changes (optional, but keep simple for now)
  const dateParams = period === 'year'
    ? { period, year: selectedYear }
    : { fromDate, toDate }

  const { data: revenueData, isLoading: isRevenueLoading } = useRevenueStats(dateParams)

  const totalStaff = staffData?.data?.pagination?.total ?? 0
  const totalUsers = customerData?.data?.pagination?.total ?? 0

  return (
    <Container>
      {/* Header */}
      <div className="mb-8 font-primary">
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
        <div className="lg:col-span-3 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            <MetricCard
              label="TOTAL USERS"
              value={isCustomerLoading ? '...' : String(totalUsers)}
              colorScheme="mint"
              trend={{ value: 12.5, label: 'vs last month', isPositive: true }}
              icon={<IoPeopleOutline size={22} />}
            />
            <MetricCard
              label="TOTAL STAFF"
              value={isStaffLoading ? '...' : String(totalStaff)}
              colorScheme="info"
              trend={{ value: 3.2, label: 'vs last month', isPositive: true }}
              icon={<IoPersonOutline size={22} />}
            />
            <MetricCard
              label="TOTAL ORDERS"
              value={isRevenueLoading ? '...' : String(revenueData?.rows?.reduce((sum, r) => sum + r.invoiceCount, 0) || 0)}
              colorScheme="warning"
              trend={{ value: 5.4, label: 'vs last month', isPositive: true }}
              icon={<IoCartOutline size={22} />}
            />
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap items-end gap-4 px-1">
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest ml-1">Period</span>
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="h-10 px-4 bg-white border border-neutral-200 rounded-xl text-[12px] font-bold text-gray-700 shadow-sm focus:outline-none focus:ring-4 focus:ring-mint-500/10 focus:border-mint-500 transition-all cursor-pointer hover:bg-neutral-50"
                >
                  <option value="day">This Day</option>
                  <option value="month">Custom Range</option>
                  <option value="year">Specific Year</option>
                </select>
              </div>

              {period === 'month' && (
                <div className="flex flex-col gap-1.5 animate-in fade-in slide-in-from-left-2 duration-300">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest ml-1">Date Selection</span>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <IoCalendarOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={14} />
                      <input
                        type="date"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        className="h-10 pl-9 pr-3 bg-white border border-neutral-200 rounded-xl text-[12px] font-bold text-gray-700 shadow-sm focus:outline-none focus:ring-4 focus:ring-mint-500/10 focus:border-mint-500 transition-all"
                      />
                    </div>
                    <span className="text-neutral-300 font-bold">→</span>
                    <div className="relative">
                      <IoCalendarOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={14} />
                      <input
                        type="date"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        className="h-10 pl-9 pr-3 bg-white border border-neutral-200 rounded-xl text-[12px] font-bold text-gray-700 shadow-sm focus:outline-none focus:ring-4 focus:ring-mint-500/10 focus:border-mint-500 transition-all"
                      />
                    </div>
                  </div>
                </div>
              )}

              {period === 'year' && (
                <div className="flex flex-col gap-1.5 animate-in fade-in slide-in-from-left-2 duration-300">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest ml-1">Select Year</span>
                  <input
                    type="number"
                    value={selectedYear}
                    min={1999}
                    max={new Date().getFullYear()}
                    onChange={(e) => {
                      const val = Number(e.target.value)
                      const currentYear = new Date().getFullYear()
                      if (val > currentYear) setSelectedYear(currentYear)
                      else if (val < 1999 && e.target.value.length >= 4) setSelectedYear(1999)
                      else setSelectedYear(val)
                    }}
                    className="h-10 px-4 w-28 bg-white border border-neutral-200 rounded-xl text-[12px] font-bold text-gray-700 shadow-sm focus:outline-none focus:ring-4 focus:ring-mint-500/10 focus:border-mint-500 transition-all"
                  />
                </div>
              )}
            </div>

            <SystemOverview
              period={period}
              fromDate={fromDate}
              toDate={toDate}
              year={selectedYear}
            />
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
