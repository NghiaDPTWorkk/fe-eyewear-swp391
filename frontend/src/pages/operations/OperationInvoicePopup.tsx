import React from 'react'
import { IoCloseOutline, IoChevronForward } from 'react-icons/io5'

// Định nghĩa lại các interface cần thiết để component này độc lập
export interface Order {
  id: string
  code: string
  item: string
}

export interface InvoiceDisplayAllInvoices {
  id: string
  invoiceCode: string
  status: string
  orderCount: number
  totalAmount: number
  orders: Order[]
}

interface OperationInvoicePopupProps {
  selectedInvoice: InvoiceDisplayAllInvoices | null
  isOpen: boolean
  onClose: () => void
  onNext: (invoiceId: string) => void
}

export default function OperationInvoicePopup({
  selectedInvoice,
  isOpen,
  onClose,
  onNext
}: OperationInvoicePopupProps) {
  // Helper function để lấy màu status (giữ nguyên logic của bạn)
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

  return (
    <>
      {/* Overlay Backdrop - Only covers main content area */}
      <div
        className={`absolute inset-0 bg-neutral-900/30 backdrop-blur-[2px] z-[40] transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Sidebar Panel - Right Side */}
      <div
        className={`absolute right-0 top-0 h-full w-[450px] bg-white shadow-2xl z-[50] transform transition-transform duration-300 ease-out border-l border-neutral-100 flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {selectedInvoice ? (
          <>
            {/* Header */}
            <div className="px-4 py-6 border-b border-neutral-100 bg-white flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">
                  {selectedInvoice.invoiceCode}
                </h2>
                <p className="text-sm text-neutral-500 mt-1 font-medium">Invoice Summary</p>
              </div>
              <button
                onClick={onClose}
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
                    className={`px-4 py-1.5 rounded-full text-xs font-bold shadow-sm ${getStatusColor(
                      selectedInvoice.status
                    )}`}
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
                      className="group p-5 bg-white border border-neutral-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:border-mint-100"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-mint-600 text-sm bg-mint-50 px-2 py-0.5 rounded-md group-hover:bg-mint-100 transition-colors">
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
            <div className="p-4 border-t border-neutral-100 bg-white">
              <button
                onClick={() => onNext(selectedInvoice.id)}
                className="w-full py-4 bg-mint-600 hover:bg-mint-700 text-white rounded-xl font-bold text-base transition-all shadow-lg shadow-mint-200 hover:shadow-mint-300 flex items-center justify-center gap-3 active:scale-[0.98]"
              >
                Proceed to Handover
                <IoChevronForward size={20} />
              </button>
            </div>
          </>
        ) : (
          /* Empty State khi chưa có selectedInvoice nhưng sidebar vẫn mở (trường hợp hiếm) */
          <div className="flex h-full items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mint-500"></div>
          </div>
        )}
      </div>
    </>
  )
}
