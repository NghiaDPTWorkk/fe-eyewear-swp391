import { useState } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { Container } from '@/components'
import { PageHeader } from '@/features/sale-staff/components/common'
import { UserTable } from './components/users/UserTable'
import { UserDetailDrawer } from './components/users/UserDetailDrawer'
import { useAdminCustomers } from '@/shared/hooks/admin/useAdminCustomers'
import { useDebounce } from '@/shared/hooks/useDebounce'
import {
  IoSearchOutline,
  IoRefreshOutline,
  IoChevronBackOutline,
  IoChevronForwardOutline,
  IoPeopleOutline,
  IoPersonOutline,
  IoBanOutline,
  IoTrendingUpOutline,
  IoTrendingDownOutline
} from 'react-icons/io5'

const SummaryCard: React.FC<{
  label: string
  value: string | number
  percent: string
  isUp: boolean
  icon: React.ReactNode
  iconBg: string
  iconColor: string
}> = ({ label, value, percent, isUp, icon, iconBg, iconColor }) => (
  <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm hover:shadow-md transition-all">
    <div className="flex justify-between items-start mb-6">
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg} ${iconColor}`}
        >
          {icon}
        </div>
        <span className="text-xs font-semibold text-neutral-400 line-clamp-1">{label}</span>
      </div>
      <div
        className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold ${
          isUp ? 'bg-indigo-50 text-indigo-600' : 'bg-red-50 text-red-600'
        }`}
      >
        {isUp ? <IoTrendingUpOutline /> : <IoTrendingDownOutline />}
        {percent}
      </div>
    </div>
    <div className="mt-4">
      <h3 className="text-3xl font-bold text-gray-900 font-primary leading-tight mb-4">{value}</h3>
      <p className="text-[10px] font-medium text-neutral-400 capitalize">Updated just now</p>
    </div>
  </div>
)

export default function AdminUsersPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearch = useDebounce(searchQuery, 500)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive' | 'Banned'>('All')
  const [page, setPage] = useState(1)
  const limit = 10

  const { data, isLoading, isError, refetch, isFetching } = useAdminCustomers({
    page,
    limit,
    search: debouncedSearch,
    status: statusFilter
  })

  const customers = data?.data.customers ?? []
  const pagination = data?.data.pagination ?? { page: 1, limit: 10, total: 0, totalPages: 1 }

  const selectedUser = customers.find((u) => u._id === selectedUserId) ?? null

  const statusTabs = [
    { label: 'All Users', value: 'All' as const },
    { label: 'Active', value: 'Active' as const },
    { label: 'Inactive', value: 'Inactive' as const },
    { label: 'Banned', value: 'Banned' as const }
  ]

  const handleStatusChange = (status: 'All' | 'Active' | 'Inactive' | 'Banned') => {
    setStatusFilter(status)
    setPage(1)
  }

  return (
    <Container className="pt-2 pb-8 px-2 max-w-none space-y-8">
      <div className="px-4">
        <PageHeader
          title="User Management"
          subtitle="Manage all registered customer accounts."
          breadcrumbs={[{ label: 'Dashboard', path: '/admin/dashboard' }, { label: 'Users' }]}
        />
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Link
            to="/admin/dashboard"
            className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-600 transition hover:border-indigo-200 hover:text-indigo-600"
          >
            Back to dashboard
          </Link>
          <Link
            to="/admin/staff"
            className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-600 transition hover:border-indigo-200 hover:text-indigo-600"
          >
            Staff accounts
          </Link>
          <button
            type="button"
            onClick={() => navigate('/admin/support')}
            className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-indigo-700"
          >
            Open support
          </button>
        </div>
      </div>

      {}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 px-4">
        <SummaryCard
          label="Total Users"
          value={pagination.total.toLocaleString()}
          percent="12.5%"
          isUp={true}
          icon={<IoPeopleOutline size={20} />}
          iconBg="bg-indigo-50"
          iconColor="text-indigo-600"
        />
        <SummaryCard
          label="Active Users"
          value="-"
          percent="8.3%"
          isUp={true}
          icon={<IoPersonOutline size={20} />}
          iconBg="bg-green-50"
          iconColor="text-green-600"
        />
        <SummaryCard
          label="Banned"
          value="-"
          percent="2.1%"
          isUp={false}
          icon={<IoBanOutline size={20} />}
          iconBg="bg-red-50"
          iconColor="text-red-600"
        />
      </div>

      {}
      <div className="px-4 overflow-x-auto">
        <div className="flex items-center gap-2 p-1.5 bg-neutral-100/50 rounded-2xl w-fit border border-neutral-100">
          {statusTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => handleStatusChange(tab.value)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                statusFilter === tab.value
                  ? 'bg-white text-indigo-600 shadow-sm border border-neutral-100'
                  : 'text-neutral-500 hover:text-neutral-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {}
      <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden mx-4">
        <div className="p-6 border-b border-neutral-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
              User List
            </p>
            <div className="flex items-baseline gap-3">
              <h2 className="text-4xl font-bold text-gray-900 font-primary">{pagination.total}</h2>
              <span className="text-xs font-bold text-indigo-500">results</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <IoSearchOutline
                className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search user..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-64 pl-12 pr-4 py-3 bg-neutral-50/50 border border-neutral-100 rounded-2xl text-[13px] font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
              />
            </div>
            <button
              onClick={() => refetch()}
              className={`w-12 h-12 flex items-center justify-center bg-neutral-50 rounded-2xl text-neutral-400 hover:text-gray-900 transition-all ${isFetching ? 'animate-spin' : ''}`}
            >
              <IoRefreshOutline size={20} />
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-neutral-500">Loading customers...</div>
        ) : isError ? (
          <div className="p-8 text-center text-red-500">Error loading customers</div>
        ) : customers.length === 0 ? (
          <div className="p-8 text-center text-neutral-500">No customers found</div>
        ) : (
          <UserTable
            users={customers}
            selectedUserId={selectedUserId}
            onSelectUser={(id) => setSelectedUserId(id)}
          />
        )}

        {}
        <div className="p-8 border-t border-neutral-50 flex items-center justify-between">
          <p className="text-xs font-semibold text-neutral-400 uppercase tracking-widest">
            Showing {(pagination.page - 1) * pagination.limit + 1}-
            {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}{' '}
            Users
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={pagination.page <= 1}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-neutral-100 text-neutral-400 hover:text-indigo-600 transition-all disabled:opacity-50"
            >
              <IoChevronBackOutline />
            </button>
            <div className="flex gap-1">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                .filter((p) => {
                  return (
                    p === 1 || p === pagination.totalPages || Math.abs(p - pagination.page) <= 1
                  )
                })
                .reduce((acc, p, i, arr) => {
                  if (i > 0 && p - arr[i - 1] > 1) {
                    acc.push(-1)
                  }
                  acc.push(p)
                  return acc
                }, [] as number[])
                .map((p, i) =>
                  p === -1 ? (
                    <span
                      key={`ellipsis-${i}`}
                      className="w-10 h-10 flex items-center justify-center text-neutral-400"
                    >
                      ...
                    </span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-10 h-10 rounded-xl text-xs font-bold transition-all ${
                        pagination.page === p
                          ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-100'
                          : 'bg-white text-neutral-400 border border-neutral-100 hover:bg-neutral-50'
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}
            </div>
            <button
              onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
              disabled={pagination.page >= pagination.totalPages}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-neutral-100 text-neutral-400 hover:text-indigo-600 transition-all disabled:opacity-50"
            >
              <IoChevronForwardOutline />
            </button>
          </div>
        </div>
      </div>

      {}
      <UserDetailDrawer
        isOpen={!!selectedUserId}
        onClose={() => setSelectedUserId(null)}
        user={selectedUser}
      />

      <div className="px-4">
        <Outlet />
      </div>
    </Container>
  )
}
