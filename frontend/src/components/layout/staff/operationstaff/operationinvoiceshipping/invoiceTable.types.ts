export interface InvoiceTableColumn {
  key: string
  label: string
  align?: 'left' | 'center' | 'right'
}

export const DEFAULT_INVOICE_COLUMNS: InvoiceTableColumn[] = [
  { key: 'invoiceId',    label: 'Invoice ID',   align: 'left'   },
  { key: 'orders',      label: 'Orders',       align: 'center' },
  { key: 'totalAmount', label: 'Total Amount', align: 'right'  },
  { key: 'status',      label: 'Status',       align: 'center' },
  { key: 'actions',     label: 'Actions',      align: 'center' }
]
