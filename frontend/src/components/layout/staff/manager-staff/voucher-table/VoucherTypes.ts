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
  { key: 'voucher', label: 'Voucher', span: 'col-span-5' },
  { key: 'discount', label: 'Discount', span: 'col-span-1', align: 'center' },
  { key: 'minOrder', label: 'Min Order', span: 'col-span-2', align: 'center' },
  { key: 'validity', label: 'Validity', span: 'col-span-2' },
  { key: 'status', label: 'Status', span: 'col-span-1', align: 'right' },
  { key: 'actions', label: '', span: 'col-span-1', align: 'center' }
]
