import { DEFAULT_INVOICE_COLUMNS, type InvoiceTableColumn } from './invoiceTable.types'

interface InvoiceTableHeaderProps {
  columns?: InvoiceTableColumn[]
}

const alignClass: Record<NonNullable<InvoiceTableColumn['align']>, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right'
}

export default function InvoiceTableHeader({
  columns = DEFAULT_INVOICE_COLUMNS
}: InvoiceTableHeaderProps) {
  return (
    <thead className="bg-white border-b border-gray-200">
      <tr>
        {columns.map((col) => (
          <th
            key={col.key}
            className={`px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider ${alignClass[col.align ?? 'left']}`}
          >
            {col.label}
          </th>
        ))}
      </tr>
    </thead>
  )
}
