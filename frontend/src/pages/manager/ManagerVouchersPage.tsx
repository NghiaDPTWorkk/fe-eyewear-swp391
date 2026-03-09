import { useNavigate } from 'react-router-dom'
import { PATHS } from '@/routes/paths'
import type { Voucher, VoucherPayload } from '@/shared/types'
import { VoucherStatus } from '@/shared/utils/enums/voucher.enum'
import {
  useManagerVouchers,
  useVoucherStats,
  useCreateVoucher,
  useDeleteVoucher
} from '@/features/manager/hooks/useManagerVouchers'
import { VoucherTable } from '@/components/layout/staff/managerstaff/vouchertable'
import { VoucherAddition } from '@/components/layout/staff/managerstaff/voucheraddition/VoucherAddition'
import { Pagination } from '@/shared/components/ui-core/pagination/Pagination'
import { createPortal } from 'react-dom'
import {
  IoAddOutline,
  IoSearchOutline,
  IoTrashOutline,
  IoRefreshOutline,
  IoTicketOutline,
  IoFlashOutline,
  IoTimeOutline,
  IoCloseCircleOutline,
  IoFilterOutline,
  IoChevronBackOutline
} from 'react-icons/io5'
import { useState } from 'react'
import PageHeader from '@/features/staff/components/common/PageHeader'

// ─── Filter tabs ──────────────────────────────────────────────────
const FILTER_TABS = [
  { key: 'all', label: 'All Vouchers' },
  { key: VoucherStatus.ACTIVE, label: 'Active' },
  { key: VoucherStatus.DRAFT, label: 'Draft' },
  { key: VoucherStatus.DISABLE, label: 'Disabled' }
] as const

type FilterKey = (typeof FILTER_TABS)[number]['key']

export default function ManagerVouchersPage() {
  const navigate = useNavigate()

  // ── List / filter state ──────────────────────────────────────────
  const [page, setPage] = useState(1)
  const LIMIT = 10
  const [statusFilter, setStatusFilter] = useState<FilterKey>('all')
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | 'PERCENTAGE' | 'FIXED'>('all')
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const { data, isLoading, refetch } = useManagerVouchers(
    page,
    LIMIT,
    statusFilter === 'all' ? undefined : statusFilter,
    search.trim() || undefined
  )
  const { stats, isLoading: isStatsLoading } = useVoucherStats()

  const vouchers = (data?.data?.items?.data ?? []).filter((v) => {
    if (typeFilter === 'all') return true
    return v.typeDiscount === typeFilter
  })
  const pagination = data?.data?.items?.pagination

  // ── Modal state ───────────────────────────────────────────────────
  // We only need local state for creating a new voucher, and deleting.
  const [showForm, setShowForm] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  // ── Handlers ──────────────────────────────────────────────────────
  /** Click any row → navigate to detail page */
  const handleRowClick = (id: string) => {
    navigate(PATHS.MANAGER.VOUCHER_DETAIL(id))
  }

  /** "New Voucher" button → open form in create mode */
  const handleOpenCreate = () => {
    setShowForm(true)
  }

  const handleClose = () => {
    setShowForm(false)
  }

  // ── Mutations ─────────────────────────────────────────────────────
  const createMutation = useCreateVoucher()
  const deleteMutation = useDeleteVoucher()

  const handleSave = (formData: Partial<Voucher>) => {
    const payload: VoucherPayload = {
      name: formData.name ?? '',
      description: formData.description ?? '',
      code: formData.code ?? '',
      typeDiscount: formData.typeDiscount ?? 'PERCENTAGE',
      value: formData.value ?? 0,
      usageLimit: formData.usageLimit ?? 100,
      startedDate: formData.startedDate ? new Date(formData.startedDate).toISOString() : '',
      endedDate: formData.endedDate ? new Date(formData.endedDate).toISOString() : '',
      minOrderValue: formData.minOrderValue ?? 0,
      maxDiscountValue: formData.maxDiscountValue ?? 0,
      applyScope: formData.applyScope ?? 'ALL',
      status: formData.status ?? 'DRAFT'
    }

    createMutation.mutate(payload, {
      onSuccess: (res) => {
        if (res.success) handleClose()
      }
    })
  }

  const handleDelete = () => {
    if (!deleteId) return
    deleteMutation.mutate(deleteId, {
      onSuccess: (res) => {
        if (res.success) {
          setDeleteId(null)
        }
      }
    })
  }

  const isSaving = createMutation.isPending
  const isDeleting = deleteMutation.isPending

  const metrics = [
    {
      key: 'all',
      label: 'Total Vouchers',
      value: stats['all'] ?? 0,
      icon: <IoTicketOutline className="text-2xl" />,
      colorScheme: 'mint',
      trend: { label: 'of total', value: 100, isPositive: true }
    },
    {
      key: VoucherStatus.ACTIVE,
      label: 'Active Now',
      value: stats[VoucherStatus.ACTIVE] ?? 0,
      icon: <IoFlashOutline className="text-2xl" />,
      colorScheme: 'secondary',
      trend: {
        label: 'of total',
        value: stats['all']
          ? Math.round(((stats[VoucherStatus.ACTIVE] ?? 0) / stats['all']) * 100)
          : 0,
        isPositive: true
      }
    },
    {
      key: VoucherStatus.DRAFT,
      label: 'Drafts',
      value: stats[VoucherStatus.DRAFT] ?? 0,
      icon: <IoTimeOutline className="text-2xl" />,
      colorScheme: 'info',
      trend: {
        label: 'of total',
        value: stats['all']
          ? Math.round(((stats[VoucherStatus.DRAFT] ?? 0) / stats['all']) * 100)
          : 0,
        isPositive: true
      }
    },
    {
      key: VoucherStatus.DISABLE,
      label: 'Disabled',
      value: stats[VoucherStatus.DISABLE] ?? 0,
      icon: <IoCloseCircleOutline className="text-2xl" />,
      colorScheme: 'danger',
      trend: {
        label: 'of total',
        value: stats['all']
          ? Math.round(((stats[VoucherStatus.DISABLE] ?? 0) / stats['all']) * 100)
          : 0,
        isPositive: false
      }
    }
  ]

  // ── Render ────────────────────────────────────────────────────────
  return (
    <div className="animate-fade-in-up space-y-8">
      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <PageHeader
          title="Vouchers"
          subtitle="Manage discount campaigns & coupons"
          breadcrumbs={[
            { label: 'Dashboard', path: PATHS.MANAGER.DASHBOARD },
            { label: 'Vouchers' }
          ]}
          noMargin
        />
      </div>

      {/* ── Stat cards ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m) => {
          const isActive = statusFilter === m.key
          const getIconBg = () => {
            switch (m.colorScheme) {
              case 'mint':
                return 'bg-mint-50 text-mint-700'
              case 'secondary':
                return 'bg-purple-50 text-purple-600'
              case 'danger':
                return 'bg-red-50 text-red-600'
              case 'info':
                return 'bg-sky-50 text-sky-600'
              default:
                return 'bg-gray-50 text-gray-600'
            }
          }

          return (
            <div
              key={m.key}
              onClick={() => setStatusFilter(m.key as FilterKey)}
              className={`bg-white p-6 rounded-3xl border-none shadow-sm ring-1 ring-neutral-100/50 transition-all cursor-pointer active:scale-95 ${
                isActive
                  ? 'ring-2 ring-mint-500 ring-offset-4 shadow-2xl shadow-mint-100/50 scale-[1.02]'
                  : 'hover:shadow-md'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[12px] font-bold text-slate-400 tracking-wider whitespace-nowrap uppercase">
                    {m.label}
                  </p>
                  <h3 className="text-2xl font-bold mt-1.5 text-slate-900 tracking-tight">
                    {isStatsLoading ? '...' : m.value}
                  </h3>
                </div>
                <div
                  className={`p-3.5 rounded-2xl shadow-sm transition-transform hover:scale-105 ${getIconBg()}`}
                >
                  {m.icon}
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm">
                <span
                  className={`font-bold flex items-center ${m.trend.isPositive ? 'text-emerald-600' : 'text-red-600'}`}
                >
                  {m.trend.isPositive ? '↗' : '↘'} {m.trend.value}%
                </span>
                <span className="text-gray-500">{m.trend.label}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Filters ─────────────────────────────────────────────── */}
      <div className="space-y-6">
        <div className="overflow-x-auto scroller-hide">
          <div className="flex items-center gap-2 p-1.5 bg-neutral-100/50 rounded-2xl w-fit border border-neutral-100">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setStatusFilter(tab.key)
                  setPage(1)
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                  statusFilter === tab.key
                    ? 'bg-white text-mint-600 shadow-sm border border-neutral-100'
                    : 'text-neutral-500 hover:text-neutral-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-neutral-50/50 shadow-sm relative">
          <div className="p-6 border-b border-neutral-50/30 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex-1 max-w-md relative">
              <IoSearchOutline
                className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search by name or code..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
                className="w-full pl-11 pr-4 py-2.5 bg-neutral-50 border border-neutral-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-mint-500/10 focus:border-mint-500 transition-all font-sans"
              />
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className={`flex items-center gap-2 px-4 py-2 border rounded-xl text-sm font-semibold transition-all min-w-[160px] justify-between h-[42px] ${
                    isFilterOpen || typeFilter !== 'all'
                      ? 'border-mint-500 bg-mint-50 text-mint-600 ring-4 ring-mint-500/10'
                      : 'border-neutral-100 bg-neutral-50 text-neutral-600 hover:bg-neutral-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <IoFilterOutline
                      className={
                        isFilterOpen || typeFilter !== 'all' ? 'text-mint-600' : 'text-neutral-400'
                      }
                      size={16}
                    />
                    <span className="capitalize">
                      {typeFilter === 'all' ? 'All Types' : typeFilter.toLowerCase()}
                    </span>
                  </div>
                  <IoChevronBackOutline
                    className={`transition-transform duration-200 ${isFilterOpen ? 'rotate-90' : '-rotate-90'}`}
                    size={12}
                  />
                </button>
                {isFilterOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsFilterOpen(false)} />
                    <div className="absolute top-full mt-2 right-0 w-56 z-20 p-2 bg-white rounded-2xl shadow-xl shadow-mint-900/5 border border-neutral-100 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="space-y-1">
                        {[
                          { label: 'All Types', value: 'all' },
                          { label: 'Percentage', value: 'PERCENTAGE' },
                          { label: 'Fixed Amount', value: 'FIXED' }
                        ].map((tab) => (
                          <button
                            key={tab.label}
                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all text-left ${
                              typeFilter === tab.value
                                ? 'bg-mint-50 text-mint-600 font-bold'
                                : 'text-neutral-600 hover:bg-neutral-50 hover:pl-4'
                            }`}
                            onClick={() => {
                              setTypeFilter(tab.value as any)
                              setPage(1)
                              setIsFilterOpen(false)
                            }}
                          >
                            {tab.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
              <button
                disabled={isLoading}
                onClick={() => refetch()}
                className="flex items-center justify-center h-11 w-11 bg-white border border-neutral-200 rounded-xl text-neutral-400 hover:text-mint-600 hover:border-mint-200 transition-all active:scale-95 disabled:opacity-50"
              >
                <IoRefreshOutline className={isLoading ? 'animate-spin' : ''} size={20} />
              </button>
              <button
                onClick={handleOpenCreate}
                className="flex items-center gap-2 px-6 h-11 bg-mint-600 text-white rounded-xl text-xs font-semibold shadow-lg shadow-mint-100/50 hover:bg-mint-700 transition-all active:scale-95"
              >
                <IoAddOutline size={18} />
                New Voucher
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Table ───────────────────────────────────────────────── */}
      {/* Click any row → detail. Delete icon stays inline. */}
      <VoucherTable
        vouchers={vouchers}
        isLoading={isLoading}
        renderActions={(v) => (
          <button
            onClick={(e) => {
              e.stopPropagation()
              setDeleteId(v._id)
            }}
            className="p-1.5 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
            title="Delete"
          >
            <IoTrashOutline size={15} />
          </button>
        )}
        onRowClick={(v) => handleRowClick(v._id)}
      />

      {/* ── Pagination ──────────────────────────────────────────── */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between px-1 py-4 border-t border-slate-50">
          <p className="text-xs font-bold text-slate-400">
            Showing <span className="text-slate-700">{vouchers.length}</span> of{' '}
            <span className="text-slate-700">{pagination.total}</span> vouchers
          </p>
          <Pagination
            currentPage={page}
            totalPages={pagination.totalPages}
            onPageChange={(p) => setPage(p)}
          />
        </div>
      )}

      {/* ── VoucherAddition form (Create only here) ───────────────── */}
      <VoucherAddition
        isOpen={showForm}
        onClose={handleClose}
        onSave={handleSave}
        editingVoucher={null}
        isSaving={isSaving}
      />

      {/* ── Delete confirm ───────────────────────────────────────── */}
      {deleteId && (
        <DeleteModal
          isDeleting={isDeleting}
          onCancel={() => setDeleteId(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  )
}

// ─── DeleteModal ──────────────────────────────────────────────────
function DeleteModal({
  isDeleting,
  onCancel,
  onConfirm
}: {
  isDeleting: boolean
  onCancel: () => void
  onConfirm: () => void
}) {
  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-[3px]" onClick={onCancel} />
      <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
        <div className="w-14 h-14 rounded-full bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-4">
          <IoTrashOutline className="text-red-400" size={26} />
        </div>
        <h2 className="text-base font-black text-slate-900 mb-1">Delete Voucher?</h2>
        <p className="text-sm text-slate-400 mb-6">This action cannot be undone.</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="px-5 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50 transition disabled:opacity-40"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-6 py-2 rounded-xl bg-red-500 text-white text-sm font-black hover:bg-red-600 transition disabled:opacity-60 flex items-center gap-2"
          >
            {isDeleting && (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            {isDeleting ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
