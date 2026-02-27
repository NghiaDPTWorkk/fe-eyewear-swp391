import { useState, useMemo } from 'react'
import { Container } from '@/components'
import { PageHeader } from '@/features/sales/components/common'
import { StaffTable, type StaffData } from './components/staff/StaffTable'
import { StaffDetailDrawer } from './components/staff/StaffDetailDrawer'
import {
  IoSearchOutline,
  IoRefreshOutline,
  IoAddOutline,
  IoChevronBackOutline,
  IoChevronForwardOutline,
  IoPersonOutline,
  IoShieldCheckmarkOutline,
  IoFlashOutline,
  IoTrendingUpOutline,
  IoTrendingDownOutline
} from 'react-icons/io5'

const mockStaff: StaffData[] = [
  {
    id: '1',
    name: 'Tran Minh Khoi',
    email: 'khoi.tran@opticview.com',
    role: 'Sale Staff',
    status: 'Active',
    lastActive: '2 hours ago',
    phone: '0901111111'
  },
  {
    id: '2',
    name: 'Nguyen Phuong Anh',
    email: 'anh.nguyen@opticview.com',
    role: 'Sale Staff',
    status: 'Active',
    lastActive: '30 minutes ago',
    phone: '0902222222'
  },
  {
    id: '3',
    name: 'Le Thanh Dat',
    email: 'dat.le@opticview.com',
    role: 'Operation Staff',
    status: 'Active',
    lastActive: '1 hour ago',
    phone: '0903333333'
  },
  {
    id: '4',
    name: 'Pham Quoc Bao',
    email: 'bao.pham@opticview.com',
    role: 'Operation Staff',
    status: 'Inactive',
    lastActive: '3 days ago',
    phone: '0904444444'
  },
  {
    id: '5',
    name: 'Vo Minh Hieu',
    email: 'hieu.vo@opticview.com',
    role: 'Manager',
    status: 'Active',
    lastActive: '15 minutes ago',
    phone: '0905555555'
  },
  {
    id: '6',
    name: 'Do Hoang Long',
    email: 'long.do@opticview.com',
    role: 'Admin',
    status: 'Active',
    lastActive: 'Just now',
    phone: '0906666666'
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

export default function AdminStaffPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null)
  const [staffList, setStaffList] = useState(mockStaff)
  const [roleFilter, setRoleFilter] = useState<string>('All')

  const filteredStaff = useMemo(() => {
    let list = staffList
    if (roleFilter !== 'All') {
      list = list.filter((s) => s.role === roleFilter)
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q) ||
          s.role.toLowerCase().includes(q)
      )
    }
    return list
  }, [staffList, searchQuery, roleFilter])

  const selectedStaff = staffList.find((s) => s.id === selectedStaffId) ?? null

  const toggleStaffStatus = (id: string) => {
    setStaffList((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, status: s.status === 'Active' ? 'Inactive' : 'Active' } : s
      )
    )
  }

  const roleTabs = [
    { label: 'All Staff', value: 'All' },
    { label: 'Sale Staff', value: 'Sale Staff' },
    { label: 'Operation Staff', value: 'Operation Staff' },
    { label: 'Manager', value: 'Manager' },
    { label: 'Admin', value: 'Admin' }
  ]

  return (
    <Container className="pt-2 pb-8 px-2 max-w-none space-y-8">
      <div className="px-4">
        <PageHeader
          title="Staff Management"
          subtitle="Manage all staff accounts and roles."
          breadcrumbs={[
            { label: 'Dashboard', path: '/admin/dashboard' },
            { label: 'Staff Accounts' }
          ]}
        />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 px-4">
        <SummaryCard
          label="Total Staff"
          value="30"
          percent="5.0%"
          isUp={true}
          icon={<IoPersonOutline size={20} />}
          iconBg="bg-indigo-50"
          iconColor="text-indigo-600"
        />
        <SummaryCard
          label="Active Staff"
          value="27"
          percent="3.2%"
          isUp={true}
          icon={<IoShieldCheckmarkOutline size={20} />}
          iconBg="bg-green-50"
          iconColor="text-green-600"
        />
        <SummaryCard
          label="New This Month"
          value="4"
          percent="15.0%"
          isUp={false}
          icon={<IoFlashOutline size={20} />}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
        />
      </div>

      {/* Role Tabs */}
      <div className="px-4 overflow-x-auto">
        <div className="flex items-center gap-2 p-1.5 bg-neutral-100/50 rounded-2xl w-fit border border-neutral-100">
          {roleTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setRoleFilter(tab.value)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                roleFilter === tab.value
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
              Staff List
            </p>
            <div className="flex items-baseline gap-3">
              <h2 className="text-4xl font-bold text-gray-900 font-primary">
                {filteredStaff.length}
              </h2>
              <span className="text-xs font-bold text-indigo-500">members</span>
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
                placeholder="Search staff..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-64 pl-12 pr-4 py-3 bg-neutral-50/50 border border-neutral-100 rounded-2xl text-[13px] font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
              />
            </div>
            <button className="w-12 h-12 flex items-center justify-center bg-neutral-50 rounded-2xl text-neutral-400 hover:text-gray-900 transition-all">
              <IoRefreshOutline size={20} />
            </button>
            <button className="hidden md:flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl text-sm font-bold shadow-xl shadow-indigo-100/50 hover:bg-indigo-700 transition-all active:scale-95">
              <IoAddOutline size={20} />
              Add Staff
            </button>
          </div>
        </div>

        <StaffTable
          staffList={filteredStaff}
          selectedStaffId={selectedStaffId}
          onSelectStaff={(id) => setSelectedStaffId(id)}
          onToggleStatus={toggleStaffStatus}
        />

        {/* Pagination */}
        <div className="p-8 border-t border-neutral-50 flex items-center justify-between">
          <p className="text-xs font-semibold text-neutral-400 uppercase tracking-widest">
            Showing 1-{filteredStaff.length} of {staffList.length} Staff
          </p>
          <div className="flex items-center gap-2">
            <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-neutral-100 text-neutral-400 hover:text-indigo-600 transition-all">
              <IoChevronBackOutline />
            </button>
            <div className="flex gap-1">
              <button className="w-10 h-10 rounded-xl bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-100">
                1
              </button>
            </div>
            <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-neutral-100 text-neutral-400 hover:text-indigo-600 transition-all">
              <IoChevronForwardOutline />
            </button>
          </div>
        </div>
      </div>

      {/* Staff Detail Drawer */}
      <StaffDetailDrawer
        isOpen={!!selectedStaffId}
        onClose={() => setSelectedStaffId(null)}
        staff={selectedStaff}
      />
    </Container>
  )
}
