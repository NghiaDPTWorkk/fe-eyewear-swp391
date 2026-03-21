import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Container } from '@/shared/components/ui'
import OperationPagination from '@/shared/components/ui/pagination/OperationPagination'
import { PageHeader } from '@/features/sales/components/common'
import { UserTable } from './components/users/UserTable'
import { useAdminCustomers } from '@/shared/hooks/admin/useAdminCustomers'
import { useDebounce } from '@/shared/hooks/useDebounce'
import {
  IoSearchOutline,
  IoRefreshOutline,
  IoPeopleOutline,
  IoPersonOutline,
  IoTrendingUpOutline,
  IoTrendingDownOutline,
  IoFlashOutline
} from 'react-icons/io5'
import { AdminAccountDetail } from './components/AdminAccountDetail'
import { AdminEditAccount, type CreateAdminAccountFormValues } from './AdminEditAccount'
import type { StaffData } from './components/staff/StaffTable'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'

const SummaryCard: React.FC<{
  label: string
  value: string | number
  percent: string
  isUp: boolean
  icon: React.ReactNode
  colorScheme: 'mint' | 'info' | 'warning' | 'danger'
}> = ({ label, value, percent, isUp, icon, colorScheme }) => {
  const getColors = () => {
    switch (colorScheme) {
      case 'mint':
        return { bg: 'bg-mint-50', text: 'text-mint-600' }
      case 'info':
        return { bg: 'bg-sky-50', text: 'text-sky-600' }
      case 'warning':
        return { bg: 'bg-amber-50', text: 'text-amber-600' }
      case 'danger':
        return { bg: 'bg-red-50', text: 'text-red-600' }
      default:
        return { bg: 'bg-gray-50', text: 'text-gray-600' }
    }
  }

  const colors = getColors()

  return (
    <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm hover:shadow-md transition-all">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors.bg} ${colors.text}`}
          >
            {icon}
          </div>
          <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
            {label}
          </span>
        </div>
        <div
          className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold ${
            isUp ? 'bg-mint-50 text-mint-600' : 'bg-red-50 text-red-600'
          }`}
        >
          {isUp ? <IoTrendingUpOutline /> : <IoTrendingDownOutline />}
          {percent}
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-3xl font-bold text-gray-900 font-heading tracking-tight mb-4">
          {value}
        </h3>
        <p className="text-[10px] font-medium text-neutral-400 capitalize">Updated just now</p>
      </div>
    </div>
  )
}

export default function AdminUsersPage() {
  const queryClient = useQueryClient()
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearch = useDebounce(searchQuery, 500)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<StaffData | null>(null)
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

  const selectedUserRaw = customers.find((u) => u._id === selectedUserId) ?? null

  const mapCustomerToStaffData = (user: any): StaffData => ({
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone || '--',
    role: 'Customer',
    createdAt: user.createdAt,
    lastLogin: '--', // Not available in customer response
    citizenId: '--',
    avatar: null
  })

  const selectedUser = selectedUserRaw ? mapCustomerToStaffData(selectedUserRaw) : null

  // Placeholder mutation for updating user (since customerService doesn't have it yet)
  const updateMutation = useMutation({
    mutationFn: (payload: any) => Promise.resolve(payload), // Placeholder
    onSuccess: () => {
      toast.success('Update user placeholder success')
      setIsEditModalOpen(false)
      setEditingUser(null)
      queryClient.invalidateQueries({ queryKey: ['admin-customers'] })
    }
  })

  const handleSubmitUser = async (_values: CreateAdminAccountFormValues) => {
    toast('User editing is currently a UI placeholder.')
    setIsEditModalOpen(false)
    setEditingUser(null)
  }

  const statusTabs = [
    { label: 'All Users', value: 'All' as const },
    { label: 'Active', value: 'Active' as const },
    { label: 'Inactive', value: 'Inactive' as const },
    { label: 'Banned', value: 'Banned' as const }
  ]

  const handleStatusChange = (status: 'All' | 'Active' | 'Inactive' | 'Banned') => {
    setStatusFilter(status)
    setPage(1) // Reset to page 1 on filter change
  }

  return (
    <Container className="pt-2 pb-8 px-2 max-w-none space-y-8">
      <div className="px-4">
        <PageHeader
          title="User Management"
          subtitle="Manage all registered customer accounts."
          breadcrumbs={[{ label: 'Dashboard', path: '/admin/dashboard' }, { label: 'Users' }]}
        />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 px-4">
        <SummaryCard
          label="Total Users"
          value={pagination.total.toLocaleString()}
          percent="12.5%"
          isUp={true}
          icon={<IoPeopleOutline size={20} />}
          colorScheme="mint"
        />
        <SummaryCard
          label="Active Users"
          value="-"
          percent="8.3%"
          isUp={true}
          icon={<IoPersonOutline size={20} />}
          colorScheme="info"
        />
        <SummaryCard
          label="Current Page"
          value={`${pagination.page}/${pagination.totalPages}`}
          percent="--"
          isUp={false}
          icon={<IoFlashOutline size={20} />}
          colorScheme="warning"
        />
      </div>

      {/* Status Tabs */}
      <div className="px-4 overflow-x-auto">
        <div className="flex items-center gap-2 p-1.5 bg-neutral-100/50 rounded-2xl w-fit border border-neutral-100">
          {statusTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => handleStatusChange(tab.value)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                statusFilter === tab.value
                  ? 'bg-mint-900 text-white shadow-md shadow-mint-100 border-none'
                  : 'text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
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
            <div className="relative group">
              <IoSearchOutline
                className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-mint-600 transition-colors"
                size={18}
              />
              <input
                type="text"
                placeholder="Search user..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-72 pl-12 pr-4 py-3 bg-neutral-50/50 border border-neutral-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-mint-500/10 focus:border-mint-500 transition-all placeholder:text-neutral-400"
              />
            </div>
            <button
              onClick={() => refetch()}
              className={`w-12 h-12 flex items-center justify-center bg-neutral-50 rounded-2xl text-neutral-400 hover:text-mint-600 hover:bg-mint-50 transition-all ${isFetching ? 'animate-spin' : ''}`}
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

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-neutral-50">
          <OperationPagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            total={pagination.total}
            limit={pagination.limit}
            onPageChange={(p) => setPage(p)}
          />
        </div>
      </div>

      {/* User Detail Drawer */}
      <AdminAccountDetail
        isOpen={!!selectedUserId}
        onClose={() => setSelectedUserId(null)}
        staff={selectedUser}
        onEditStaff={(staff) => {
          setEditingUser(staff)
          setIsEditModalOpen(true)
        }}
        onDeactivate={() => {
          toast.error('Banning customers is not implemented yet.')
        }}
      />

      {/* User Edit Modal */}
      <AdminEditAccount
        open={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setEditingUser(null)
        }}
        initialData={editingUser}
        onSubmit={handleSubmitUser as any}
        isSubmitting={updateMutation.isPending}
      />

      <div className="px-4">
        <Outlet />
      </div>
    </Container>
  )
}
