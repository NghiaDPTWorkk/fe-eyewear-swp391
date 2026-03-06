import { VoucherAddition } from '@/components/layout/staff/managerstaff/voucheraddition'
import type {
  Voucher,
  Customer,
  VoucherStatus
} from '../../components/layout/staff/managerstaff/voucheraddition/VoucherAddition'

import { useState } from 'react'
import { createPortal } from 'react-dom'

// ─── Mock data ───────────────────────────────────────────────────
const MOCK_CUSTOMERS: Customer[] = [
  {
    id: 'cus-001',
    name: 'Nguyễn Thị Lan',
    email: 'lan.nguyen@email.com',
    avatarInitials: 'NL',
    totalSpending: 12500000,
    orderCount: 8
  },
  {
    id: 'cus-002',
    name: 'Trần Văn Hùng',
    email: 'hung.tran@email.com',
    avatarInitials: 'TH',
    totalSpending: 2400000,
    orderCount: 2
  },
  {
    id: 'cus-003',
    name: 'Lê Minh Phúc',
    email: 'phuc.le@email.com',
    avatarInitials: 'LP',
    totalSpending: 850000,
    orderCount: 1
  },
  {
    id: 'cus-004',
    name: 'Phạm Thu Hương',
    email: 'huong.pham@email.com',
    avatarInitials: 'PH',
    totalSpending: 15700000,
    orderCount: 12
  },
  {
    id: 'cus-005',
    name: 'Võ Thị Kim Chi',
    email: 'chi.vo@email.com',
    avatarInitials: 'VC',
    totalSpending: 4200000,
    orderCount: 4
  },
  {
    id: 'cus-006',
    name: 'Đặng Quốc Tuấn',
    email: 'tuan.dang@email.com',
    avatarInitials: 'DT',
    totalSpending: 9800000,
    orderCount: 6
  }
]

const INITIAL_VOUCHERS: Voucher[] = [
  {
    _id: 'v-001',
    name: 'Chương trình Hè 2026',
    code: 'SUMMER25',
    description: 'Summer sale campaign',
    typeDiscount: 'PERCENTAGE',
    value: 10,
    applyScope: 'ALL',
    selectionMode: 'RULE',
    minSpendingRule: 0,
    minOrderRule: 0,
    minOrderValue: 1000000,
    maxDiscountValue: 500000,
    usageLimit: 100,
    usageCount: 42,
    status: 'ACTIVE',
    startedDate: '2026-03-01',
    endedDate: '2026-04-30',
    assignedTo: [],
    deletedAt: null,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01'
  },
  {
    _id: 'v-002',
    name: 'Chào mừng người dùng mới',
    code: 'NEWUSER100K',
    description: 'Welcome voucher',
    typeDiscount: 'FIXED',
    value: 100000,
    applyScope: 'SPECIFIC',
    selectionMode: 'MANUAL',
    minSpendingRule: 0,
    minOrderRule: 0,
    minOrderValue: 300000,
    maxDiscountValue: 100000,
    usageLimit: 200,
    usageCount: 178,
    status: 'ACTIVE',
    startedDate: '2026-01-01',
    endedDate: '2026-12-31',
    assignedTo: ['cus-002', 'cus-004', 'cus-005'],
    deletedAt: null,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01'
  },
  {
    _id: 'v-003',
    name: 'Flash Sale 50%',
    code: 'FLASH50',
    description: 'Quick flash sale',
    typeDiscount: 'PERCENTAGE',
    value: 50,
    applyScope: 'ALL',
    selectionMode: 'RULE',
    minSpendingRule: 0,
    minOrderRule: 0,
    minOrderValue: 1000000,
    maxDiscountValue: 300000,
    usageLimit: 30,
    usageCount: 30,
    status: 'INACTIVE',
    startedDate: '2026-02-14',
    endedDate: '2026-02-14',
    assignedTo: [],
    deletedAt: null,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01'
  }
]

import {
  IoTicketOutline,
  IoAddOutline,
  IoSearchOutline,
  IoCreateOutline,
  IoTrashOutline,
  IoPersonAddOutline,
  IoCloseOutline,
  IoCheckmarkOutline,
  IoFilterOutline,
  IoPricetagOutline
} from 'react-icons/io5'

const STATUS_CFG: Record<VoucherStatus, { label: string; color: string; bg: string }> = {
  ACTIVE: { label: 'Active', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
  INACTIVE: {
    label: 'Inactive',
    color: 'text-neutral-600',
    bg: 'bg-neutral-100 border-neutral-200'
  },
  EXPIRED: { label: 'Expired', color: 'text-red-700', bg: 'bg-red-50 border-red-200' }
}

// ─── Component ────────────────────────────────────────────────────
export default function ManagerVouchersPage() {
  const [vouchers, setVouchers] = useState<Voucher[]>(INITIAL_VOUCHERS)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const [showForm, setShowForm] = useState(false)
  const [editingVoucher, setEditingVoucher] = useState<Voucher | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [assignVoucher, setAssignVoucher] = useState<Voucher | null>(null)
  const [assignSearch, setAssignSearch] = useState('')

  // ── Derived ──────────────────────────────────────────────────────
  const filtered = vouchers
    .filter((v) => {
      const q = search.toLowerCase()
      return (
        !q ||
        v.code.toLowerCase().includes(q) ||
        v.description.toLowerCase().includes(q) ||
        v.name.toLowerCase().includes(q)
      )
    })
    .filter((v) => statusFilter === 'all' || v.status === statusFilter)

  const counts = {
    all: vouchers.length,
    ACTIVE: vouchers.filter((v) => v.status === 'ACTIVE').length,
    INACTIVE: vouchers.filter((v) => v.status === 'INACTIVE').length,
    EXPIRED: vouchers.filter((v) => v.status === 'EXPIRED').length
  }

  // Handlers ────────────────────────────────────────────────────
  const openCreate = () => {
    setEditingVoucher(null)
    setShowForm(true)
  }

  const openEdit = (v: Voucher) => {
    setEditingVoucher(v)
    setShowForm(true)
  }

  const handleSaveVoucher = (formData: Partial<Voucher>) => {
    if (editingVoucher) {
      setVouchers((prev) =>
        prev.map((v) =>
          v._id === editingVoucher._id
            ? ({ ...v, ...formData, updatedAt: new Date().toISOString() } as Voucher)
            : v
        )
      )
    } else {
      const newV: Voucher = {
        ...formData,
        _id: `v-${Date.now()}`,
        usageCount: 0,
        deletedAt: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } as Voucher
      setVouchers((prev) => [newV, ...prev])
    }
    setShowForm(false)
  }

  const handleDelete = () => {
    if (!deleteId) return
    setVouchers((prev) => prev.filter((v) => v._id !== deleteId))
    setDeleteId(null)
  }

  // Standalone assign modal
  const toggleAssign = (customerId: string) => {
    if (!assignVoucher) return
    const update = (prev: Voucher[]) =>
      prev.map((v) => {
        if (v._id !== assignVoucher._id) return v
        const already = v.assignedTo.includes(customerId)
        return {
          ...v,
          assignedTo: already
            ? v.assignedTo.filter((id) => id !== customerId)
            : [...v.assignedTo, customerId]
        }
      })
    setVouchers(update)
    setAssignVoucher((prev) => {
      if (!prev) return null
      const already = prev.assignedTo.includes(customerId)
      return {
        ...prev,
        assignedTo: already
          ? prev.assignedTo.filter((id) => id !== customerId)
          : [...prev.assignedTo, customerId]
      }
    })
  }

  const filteredAssignCustomers = MOCK_CUSTOMERS.filter(
    (c) =>
      !assignSearch ||
      c.name.toLowerCase().includes(assignSearch.toLowerCase()) ||
      c.email.includes(assignSearch)
  )

  // Format helpers
  const fmt = (n: number) => n.toLocaleString('vi-VN')
  const condLabel = (v: Voucher) =>
    `Order ≥ ${fmt(v.minOrderValue)}₫ → ${v.typeDiscount === 'PERCENTAGE' ? `${v.value}%` : `${fmt(v.value)}₫`}${v.maxDiscountValue > 0 ? ` (max ${fmt(v.maxDiscountValue)}₫)` : ''}`

  // ── Render ───────────────────────────────────────────────────────
  return (
    <div className="animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2.5">
            <IoTicketOutline className="text-mint-500" size={28} />
            Vouchers
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Manage discount vouchers and assign them to customers.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-mint-500 text-white text-sm font-bold hover:bg-mint-600 transition shadow-sm shadow-mint-200"
        >
          <IoAddOutline size={18} /> Add Voucher
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          {
            label: 'Total',
            value: counts.all,
            color: 'text-neutral-800',
            bg: 'bg-neutral-50 border-neutral-100'
          },
          {
            label: 'Active',
            value: counts.ACTIVE,
            color: 'text-emerald-700',
            bg: 'bg-emerald-50 border-emerald-100'
          },
          {
            label: 'Inactive',
            value: counts.INACTIVE,
            color: 'text-neutral-500',
            bg: 'bg-neutral-50 border-neutral-100'
          },
          {
            label: 'Expired',
            value: counts.EXPIRED,
            color: 'text-red-600',
            bg: 'bg-red-50 border-red-100'
          }
        ].map((s) => (
          <div key={s.label} className={`rounded-xl border p-4 ${s.bg}`}>
            <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
              {s.label}
            </p>
            <p className={`text-3xl font-black mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="relative flex-1 min-w-[220px] max-w-sm">
          <IoSearchOutline
            className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
            size={17}
          />
          <input
            type="text"
            placeholder="Search code or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-neutral-200 bg-white text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-mint-300/50 focus:border-mint-400 transition"
          />
        </div>
        <div className="flex items-center gap-2">
          <IoFilterOutline className="text-neutral-400" size={15} />
          {(['all', 'ACTIVE', 'INACTIVE', 'EXPIRED'] as const).map((s) => {
            const cnt = s === 'all' ? counts.all : counts[s]
            const active = statusFilter === s
            return (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${active ? 'bg-mint-500 border-mint-500 text-white' : 'bg-white border-neutral-200 text-neutral-600 hover:border-mint-300 hover:text-mint-600'}`}
              >
                {s === 'all' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}
                <span
                  className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${active ? 'bg-white/25 text-white' : 'bg-neutral-100 text-neutral-500'}`}
                >
                  {cnt}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-neutral-100 shadow-sm overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-neutral-50 border-b border-neutral-100 text-[11px] font-bold text-neutral-500 uppercase tracking-widest">
          <div className="col-span-2">Code</div>
          <div className="col-span-3">Description</div>
          <div className="col-span-3">Conditions</div>
          <div className="col-span-1 text-center">Usage</div>
          <div className="col-span-1 text-center">Assigned</div>
          <div className="col-span-1 text-center">Status</div>
          <div className="col-span-1 text-center">Actions</div>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <IoTicketOutline className="text-neutral-300" size={40} />
            <p className="text-sm font-semibold text-neutral-500">No vouchers found</p>
          </div>
        ) : (
          filtered.map((v, idx) => {
            const st = STATUS_CFG[v.status]
            return (
              <div
                key={v._id}
                className={`grid grid-cols-12 gap-4 px-6 py-4 items-start hover:bg-mint-50/30 transition-colors ${idx !== filtered.length - 1 ? 'border-b border-neutral-50' : ''}`}
              >
                {/* Code */}
                <div className="col-span-2">
                  <div className="flex items-center gap-1.5">
                    {v.typeDiscount === 'PERCENTAGE' ? (
                      <span className="w-3.5 h-3.5 flex items-center justify-center text-mint-500 font-bold text-xs">
                        %
                      </span>
                    ) : (
                      <IoPricetagOutline className="text-violet-500" size={13} />
                    )}
                    <span className="font-mono text-sm font-bold text-neutral-800">{v.code}</span>
                  </div>
                  <span
                    className={`mt-1 inline-block text-[10px] font-bold px-1.5 py-0.5 rounded border ${v.applyScope === 'ALL' ? 'bg-neutral-100 text-neutral-500 border-neutral-200' : 'bg-blue-50 text-blue-600 border-blue-200'}`}
                  >
                    {v.applyScope === 'ALL'
                      ? 'ALL USERS'
                      : v.selectionMode === 'RULE'
                        ? 'AUTO RULES'
                        : 'MANUAL'}
                  </span>
                </div>
                {/* Description */}
                <div className="col-span-3 pt-0.5">
                  <p className="text-sm font-bold text-neutral-800 truncate" title={v.name}>
                    {v.name}
                  </p>
                  <p className="text-xs text-neutral-500 truncate mt-0.5" title={v.description}>
                    {v.description}
                  </p>
                </div>
                {/* Conditions */}
                <div className="col-span-3 space-y-1">
                  <p className="text-xs text-neutral-600 bg-neutral-50 border border-neutral-100 rounded px-2 py-1 leading-tight">
                    {condLabel(v)}
                  </p>
                </div>
                {/* Usage */}
                <div className="col-span-1 flex flex-col items-center gap-1 pt-0.5">
                  <span className="text-xs font-semibold text-neutral-700">
                    {v.usageCount}/{v.usageLimit}
                  </span>
                  <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${v.usageCount >= v.usageLimit ? 'bg-red-400' : 'bg-mint-400'}`}
                      style={{ width: `${Math.min((v.usageCount / v.usageLimit) * 100, 100)}%` }}
                    />
                  </div>
                </div>
                {/* Assigned */}
                <div className="col-span-1 flex justify-center pt-0.5">
                  <button
                    onClick={() => {
                      setAssignVoucher(v)
                      setAssignSearch('')
                    }}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-neutral-100 text-xs font-bold text-neutral-600 hover:bg-mint-100 hover:text-mint-700 transition"
                  >
                    <IoPersonAddOutline size={11} />
                    {v.assignedTo.length}
                  </button>
                </div>
                {/* Status */}
                <div className="col-span-1 flex justify-center pt-0.5">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${st.bg} ${st.color}`}
                  >
                    {st.label}
                  </span>
                </div>
                {/* Actions */}
                <div className="col-span-1 flex justify-center gap-1 pt-0.5">
                  <button
                    onClick={() => openEdit(v)}
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-mint-600 hover:bg-mint-50 transition"
                    title="Edit"
                  >
                    <IoCreateOutline size={16} />
                  </button>
                  <button
                    onClick={() => setDeleteId(v._id)}
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-red-50 transition"
                    title="Delete"
                  >
                    <IoTrashOutline size={16} />
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* ════ MODAL: Create / Edit ════ */}
      <VoucherAddition
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSave={handleSaveVoucher}
        editingVoucher={editingVoucher}
        customers={MOCK_CUSTOMERS}
      />

      {/* ════ MODAL: Delete confirm ════ */}
      {deleteId && (
        <ModalOverlay onClose={() => setDeleteId(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-4">
              <IoTrashOutline className="text-red-400" size={26} />
            </div>
            <h2 className="text-base font-bold text-neutral-900 mb-1">Delete Voucher?</h2>
            <p className="text-sm text-neutral-500 mb-6">This action cannot be undone.</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setDeleteId(null)}
                className="px-5 py-2 rounded-lg border border-neutral-200 text-neutral-600 text-sm font-semibold hover:bg-neutral-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-6 py-2 rounded-lg bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </ModalOverlay>
      )}

      {/* ════ MODAL: Assign from table row ════ */}
      {assignVoucher && (
        <ModalOverlay onClose={() => setAssignVoucher(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-neutral-900">Assign Voucher</h2>
                <p className="text-xs text-neutral-400 mt-0.5 font-mono">{assignVoucher.code}</p>
              </div>
              <button
                onClick={() => setAssignVoucher(null)}
                className="p-2 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition"
              >
                <IoCloseOutline size={20} />
              </button>
            </div>
            <div className="relative mb-4">
              <IoSearchOutline
                className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                size={16}
              />
              <input
                value={assignSearch}
                onChange={(e) => setAssignSearch(e.target.value)}
                placeholder="Search customer..."
                className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-mint-300/50 focus:border-mint-400 transition"
              />
            </div>
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {filteredAssignCustomers.map((c) => {
                const assigned = assignVoucher.assignedTo.includes(c.id)
                return (
                  <div
                    key={c.id}
                    onClick={() => toggleAssign(c.id)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl border transition cursor-pointer ${assigned ? 'bg-mint-50 border-mint-200' : 'bg-white border-neutral-100 hover:bg-neutral-50'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${assigned ? 'bg-mint-500 text-white' : 'bg-neutral-100 text-neutral-600'}`}
                      >
                        {c.avatarInitials}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-neutral-800">{c.name}</p>
                        <p className="text-xs text-neutral-400">{c.email}</p>
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition ${assigned ? 'bg-mint-500 border-mint-500' : 'border-neutral-300'}`}
                    >
                      {assigned && <IoCheckmarkOutline size={12} className="text-white" />}
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="mt-4 pt-4 border-t border-neutral-100 flex justify-between items-center">
              <p className="text-xs text-neutral-500">
                {assignVoucher.assignedTo.length} customer(s) assigned
              </p>
              <button
                onClick={() => setAssignVoucher(null)}
                className="px-5 py-2 rounded-lg bg-mint-500 text-white text-sm font-bold hover:bg-mint-600 transition"
              >
                Done
              </button>
            </div>
          </div>
        </ModalOverlay>
      )}
    </div>
  )
}

function ModalOverlay({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  const modalRoot = document.body
  if (!modalRoot) return null

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-hidden">
      <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-[3px]" onClick={onClose} />
      <div className="relative z-10 w-full flex justify-center">{children}</div>
    </div>,
    modalRoot
  )
}
