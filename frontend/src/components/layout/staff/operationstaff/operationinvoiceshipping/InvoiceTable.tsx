import type { OperationInvoiceListItem } from '@/shared/types'
import InvoiceTableHeader from './InvoiceTableHeader'
import InvoiceTableRow from './InvoiceTableRow'

interface InvoiceTableProps {
  invoices: OperationInvoiceListItem[]
  onView: (invoice: OperationInvoiceListItem) => void
  onNext: (invoiceId: string) => void
}

export default function InvoiceTable({ invoices, onView, onNext }: InvoiceTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <InvoiceTableHeader />
        <tbody className="divide-y divide-gray-200">
          {invoices.map((invoice) => (
            <InvoiceTableRow
              key={invoice.id}
              invoice={invoice}
              onView={onView}
              onNext={onNext}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}
