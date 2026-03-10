/**
 * VoucherTr — renders one full row of data cells for a single voucher.
 * Accepts optional render-prop for the actions column to keep the row
 * decoupled from any specific page-level handlers.
 */
import type { ReactNode } from 'react'
import type { Voucher } from '@/shared/types'
import { DEFAULT_VOUCHER_COLUMNS, type VoucherColumn } from './VoucherHeader'
import { VoucherTdata, type VoucherCellKey } from './VoucherTdata'

interface VoucherTrProps {
  voucher: Voucher
  /** Column definitions — must match those passed to <VoucherHeader /> */
  columns?: VoucherColumn[]
  /** Slot for the actions cell content */
  actions?: ReactNode
  /** Called when anywhere on the row is clicked */
  onClick?: () => void
  /** Extra className on the row wrapper */
  className?: string
}

export function VoucherTr({
  voucher,
  columns = DEFAULT_VOUCHER_COLUMNS,
  actions,
  onClick,
  className = ''
}: VoucherTrProps) {
  return (
    <div
      onClick={onClick}
      className={`grid grid-cols-12 gap-3 px-6 py-6 items-center group hover:bg-neutral-50 transition-colors ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {columns.map((col) => {
        if (col.key === 'actions') {
          return (
            <div
              key="actions"
              className={`${col.span} flex justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity`}
            >
              {actions}
            </div>
          )
        }

        return (
          <div
            key={col.key}
            className={`${col.span} ${
              col.align === 'center'
                ? 'flex justify-center'
                : col.align === 'right'
                  ? 'flex justify-end'
                  : ''
            }`}
          >
            <VoucherTdata voucher={voucher} field={col.key as VoucherCellKey} />
          </div>
        )
      })}
    </div>
  )
}
