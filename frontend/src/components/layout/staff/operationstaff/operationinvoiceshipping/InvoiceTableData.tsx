import { IoEyeOutline, IoChevronForward } from 'react-icons/io5'
import type { OperationInvoiceListItem } from '@/shared/types'

interface InvoiceTableDataProps {
  invoice: OperationInvoiceListItem
  onView: (invoice: OperationInvoiceListItem) => void
  onNext: (invoiceId: string) => void
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'COMPLETED':
      return 'bg-yellow-100 text-yellow-600'
    case 'READY_TO_SHIP':
      return 'bg-mint-100 text-mint-600'
    case 'DELIVERED':
      return 'bg-blue-100 text-blue-600'
    default:
      return 'bg-gray-100 text-gray-600'
  }
}

export default function InvoiceTableData({ invoice, onView, onNext }: InvoiceTableDataProps) {
  const totalAmount = parseFloat(invoice.finalPrice ?? '0')

  return (
    <>
      {/* Invoice ID */}
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="text-sm font-semibold text-gray-900">{invoice.invoiceCode}</span>
      </td>

      {/* Orders count */}
      <td className="px-6 py-4 whitespace-nowrap text-center">
        <span className="text-sm font-medium text-gray-900">
          {invoice.orders?.length ?? 0} orders
        </span>
      </td>

      {/* Total amount */}
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <span className="text-sm font-semibold text-gray-900">
          {isNaN(totalAmount) ? invoice.finalPrice : totalAmount.toLocaleString('vi-VN')} ₫
        </span>
      </td>

      {/* Status */}
      <td className="px-6 py-4 whitespace-nowrap text-center">
        <span
          className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(invoice.status)}`}
        >
          {invoice.status.replace(/_/g, ' ')}
        </span>
      </td>

      {/* Actions */}
      <td className="px-6 py-4 whitespace-nowrap text-center">
        <div className="flex items-center justify-center gap-2">
          {/* View Button */}
          <button
            onClick={() => onView(invoice)}
            className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-all border border-blue-200"
            title="View Invoice Details"
          >
            <IoEyeOutline size={18} />
          </button>

          {/* Next Button */}
          <button
            onClick={() => onNext(invoice.id)}
            disabled={invoice.status === 'READY_TO_SHIP'}
            className={`p-2 rounded-lg transition-all border ${
              invoice.status !== 'READY_TO_SHIP'
                ? 'bg-mint-50 hover:bg-mint-100 text-mint-600 border-mint-200'
                : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
            }`}
            title="Process Shipping"
          >
            <IoChevronForward size={18} />
          </button>
        </div>
      </td>
    </>
  )
}
