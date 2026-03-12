import { type VoucherColumn, DEFAULT_VOUCHER_COLUMNS } from './VoucherTypes'

interface VoucherHeaderProps {
  columns?: VoucherColumn[]
}

export function VoucherHeader({ columns = DEFAULT_VOUCHER_COLUMNS }: VoucherHeaderProps) {
  return (
    <div className="grid grid-cols-12 gap-3 px-6 py-5 bg-white border-b border-neutral-50/50 text-[11px] font-semibold text-neutral-400 uppercase tracking-widest select-none">
      {columns.map((col) => (
        <div
          key={col.key}
          className={`${col.span} ${
            col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : ''
          }`}
        >
          {col.label}
        </div>
      ))}
    </div>
  )
}
