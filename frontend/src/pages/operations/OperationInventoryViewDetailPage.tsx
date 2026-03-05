import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Container } from '@/components'
import { BreadcrumbPath } from '@/components/layout/staff/operationstaff/breadcrumbpath'
import {
  IoArchiveOutline,
  IoArrowBack,
  IoCheckmarkCircleOutline,
  IoTimeOutline,
  IoAlertCircleOutline,
  IoCloseCircleOutline,
  IoCalendarOutline,
  IoCubeOutline,
  IoPersonOutline,
  IoLayersOutline
} from 'react-icons/io5'
import type { PreOrderImportBatch, PreOrderImportStatus } from './OperationInventoryReceivingPage'

// ─── Same mock data (keyed by _id) ───────────────────────────────
const MOCK_BATCHES_MAP: Record<string, PreOrderImportBatch> = {
  '699fb913c23363fb666a30a7': {
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
  '699fb913c23363fb666a30b1': {
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
  '699fb913c23363fb666a30c2': {
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
  '699fb913c23363fb666a30d3': {
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
  '699fb913c23363fb666a30e4': {
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
  '699fb913c23363fb666a30f5': {
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
}

// ─── Status config ────────────────────────────────────────────────
const STATUS_CONFIG: Record<
  PreOrderImportStatus,
  { label: string; color: string; bg: string; icon: React.ReactNode }
> = {
  PENDING: {
    label: 'Pending',
    color: 'text-amber-700',
    bg: 'bg-amber-50 border-amber-200',
    icon: <IoTimeOutline size={16} />
  },
  DONE: {
    label: 'Done',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50 border-emerald-200',
    icon: <IoCheckmarkCircleOutline size={16} />
  },
  CANCELLED: {
    label: 'Cancelled',
    color: 'text-red-700',
    bg: 'bg-red-50 border-red-200',
    icon: <IoCloseCircleOutline size={16} />
  }
}

// ─── Helpers ──────────────────────────────────────────────────────
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// ─── Component ────────────────────────────────────────────────────
export default function OperationInventoryViewDetailPage() {
  const { receiptId } = useParams<{ receiptId: string }>()
  const navigate = useNavigate()

  const batch = receiptId ? MOCK_BATCHES_MAP[receiptId] : null

  if (!batch) {
    return (
      <Container className="animate-fade-in-up">
        <BreadcrumbPath paths={['Dashboard', 'Inventory Receiving', 'Detail']} />
        <div className="flex flex-col items-center justify-center py-40 gap-4">
          <div className="w-16 h-16 rounded-full bg-red-50 border border-red-100 flex items-center justify-center">
            <IoAlertCircleOutline className="text-red-400" size={32} />
          </div>
          <p className="text-sm font-semibold text-neutral-700">Batch not found</p>
          <button
            onClick={() => navigate('/operationstaff/inventory-receiving')}
            className="mt-2 px-5 py-2 rounded-lg bg-mint-500 text-white text-sm font-semibold hover:bg-mint-600 transition"
          >
            Back to list
          </button>
        </div>
      </Container>
    )
  }

  const st = STATUS_CONFIG[batch.status]
  const fillPct =
    batch.targetQuantity > 0
      ? Math.min((batch.preOrderedQuantity / batch.targetQuantity) * 100, 100)
      : 0

  const initials = batch.managerResponsibility
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <Container className="animate-fade-in-up">
      <BreadcrumbPath paths={['Dashboard', 'Inventory Receiving', batch.sku]} />

      {/* ── Header ── */}
      <div className="flex items-start justify-between mb-8 gap-4">
        <div className="flex items-start gap-4">
          <button
            onClick={() => navigate('/operationstaff/inventory-receiving')}
            className="mt-1 p-2 rounded-lg border border-neutral-200 text-neutral-500 hover:text-mint-600 hover:border-mint-300 hover:bg-mint-50 transition-all"
          >
            <IoArrowBack size={18} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
              <IoArchiveOutline className="text-mint-500" />
              {batch.sku}
            </h1>
            <p className="text-sm text-neutral-500 mt-1">{batch.description}</p>
          </div>
        </div>

        <span
          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold border ${st.bg} ${st.color}`}
        >
          {st.icon}
          {st.label}
        </span>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* ── Left column ── */}
        <div className="col-span-12 lg:col-span-7 space-y-5">
          {/* Progress card */}
          <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6">
            <div className="flex items-center gap-2 mb-5 pb-4 border-b border-neutral-100">
              <IoCubeOutline className="text-mint-500" size={18} />
              <h2 className="text-base font-semibold text-gray-900">Receiving Progress</h2>
            </div>

            {/* Big numbers */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-neutral-50 rounded-lg border border-neutral-100">
                <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1">
                  Pre-Ordered
                </p>
                <p className="text-3xl font-black text-mint-600">{batch.preOrderedQuantity}</p>
              </div>
              <div className="text-center p-4 bg-neutral-50 rounded-lg border border-neutral-100">
                <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1">
                  Target
                </p>
                <p className="text-3xl font-black text-neutral-800">{batch.targetQuantity}</p>
              </div>
              <div className="text-center p-4 bg-neutral-50 rounded-lg border border-neutral-100">
                <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1">
                  Fill Rate
                </p>
                <p
                  className={`text-3xl font-black ${fillPct >= 100 ? 'text-emerald-600' : fillPct > 0 ? 'text-amber-600' : 'text-neutral-400'}`}
                >
                  {Math.round(fillPct)}%
                </p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-neutral-500">
                <span>{batch.preOrderedQuantity} pre-ordered</span>
                <span>Target: {batch.targetQuantity}</span>
              </div>
              <div className="w-full h-4 bg-neutral-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    batch.status === 'CANCELLED'
                      ? 'bg-red-400'
                      : fillPct >= 100
                        ? 'bg-emerald-400'
                        : 'bg-gradient-to-r from-mint-400 to-mint-600'
                  }`}
                  style={{ width: `${fillPct}%` }}
                />
              </div>
            </div>
          </div>

          {/* Timeline card */}
          <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6">
            <div className="flex items-center gap-2 mb-5 pb-4 border-b border-neutral-100">
              <IoCalendarOutline className="text-mint-500" size={18} />
              <h2 className="text-base font-semibold text-gray-900">Timeline</h2>
            </div>

            <div className="relative pl-6">
              {/* Vertical line */}
              <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-neutral-100" />

              {/* Start */}
              <TimelineItem
                dotColor="bg-mint-400"
                label="Started"
                date={formatDate(batch.startedDate)}
              />

              {/* Target */}
              <TimelineItem
                dotColor="bg-blue-400"
                label="Target Date"
                date={formatDate(batch.targetDate)}
              />

              {/* End */}
              <TimelineItem
                dotColor={
                  batch.status === 'CANCELLED'
                    ? 'bg-red-400'
                    : batch.status === 'DONE'
                      ? 'bg-emerald-400'
                      : 'bg-neutral-300'
                }
                label="Deadline"
                date={formatDate(batch.endedDate)}
                isLast
              />
            </div>
          </div>
        </div>

        {/* ── Right column ── */}
        <div className="col-span-12 lg:col-span-5 space-y-5">
          {/* Batch info */}
          <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-5 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-neutral-100">
              <IoLayersOutline className="text-mint-500" size={18} />
              <h3 className="text-sm font-semibold text-neutral-800">Batch Info</h3>
            </div>

            <InfoRow label="Batch ID" value={batch._id.slice(-8).toUpperCase()} mono />
            <InfoRow label="SKU" value={batch.sku} mono />
            <InfoRow label="Description" value={batch.description} />
            <InfoRow label="Created" value={formatDateTime(batch.createdAt)} />
            <InfoRow label="Last Updated" value={formatDateTime(batch.updatedAt)} />
          </div>

          {/* Manager */}
          <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-5">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-neutral-100">
              <IoPersonOutline className="text-mint-500" size={18} />
              <h3 className="text-sm font-semibold text-neutral-800">Manager Responsibility</h3>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-mint-100 flex items-center justify-center flex-shrink-0">
                <span className="text-base font-black text-mint-700">{initials}</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-800">
                  {batch.managerResponsibility}
                </p>
                <p className="text-xs text-neutral-400 mt-0.5">Responsible Manager</p>
              </div>
            </div>
          </div>

          {/* Status card */}
          <div className={`rounded-xl border p-5 ${st.bg}`}>
            <div className="flex items-center gap-2 mb-2">
              {st.icon}
              <span className={`text-xs font-bold uppercase tracking-widest ${st.color}`}>
                Current Status
              </span>
            </div>
            <p className={`text-2xl font-black ${st.color}`}>{st.label}</p>
            <p className={`text-xs mt-1 opacity-70 ${st.color}`}>
              {batch.status === 'PENDING' && 'This batch is awaiting fulfillment.'}
              {batch.status === 'DONE' && 'All pre-ordered items have been received.'}
              {batch.status === 'CANCELLED' && 'This batch has been cancelled.'}
            </p>
          </div>
        </div>
      </div>
    </Container>
  )
}

// ─── Small helpers ────────────────────────────────────────────────
function InfoRow({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex justify-between items-start gap-3">
      <span className="text-xs text-neutral-500 flex-shrink-0">{label}</span>
      <span
        className={`text-sm font-semibold text-neutral-800 text-right break-all ${mono ? 'font-mono' : ''}`}
      >
        {value}
      </span>
    </div>
  )
}

function TimelineItem({
  dotColor,
  label,
  date,
  isLast = false
}: {
  dotColor: string
  label: string
  date: string
  isLast?: boolean
}) {
  return (
    <div className={`relative flex items-start gap-4 ${isLast ? '' : 'mb-6'}`}>
      <div
        className={`absolute -left-4 top-1 w-3 h-3 rounded-full border-2 border-white ${dotColor} shadow-sm`}
      />
      <div>
        <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest">{label}</p>
        <p className="text-sm font-semibold text-neutral-800 mt-0.5">{date}</p>
      </div>
    </div>
  )
}
