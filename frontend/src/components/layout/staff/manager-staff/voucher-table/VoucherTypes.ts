export interface VoucherColumn {
  key: string

  label: string

  span: string

  align?: 'left' | 'center' | 'right'
}

export const DEFAULT_VOUCHER_COLUMNS: VoucherColumn[] = [
  { key: 'voucher', label: 'Voucher', span: 'col-span-5' },
  { key: 'discount', label: 'Discount', span: 'col-span-1', align: 'center' },
  { key: 'minOrder', label: 'Min Order', span: 'col-span-2', align: 'center' },
  { key: 'validity', label: 'Validity', span: 'col-span-2' },
  { key: 'status', label: 'Status', span: 'col-span-1', align: 'right' },
  { key: 'actions', label: '', span: 'col-span-1', align: 'center' }
]
