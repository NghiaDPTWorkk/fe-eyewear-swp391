import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  IoAddOutline,
  IoTrashOutline,
  IoRefreshOutline,
  IoFilterOutline,
  IoChevronBackOutline,
  IoChevronForwardOutline
} from 'react-icons/io5'
import { PATHS } from '@/routes/paths'
import { VoucherStatus } from '@/shared/utils/enums/voucher.enum'
import {
  useManagerVouchers,
  useVoucherStats,
  useCreateVoucher,
  useDeleteVoucher
} from '@/features/manager-staff/hooks/useManagerVouchers'
import { VoucherTable } from '@/components/layout/staff/manager-staff/voucher-table'
import { VoucherAddition } from '@/components/layout/staff/manager-staff/voucher-addition/VoucherAddition'
import PageHeader from '@/features/staff/components/common/PageHeader'
import ManagerVoucherSearch from '@/components/layout/staff/manager-staff/voucher-search/ManagerVoucherSearch'
import { VoucherMetrics } from './components/vouchers/VoucherMetrics'
import { DeleteVoucherModal } from './components/vouchers/DeleteVoucherModal'

const FILTER_TABS = [
  { key: 'all', label: 'All Vouchers' },
  { key: VoucherStatus.ACTIVE, label: 'Active' },
  { key: VoucherStatus.DRAFT, label: 'Draft' },
  { key: VoucherStatus.DISABLE, label: 'Disabled' }
] as const

export default function ManagerVouchersPage() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<(typeof FILTER_TABS)[number]['key']>('all')
  const [typeFilter, setTypeFilter] = useState<'all' | 'PERCENTAGE' | 'FIXED'>('all')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const { data, isLoading, isFetching, refetch } = useManagerVouchers(
    page,
    10,
    statusFilter === 'all' ? undefined : statusFilter
  )
  const { stats, isLoading: isStatsLoading } = useVoucherStats()
  const createMutation = useCreateVoucher()
  const deleteMutation = useDeleteVoucher()

  const rawItems = data?.data?.items
  const vouchers =
    data?.data?.voucherList ?? (Array.isArray(rawItems) ? rawItems : (rawItems?.data ?? []))
  const pagination =
    data?.pagination ||
    data?.data?.pagination ||
    (rawItems && !Array.isArray(rawItems)
      ? {
          page: (rawItems as any).page,
          limit: (rawItems as any).limit,
          total: (rawItems as any).total,
          totalPages: (rawItems as any).totalPages
        }
      : undefined)

  const handleSave = (f: any) => {
    createMutation.mutate(
      {
        ...f,
        name: f.name ?? '',
        description: f.description ?? '',
        code: f.code ?? '',
        typeDiscount: f.typeDiscount ?? 'PERCENTAGE',
        value: f.value ?? 0,
        usageLimit: f.usageLimit ?? 100,
        startedDate: f.startedDate ? new Date(f.startedDate).toISOString() : '',
        endedDate: f.endedDate ? new Date(f.endedDate).toISOString() : '',
        minOrderValue: f.minOrderValue ?? 0,
        maxDiscountValue: f.maxDiscountValue ?? 0,
        applyScope: f.applyScope ?? 'ALL',
        status: f.status ?? 'DRAFT'
      },
      {
        onSuccess: (res) => {
          if (res.success) setShowForm(false)
        }
      }
    )
  }

  return (
    <div className="animate-fade-in-up space-y-8">
      <PageHeader
        title="Vouchers"
        subtitle="Manage discount campaigns & coupons"
        breadcrumbs={[{ label: 'Dashboard', path: PATHS.MANAGER.DASHBOARD }, { label: 'Vouchers' }]}
        noMargin
      />
      <VoucherMetrics
        stats={stats}
        currentFilter={statusFilter}
        onFilter={(k) => {
          setStatusFilter(k as any)
          setPage(1)
        }}
        isStatsLoading={isStatsLoading}
      />
      <div className="space-y-6">
        <div className="overflow-x-auto">
          <div className="flex items-center gap-2 p-1.5 bg-neutral-100/50 rounded-2xl w-fit border border-neutral-100">
            {FILTER_TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => {
                  setStatusFilter(t.key)
                  setPage(1)
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${statusFilter === t.key ? 'bg-white text-mint-600 shadow-sm' : 'text-neutral-500'}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-3xl border border-neutral-50 shadow-sm">
          <div className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <ManagerVoucherSearch />
            <div className="flex items-center gap-3">
              <div className="relative">
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className={`flex items-center gap-2 px-4 py-2 border rounded-xl text-xs font-bold transition-all min-w-[160px] justify-between h-11 ${isFilterOpen || typeFilter !== 'all' ? 'border-mint-500 bg-mint-50 text-mint-600' : 'border-neutral-100 bg-neutral-50 text-neutral-600'}`}
                >
                  <div>
                    <IoFilterOutline size={16} />
                    <span className="ml-2 uppercase">
                      {typeFilter === 'all' ? 'All Types' : typeFilter}
                    </span>
                  </div>
                  <IoChevronBackOutline
                    className={isFilterOpen ? 'rotate-90' : '-rotate-90'}
                    size={12}
                  />
                </button>
                {isFilterOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsFilterOpen(false)} />
                    <div className="absolute top-full mt-2 right-0 w-56 z-20 p-2 bg-white rounded-2xl shadow-xl border border-neutral-100 animate-in fade-in slide-in-from-top-2">
                      {[
                        { l: 'All Types', v: 'all' },
                        { l: 'Percentage', v: 'PERCENTAGE' },
                        { l: 'Fixed Amount', v: 'FIXED' }
                      ].map((t) => (
                        <button
                          key={t.l}
                          className={`w-full text-left px-3 py-2.5 rounded-xl text-[10px] uppercase font-bold transition-all ${typeFilter === t.v ? 'bg-mint-50 text-mint-600' : 'text-neutral-600'}`}
                          onClick={() => {
                            setTypeFilter(t.v as any)
                            setPage(1)
                            setIsFilterOpen(false)
                          }}
                        >
                          {t.l}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
              <button
                onClick={() => refetch()}
                className="h-11 w-11 bg-white border border-neutral-200 rounded-xl text-neutral-400 hover:text-mint-600 transition-all flex items-center justify-center"
              >
                <IoRefreshOutline className={isFetching ? 'animate-spin' : ''} size={20} />
              </button>
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 px-6 h-11 bg-mint-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-mint-100 uppercase tracking-widest hover:bg-mint-700 active:scale-95"
              >
                <IoAddOutline size={18} /> New Voucher
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-3xl border border-neutral-50 shadow-sm overflow-hidden">
        <VoucherTable
          vouchers={vouchers}
          isLoading={isLoading || isFetching}
          renderActions={(v) => (
            <button
              onClick={(e) => {
                e.stopPropagation()
                setDeleteId(v._id)
              }}
              className="p-1.5 rounded-xl text-slate-400 hover:text-red-500 transition-all"
            >
              <IoTrashOutline size={15} />
            </button>
          )}
          onRowClick={(v) => navigate(PATHS.MANAGER.VOUCHER_DETAIL(v._id))}
        />
        {pagination && pagination.totalPages > 1 && (
          <div className="p-6 bg-white border-t border-neutral-50 flex items-center justify-between">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Page {pagination.page} of {pagination.totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-neutral-50 text-neutral-400 disabled:opacity-30"
              >
                <IoChevronBackOutline />
              </button>
              <div className="flex gap-1">
                {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => i + 1).map(
                  (p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${page === p ? 'bg-mint-500 text-white' : 'text-neutral-400 hover:bg-neutral-50'}`}
                    >
                      {p}
                    </button>
                  )
                )}
              </div>
              <button
                disabled={page >= pagination.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-neutral-50 text-neutral-400 disabled:opacity-30"
              >
                <IoChevronForwardOutline />
              </button>
            </div>
          </div>
        )}
      </div>
      <VoucherAddition
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSave={handleSave}
        editingVoucher={null}
        isSaving={createMutation.isPending}
      />
      {deleteId && (
        <DeleteVoucherModal
          isDeleting={deleteMutation.isPending}
          onCancel={() => setDeleteId(null)}
          onConfirm={() =>
            deleteMutation.mutate(deleteId, {
              onSuccess: (res) => {
                if (res.success) setDeleteId(null)
              }
            })
          }
        />
      )}
    </div>
  )
}
