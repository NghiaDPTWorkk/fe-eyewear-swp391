import type { OperationInvoiceListItem } from '@/shared/types'
import InvoiceTableHeader from './InvoiceTableHeader'
import InvoiceTableRow from './InvoiceTableRow'
import type { InvoiceTableColumn } from './invoiceTable.types'

interface InvoiceTableProps {
  invoices: OperationInvoiceListItem[]
  onView: (invoice: OperationInvoiceListItem) => void
  onNext: (invoiceId: string) => void
  /** Override or extend the header columns. Defaults to the standard 5 columns. */
  columns?: InvoiceTableColumn[]
}

export default function InvoiceTable({ invoices, onView, onNext, columns }: InvoiceTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <InvoiceTableHeader columns={columns} />
        <tbody className="divide-y divide-gray-200">
          {invoices.map((invoice) => (
            <InvoiceTableRow key={invoice.id} invoice={invoice} onView={onView} onNext={onNext} />
          ))}
        </tbody>
      </table>
    </div>
  )
}
