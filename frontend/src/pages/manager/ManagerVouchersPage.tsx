import { useState } from 'react'
import { createPortal } from 'react-dom'
import type { Voucher } from '@/shared/types'
import { VoucherStatus } from '@/shared/utils/enums/voucher.enum'
import { useManagerVouchers } from '@/features/manager/hooks/useManagerVouchers'
import { VoucherTable } from '@/components/layout/staff/managerstaff/vouchertable'
import { VoucherAddition } from '@/components/layout/staff/managerstaff/voucheraddition/VoucherAddition'
import {
  IoTicketOutline,
  IoAddOutline,
  IoSearchOutline,
  IoCreateOutline,
  IoTrashOutline,
  IoFilterOutline,
  IoBarChartOutline,
  IoRefreshOutline,
  IoChevronBackOutline,
  IoChevronForwardOutline
} from 'react-icons/io5'

// ─── Status filter tab config ─────────────────────────────────────
const FILTER_TABS = [
  { key: 'all',                  label: 'All' },
  { key: VoucherStatus.ACTIVE,   label: 'Active' },
  { key: VoucherStatus.DRAFT,    label: 'Draft' },
  { key: VoucherStatus.DISABLE,  label: 'Disabled' }
] as const

type FilterKey = (typeof FILTER_TABS)[number]['key']

// ─── Component ────────────────────────────────────────────────────
export default function ManagerVouchersPage() {
  const [page, setPage]               = useState(1)
  const LIMIT                          = 10
  const [statusFilter, setStatusFilter] = useState<FilterKey>('all')
  const [search, setSearch]            = useState('')

  const { data, isLoading, refetch }   = useManagerVouchers(
    page,
    LIMIT,
    statusFilter === 'all' ? undefined : statusFilter
  )

  const vouchers   = data?.data?.items?.data ?? []
  const pagination = data?.data?.items?.pagination

  // Client-side search within the current page results
  const filtered = search.trim()
    ? vouchers.filter((v) => {
        const q = search.toLowerCase()
        return (
          v.code.toLowerCase().includes(q) ||
          v.name.toLowerCase().includes(q) ||
          v.description.toLowerCase().includes(q)
        )
      })
    : vouchers

  // ── Modal state ──────────────────────────────────────────────────
  const [showForm,      setShowForm]      = useState(false)
  const [editingVoucher, setEditingVoucher] = useState<Voucher | null>(null)
  const [deleteId,      setDeleteId]      = useState<string | null>(null)

  const openCreate = () => { setEditingVoucher(null); setShowForm(true) }
  const openEdit   = (v: Voucher) => { setEditingVoucher(v); setShowForm(true) }

  // TODO: wire onSave to POST/PUT API mutation
  const handleSave = (formData: Partial<Voucher>) => {
    console.log('Save voucher:', formData)
    setShowForm(false)
    refetch()
  }

  // TODO: wire handleDelete to DELETE API mutation
  const handleDelete = () => {
    console.log('Delete voucher:', deleteId)
    setDeleteId(null)
    refetch()
  }

  // ── Render ───────────────────────────────────────────────────────
  return (
    <div className="animate-fade-in-up space-y-6">

      {/* Header */}
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
            onClick={openCreate}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-mint-500 text-white text-sm font-bold hover:bg-mint-600 transition-all active:scale-95 shadow-lg shadow-mint-200"
          >
            <IoAddOutline size={18} />
            New Voucher
          </button>
        </div>
      </div>

      {/* Stat pills from API total */}
      <div className="grid grid-cols-4 gap-3">
        {FILTER_TABS.map((tab) => {
          const colors: Record<FilterKey, { text: string; iconBg: string }> = {
            all:     { text: 'text-slate-700',   iconBg: 'bg-slate-100'  },
            ACTIVE:  { text: 'text-emerald-700', iconBg: 'bg-emerald-50' },
            DRAFT:   { text: 'text-amber-600',   iconBg: 'bg-amber-50'   },
            DISABLE: { text: 'text-slate-400',   iconBg: 'bg-slate-50'   }
          }
          const c = colors[tab.key]
          // For the total card use pagination.total; others are filtered by API
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
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">
                  {tab.label}
                </p>
                <p className={`text-2xl font-black mt-0.5 ${c.text}`}>{count}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
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

        {/* Status tabs */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl">
          <IoFilterOutline className="text-slate-400 ml-2" size={13} />
          {FILTER_TABS.map((tab) => {
            const isActive = statusFilter === tab.key
            return (
              <button
                key={tab.key}
                onClick={() => { setStatusFilter(tab.key); setPage(1); setSearch('') }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  isActive ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Table */}
      <VoucherTable
        vouchers={filtered}
        isLoading={isLoading}
        renderActions={(v) => (
          <>
            <button
              onClick={() => openEdit(v)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-mint-600 hover:bg-mint-50 transition-all"
              title="Edit"
            >
              <IoCreateOutline size={15} />
            </button>
            <button
              onClick={() => setDeleteId(v._id)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
              title="Delete"
            >
              <IoTrashOutline size={15} />
            </button>
          </>
        )}
      />

      {/* Pagination */}
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

      {/* Modals */}
      <VoucherAddition
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSave={handleSave}
        editingVoucher={editingVoucher}
      />

      {deleteId && (
        <ModalOverlay onClose={() => setDeleteId(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-4">
              <IoTrashOutline className="text-red-400" size={26} />
            </div>
            <h2 className="text-base font-black text-slate-900 mb-1">Delete Voucher?</h2>
            <p className="text-sm text-slate-400 mb-6">This action cannot be undone.</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setDeleteId(null)}
                className="px-5 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-6 py-2 rounded-xl bg-red-500 text-white text-sm font-black hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </ModalOverlay>
      )}
    </div>
  )
}

function ModalOverlay({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-[3px]" onClick={onClose} />
      <div className="relative z-10 w-full flex justify-center">{children}</div>
    </div>,
    document.body
  )
}
