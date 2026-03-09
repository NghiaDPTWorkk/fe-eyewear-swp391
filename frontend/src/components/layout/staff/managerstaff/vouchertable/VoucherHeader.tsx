/**
 * VoucherHeader — renders the <thead> row of the voucher table.
 * `columns` prop drives what columns appear, making the table reusable.
 */

export interface VoucherColumn {
  /** Unique key matching VoucherTdata's field map */
  key: string
  /** Displayed header label */
  label: string
  /** Tailwind col-span class, e.g. "col-span-3" */
  span: string
  /** Optional text-align override, default left */
  align?: 'left' | 'center' | 'right'
}

/** Default column set — import and override to customise */
export const DEFAULT_VOUCHER_COLUMNS: VoucherColumn[] = [
  { key: 'voucher', label: 'Voucher', span: 'col-span-3' },
  { key: 'discount', label: 'Discount', span: 'col-span-2', align: 'center' },
  { key: 'minOrder', label: 'Min Order', span: 'col-span-2', align: 'center' },
  { key: 'validity', label: 'Validity', span: 'col-span-2' },
  { key: 'usage', label: 'Usage', span: 'col-span-1', align: 'center' },
  { key: 'status', label: 'Status', span: 'col-span-1', align: 'center' },
  { key: 'actions', label: '', span: 'col-span-1', align: 'center' }
]

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
