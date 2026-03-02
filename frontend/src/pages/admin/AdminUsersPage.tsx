import { useState, useMemo } from 'react'
import { Container } from '@/components'
import { PageHeader } from '@/features/sales/components/common'
import { UserTable, type UserData } from './components/users/UserTable'
import { UserDetailDrawer } from './components/users/UserDetailDrawer'
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

const mockUsers: UserData[] = [
  {
    id: '1',
    name: 'Nguyen Van An',
    email: 'an.nguyen@gmail.com',
    phone: '0901234567',
    status: 'Active',
    joinDate: 'Jan 15, 2026',
    totalOrders: 23,
    totalSpent: 1250
  },
  {
    id: '2',
    name: 'Tran Thi Bich',
    email: 'bich.tran@gmail.com',
    phone: '0912345678',
    status: 'Active',
    joinDate: 'Feb 02, 2026',
    totalOrders: 5,
    totalSpent: 340
  },
  {
    id: '3',
    name: 'Le Hoang Nam',
    email: 'nam.le@gmail.com',
    phone: '0923456789',
    status: 'Inactive',
    joinDate: 'Dec 20, 2025',
    totalOrders: 12,
    totalSpent: 890
  },
  {
    id: '4',
    name: 'Pham Minh Duc',
    email: 'duc.pham@gmail.com',
    phone: '0934567890',
    status: 'Banned',
    joinDate: 'Nov 10, 2025',
    totalOrders: 2,
    totalSpent: 150
  },
  {
    id: '5',
    name: 'Vo Thi Hanh',
    email: 'hanh.vo@gmail.com',
    phone: '0945678901',
    status: 'Active',
    joinDate: 'Jan 28, 2026',
    totalOrders: 8,
    totalSpent: 620
  },
  {
    id: '6',
    name: 'Do Quang Huy',
    email: 'huy.do@gmail.com',
    phone: '0956789012',
    status: 'Active',
    joinDate: 'Feb 10, 2026',
    totalOrders: 15,
    totalSpent: 980
  }
]

const SummaryCard: React.FC<{
  label: string
  value: string
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
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive' | 'Banned'>('All')

  const filteredUsers = useMemo(() => {
    let list = mockUsers
    if (statusFilter !== 'All') {
      list = list.filter((u) => u.status === statusFilter)
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.phone.includes(q)
      )
    }
    return list
  }, [searchQuery, statusFilter])

  const selectedUser = mockUsers.find((u) => u.id === selectedUserId) ?? null

  const statusTabs = [
    { label: 'All Users', value: 'All' as const },
    { label: 'Active', value: 'Active' as const },
    { label: 'Inactive', value: 'Inactive' as const },
    { label: 'Banned', value: 'Banned' as const }
  ]

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
          value="8,234"
          percent="12.5%"
          isUp={true}
          icon={<IoPeopleOutline size={20} />}
          iconBg="bg-indigo-50"
          iconColor="text-indigo-600"
        />
        <SummaryCard
          label="Active Users"
          value="7,102"
          percent="8.3%"
          isUp={true}
          icon={<IoPersonOutline size={20} />}
          iconBg="bg-green-50"
          iconColor="text-green-600"
        />
        <SummaryCard
          label="Banned"
          value="45"
          percent="2.1%"
          isUp={false}
          icon={<IoBanOutline size={20} />}
          iconBg="bg-red-50"
          iconColor="text-red-600"
        />
      </div>

      {/* Status Tabs */}
      <div className="px-4 overflow-x-auto">
        <div className="flex items-center gap-2 p-1.5 bg-neutral-100/50 rounded-2xl w-fit border border-neutral-100">
          {statusTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
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

      {/* Table */}
      <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden mx-4">
        <div className="p-6 border-b border-neutral-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
              User List
            </p>
            <div className="flex items-baseline gap-3">
              <h2 className="text-4xl font-bold text-gray-900 font-primary">
                {filteredUsers.length}
              </h2>
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
            <button className="w-12 h-12 flex items-center justify-center bg-neutral-50 rounded-2xl text-neutral-400 hover:text-gray-900 transition-all">
              <IoRefreshOutline size={20} />
            </button>
          </div>
        </div>

        <UserTable
          users={filteredUsers}
          selectedUserId={selectedUserId}
          onSelectUser={(id) => setSelectedUserId(id)}
        />

        {/* Pagination */}
        <div className="p-8 border-t border-neutral-50 flex items-center justify-between">
          <p className="text-xs font-semibold text-neutral-400 uppercase tracking-widest">
            Showing 1-{filteredUsers.length} of {mockUsers.length} Users
          </p>
          <div className="flex items-center gap-2">
            <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-neutral-100 text-neutral-400 hover:text-indigo-600 transition-all">
              <IoChevronBackOutline />
            </button>
            <div className="flex gap-1">
              <button className="w-10 h-10 rounded-xl bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-100">
                1
              </button>
              <button className="w-10 h-10 rounded-xl bg-white text-neutral-400 text-xs font-bold hover:bg-neutral-50">
                2
              </button>
            </div>
            <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-neutral-100 text-neutral-400 hover:text-indigo-600 transition-all">
              <IoChevronForwardOutline />
            </button>
          </div>
        </div>
      </div>

      {/* User Detail Drawer */}
      <UserDetailDrawer
        isOpen={!!selectedUserId}
        onClose={() => setSelectedUserId(null)}
        user={selectedUser}
      />
    </Container>
  )
}
