/* eslint-disable */
import { useState } from 'react'
import { Container } from '@/components'
import { BreadcrumbPath } from '@/components/layout/staff/operationstaff/breadcrumbpath'
import { IoAirplaneOutline, IoEyeOutline, IoChevronForward, IoCloseOutline } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'

interface Order {
  id: string
  code: string
  item: string
}

interface InvoiceDisplayAllInvoices {
  id: string
  invoiceCode: string
  status: string
  orderCount: number
  totalAmount: number
  orders: Order[]
}

export default function OperationAllInvoices() {
  const navigate = useNavigate()
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceDisplayAllInvoices | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Hardcoded invoice data with orders
  const invoices: InvoiceDisplayAllInvoices[] = [
    {
      id: '1',
      invoiceCode: 'INV-2024-001',
      status: 'READY_TO_SHIP',
      orderCount: 3,
      totalAmount: 2500000,
      orders: [
        { id: 'ORD-001', code: '#RX-001', item: 'RayBan Aviator + Progressive Lens' },
        { id: 'ORD-002', code: '#RX-002', item: 'Oakley Holbrook + Single Vision' },
        { id: 'ORD-003', code: '#RX-003', item: 'Glasses Case + Cleaning Cloth' }
      ]
    },
    {
      id: '2',
      invoiceCode: 'INV-2024-002',
      status: 'READY_TO_SHIP',
      orderCount: 2,
      totalAmount: 1800000,
      orders: [
        { id: 'ORD-004', code: '#RX-004', item: 'Gucci Square + Blue Light Lens' },
        { id: 'ORD-005', code: '#RX-005', item: 'Prada Rectangle + Photochromic' }
      ]
    },
    {
      id: '3',
      invoiceCode: 'INV-2024-003',
      status: 'PENDING',
      orderCount: 1,
      totalAmount: 950000,
      orders: [{ id: 'ORD-006', code: '#RX-006', item: 'Versace Cat Eye + Bifocal' }]
    },
    {
      id: '4',
      invoiceCode: 'INV-2024-004',
      status: 'READY_TO_SHIP',
      orderCount: 4,
      totalAmount: 3200000,
      orders: [
        { id: 'ORD-007', code: '#RX-007', item: 'Tom Ford Round + High Index' },
        { id: 'ORD-008', code: '#RX-008', item: 'Burberry Oval + Anti-Reflective' },
        { id: 'ORD-009', code: '#RX-009', item: 'Persol Square + Polarized' },
        { id: 'ORD-010', code: '#RX-010', item: 'Dior Pilot + Tinted' }
      ]
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

  const handleViewInvoice = (invoice: InvoiceDisplayAllInvoices) => {
    setSelectedInvoice(invoice)
    setIsSidebarOpen(true)
  }

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false)
    setTimeout(() => setSelectedInvoice(null), 300) // Clear after animation
  }

  const handleNextInvoice = (invoiceId: string) => {
    navigate(`/operationstaff/shipping-handover/${invoiceId}`)
  }

  return (
    <>
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
                          onClick={() => handleViewInvoice(invoice)}
                          className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-all border border-blue-200"
                          title="View Invoice Details"
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

      {/* Invoice Detail Sidebar (Popup) - Rendered scoped to Main Layout (relative) */}

      {/* Overlay */}
      <div
        className={`absolute inset-0 bg-neutral-900/40 backdrop-blur-[2px] z-[40] transition-opacity duration-300 ${
          isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={handleCloseSidebar}
      />

      {/* Sidebar Panel - Right Side */}
      <div
        className={`absolute right-0 top-0 h-full w-[450px] bg-white shadow-2xl z-[50] transform transition-transform duration-300 ease-out border-l border-neutral-100 flex flex-col ${
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {selectedInvoice && (
          <>
            {/* Header */}
            <div className="px-8 py-6 border-b border-neutral-100 bg-white flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">
                  {selectedInvoice.invoiceCode}
                </h2>
                <p className="text-sm text-neutral-500 mt-1 font-medium">Invoice Summary</p>
              </div>
              <button
                onClick={handleCloseSidebar}
                className="p-2 hover:bg-neutral-100 rounded-full transition-colors text-neutral-400 hover:text-neutral-900"
              >
                <IoCloseOutline size={28} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8 bg-neutral-50/50">
              {/* Status Section */}
              <div>
                <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-3">
                  CURRENT STATUS
                </h3>
                <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-neutral-100 shadow-sm">
                  <span className="text-sm font-semibold text-neutral-700">Payment Status</span>
                  <span
                    className={`px-4 py-1.5 rounded-full text-xs font-bold shadow-sm ${getStatusColor(selectedInvoice.status)}`}
                  >
                    {selectedInvoice.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Orders List */}
              <div>
                <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  ORDERS INCLUDED ({selectedInvoice.orders.length})
                </h3>
                <div className="space-y-3">
                  {selectedInvoice.orders.map((order, index) => (
                    <div
                      key={index}
                      className="group p-5 bg-white border border-neutral-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:border-blue-100"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-blue-600 text-sm bg-blue-50 px-2 py-0.5 rounded-md group-hover:bg-blue-100 transition-colors">
                          {order.code}
                        </span>
                        <span className="text-[10px] text-neutral-400 font-mono border border-neutral-100 px-1.5 py-0.5 rounded">
                          {order.id}
                        </span>
                      </div>
                      <p className="text-sm text-neutral-700 font-medium leading-relaxed">
                        {order.item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total Amount */}
              <div className="pt-6 border-t border-neutral-200 border-dashed">
                <div className="flex justify-between items-end">
                  <span className="text-neutral-500 font-medium text-sm mb-1">Total Amount</span>
                  <span className="text-3xl font-bold text-neutral-900 tracking-tight">
                    {selectedInvoice.totalAmount.toLocaleString('vi-VN')}{' '}
                    <span className="text-lg text-neutral-400 font-normal">₫</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-8 border-t border-neutral-100 bg-white">
              <button
                onClick={() => handleNextInvoice(selectedInvoice.id)}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-base transition-all shadow-lg shadow-blue-200 hover:shadow-blue-300 flex items-center justify-center gap-3 active:scale-[0.98]"
              >
                Proceed to Handover
                <IoChevronForward size={20} />
              </button>
            </div>
          </>
        )}
      </div>
    </>
  )
}
