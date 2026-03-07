import { useNavigate } from 'react-router-dom'
import { PATHS } from '@/routes/paths'
import type { Voucher, VoucherPayload } from '@/shared/types'
import { VoucherStatus } from '@/shared/utils/enums/voucher.enum'
import {
  useManagerVouchers,
  useCreateVoucher,
  useDeleteVoucher
} from '@/features/manager/hooks/useManagerVouchers'
import { VoucherTable } from '@/components/layout/staff/managerstaff/vouchertable'
import { VoucherAddition } from '@/components/layout/staff/managerstaff/voucheraddition/VoucherAddition'
import { createPortal } from 'react-dom'
import {
  IoTicketOutline,
  IoAddOutline,
  IoSearchOutline,
  IoTrashOutline,
  IoFilterOutline,
  IoBarChartOutline,
  IoRefreshOutline,
  IoChevronBackOutline,
  IoChevronForwardOutline
} from 'react-icons/io5'
import { useState } from 'react'

// ─── Filter tabs ──────────────────────────────────────────────────
const FILTER_TABS = [
  { key: 'all',                 label: 'All'      },
  { key: VoucherStatus.ACTIVE,  label: 'Active'   },
  { key: VoucherStatus.DRAFT,   label: 'Draft'    },
  { key: VoucherStatus.DISABLE, label: 'Disabled' }
] as const

type FilterKey = (typeof FILTER_TABS)[number]['key']

export default function ManagerVouchersPage() {
  const navigate = useNavigate()

  // ── List / filter state ──────────────────────────────────────────
  const [page, setPage]               = useState(1)
  const LIMIT                          = 10
  const [statusFilter, setStatusFilter] = useState<FilterKey>('all')
  const [search, setSearch]            = useState('')

  const { data, isLoading, refetch } = useManagerVouchers(
    page, LIMIT,
    statusFilter === 'all' ? undefined : statusFilter
  )
  const vouchers   = data?.data?.items?.data ?? []
  const pagination = data?.data?.items?.pagination

  const filtered = search.trim()
    ? vouchers.filter((v) => {
        const q = search.toLowerCase()
        return (
          v.code.toLowerCase().includes(q) ||
          v.name.toLowerCase().includes(q) ||
          (v.description ?? '').toLowerCase().includes(q)
        )
      })
    : vouchers

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
      name:             formData.name             ?? '',
      description:      formData.description      ?? '',
      code:             formData.code             ?? '',
      typeDiscount:     formData.typeDiscount      ?? 'PERCENTAGE',
      value:            formData.value             ?? 0,
      usageLimit:       formData.usageLimit        ?? 100,
      startedDate:      formData.startedDate       ?? '',
      endedDate:        formData.endedDate         ?? '',
      minOrderValue:    formData.minOrderValue      ?? 0,
      maxDiscountValue: formData.maxDiscountValue   ?? 0,
      applyScope:       formData.applyScope        ?? 'ALL',
      status:           formData.status            ?? 'DRAFT'
    }

    createMutation.mutate(payload, {
      onSuccess: (res) => { if (res.success) handleClose() }
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

  const isSaving   = createMutation.isPending
  const isDeleting = deleteMutation.isPending

  // ── Render ────────────────────────────────────────────────────────
  return (
    <div className="animate-fade-in-up space-y-6">

      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <IoTicketOutline className="text-mint-500" size={26} />
            Vouchers
          </h1>
          <p className="text-sm text-slate-400 mt-0.5 font-medium">
            Manage discount campaigns &amp; coupons
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => refetch()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-slate-500 text-sm font-bold hover:border-mint-300 hover:text-mint-600 hover:bg-mint-50/40 transition-all active:scale-95"
          >
            <IoRefreshOutline size={16} />
          </button>
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-mint-500 text-white text-sm font-bold hover:bg-mint-600 transition-all active:scale-95 shadow-lg shadow-mint-200"
          >
            <IoAddOutline size={18} />
            New Voucher
          </button>
        </div>
      </div>

      {/* ── Stat cards ──────────────────────────────────────────── */}
      <div className="grid grid-cols-4 gap-3">
        {FILTER_TABS.map((tab) => {
          const colors: Record<FilterKey, { text: string; iconBg: string }> = {
            all:     { text: 'text-slate-700',   iconBg: 'bg-slate-100'  },
            ACTIVE:  { text: 'text-emerald-700', iconBg: 'bg-emerald-50' },
            DRAFT:   { text: 'text-amber-600',   iconBg: 'bg-amber-50'   },
            DISABLE: { text: 'text-slate-400',   iconBg: 'bg-slate-50'   }
          }
          const c     = colors[tab.key]
          const count = tab.key === 'all' ? (pagination?.total ?? '—') : '—'
          return (
            <div
              key={tab.key}
              className="bg-white rounded-2xl border border-slate-100 px-5 py-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className={`w-10 h-10 rounded-xl ${c.iconBg} flex items-center justify-center shrink-0`}>
                <IoBarChartOutline className={c.text} size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">{tab.label}</p>
                <p className={`text-2xl font-black mt-0.5 ${c.text}`}>{count}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Filters ─────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px] max-w-xs">
          <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search code or name…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="w-full pl-9 pr-4 py-2.5 rounded-2xl border border-slate-200 bg-white text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-mint-300/50 focus:border-mint-400 transition"
          />
        </div>
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl">
          <IoFilterOutline className="text-slate-400 ml-2" size={13} />
          {FILTER_TABS.map((tab) => {
            const isActive = statusFilter === tab.key
            return (
              <button
                key={tab.key}
                onClick={() => { setStatusFilter(tab.key); setPage(1); setSearch('') }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${isActive ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Table ───────────────────────────────────────────────── */}
      {/* Click any row → detail. Delete icon stays inline. */}
      <VoucherTable
        vouchers={filtered}
        isLoading={isLoading}
        renderActions={(v) => (
          <button
            onClick={(e) => { e.stopPropagation(); setDeleteId(v._id) }}
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
        <div className="flex items-center justify-between px-1">
          <p className="text-xs font-bold text-slate-400">
            Page <span className="text-slate-700">{pagination.page}</span> of{' '}
            <span className="text-slate-700">{pagination.totalPages}</span>
            {' '}·{' '}
            <span className="text-slate-700">{pagination.total}</span> total
          </p>
          <div className="flex items-center gap-1.5">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-500 hover:border-mint-300 hover:text-mint-600 hover:bg-mint-50 transition-all disabled:opacity-30"
            >
              <IoChevronBackOutline size={16} />
            </button>
            <button
              disabled={page >= pagination.totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-500 hover:border-mint-300 hover:text-mint-600 hover:bg-mint-50 transition-all disabled:opacity-30"
            >
              <IoChevronForwardOutline size={16} />
            </button>
          </div>
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
            {isDeleting && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            {isDeleting ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
