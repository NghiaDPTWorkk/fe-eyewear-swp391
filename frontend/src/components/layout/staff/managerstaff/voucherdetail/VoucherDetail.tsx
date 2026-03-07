/**
 * VoucherDetail — read-only detail panel for a single voucher.
 * Opens as a modal overlay. Has an "Edit" button that calls
 * the optional `onEdit` callback so the parent can swap to VoucherAddition.
 */
import { createPortal } from 'react-dom'
import {
  IoCloseOutline,
  IoCreateOutline,
  IoTrashOutline,
  IoTicketOutline,
  IoCalendarOutline,
  IoInfiniteOutline,
  IoPricetagOutline,
  IoGlobeOutline,
  IoPeopleOutline
} from 'react-icons/io5'
import type { Voucher } from '@/shared/types'
import { VoucherDiscountType } from '@/shared/utils/enums/voucher.enum'
import { VOUCHER_STATUS_CFG, fmtVND, fmtDate } from '@/components/layout/staff/managerstaff/vouchertable/VoucherTdata'

interface VoucherDetailProps {
  voucher: Voucher
  isOpen: boolean
  onClose: () => void
  onEdit: () => void
  onDelete: () => void
}

export function VoucherDetail({
  voucher: v,
  isOpen,
  onClose,
  onEdit,
  onDelete
}: VoucherDetailProps) {
  if (!isOpen) return null

  const isPerc = v.typeDiscount === VoucherDiscountType.PERCENTAGE
  const st = VOUCHER_STATUS_CFG[v.status] ?? VOUCHER_STATUS_CFG['DISABLE']
  const usagePct = Math.min((v.usageCount / (v.usageLimit || 1)) * 100, 100)

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-[3px]"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black ${isPerc ? 'bg-mint-50 text-mint-600' : 'bg-violet-50 text-violet-600'}`}>
              {isPerc ? '%' : '₫'}
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <IoTicketOutline size={15} className="text-slate-400" />
                {v.name}
              </h2>
              <p className="font-mono text-xs font-black text-slate-500 mt-0.5">{v.code}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Status pill */}
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black ${st.pill}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
              {st.label}
            </span>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
            >
              <IoCloseOutline size={18} />
            </button>
          </div>
        </div>

        {/* Body — scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">

          {/* Description */}
          {v.description && (
            <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 rounded-2xl px-4 py-3 border border-slate-100">
              {v.description}
            </p>
          )}

          {/* Discount */}
          <Section title="Discount">
            <div className="grid grid-cols-2 gap-3">
              <Stat
                icon={<IoPricetagOutline size={14} className="text-slate-400" />}
                label="Type"
                value={isPerc ? 'Percentage (%)' : 'Fixed (₫)'}
              />
              <Stat
                icon={isPerc ? <span className="text-mint-600 font-black text-sm">%</span> : <span className="text-violet-600 font-black text-sm">₫</span>}
                label="Discount value"
                value={
                  <span className={`text-xl font-black ${isPerc ? 'text-mint-600' : 'text-violet-600'}`}>
                    {isPerc ? `${v.value}%` : `${fmtVND(v.value)}₫`}
                  </span>
                }
              />
              {isPerc && v.maxDiscountValue > 0 && (
                <Stat
                  icon={null}
                  label="Max discount cap"
                  value={`${fmtVND(v.maxDiscountValue)}₫`}
                />
              )}
              {v.minOrderValue > 0 && (
                <Stat
                  icon={null}
                  label="Min order value"
                  value={`${fmtVND(v.minOrderValue)}₫`}
                />
              )}
            </div>
          </Section>

          {/* Scope & Usage */}
          <Section title="Scope & Usage">
            <div className="grid grid-cols-2 gap-3">
              <Stat
                icon={v.applyScope === 'ALL'
                  ? <IoGlobeOutline size={14} className="text-blue-400" />
                  : <IoPeopleOutline size={14} className="text-purple-400" />}
                label="Apply scope"
                value={v.applyScope === 'ALL' ? 'Public — All Users' : 'Targeted — Specific Users'}
              />
              <Stat
                icon={<IoInfiniteOutline size={14} className="text-slate-400" />}
                label="Usage"
                value={
                  <div className="space-y-1.5">
                    <p className="text-sm font-black text-slate-700">
                      {v.usageCount}
                      <span className="text-slate-400 font-medium">/{v.usageLimit}</span>
                    </p>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${usagePct >= 100 ? 'bg-red-400' : usagePct >= 75 ? 'bg-amber-400' : 'bg-mint-400'}`}
                        style={{ width: `${usagePct}%` }}
                      />
                    </div>
                  </div>
                }
              />
            </div>
          </Section>

          {/* Validity */}
          <Section title="Validity period">
            <div className="grid grid-cols-2 gap-3">
              <Stat
                icon={<IoCalendarOutline size={14} className="text-slate-400" />}
                label="Active from"
                value={fmtDate(v.startedDate)}
              />
              <Stat
                icon={<IoCalendarOutline size={14} className="text-amber-400" />}
                label="Valid until"
                value={fmtDate(v.endedDate)}
              />
            </div>
          </Section>

          {/* Meta */}
          <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest space-y-0.5 pt-1 border-t border-slate-50">
            <p>Created: {fmtDate(v.createdAt)}</p>
            <p>Updated: {fmtDate(v.updatedAt)}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50">
          <button
            onClick={onDelete}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-red-400 hover:text-red-600 hover:bg-red-50 text-sm font-bold transition"
          >
            <IoTrashOutline size={15} />
            Delete
          </button>
          <button
            onClick={onEdit}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-mint-500 text-white text-sm font-black hover:bg-mint-600 transition active:scale-95 shadow-lg shadow-mint-200"
          >
            <IoCreateOutline size={15} />
            Edit Voucher
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}

// ─── Helper sub-components ────────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-100 overflow-hidden">
      <div className="px-4 py-2 bg-slate-50 border-b border-slate-100">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
      </div>
      <div className="px-4 py-3">{children}</div>
    </div>
  )
}

function Stat({
  icon,
  label,
  value
}: {
  icon: React.ReactNode
  label: string
  value: React.ReactNode
}) {
  return (
    <div className="space-y-0.5">
      <div className="flex items-center gap-1.5">
        {icon}
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{label}</p>
      </div>
      <div className="text-sm font-bold text-slate-700">{value}</div>
    </div>
  )
}
