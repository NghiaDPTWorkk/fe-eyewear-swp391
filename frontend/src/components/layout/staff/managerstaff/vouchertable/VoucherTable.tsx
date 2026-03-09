/**
 * VoucherTable — the full table: header + rows + empty/loading states.
 * Acts as the single import point for the voucher table feature.
 */
import type { ReactNode } from 'react'
import { IoTicketOutline } from 'react-icons/io5'
import type { Voucher } from '@/shared/types'
import { VoucherHeader, type VoucherColumn, DEFAULT_VOUCHER_COLUMNS } from './VoucherHeader'
import { VoucherTr } from './VoucherTr'

interface VoucherTableProps {
  vouchers: Voucher[]
  isLoading?: boolean
  columns?: VoucherColumn[]
  /** Render-prop: given a voucher, returns the actions ReactNode for that row */
  renderActions?: (voucher: Voucher) => ReactNode
  /** Called when the user clicks anywhere on a data row */
  onRowClick?: (voucher: Voucher) => void
  /** Extra className on the outer wrapper */
  className?: string
}

export function VoucherTable({
  vouchers,
  isLoading = false,
  columns = DEFAULT_VOUCHER_COLUMNS,
  renderActions,
  onRowClick,
  className = ''
}: VoucherTableProps) {
  return (
    <div
      className={`bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden ${className}`}
    >
      <VoucherHeader columns={columns} />

      {isLoading ? (
        /* Loading skeleton */
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="w-10 h-10 rounded-full border-4 border-mint-100 border-t-mint-500 animate-spin" />
          <p className="text-sm font-bold text-slate-400 animate-pulse">Loading vouchers…</p>
        </div>
      ) : vouchers.length === 0 ? (
        /* Empty state */
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center">
            <IoTicketOutline className="text-slate-300" size={32} />
          </div>
          <p className="text-sm font-bold text-slate-400">No vouchers found</p>
          <p className="text-xs text-slate-300 font-medium">
            Try adjusting your search or filters.
          </p>
        </div>
      ) : (
        /* Rows */
        <div className="divide-y divide-slate-50">
          {vouchers.map((v, idx) => (
            <VoucherTr
              key={v._id}
              voucher={v}
              columns={columns}
              actions={renderActions?.(v)}
              className={idx % 2 === 1 ? 'bg-slate-50/20' : ''}
              onClick={onRowClick ? () => onRowClick(v) : undefined}
            />
          ))}
        </div>
      )}
    </div>
  )
}
