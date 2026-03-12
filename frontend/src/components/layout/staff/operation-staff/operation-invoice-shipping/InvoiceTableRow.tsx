import type { OperationInvoiceListItem } from '@/shared/types'
import InvoiceTableData from './InvoiceTableData'

interface InvoiceTableRowProps {
  invoice: OperationInvoiceListItem
  onView: (invoice: OperationInvoiceListItem) => void
  onNext: (invoiceId: string) => void
}

export default function InvoiceTableRow({ invoice, onView, onNext }: InvoiceTableRowProps) {
  return (
    <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
      <InvoiceTableData invoice={invoice} onView={onView} onNext={onNext} />
    </tr>
  )
}
