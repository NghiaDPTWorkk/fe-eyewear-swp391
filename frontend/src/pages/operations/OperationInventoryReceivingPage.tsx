import { useState, type JSX } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container } from '@/components'
import { BreadcrumbPath } from '@/components/layout/staff/operationstaff/breadcrumbpath'
import {
  IoArchiveOutline,
  IoSearchOutline,
  IoEyeOutline,
  IoCheckmarkCircleOutline,
  IoTimeOutline,
  IoCloseCircleOutline,
  IoFilterOutline,
  IoPersonOutline,
  IoCalendarOutline,
  IoLayersOutline
} from 'react-icons/io5'

// ─── Types ────────────────────────────────────────────────────────
export type PreOrderImportStatus = 'PENDING' | 'DONE' | 'CANCELLED'

export interface PreOrderImportBatch {
  _id: string
  sku: string
  description: string
  targetDate: string
  targetQuantity: number
  preOrderedQuantity: number
  managerResponsibility: string
  startedDate: string
  endedDate: string
  status: PreOrderImportStatus
  createdAt: string
  updatedAt: string
}

// ─── Hardcoded mock data ──────────────────────────────────────────
const MOCK_BATCHES: PreOrderImportBatch[] = [
  {
    _id: '699fb913c23363fb666a30a7',
    sku: 'FRAME-011-02',
    description: 'Import frame FRAME-011-02',
    targetDate: '2026-04-01T00:00:00.000Z',
    targetQuantity: 100,
    preOrderedQuantity: 4,
    managerResponsibility: 'Nguyen Van An',
    startedDate: '2026-02-01T00:00:00.000Z',
    endedDate: '2026-03-28T23:59:59.999Z',
    status: 'PENDING',
    createdAt: '2026-02-26T03:08:03.723Z',
    updatedAt: '2026-02-26T03:09:23.580Z'
  },
  {
    _id: '699fb913c23363fb666a30b1',
    sku: 'LENS-BL-001',
    description: 'Import blue light lens batch Q1',
    targetDate: '2026-03-20T00:00:00.000Z',
    targetQuantity: 200,
    preOrderedQuantity: 120,
    managerResponsibility: 'Tran Thi Mai',
    startedDate: '2026-01-15T00:00:00.000Z',
    endedDate: '2026-03-15T23:59:59.999Z',
    status: 'DONE',
    createdAt: '2026-01-15T08:00:00.000Z',
    updatedAt: '2026-03-15T10:30:00.000Z'
  },
  {
    _id: '699fb913c23363fb666a30c2',
    sku: 'SG-OV-2001',
    description: 'Import sunglasses OpticView Sport Wrap',
    targetDate: '2026-05-01T00:00:00.000Z',
    targetQuantity: 50,
    preOrderedQuantity: 18,
    managerResponsibility: 'Le Minh Duc',
    startedDate: '2026-03-01T00:00:00.000Z',
    endedDate: '2026-04-25T23:59:59.999Z',
    status: 'PENDING',
    createdAt: '2026-03-01T09:00:00.000Z',
    updatedAt: '2026-03-01T09:00:00.000Z'
  },
  {
    _id: '699fb913c23363fb666a30d3',
    sku: 'FRAME-TN-001',
    description: 'Import titanium slim frame – matte black',
    targetDate: '2026-02-28T00:00:00.000Z',
    targetQuantity: 80,
    preOrderedQuantity: 0,
    managerResponsibility: 'Pham Quoc Bao',
    startedDate: '2026-01-10T00:00:00.000Z',
    endedDate: '2026-02-25T23:59:59.999Z',
    status: 'CANCELLED',
    createdAt: '2026-01-10T07:00:00.000Z',
    updatedAt: '2026-02-20T14:00:00.000Z'
  },
  {
    _id: '699fb913c23363fb666a30e4',
    sku: 'LENS-PR-002',
    description: 'Import progressive lens 1.67 transition batch',
    targetDate: '2026-04-15T00:00:00.000Z',
    targetQuantity: 60,
    preOrderedQuantity: 35,
    managerResponsibility: 'Nguyen Van An',
    startedDate: '2026-02-20T00:00:00.000Z',
    endedDate: '2026-04-10T23:59:59.999Z',
    status: 'PENDING',
    createdAt: '2026-02-20T08:30:00.000Z',
    updatedAt: '2026-03-04T11:20:00.000Z'
  },
  {
    _id: '699fb913c23363fb666a30f5',
    sku: 'FRAME-AC-002',
    description: 'Import acetate square frame – tortoise',
    targetDate: '2026-03-10T00:00:00.000Z',
    targetQuantity: 120,
    preOrderedQuantity: 120,
    managerResponsibility: 'Tran Thi Mai',
    startedDate: '2026-01-20T00:00:00.000Z',
    endedDate: '2026-03-08T23:59:59.999Z',
    status: 'DONE',
    createdAt: '2026-01-20T09:15:00.000Z',
    updatedAt: '2026-03-08T16:45:00.000Z'
  }
]

// ─── Status config ────────────────────────────────────────────────
const STATUS_CONFIG: Record<PreOrderImportStatus, { label: string; color: string; bg: string; icon: JSX.Element }> = {
  PENDING:   { label: 'Pending',   color: 'text-amber-700',   bg: 'bg-amber-50 border-amber-200',   icon: <IoTimeOutline size={13} /> },
  DONE:      { label: 'Done',      color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200', icon: <IoCheckmarkCircleOutline size={13} /> },
  CANCELLED: { label: 'Cancelled', color: 'text-red-700',     bg: 'bg-red-50 border-red-200',       icon: <IoCloseCircleOutline size={13} /> }
}

const STATUS_FILTERS = [
  { label: 'All',       value: 'all' },
  { label: 'Pending',   value: 'PENDING' },
  { label: 'Done',      value: 'DONE' },
  { label: 'Cancelled', value: 'CANCELLED' }
]

// ─── Helpers ──────────────────────────────────────────────────────
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

// ─── Component ────────────────────────────────────────────────────
export default function OperationInventoryReceivingPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const filtered = MOCK_BATCHES.filter((b) => {
    const matchStatus = statusFilter === 'all' || b.status === statusFilter
    const q = search.toLowerCase()
    const matchSearch =
      !q ||
      b.sku.toLowerCase().includes(q) ||
      b.managerResponsibility.toLowerCase().includes(q) ||
      b.description.toLowerCase().includes(q)
    return matchStatus && matchSearch
  })

  const counts = {
    all: MOCK_BATCHES.length,
    PENDING:   MOCK_BATCHES.filter((b) => b.status === 'PENDING').length,
    DONE:      MOCK_BATCHES.filter((b) => b.status === 'DONE').length,
    CANCELLED: MOCK_BATCHES.filter((b) => b.status === 'CANCELLED').length
  }

  return (
    <Container className="animate-fade-in-up">
      <BreadcrumbPath paths={['Dashboard', 'Inventory Receiving']} />

      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
            <IoArchiveOutline className="text-mint-500" />
            Inventory Receiving
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Track pre-order import batches and their receiving status.
          </p>
        </div>
        <div className="px-5 py-2 bg-mint-50 border border-mint-200 text-mint-700 rounded-full text-xs font-bold uppercase tracking-widest">
          {counts.all} Batches
        </div>
      </div>

      {/* ── Filters row ── */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px] max-w-sm">
          <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
          <input
            type="text"
            placeholder="Search SKU, manager or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-neutral-200 bg-white text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-mint-300/50 focus:border-mint-400 transition"
          />
        </div>

        {/* Status filter pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <IoFilterOutline className="text-neutral-400" size={16} />
          {STATUS_FILTERS.map((f) => {
            const cnt = f.value === 'all' ? counts.all : counts[f.value as PreOrderImportStatus]
            const active = statusFilter === f.value
            return (
              <button
                key={f.value}
                onClick={() => setStatusFilter(f.value)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  active
                    ? 'bg-mint-500 border-mint-500 text-white shadow-sm shadow-mint-200'
                    : 'bg-white border-neutral-200 text-neutral-600 hover:border-mint-300 hover:text-mint-600'
                }`}
              >
                {f.label}
                <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${active ? 'bg-white/25 text-white' : 'bg-neutral-100 text-neutral-500'}`}>
                  {cnt}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-100 overflow-hidden">

        {/* Table header */}
        <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-neutral-50 border-b border-neutral-100 text-[11px] font-bold text-neutral-500 uppercase tracking-widest">
          <div className="col-span-2 flex items-center gap-1.5">
            <IoLayersOutline size={13} /> SKU
          </div>
          <div className="col-span-3">Description</div>
          <div className="col-span-1 text-center">Pre-Ordered Qty</div>
          <div className="col-span-2 flex items-center gap-1.5">
            <IoPersonOutline size={13} /> Manager
          </div>
          <div className="col-span-2 flex items-center gap-1.5">
            <IoCalendarOutline size={13} /> Started Date
          </div>
          <div className="col-span-1 text-center">Status</div>
          <div className="col-span-1 text-center">Detail</div>
        </div>

        {/* Rows */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <IoArchiveOutline className="text-neutral-300" size={40} />
            <p className="text-sm font-semibold text-neutral-500">No batches found</p>
            <p className="text-xs text-neutral-400">Try adjusting your filters or search term.</p>
          </div>
        ) : (
          filtered.map((batch, idx) => {
            const st = STATUS_CONFIG[batch.status]
            const fillPct = batch.targetQuantity > 0 ? (batch.preOrderedQuantity / batch.targetQuantity) * 100 : 0
            return (
              <div
                key={batch._id}
                className={`grid grid-cols-12 gap-4 px-6 py-4 items-center transition-colors hover:bg-mint-50/40 ${
                  idx !== filtered.length - 1 ? 'border-b border-neutral-50' : ''
                }`}
              >
                {/* SKU */}
                <div className="col-span-2">
                  <span className="font-mono text-sm font-bold text-neutral-800 bg-neutral-100 px-2 py-0.5 rounded">
                    {batch.sku}
                  </span>
                </div>

                {/* Description */}
                <div className="col-span-3">
                  <p className="text-sm text-neutral-700 truncate" title={batch.description}>
                    {batch.description}
                  </p>
                </div>

                {/* Pre-Ordered Qty + mini progress */}
                <div className="col-span-1 flex flex-col items-center gap-1">
                  <span className="text-sm font-bold text-neutral-800">
                    {batch.preOrderedQuantity}
                    <span className="text-xs text-neutral-400 font-normal">/{batch.targetQuantity}</span>
                  </span>
                  <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        batch.status === 'CANCELLED' ? 'bg-red-300' :
                        fillPct >= 100 ? 'bg-emerald-400' : 'bg-mint-400'
                      }`}
                      style={{ width: `${Math.min(fillPct, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Manager */}
                <div className="col-span-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-mint-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-[10px] font-bold text-mint-700 uppercase">
                        {batch.managerResponsibility.split(' ').map(w => w[0]).join('').slice(0, 2)}
                      </span>
                    </div>
                    <span className="text-sm text-neutral-700 truncate" title={batch.managerResponsibility}>
                      {batch.managerResponsibility}
                    </span>
                  </div>
                </div>

                {/* Started Date */}
                <div className="col-span-2">
                  <p className="text-sm text-neutral-600">{formatDate(batch.startedDate)}</p>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    → {formatDate(batch.endedDate)}
                  </p>
                </div>

                {/* Status badge */}
                <div className="col-span-1 flex justify-center">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${st.bg} ${st.color}`}>
                    {st.icon}
                    {st.label}
                  </span>
                </div>

                {/* View detail */}
                <div className="col-span-1 flex justify-center">
                  <button
                    onClick={() => navigate(`/operationstaff/inventory-receiving/${batch._id}`)}
                    className="p-2 rounded-lg text-neutral-400 hover:text-mint-600 hover:bg-mint-50 transition-colors"
                    title="View detail"
                  >
                    <IoEyeOutline size={18} />
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>
    </Container>
  )
}
