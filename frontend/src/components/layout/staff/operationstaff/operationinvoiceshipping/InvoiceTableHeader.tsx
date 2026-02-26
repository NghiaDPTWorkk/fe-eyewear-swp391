export default function InvoiceTableHeader() {
  return (
    <thead className="bg-gray-50 border-b border-gray-200">
      <tr>
        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
          Invoice ID
        </th>
        <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
          Orders
        </th>
        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
          Total Amount
        </th>
        <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
          Status
        </th>
        <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
          Actions
        </th>
      </tr>
    </thead>
  )
}
