export interface InvoiceTableColumn {
  key: string
  label: string
  align?: 'left' | 'center' | 'right'
}

export const DEFAULT_INVOICE_COLUMNS: InvoiceTableColumn[] = [
  { key: 'invoiceId', label: 'Invoice ID', align: 'left' },
  { key: 'orders', label: 'Orders', align: 'center' },
  { key: 'status', label: 'Status', align: 'center' },
  { key: 'actions', label: 'Actions', align: 'center' }
]
