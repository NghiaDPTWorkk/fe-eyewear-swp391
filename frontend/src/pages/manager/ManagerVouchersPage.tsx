import { useState } from 'react'
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

// ─── Types ────────────────────────────────────────────────────────
type DiscountType = 'PERCENTAGE' | 'FIXED'
type VoucherStatus = 'ACTIVE' | 'INACTIVE' | 'EXPIRED'
type VoucherScope = 'ALL' | 'SPECIFIC'

interface DiscountCondition {
  id: string
  minOrderValue: number
  discountValue: number
  maxDiscount: number | null // null = unlimited
}

interface Voucher {
  id: string
  code: string
  description: string
  discountType: DiscountType
  scope: VoucherScope
  conditions: DiscountCondition[]
  maxUsage: number
  usedCount: number
  status: VoucherStatus
  startDate: string
  endDate: string
  assignedTo: string[] // customer IDs
}

interface Customer {
  id: string
  name: string
  email: string
  avatarInitials: string
}

// ─── Mock data ────────────────────────────────────────────────────
const MOCK_CUSTOMERS: Customer[] = [
  { id: 'cus-001', name: 'Nguyễn Thị Lan', email: 'lan.nguyen@email.com', avatarInitials: 'NL' },
  { id: 'cus-002', name: 'Trần Văn Hùng', email: 'hung.tran@email.com', avatarInitials: 'TH' },
  { id: 'cus-003', name: 'Lê Minh Phúc', email: 'phuc.le@email.com', avatarInitials: 'LP' },
  { id: 'cus-004', name: 'Phạm Thu Hương', email: 'huong.pham@email.com', avatarInitials: 'PH' },
  { id: 'cus-005', name: 'Võ Thị Kim Chi', email: 'chi.vo@email.com', avatarInitials: 'VC' },
  { id: 'cus-006', name: 'Đặng Quốc Tuấn', email: 'tuan.dang@email.com', avatarInitials: 'DT' }
]

const mkCond = (id: string, min: number, val: number, max: number | null): DiscountCondition => ({
  id,
  minOrderValue: min,
  discountValue: val,
  maxDiscount: max
})

const INITIAL_VOUCHERS: Voucher[] = [
  {
    id: 'v-001',
    code: 'SUMMER25',
    description: 'Summer sale – multi-tier discount',
    discountType: 'PERCENTAGE',
    scope: 'ALL',
    conditions: [mkCond('c1', 9000000, 10, 500000), mkCond('c2', 1000000, 2, 90000)],
    maxUsage: 100,
    usedCount: 42,
    status: 'ACTIVE',
    startDate: '2026-03-01',
    endDate: '2026-04-30',
    assignedTo: []
  },
  {
    id: 'v-002',
    code: 'NEWUSER100K',
    description: 'Welcome voucher – fixed 100k',
    discountType: 'FIXED',
    scope: 'SPECIFIC',
    conditions: [mkCond('c3', 300000, 100000, null)],
    maxUsage: 200,
    usedCount: 178,
    status: 'ACTIVE',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    assignedTo: ['cus-002', 'cus-004', 'cus-005']
  },
  {
    id: 'v-003',
    code: 'FLASH50',
    description: 'Flash sale – 50% off',
    discountType: 'PERCENTAGE',
    scope: 'ALL',
    conditions: [mkCond('c4', 1000000, 50, 300000)],
    maxUsage: 30,
    usedCount: 30,
    status: 'INACTIVE',
    startDate: '2026-02-14',
    endDate: '2026-02-14',
    assignedTo: []
  },
  {
    id: 'v-004',
    code: 'LOYAL200K',
    description: 'Loyalty reward – 200k fixed',
    discountType: 'FIXED',
    scope: 'SPECIFIC',
    conditions: [mkCond('c5', 800000, 200000, null)],
    maxUsage: 50,
    usedCount: 12,
    status: 'ACTIVE',
    startDate: '2026-03-05',
    endDate: '2026-06-30',
    assignedTo: ['cus-001', 'cus-006']
  },
  {
    id: 'v-005',
    code: 'EXPIRE10',
    description: 'Year-end promo – expired',
    discountType: 'PERCENTAGE',
    scope: 'ALL',
    conditions: [mkCond('c6', 0, 10, null)],
    maxUsage: 500,
    usedCount: 488,
    status: 'EXPIRED',
    startDate: '2025-12-01',
    endDate: '2025-12-31',
    assignedTo: []
  }
]

// ─── Config ───────────────────────────────────────────────────────
const STATUS_CFG: Record<VoucherStatus, { label: string; color: string; bg: string }> = {
  ACTIVE: { label: 'Active', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
  INACTIVE: {
    label: 'Inactive',
    color: 'text-neutral-600',
    bg: 'bg-neutral-100 border-neutral-200'
  },
  EXPIRED: { label: 'Expired', color: 'text-red-700', bg: 'bg-red-50 border-red-200' }
}

const newCondId = () => `cond-${Date.now()}-${Math.random().toString(36).slice(2)}`

interface FormState {
  code: string
  description: string
  discountType: DiscountType
  scope: VoucherScope
  conditions: DiscountCondition[]
  maxUsage: number
  status: VoucherStatus
  startDate: string
  endDate: string
  assignedTo: string[]
}

const EMPTY_FORM: FormState = {
  code: '',
  description: '',
  discountType: 'PERCENTAGE',
  scope: 'ALL',
  conditions: [{ id: newCondId(), minOrderValue: 0, discountValue: 0, maxDiscount: null }],
  maxUsage: 100,
  status: 'ACTIVE',
  startDate: '',
  endDate: '',
  assignedTo: []
}

// ─── Component ────────────────────────────────────────────────────
export default function ManagerVouchersPage() {
  const [vouchers, setVouchers] = useState<Voucher[]>(INITIAL_VOUCHERS)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>({ ...EMPTY_FORM })
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [custSearch, setCustSearch] = useState('')
  const [assignVoucher, setAssignVoucher] = useState<Voucher | null>(null)
  const [assignSearch, setAssignSearch] = useState('')

  // ── Derived ──────────────────────────────────────────────────────
  const filtered = vouchers
    .filter((v) => {
      const matchStatus = statusFilter === 'all' || v.status === statusFilter
      const q = search.toLowerCase()
      return (
        (statusFilter === 'all' || matchStatus) &&
        (!q || v.code.toLowerCase().includes(q) || v.description.toLowerCase().includes(q))
      )
    })
    .filter((v) => statusFilter === 'all' || v.status === statusFilter)

  const counts = {
    all: vouchers.length,
    ACTIVE: vouchers.filter((v) => v.status === 'ACTIVE').length,
    INACTIVE: vouchers.filter((v) => v.status === 'INACTIVE').length,
    EXPIRED: vouchers.filter((v) => v.status === 'EXPIRED').length
  }

  // ── Form helpers ─────────────────────────────────────────────────
  const openCreate = () => {
    setEditingId(null)
    setForm({
      ...EMPTY_FORM,
      conditions: [{ id: newCondId(), minOrderValue: 0, discountValue: 0, maxDiscount: null }]
    })
    setCustSearch('')
    setShowForm(true)
  }

  const openEdit = (v: Voucher) => {
    setEditingId(v.id)
    setForm({
      code: v.code,
      description: v.description,
      discountType: v.discountType,
      scope: v.scope,
      conditions: v.conditions.map((c) => ({ ...c })),
      maxUsage: v.maxUsage,
      status: v.status,
      startDate: v.startDate,
      endDate: v.endDate,
      assignedTo: [...v.assignedTo]
    })
    setCustSearch('')
    setShowForm(true)
  }

  const handleSave = () => {
    if (!form.code.trim() || form.conditions.length === 0) return
    if (editingId) {
      setVouchers((prev) => prev.map((v) => (v.id === editingId ? { ...v, ...form } : v)))
    } else {
      setVouchers((prev) => [{ id: `v-${Date.now()}`, ...form, usedCount: 0 }, ...prev])
    }
    setShowForm(false)
  }

  const handleDelete = () => {
    if (!deleteId) return
    setVouchers((prev) => prev.filter((v) => v.id !== deleteId))
    setDeleteId(null)
  }

  // Condition management
  const addCondition = () =>
    setForm((f) => ({
      ...f,
      conditions: [
        ...f.conditions,
        { id: newCondId(), minOrderValue: 0, discountValue: 0, maxDiscount: null }
      ]
    }))

  const removeCondition = (id: string) =>
    setForm((f) => ({ ...f, conditions: f.conditions.filter((c) => c.id !== id) }))

  const updateCondition = (id: string, field: keyof DiscountCondition, value: number | null) =>
    setForm((f) => ({
      ...f,
      conditions: f.conditions.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    }))

  // Customer toggle in form
  const toggleFormCustomer = (custId: string) =>
    setForm((f) => ({
      ...f,
      assignedTo: f.assignedTo.includes(custId)
        ? f.assignedTo.filter((id) => id !== custId)
        : [...f.assignedTo, custId]
    }))

  // Standalone assign modal
  const toggleAssign = (customerId: string) => {
    if (!assignVoucher) return
    const update = (prev: Voucher[]) =>
      prev.map((v) => {
        if (v.id !== assignVoucher.id) return v
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
  const filteredFormCustomers = MOCK_CUSTOMERS.filter(
    (c) =>
      !custSearch ||
      c.name.toLowerCase().includes(custSearch.toLowerCase()) ||
      c.email.includes(custSearch)
  )

  // Format helpers
  const fmt = (n: number) => n.toLocaleString('vi-VN')
  const condLabel = (c: DiscountCondition, type: DiscountType) =>
    `Order ≥ ${fmt(c.minOrderValue)}₫ → ${type === 'PERCENTAGE' ? `${c.discountValue}%` : `${fmt(c.discountValue)}₫`}${c.maxDiscount ? ` (max ${fmt(c.maxDiscount)}₫)` : ''}`

  const inputCls =
    'w-full px-3 py-2 rounded-lg border border-neutral-200 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-mint-300/50 focus:border-mint-400 transition bg-white'

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
                key={v.id}
                className={`grid grid-cols-12 gap-4 px-6 py-4 items-start hover:bg-mint-50/30 transition-colors ${idx !== filtered.length - 1 ? 'border-b border-neutral-50' : ''}`}
              >
                {/* Code */}
                <div className="col-span-2">
                  <div className="flex items-center gap-1.5">
                    {v.discountType === 'PERCENTAGE' ? (
                      <span className="w-3.5 h-3.5 flex items-center justify-center text-mint-500 font-bold text-xs">
                        %
                      </span>
                    ) : (
                      <IoPricetagOutline className="text-violet-500" size={13} />
                    )}
                    <span className="font-mono text-sm font-bold text-neutral-800">{v.code}</span>
                  </div>
                  <span
                    className={`mt-1 inline-block text-[10px] font-bold px-1.5 py-0.5 rounded border ${v.scope === 'ALL' ? 'bg-neutral-100 text-neutral-500 border-neutral-200' : 'bg-blue-50 text-blue-600 border-blue-200'}`}
                  >
                    {v.scope === 'ALL' ? 'ALL USERS' : 'SPECIFIC'}
                  </span>
                </div>
                {/* Description */}
                <div
                  className="col-span-3 text-sm text-neutral-600 truncate pt-0.5"
                  title={v.description}
                >
                  {v.description}
                </div>
                {/* Conditions */}
                <div className="col-span-3 space-y-1">
                  {v.conditions.map((c) => (
                    <p
                      key={c.id}
                      className="text-xs text-neutral-600 bg-neutral-50 border border-neutral-100 rounded px-2 py-1 leading-tight"
                    >
                      {condLabel(c, v.discountType)}
                    </p>
                  ))}
                </div>
                {/* Usage */}
                <div className="col-span-1 flex flex-col items-center gap-1 pt-0.5">
                  <span className="text-xs font-semibold text-neutral-700">
                    {v.usedCount}/{v.maxUsage}
                  </span>
                  <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${v.usedCount >= v.maxUsage ? 'bg-red-400' : 'bg-mint-400'}`}
                      style={{ width: `${Math.min((v.usedCount / v.maxUsage) * 100, 100)}%` }}
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
                    onClick={() => setDeleteId(v.id)}
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
      {showForm && (
        <ModalOverlay onClose={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 flex-shrink-0">
              <h2 className="text-lg font-bold text-neutral-900">
                {editingId ? 'Edit Voucher' : 'Create Voucher'}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="p-2 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition"
              >
                <IoCloseOutline size={20} />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="overflow-y-auto px-6 py-5 space-y-5 flex-1">
              {/* Basic info */}
              <Section title="Basic Info">
                <div className="grid grid-cols-2 gap-4">
                  <FormRow label="Code *">
                    <input
                      value={form.code}
                      onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                      className={`${inputCls} font-mono`}
                      placeholder="e.g. SUMMER25"
                    />
                  </FormRow>
                  <FormRow label="Status">
                    <select
                      value={form.status}
                      onChange={(e) =>
                        setForm({ ...form, status: e.target.value as VoucherStatus })
                      }
                      className={inputCls}
                    >
                      <option value="ACTIVE">Active</option>
                      <option value="INACTIVE">Inactive</option>
                      <option value="EXPIRED">Expired</option>
                    </select>
                  </FormRow>
                </div>
                <FormRow label="Description">
                  <input
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className={inputCls}
                    placeholder="Short description"
                  />
                </FormRow>
                <div className="grid grid-cols-3 gap-4">
                  <FormRow label="Discount Type">
                    <select
                      value={form.discountType}
                      onChange={(e) =>
                        setForm({ ...form, discountType: e.target.value as DiscountType })
                      }
                      className={inputCls}
                    >
                      <option value="PERCENTAGE">Percentage (%)</option>
                      <option value="FIXED">Fixed Amount (₫)</option>
                    </select>
                  </FormRow>
                  <FormRow label="Max Usage">
                    <input
                      type="number"
                      min={1}
                      value={form.maxUsage}
                      onChange={(e) => setForm({ ...form, maxUsage: +e.target.value })}
                      className={inputCls}
                    />
                  </FormRow>
                  <FormRow label="Scope">
                    <select
                      value={form.scope}
                      onChange={(e) =>
                        setForm({ ...form, scope: e.target.value as VoucherScope, assignedTo: [] })
                      }
                      className={inputCls}
                    >
                      <option value="ALL">All customers</option>
                      <option value="SPECIFIC">Specific customers</option>
                    </select>
                  </FormRow>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormRow label="Start Date">
                    <input
                      type="date"
                      value={form.startDate}
                      onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                      className={inputCls}
                    />
                  </FormRow>
                  <FormRow label="End Date">
                    <input
                      type="date"
                      value={form.endDate}
                      onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                      className={inputCls}
                    />
                  </FormRow>
                </div>
              </Section>

              {/* Discount Conditions */}
              <Section
                title="Discount Conditions"
                action={
                  <button
                    onClick={addCondition}
                    className="flex items-center gap-1 text-xs font-bold text-mint-600 hover:text-mint-700 transition"
                  >
                    <IoAddOutline size={14} /> Add Condition
                  </button>
                }
              >
                <div className="space-y-2">
                  {/* Header row */}
                  <div className="grid grid-cols-12 gap-2 text-[10px] font-bold text-neutral-400 uppercase tracking-widest px-1">
                    <div className="col-span-4">Min Order Value (₫)</div>
                    <div className="col-span-3">
                      {form.discountType === 'PERCENTAGE' ? 'Discount (%)' : 'Discount (₫)'}
                    </div>
                    <div className="col-span-4">Max Discount (₫) — optional</div>
                    <div className="col-span-1" />
                  </div>

                  {form.conditions.map((cond) => (
                    <div
                      key={cond.id}
                      className="grid grid-cols-12 gap-2 items-center bg-neutral-50 border border-neutral-100 rounded-lg p-2"
                    >
                      <div className="col-span-4">
                        <input
                          type="number"
                          min={0}
                          value={cond.minOrderValue}
                          onChange={(e) =>
                            updateCondition(cond.id, 'minOrderValue', +e.target.value)
                          }
                          className="w-full px-2.5 py-1.5 rounded border border-neutral-200 text-sm text-neutral-800 focus:outline-none focus:ring-1 focus:ring-mint-400 bg-white"
                        />
                      </div>
                      <div className="col-span-3">
                        <input
                          type="number"
                          min={0}
                          value={cond.discountValue}
                          onChange={(e) =>
                            updateCondition(cond.id, 'discountValue', +e.target.value)
                          }
                          className="w-full px-2.5 py-1.5 rounded border border-neutral-200 text-sm text-neutral-800 focus:outline-none focus:ring-1 focus:ring-mint-400 bg-white"
                        />
                      </div>
                      <div className="col-span-4">
                        <input
                          type="number"
                          min={0}
                          value={cond.maxDiscount ?? ''}
                          placeholder="Unlimited"
                          onChange={(e) =>
                            updateCondition(
                              cond.id,
                              'maxDiscount',
                              e.target.value === '' ? null : +e.target.value
                            )
                          }
                          className="w-full px-2.5 py-1.5 rounded border border-neutral-200 text-sm text-neutral-800 placeholder:text-neutral-300 focus:outline-none focus:ring-1 focus:ring-mint-400 bg-white"
                        />
                      </div>
                      <div className="col-span-1 flex justify-center">
                        {form.conditions.length > 1 && (
                          <button
                            onClick={() => removeCondition(cond.id)}
                            className="p-1 rounded text-neutral-300 hover:text-red-400 hover:bg-red-50 transition"
                          >
                            <IoCloseOutline size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Preview */}
                {form.conditions.some((c) => c.discountValue > 0) && (
                  <div className="mt-3 p-3 bg-mint-50 border border-mint-200 rounded-lg space-y-1">
                    <p className="text-[10px] font-bold text-mint-700 uppercase tracking-widest mb-2">
                      Preview
                    </p>
                    {form.conditions
                      .filter((c) => c.discountValue > 0)
                      .sort((a, b) => b.minOrderValue - a.minOrderValue)
                      .map((c) => (
                        <p key={c.id} className="text-xs text-mint-800">
                          • {condLabel(c, form.discountType)}
                        </p>
                      ))}
                  </div>
                )}
              </Section>

              {/* Assign to Customers — shown only when scope = SPECIFIC */}
              {form.scope === 'SPECIFIC' && (
                <Section
                  title="Assign to Customers"
                  badge={
                    form.assignedTo.length > 0 ? `${form.assignedTo.length} selected` : undefined
                  }
                >
                  <div className="relative mb-3">
                    <IoSearchOutline
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                      size={15}
                    />
                    <input
                      value={custSearch}
                      onChange={(e) => setCustSearch(e.target.value)}
                      placeholder="Search customer..."
                      className="w-full pl-8 pr-4 py-2 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-mint-300/50 focus:border-mint-400 transition"
                    />
                  </div>
                  <div className="space-y-1.5 max-h-52 overflow-y-auto pr-0.5">
                    {filteredFormCustomers.map((c) => {
                      const selected = form.assignedTo.includes(c.id)
                      return (
                        <div
                          key={c.id}
                          onClick={() => toggleFormCustomer(c.id)}
                          className={`flex items-center justify-between px-3 py-2.5 rounded-xl border transition cursor-pointer ${selected ? 'bg-mint-50 border-mint-200' : 'bg-white border-neutral-100 hover:bg-neutral-50'}`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${selected ? 'bg-mint-500 text-white' : 'bg-neutral-100 text-neutral-600'}`}
                            >
                              {c.avatarInitials}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-neutral-800">{c.name}</p>
                              <p className="text-xs text-neutral-400">{c.email}</p>
                            </div>
                          </div>
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition ${selected ? 'bg-mint-500 border-mint-500' : 'border-neutral-300'}`}
                          >
                            {selected && <IoCheckmarkOutline size={11} className="text-white" />}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </Section>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-neutral-100 flex-shrink-0">
              <button
                onClick={() => setShowForm(false)}
                className="px-5 py-2 rounded-lg border border-neutral-200 text-neutral-600 text-sm font-semibold hover:bg-neutral-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 rounded-lg bg-mint-500 text-white text-sm font-bold hover:bg-mint-600 transition flex items-center gap-1.5 disabled:opacity-50"
                disabled={!form.code.trim() || form.conditions.length === 0}
              >
                <IoCheckmarkOutline size={16} />
                {editingId ? 'Save Changes' : 'Create Voucher'}
              </button>
            </div>
          </div>
        </ModalOverlay>
      )}

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

// ─── Helpers ─────────────────────────────────────────────────────
function ModalOverlay({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative z-10 w-full flex justify-center">{children}</div>
    </div>
  )
}

function Section({
  title,
  children,
  action,
  badge
}: {
  title: string
  children: React.ReactNode
  action?: React.ReactNode
  badge?: string
}) {
  return (
    <div className="rounded-xl border border-neutral-100 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 bg-neutral-50 border-b border-neutral-100">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-neutral-600 uppercase tracking-widest">
            {title}
          </span>
          {badge && (
            <span className="px-2 py-0.5 rounded-full bg-mint-100 text-mint-700 text-[10px] font-bold">
              {badge}
            </span>
          )}
        </div>
        {action}
      </div>
      <div className="p-4 space-y-3">{children}</div>
    </div>
  )
}

function FormRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest">
        {label}
      </label>
      {children}
    </div>
  )
}
