/**
 * VoucherTdata — renders a single data cell for a given field key.
 * Decouples cell rendering logic from the row, making individual cells
 * independently testable and swappable.
 */
import { IoCalendarOutline } from 'react-icons/io5'
import type { Voucher } from '@/shared/types'
import { VoucherDiscountType, VoucherStatus } from '@/shared/utils/enums/voucher.enum'

// ─── Status config ────────────────────────────────────────────────
export const VOUCHER_STATUS_CFG: Record<string, { label: string; dot: string; pill: string }> = {
  [VoucherStatus.ACTIVE]: {
    label: 'Active',
    dot: 'bg-emerald-400 animate-pulse',
    pill: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
  },
  [VoucherStatus.DRAFT]: {
    label: 'Draft',
    dot: 'bg-amber-400',
    pill: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200'
  },
  [VoucherStatus.DISABLE]: {
    label: 'Disabled',
    dot: 'bg-slate-300',
    pill: 'bg-slate-100 text-slate-500 ring-1 ring-slate-200'
  }
}

// ─── Helpers ──────────────────────────────────────────────────────
export function fmtVND(n: number) {
  return n.toLocaleString('vi-VN')
}

export function fmtDate(d: string) {
  if (!d) return '—'
  try {
    return new Date(d).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: '2-digit'
    })
  } catch {
    return d
  }
}

// ─── Cell types ───────────────────────────────────────────────────
export type VoucherCellKey =
  | 'voucher'
  | 'discount'
  | 'minOrder'
  | 'validity'
  | 'usage'
  | 'status'

interface VoucherTdataProps {
  voucher: Voucher
  field: VoucherCellKey
}

export function VoucherTdata({ voucher: v, field }: VoucherTdataProps) {
  const isPerc = v.typeDiscount === VoucherDiscountType.PERCENTAGE
  const st = VOUCHER_STATUS_CFG[v.status] ?? VOUCHER_STATUS_CFG[VoucherStatus.DISABLE]
  const usagePct = Math.min((v.usageCount / (v.usageLimit || 1)) * 100, 100)

  switch (field) {
    case 'voucher':
      return (
        <div className="flex items-center gap-3 min-w-0">
          {/* Discount type icon chip */}
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black shrink-0 ${
              isPerc ? 'bg-mint-50 text-mint-600' : 'bg-violet-50 text-violet-600'
            }`}
          >
            {isPerc ? '%' : '₫'}
          </div>
          <div className="min-w-0">
            <p className="font-mono text-sm font-black text-slate-800 leading-none truncate">
              {v.code}
            </p>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5 truncate">{v.name}</p>
            <span
              className={`inline-block mt-1 text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md ${
                v.applyScope === 'ALL'
                  ? 'bg-slate-100 text-slate-500'
                  : 'bg-blue-50 text-blue-500'
              }`}
            >
              {v.applyScope === 'ALL' ? 'Public' : 'Targeted'}
            </span>
          </div>
        </div>
      )

    case 'discount':
      return (
        <div className="flex flex-col items-center">
          <span
            className={`inline-flex items-baseline gap-0.5 font-black ${isPerc ? 'text-mint-600' : 'text-violet-600'}`}
          >
            <span className="text-xl">{isPerc ? v.value : fmtVND(v.value)}</span>
            <span className="text-xs">{isPerc ? '%' : '₫'}</span>
          </span>
          {isPerc && v.maxDiscountValue > 0 && (
            <p className="text-[10px] text-slate-400 font-medium mt-0.5">
              max {fmtVND(v.maxDiscountValue)}₫
            </p>
          )}
        </div>
      )

    case 'minOrder':
      return v.minOrderValue > 0 ? (
        <span className="text-sm font-bold text-slate-700 tabular-nums">
          {fmtVND(v.minOrderValue)}₫
        </span>
      ) : (
        <span className="text-sm font-bold text-slate-300">—</span>
      )

    case 'validity':
      return (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
            <IoCalendarOutline size={11} className="text-slate-300 shrink-0" />
            {fmtDate(v.startedDate)}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
            <IoCalendarOutline size={11} className="text-amber-400 shrink-0" />
            {fmtDate(v.endedDate)}
          </div>
        </div>
      )

    case 'usage':
      return (
        <div className="flex flex-col items-center gap-1.5 w-full">
          <span className="text-[11px] font-black text-slate-600 tabular-nums">
            {v.usageCount}
            <span className="text-slate-300 font-medium">/{v.usageLimit}</span>
          </span>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                usagePct >= 100
                  ? 'bg-red-400'
                  : usagePct >= 75
                    ? 'bg-amber-400'
                    : 'bg-mint-400'
              }`}
              style={{ width: `${usagePct}%` }}
            />
          </div>
        </div>
      )

    case 'status':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black ${st.pill}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
          {st.label}
        </span>
      )

    default:
      return null
  }
}
