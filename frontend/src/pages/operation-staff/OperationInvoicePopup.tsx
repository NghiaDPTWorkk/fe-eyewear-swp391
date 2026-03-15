import { IoCloseOutline, IoChevronForward } from 'react-icons/io5'
import { createPortal } from 'react-dom'
import type { OperationInvoiceListItem } from '@/shared/types'

interface OperationInvoicePopupProps {
  selectedInvoice: OperationInvoiceListItem | null
  isOpen: boolean
  onClose: () => void
  onNext: (invoiceId: string) => void
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'COMPLETED':
      return 'bg-yellow-100 text-yellow-600'
    case 'READY_TO_SHIP':
      return 'bg-mint-100 text-mint-600'
    case 'SHIPPED':
      return 'bg-blue-100 text-blue-600'
    default:
      return 'bg-gray-100 text-gray-600'
  }
}

export default function OperationInvoicePopup({
  selectedInvoice,
  isOpen,
  onClose,
  onNext
}: OperationInvoicePopupProps) {
  if (!isOpen && !selectedInvoice) return null

  return createPortal(
    <>
      {}
      <div
        className={`fixed inset-0 bg-neutral-900/40 backdrop-blur-[2px] z-[40] transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {}
      <div
        className={`fixed right-0 top-0 h-full w-[600px] bg-white shadow-2xl z-[50] transform transition-transform duration-300 ease-out border-l border-neutral-100 flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {selectedInvoice ? (
          <>
            {}
            <div className="px-4 py-6 border-b border-neutral-100 bg-white flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold ps-5 text-mint-800 tracking-tight">
                  {selectedInvoice.invoiceCode}
                </h2>
                <p className="text-sm ps-5 text-neutral-500 mt-1 font-medium">Invoice Summary</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-neutral-100 rounded-full transition-colors text-neutral-400 hover:text-neutral-900"
              >
                <IoCloseOutline size={28} />
              </button>
            </div>

            {}
            <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8 bg-neutral-50/50">
              {}
              <div>
                <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-3">
                  CUSTOMER INFO
                </h3>
                <div className="p-4 bg-white rounded-xl border border-neutral-100 shadow-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-neutral-500">Name</span>
                    <span className="text-md font-semibold text-neutral-800">
                      {selectedInvoice.fullName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-neutral-500">Phone</span>
                    <span className="text-sm font-semibold text-neutral-800">
                      {selectedInvoice.phone}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-neutral-500">Address</span>
                    <span className="text-sm font-semibold text-neutral-800">
                      {selectedInvoice.address}
                    </span>
                  </div>
                </div>
              </div>

              {}
              <div>
                <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-3">
                  CURRENT STATUS
                </h3>
                <div className="bg-white rounded-xl border border-neutral-100 shadow-sm overflow-hidden">
                  {}
                  <div className="flex items-center justify-between px-4 py-3">
                    <span className="text-sm font-semibold text-neutral-700">Invoice Status</span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(selectedInvoice.status)}`}
                    >
                      {selectedInvoice.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="border-t border-neutral-100" />

                  {}
                  <div className="flex items-center justify-between px-4 py-3">
                    <span className="text-sm font-semibold text-neutral-700">Created At</span>
                    <span className="text-sm text-neutral-500 font-mono bg-neutral-50 border border-neutral-100 px-3 py-1 rounded-lg">
                      {(() => {
                        const d = new Date(selectedInvoice.createdAt)
                        return isNaN(d.getTime())
                          ? selectedInvoice.createdAt
                          : d.toLocaleString('vi-VN', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })
                      })()}
                    </span>
                  </div>
                </div>
              </div>

              {}
              <div>
                <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  ORDERS INCLUDED ({selectedInvoice.orders?.length ?? 0})
                </h3>
                <div className="space-y-3">
                  {(selectedInvoice.orders ?? []).map((orderId, index) => (
                    <div
                      key={orderId}
                      className="group p-5 bg-white border border-neutral-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:border-mint-100"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-mint-600 text-sm bg-mint-50 px-2 py-0.5 rounded-md group-hover:bg-mint-100 transition-colors">
                          Order {index + 1}
                        </span>
                        <span className="text-[16px] text-neutral-400 font-mono border border-neutral-300 px-1.5 py-0.5 rounded">
                          ID: {orderId.slice(-8).toUpperCase()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {}
            <div className="p-4 border-t border-neutral-100 bg-white">
              <button
                onClick={() => onNext(selectedInvoice.id)}
                className="w-full py-4 bg-mint-600 hover:bg-mint-700 text-white rounded-xl font-bold text-base transition-all shadow-lg shadow-mint-200 hover:shadow-mint-300 flex items-center justify-center gap-3 active:scale-[0.98]"
              >
                {selectedInvoice.status === 'COMPLETED'
                  ? 'Proceed to Handover'
                  : 'View Invoice Detail'}
                <IoChevronForward size={20} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mint-500"></div>
          </div>
        )}
      </div>
    </>,
    document.body
  )
}
