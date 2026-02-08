import { Container } from '@/components'
import { BreadcrumbPath } from '@/components/layout/staff/operationstaff/breadcrumbpath'
import { IoAirplaneOutline, IoEyeOutline, IoChevronForward } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'

interface Invoice {
  id: string
  invoiceCode: string
  status: string
  orderCount: number
  totalAmount: number
}

export default function OperationAllInvoices() {
  const navigate = useNavigate()

  // Hardcoded invoice data
  const invoices: Invoice[] = [
    {
      id: '1',
      invoiceCode: 'INV-2024-001',
      status: 'READY_TO_SHIP',
      orderCount: 3,
      totalAmount: 2500000
    },
    {
      id: '2',
      invoiceCode: 'INV-2024-002',
      status: 'READY_TO_SHIP',
      orderCount: 2,
      totalAmount: 1800000
    },
    {
      id: '3',
      invoiceCode: 'INV-2024-003',
      status: 'PENDING',
      orderCount: 1,
      totalAmount: 950000
    },
    {
      id: '4',
      invoiceCode: 'INV-2024-004',
      status: 'READY_TO_SHIP',
      orderCount: 4,
      totalAmount: 3200000
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'READY_TO_SHIP':
        return 'bg-mint-100 text-mint-600'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-600'
      case 'SHIPPED':
        return 'bg-blue-100 text-blue-600'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  const handleViewInvoice = (invoiceId: string) => {
    navigate(`/operationstaff/shipping-handover/${invoiceId}`)
  }

  const handleNextInvoice = (invoiceId: string) => {
    navigate(`/operationstaff/shipping-handover/${invoiceId}`)
  }

  return (
    <Container className="animate-fade-in-up">
      {/* Breadcrumb */}
      <BreadcrumbPath paths={['Dashboard', 'Shipping Handover']} />

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
            <IoAirplaneOutline className="text-blue-500" /> Shipping Handover
          </h1>
          <p className="text-gray-500 mt-1">Manage invoices ready for shipping and delivery.</p>
        </div>
        <span className="px-6 py-2 bg-blue-100 text-blue-700 border border-blue-200 rounded-full text-xs font-bold uppercase tracking-widest">
          {invoices.length} Invoices
        </span>
      </div>

      {/* Invoice Table */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
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
            <tbody className="divide-y divide-gray-200">
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-gray-900">
                      {invoice.invoiceCode}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="text-sm font-medium text-gray-900">
                      {invoice.orderCount} orders
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className="text-sm font-semibold text-gray-900">
                      {invoice.totalAmount.toLocaleString('vi-VN')} ₫
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(invoice.status)}`}
                    >
                      {invoice.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-2">
                      {/* View Button */}
                      <button
                        onClick={() => handleViewInvoice(invoice.id)}
                        className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-all border border-blue-200"
                        title="View Invoice"
                      >
                        <IoEyeOutline size={18} />
                      </button>

                      {/* Next Button */}
                      <button
                        onClick={() => handleNextInvoice(invoice.id)}
                        disabled={invoice.status !== 'READY_TO_SHIP'}
                        className={`p-2 rounded-lg transition-all border ${
                          invoice.status === 'READY_TO_SHIP'
                            ? 'bg-mint-50 hover:bg-mint-100 text-mint-600 border-mint-200'
                            : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                        }`}
                        title="Process Shipping"
                      >
                        <IoChevronForward size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {invoices.length === 0 && (
          <div className="text-center py-12">
            <IoAirplaneOutline className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-500">No invoices found</p>
          </div>
        )}
      </div>
    </Container>
  )
}
