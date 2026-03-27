import { useMemo, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { type FormikHelpers } from 'formik'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Container, Button } from '@/shared/components/ui'
import OperationPagination from '@/shared/components/ui/pagination/OperationPagination'
import { PageHeader } from '@/features/sales/components/common'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { adminAccountService } from '@/shared/services/admin/adminAccountService'
import type { AdminAccount, CreateAdminAccountRequest } from '@/shared/types'
import { StaffTable, type StaffData } from './components/staff/StaffTable'
import { AdminAccountDetail } from './components/AdminAccountDetail'
import { AdminEditAccount, type CreateAdminAccountFormValues } from './AdminEditAccount'
import ConfirmationModal from '@/shared/components/ui/ConfirmationModal'
import {
  IoSearchOutline,
  IoRefreshOutline,
  IoAddOutline,
  IoPersonOutline,
  IoShieldCheckmarkOutline,
  IoFlashOutline,
  IoTrendingUpOutline,
  IoTrendingDownOutline
} from 'react-icons/io5'

// ─── Helpers ────────────────────────────────────────────────────────────────

const formatRoleLabel = (role: string): string => {
  const normalized = role.toUpperCase()
  if (normalized === 'SALE_STAFF') return 'Sale Staff'
  if (normalized === 'OPERATION_STAFF') return 'Operation Staff'
  if (normalized === 'MANAGER') return 'Manager'
  if (normalized === 'SYSTEM_ADMIN' || normalized === 'ADMIN') return 'Admin'
  return role
}

const formatDate = (isoDate?: string | null): string => {
  if (!isoDate) return '--'
  const date = new Date(isoDate)
  if (Number.isNaN(date.getTime())) return '--'
  return date.toLocaleString('vi-VN')
}

const mapToStaffData = (item: AdminAccount): StaffData => ({
  id: item._id,
  name: item.name,
  email: item.email,
  role: formatRoleLabel(item.role),
  lastLogin: formatDate(item.lastLogin),
  createdAt: formatDate(item.createdAt),
  phone: item.phone,
  citizenId: item.citizenId,
  avatar: item.avatar
})

// ─── SummaryCard ─────────────────────────────────────────────────────────────

const SummaryCard: React.FC<{
  label: string
  value: string
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
        <p className="text-[10px] font-medium text-neutral-400 capitalize whitespace-nowrap">
          Updated just now
        </p>
      </div>
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function AdminStaffPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null)
  const [roleFilter, setRoleFilter] = useState<string>('All')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingStaff, setEditingStaff] = useState<StaffData | null>(null)
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)

  const debouncedSearch = useDebounce(searchQuery, 400)
  const listLimit = 10

  const roleToApiValue = useMemo(() => {
    if (roleFilter === 'All') return undefined
    if (roleFilter === 'Sale Staff') return 'SALE_STAFF'
    if (roleFilter === 'Operation Staff') return 'OPERATION_STAFF'
    if (roleFilter === 'Manager') return 'MANAGER'
    if (roleFilter === 'Admin') return 'SYSTEM_ADMIN'
    return undefined
  }, [roleFilter])

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['admin-staff-accounts', currentPage, listLimit, roleToApiValue, debouncedSearch],
    queryFn: () =>
      adminAccountService.getAdminAccounts({
        page: currentPage,
        limit: listLimit,
        role: roleToApiValue,
        search: debouncedSearch || undefined
      })
  })

  const { data: selectedDetailData } = useQuery({
    queryKey: ['admin-staff-account-detail', selectedStaffId],
    queryFn: () => adminAccountService.getAdminAccountDetail(selectedStaffId as string),
    enabled: !!selectedStaffId
  })

  const createMutation = useMutation({
    mutationFn: (payload: CreateAdminAccountRequest) =>
      adminAccountService.createAdminAccount(payload),
    onSuccess: () => {
      toast.success('Create admin account success')
      setIsEditModalOpen(false)
      queryClient.invalidateQueries({ queryKey: ['admin-staff-accounts'] })
    },
    onError: () => {
      toast.error('Create admin account failed')
    }
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      adminAccountService.updateAdminAccount(id, payload),
    onSuccess: () => {
      toast.success('Update admin account success')
      setIsEditModalOpen(false)
      setEditingStaff(null)
      queryClient.invalidateQueries({ queryKey: ['admin-staff-accounts'] })
      queryClient.invalidateQueries({ queryKey: ['admin-staff-account-detail'] })
    },
    onError: () => {
      toast.error('Update admin account failed')
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminAccountService.deleteAdminAccount(id),
    onSuccess: () => {
      toast.success('Delete admin account success')
      queryClient.invalidateQueries({ queryKey: ['admin-staff-accounts'] })
    },
    onError: () => {
      toast.error('Delete admin account failed')
    }
  })

  const adminAccounts = data?.data.adminAccounts ?? []
  const pagination = data?.data.pagination
  const staffList = adminAccounts.map(mapToStaffData)

  const selectedStaff = useMemo(() => {
    const detail = selectedDetailData?.data
    if (detail) return mapToStaffData(detail)
    return staffList.find((s) => s.id === selectedStaffId) ?? null
  }, [selectedDetailData, selectedStaffId, staffList])

  const activeStaffCount = adminAccounts.filter((acc) => !acc.deletedAt).length

  const roleTabs = [
    { label: 'All Staff', value: 'All' },
    { label: 'Sale Staff', value: 'Sale Staff' },
    { label: 'Operation Staff', value: 'Operation Staff' },
    { label: 'Manager', value: 'Manager' },
    { label: 'Admin', value: 'Admin' }
  ]

  const handleSubmitStaff = async (
    values: CreateAdminAccountFormValues,
    helpers: FormikHelpers<CreateAdminAccountFormValues>
  ) => {
    console.log('--- handleSubmitStaff triggered ---', { values, isEditing: !!editingStaff })
    try {
      if (editingStaff) {
        // Update mode
        const payload: any = {
          name: values.name.trim(),
          citizenId: values.citizenId.trim(),
          phone: values.phone.trim(),
          email: values.email.trim(),
          role: values.role,
          avatar: values.avatar?.trim() ? values.avatar.trim() : null
        }
        // Only include password if it's not empty
        if (values.password.trim()) {
          payload.password = values.password
        }

        await updateMutation.mutateAsync({
          id: editingStaff.id,
          payload
        })
      } else {
        // Create mode
        await createMutation.mutateAsync({
          name: values.name.trim(),
          citizenId: values.citizenId.trim(),
          phone: values.phone.trim(),
          email: values.email.trim(),
          password: values.password,
          role: values.role,
          avatar: values.avatar?.trim() ? values.avatar.trim() : null
        })
      }
      helpers.resetForm()
    } finally {
      helpers.setSubmitting(false)
    }
  }

  const toggleStaffStatus = (id: string) => {
    const target = adminAccounts.find((item) => item._id === id)
    if (!target) return

    if (target.deletedAt) {
      toast('Account is already inactive. Update endpoint is needed to reactivate.')
      return
    }

    // Mở confirm modal thay vì xóa trực tiếp
    setPendingDeleteId(id)
  }

  const handleConfirmDelete = () => {
    if (!pendingDeleteId) return
    deleteMutation.mutate(pendingDeleteId, {
      onSuccess: () => {
        setPendingDeleteId(null)
        setSelectedStaffId(null)
      }
    })
  }

  const total = pagination?.total ?? 0
  const totalPages = pagination?.totalPages ?? 1
  const page = pagination?.page ?? currentPage

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
      {/* summary card */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 px-4">
        <SummaryCard
          label="Total Staff"
          value={String(total)}
          percent="--"
          isUp={true}
          icon={<IoPersonOutline size={20} />}
          colorScheme="mint"
        />
        <SummaryCard
          label="Active Staff"
          value={String(activeStaffCount)}
          percent="--"
          isUp={true}
          icon={<IoShieldCheckmarkOutline size={20} />}
          colorScheme="info"
        />
        <SummaryCard
          label="Current Page"
          value={`${page}/${totalPages}`}
          percent="--"
          isUp={false}
          icon={<IoFlashOutline size={20} />}
          colorScheme="warning"
        />
      </div>
      {/* FILTER ROLE */}
      <div className="px-4 overflow-x-auto">
        <div className="flex items-center gap-2 p-1.5 bg-neutral-100/50 rounded-2xl w-fit border border-neutral-100">
          {roleTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => {
                setRoleFilter(tab.value)
                setCurrentPage(1)
              }}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                roleFilter === tab.value
                  ? 'bg-mint-900 text-white shadow-md shadow-mint-100 border-none'
                  : 'text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      {/* STAFF LIST */}
      <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden mx-4">
        <div className="p-6 border-b border-neutral-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
              Staff List
            </p>
            <div className="flex items-baseline gap-3">
              <h2 className="text-4xl font-bold text-gray-900 font-primary">{staffList.length}</h2>
              <span className="text-xs font-bold text-indigo-500">members</span>
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
                placeholder="Search staff..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
                className="w-full md:w-72 pl-12 pr-4 py-3 bg-neutral-50/50 border border-neutral-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-mint-500/10 focus:border-mint-500 transition-all placeholder:text-neutral-400"
              />
            </div>
            <button
              onClick={() => refetch()}
              className="w-12 h-12 flex items-center justify-center bg-neutral-50 rounded-2xl text-neutral-400 hover:text-mint-600 hover:bg-mint-50 transition-all"
            >
              <IoRefreshOutline size={20} className={isFetching ? 'animate-spin' : ''} />
            </button>
            <Button
              onClick={() => {
                setEditingStaff(null)
                setIsEditModalOpen(true)
              }}
              variant="solid"
              colorScheme="primary"
              className="hidden md:flex items-center gap-2 px-6 py-3 h-12 rounded-2xl text-sm font-bold shadow-xl shadow-mint-100/50 active:scale-95"
            >
              <IoAddOutline size={20} />
              Add Staff
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="p-8 text-sm text-neutral-500">Loading staff accounts...</div>
        ) : (
          <StaffTable
            staffList={staffList}
            selectedStaffId={selectedStaffId}
            onSelectStaff={(id) => setSelectedStaffId(id)}
            onToggleStatus={toggleStaffStatus}
          />
        )}

        <div className="px-6 py-4 border-t border-neutral-50">
          <OperationPagination
            page={page}
            totalPages={totalPages}
            total={total}
            limit={listLimit}
            onPageChange={(p) => setCurrentPage(p)}
          />
        </div>
      </div>

      {/* Staff Detail Drawer */}
      <AdminAccountDetail
        isOpen={!!selectedStaffId}
        onClose={() => setSelectedStaffId(null)}
        staff={selectedStaff}
        onEditStaff={(staff) => {
          navigate(`/admin/staff/edit/${staff.id}`)
          setSelectedStaffId(null) // Close drawer
        }}
        onDeactivate={(id) => toggleStaffStatus(id)}
      />

      {/* Staff Editor Modal - Used only for Adding New Staff */}
      <AdminEditAccount
        open={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setEditingStaff(null)
        }}
        initialData={null}
        onSubmit={handleSubmitStaff}
        isSubmitting={createMutation.isPending}
      />

      {/* Confirm Delete Modal */}
      <ConfirmationModal
        isOpen={!!pendingDeleteId}
        onClose={() => setPendingDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="Deactivate Account"
        message={`Are you sure you want to deactivate this staff account? This action cannot be undone.`}
        confirmText="Yes, Deactivate"
        cancelText="Cancel"
        isLoading={deleteMutation.isPending}
        type="danger"
      />

      <div className="px-4">
        <Outlet />
      </div>
    </Container>
  )
}
