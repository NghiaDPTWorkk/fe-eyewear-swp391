import { useEffect, useMemo, useState } from 'react'
import { Form, Formik, type FormikHelpers } from 'formik'
import * as Yup from 'yup'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Container } from '@/components'
import { PageHeader } from '@/features/sales/components/common'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { adminAccountService } from '@/shared/services/admin/adminAccountService'
import type { AdminAccount, CreateAdminAccountRequest } from '@/shared/types'
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
  IoTrendingDownOutline,
  IoCloseOutline
} from 'react-icons/io5'

const VN_PHONE_REGEX = /^(0|\+84)(3|5|7|8|9)\d{8}$/
const CITIZEN_ID_REGEX = /^\d{12}$/

interface CreateAdminAccountFormValues {
  name: string
  citizenId: string
  phone: string
  email: string
  password: string
  role: string
  avatar: string
}

const createAdminAccountValidationSchema = Yup.object({
  name: Yup.string().trim().min(1).max(255).required('Name is required'),
  citizenId: Yup.string()
    .matches(CITIZEN_ID_REGEX, 'Citizen ID must be exactly 12 digits')
    .required('Citizen ID is required'),
  phone: Yup.string()
    .matches(VN_PHONE_REGEX, 'Invalid Vietnam phone number')
    .required('Phone is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  role: Yup.string()
    .oneOf(['SALE_STAFF', 'OPERATION_STAFF', 'MANAGER', 'SYSTEM_ADMIN'])
    .required('Role is required'),
  avatar: Yup.string().trim().nullable().defined()
})

const formatRoleLabel = (role: string): string => {
  const normalized = role.toUpperCase()
  if (normalized === 'SALE_STAFF') return 'Sale Staff'
  if (normalized === 'OPERATION_STAFF') return 'Operation Staff'
  if (normalized === 'MANAGER') return 'Manager'
  if (normalized === 'SYSTEM_ADMIN' || normalized === 'ADMIN') return 'Admin'
  return role
}

const formatLastActive = (isoDate?: string | null): string => {
  if (!isoDate) return 'N/A'
  const date = new Date(isoDate)
  if (Number.isNaN(date.getTime())) return 'N/A'
  return date.toLocaleString('vi-VN')
}

const mapToStaffData = (item: AdminAccount): StaffData => ({
  id: item._id,
  name: item.name,
  email: item.email,
  role: formatRoleLabel(item.role),
  status: item.deletedAt ? 'Inactive' : 'Active',
  lastActive: formatLastActive(item.lastLogin ?? item.updatedAt),
  phone: item.phone,
  citizenId: item.citizenId,
  avatar: item.avatar
})

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

interface CreateStaffModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (
    values: CreateAdminAccountFormValues,
    helpers: FormikHelpers<CreateAdminAccountFormValues>
  ) => Promise<void>
  isSubmitting: boolean
}

function CreateStaffModal({ open, onClose, onSubmit, isSubmitting }: CreateStaffModalProps) {
  useEffect(() => {
    if (!open) return
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [open])

  if (!open) return null

  const initialValues: CreateAdminAccountFormValues = {
    name: '',
    citizenId: '',
    phone: '',
    email: '',
    password: '',
    role: 'SALE_STAFF',
    avatar: ''
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-[100]" onClick={onClose} />
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
        <div className="w-full max-w-2xl max-h-[90vh] bg-white rounded-3xl border border-neutral-100 shadow-2xl overflow-y-auto">
          <div className="p-6 border-b border-neutral-100 flex items-center justify-between sticky top-0 bg-white z-10">
            <h3 className="text-xl font-bold text-gray-900">Create Staff Account</h3>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-neutral-50 flex items-center justify-center text-neutral-400 hover:text-gray-900"
            >
              <IoCloseOutline size={22} />
            </button>
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={createAdminAccountValidationSchema}
            onSubmit={onSubmit}
          >
            {({ values, errors, touched, handleChange, handleBlur, setFieldValue }) => (
              <Form className="p-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                      Name
                    </label>
                    <input
                      name="name"
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      autoComplete="name"
                      maxLength={255}
                      className="w-full px-4 py-3 border border-neutral-200 rounded-xl"
                    />
                    {touched.name && errors.name && (
                      <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                      Citizen ID
                    </label>
                    <input
                      name="citizenId"
                      value={values.citizenId}
                      onChange={(e) =>
                        setFieldValue('citizenId', e.target.value.replace(/\D/g, '').slice(0, 12))
                      }
                      onBlur={handleBlur}
                      autoComplete="off"
                      inputMode="numeric"
                      maxLength={12}
                      className="w-full px-4 py-3 border border-neutral-200 rounded-xl"
                    />
                    {touched.citizenId && errors.citizenId && (
                      <p className="mt-1 text-xs text-red-500">{errors.citizenId}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                      Phone
                    </label>
                    <input
                      name="phone"
                      value={values.phone}
                      onChange={(e) =>
                        setFieldValue('phone', e.target.value.replace(/[^\d+]/g, '').slice(0, 12))
                      }
                      onBlur={handleBlur}
                      autoComplete="tel"
                      inputMode="tel"
                      className="w-full px-4 py-3 border border-neutral-200 rounded-xl"
                    />
                    {touched.phone && errors.phone && (
                      <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                      Email
                    </label>
                    <input
                      name="email"
                      type="email"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      autoComplete="email"
                      className="w-full px-4 py-3 border border-neutral-200 rounded-xl"
                    />
                    {touched.email && errors.email && (
                      <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                      Password
                    </label>
                    <input
                      name="password"
                      type="password"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      autoComplete="new-password"
                      className="w-full px-4 py-3 border border-neutral-200 rounded-xl"
                    />
                    {touched.password && errors.password && (
                      <p className="mt-1 text-xs text-red-500">{errors.password}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                      Role
                    </label>
                    <select
                      name="role"
                      value={values.role}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="w-full px-4 py-3 border border-neutral-200 rounded-xl"
                    >
                      <option value="SALE_STAFF">SALE_STAFF</option>
                      <option value="OPERATION_STAFF">OPERATION_STAFF</option>
                      <option value="MANAGER">MANAGER</option>
                      <option value="SYSTEM_ADMIN">SYSTEM_ADMIN</option>
                    </select>
                    {touched.role && errors.role && (
                      <p className="mt-1 text-xs text-red-500">{errors.role}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Avatar URL (optional)
                  </label>
                  <input
                    name="avatar"
                    value={values.avatar}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="w-full px-4 py-3 border border-neutral-200 rounded-xl"
                    placeholder="https://..."
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2 sticky bottom-0 bg-white pb-1">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2.5 rounded-xl border border-neutral-200 text-neutral-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold disabled:opacity-60"
                  >
                    {isSubmitting ? 'Creating...' : 'Create Account'}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  )
}

export default function AdminStaffPage() {
  const queryClient = useQueryClient()

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null)
  const [roleFilter, setRoleFilter] = useState<string>('All')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

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
      setIsCreateModalOpen(false)
      queryClient.invalidateQueries({ queryKey: ['admin-staff-accounts'] })
    },
    onError: () => {
      toast.error('Create admin account failed')
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

  const handleSubmitCreate = async (
    values: CreateAdminAccountFormValues,
    helpers: FormikHelpers<CreateAdminAccountFormValues>
  ) => {
    try {
      await createMutation.mutateAsync({
        name: values.name.trim(),
        citizenId: values.citizenId.trim(),
        phone: values.phone.trim(),
        email: values.email.trim(),
        password: values.password,
        role: values.role,
        avatar: values.avatar?.trim() ? values.avatar.trim() : null
      })
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

    deleteMutation.mutate(id)
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

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 px-4">
        <SummaryCard
          label="Total Staff"
          value={String(total)}
          percent="--"
          isUp={true}
          icon={<IoPersonOutline size={20} />}
          iconBg="bg-indigo-50"
          iconColor="text-indigo-600"
        />
        <SummaryCard
          label="Active Staff"
          value={String(activeStaffCount)}
          percent="--"
          isUp={true}
          icon={<IoShieldCheckmarkOutline size={20} />}
          iconBg="bg-green-50"
          iconColor="text-green-600"
        />
        <SummaryCard
          label="Current Page"
          value={`${page}/${totalPages}`}
          percent="--"
          isUp={false}
          icon={<IoFlashOutline size={20} />}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
        />
      </div>

      <div className="px-4 overflow-x-auto">
        <div className="flex items-center gap-2 p-1.5 bg-neutral-100/50 rounded-2xl w-fit border border-neutral-100">
          {roleTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => {
                setRoleFilter(tab.value)
                setCurrentPage(1)
              }}
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
            <div className="relative">
              <IoSearchOutline
                className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
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
                className="w-full md:w-64 pl-12 pr-4 py-3 bg-neutral-50/50 border border-neutral-100 rounded-2xl text-[13px] font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
              />
            </div>
            <button
              onClick={() => refetch()}
              className="w-12 h-12 flex items-center justify-center bg-neutral-50 rounded-2xl text-neutral-400 hover:text-gray-900 transition-all"
            >
              <IoRefreshOutline size={20} className={isFetching ? 'animate-spin' : ''} />
            </button>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="hidden md:flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl text-sm font-bold shadow-xl shadow-indigo-100/50 hover:bg-indigo-700 transition-all active:scale-95"
            >
              <IoAddOutline size={20} />
              Add Staff
            </button>
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

        <div className="p-8 border-t border-neutral-50 flex items-center justify-between">
          <p className="text-xs font-semibold text-neutral-400 uppercase tracking-widest">
            Showing {staffList.length} of {total} Staff
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage <= 1}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-neutral-100 text-neutral-400 hover:text-indigo-600 transition-all disabled:opacity-40"
            >
              <IoChevronBackOutline />
            </button>
            <div className="flex gap-1">
              <button className="px-3 h-10 rounded-xl bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-100">
                {page}
              </button>
            </div>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage >= totalPages}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-neutral-100 text-neutral-400 hover:text-indigo-600 transition-all disabled:opacity-40"
            >
              <IoChevronForwardOutline />
            </button>
          </div>
        </div>
      </div>

      <StaffDetailDrawer
        isOpen={!!selectedStaffId}
        onClose={() => setSelectedStaffId(null)}
        staff={selectedStaff}
      />

      <CreateStaffModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleSubmitCreate}
        isSubmitting={createMutation.isPending}
      />
    </Container>
  )
}
