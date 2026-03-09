/**
 * VoucherTdata — renders a single data cell for a given field key.
 * Decouples cell rendering logic from the row, making individual cells
 * independently testable and swappable.
 */
import { IoCalendarOutline, IoCashOutline } from 'react-icons/io5'
import type { Voucher } from '@/shared/types'
import { VoucherDiscountType, VoucherStatus } from '@/shared/utils/enums/voucher.enum'
import { fmtVND, fmtDate } from './VoucherTdata.utils'

// ─── Cell types ───────────────────────────────────────────────────
export type VoucherCellKey = 'voucher' | 'discount' | 'minOrder' | 'validity' | 'usage' | 'status'

interface VoucherTdataProps {
  voucher: Voucher
  field: VoucherCellKey
}

export function VoucherTdata({ voucher: v, field }: VoucherTdataProps) {
  const isPerc = v.typeDiscount === VoucherDiscountType.PERCENTAGE
  const usagePct = Math.min((v.usageCount / (v.usageLimit || 1)) * 100, 100)

  switch (field) {
    case 'voucher':
      return (
        <div className="flex items-center gap-4 min-w-0">
          {/* Discount type icon chip */}
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-bold shrink-0 bg-mint-50 text-mint-600 border border-mint-100 shadow-sm`}
          >
            {isPerc ? '%' : <IoCashOutline size={22} />}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 leading-none mb-1.5 truncate group-hover:text-mint-600 transition-colors">
              {v.code}
            </p>
            <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider truncate">
              {v.name}
            </p>
          </div>
        </div>
      )

    case 'discount':
      return (
        <div className="flex flex-col items-center">
          <span className={`inline-flex items-baseline gap-0.5 font-bold text-mint-600`}>
            <span className="text-lg">{isPerc ? v.value : fmtVND(v.value)}</span>
            <span className="text-[10px] font-black">{isPerc ? '%' : '₫'}</span>
          </span>
          {isPerc && v.maxDiscountValue > 0 && (
            <p className="text-[10px] text-neutral-400 font-semibold uppercase tracking-tight mt-0.5">
              up to {fmtVND(v.maxDiscountValue)}₫
            </p>
          )}
        </div>
      )

    case 'minOrder':
      return v.minOrderValue > 0 ? (
        <span className="text-sm font-semibold text-gray-600 tabular-nums">
          {fmtVND(v.minOrderValue)}₫
        </span>
      ) : (
        <span className="text-sm font-semibold text-neutral-300">—</span>
      )

    case 'validity':
      return (
        <div className="flex flex-col gap-1.5 min-w-[100px]">
          <div className="flex items-center gap-2 text-[11px] text-neutral-500 font-semibold uppercase tracking-wider">
            <IoCalendarOutline size={12} className="text-neutral-300 shrink-0" />
            {fmtDate(v.startedDate)}
          </div>
          <div className="flex items-center gap-2 text-[11px] text-neutral-500 font-semibold uppercase tracking-wider">
            <IoCalendarOutline size={12} className="text-amber-400 shrink-0" />
            {fmtDate(v.endedDate)}
          </div>
        </div>
      )

    case 'usage':
      return (
        <div className="flex flex-col items-center gap-2 w-full max-w-[120px]">
          <span className="text-[11px] font-bold text-gray-600 tabular-nums tracking-widest">
            {v.usageCount}
            <span className="text-neutral-300 font-medium"> / {v.usageLimit}</span>
          </span>
          <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${
                usagePct >= 100 ? 'bg-red-500' : usagePct >= 75 ? 'bg-amber-500' : 'bg-mint-500'
              }`}
              style={{ width: `${usagePct}%` }}
            />
          </div>
        </div>
      )

    case 'status':
      return (
        <span
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border font-primary ${
            v.status === VoucherStatus.ACTIVE
              ? 'bg-mint-50 text-mint-600 border-mint-100'
              : v.status === VoucherStatus.DRAFT
                ? 'bg-blue-50 text-blue-600 border-blue-100'
                : 'bg-red-50 text-red-600 border-red-100'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              v.status === VoucherStatus.ACTIVE
                ? 'bg-mint-500'
                : v.status === VoucherStatus.DRAFT
                  ? 'bg-blue-500'
                  : 'bg-red-500'
            }`}
          />
          {v.status}
        </span>
      )

    default:
      return null
  }
}
