import { IoReceiptOutline } from 'react-icons/io5'
import { ConfirmationModal } from '@/shared/components/ui'
import { RejectionModal } from '@/features/sale-staff/components/common'
import { LockBlockedModal } from '@/features/sale-staff/components/orders/InvoiceLockBadge'
import { type Invoice } from '@/features/sale-staff/types'

interface InvoiceProcessingModalsProps {
  showConfirmModal: boolean
  setShowConfirmModal: (show: boolean) => void
  showRejectModal: boolean
  setShowRejectModal: (show: boolean) => void
  showLockBlockedModal: boolean
  setShowLockBlockedModal: (show: boolean) => void
  invoiceToProcess: string | null
  setInvoiceToProcess: (id: string | null) => void
  lockedInvoiceId: string | null
  setLockedInvoiceId: (id: string | null) => void
  invoiceList: Invoice[]
  processing: boolean
  confirmApproval: () => Promise<void>
  confirmRejection: (note: string) => Promise<void>
  releaseLock: (id: string) => void
}

export function InvoiceProcessingModals({
  showConfirmModal,
  setShowConfirmModal,
  showRejectModal,
  setShowRejectModal,
  showLockBlockedModal,
  setShowLockBlockedModal,
  invoiceToProcess,
  setInvoiceToProcess,
  lockedInvoiceId,
  setLockedInvoiceId,
  invoiceList,
  processing,
  confirmApproval,
  confirmRejection,
  releaseLock
}: InvoiceProcessingModalsProps) {
  const invoice = invoiceList.find((inv) => inv.id === invoiceToProcess)

  return (
    <>
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => {
          if (invoiceToProcess) releaseLock(invoiceToProcess)
          setShowConfirmModal(false)
          setInvoiceToProcess(null)
        }}
        onConfirm={confirmApproval}
        title="Approve Invoice"
        message={
          <div className="space-y-2">
            <p className="text-slate-600">Are you sure you want to approve this invoice?</p>
            <p className="text-slate-500 text-sm">
              All orders will be marked as{' '}
              <span className="text-mint-600 font-semibold">verified</span>.
            </p>
          </div>
        }
        details={
          invoice && (
            <div className="space-y-4 pt-2">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
                  Items to Approve
                </span>
                <span className="text-[11px] font-bold text-mint-600 uppercase">
                  {invoice.orders?.length || 0} Total
                </span>
              </div>
              <div className="max-h-[240px] overflow-y-auto pr-1 space-y-3">
                {invoice.orders?.map((order, i) => (
                  <div
                    key={order.id || i}
                    className="group flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-mint-600">
                        <IoReceiptOutline size={20} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-slate-700">
                            #{order.orderCode || order.id?.slice(-8)}
                          </span>
                          {order.isPrescription && (
                            <span className="px-2 py-0.5 bg-rose-50 text-rose-500 rounded-md text-[8px] font-bold">
                              RX
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        }
        confirmText="Approve Invoice"
        type="info"
        isLoading={processing}
      />
      <RejectionModal
        isOpen={showRejectModal}
        onClose={() => {
          if (invoiceToProcess) releaseLock(invoiceToProcess)
          setShowRejectModal(false)
          setInvoiceToProcess(null)
        }}
        onConfirm={confirmRejection}
        isLoading={processing}
      />
      <LockBlockedModal
        isOpen={showLockBlockedModal}
        invoiceId={lockedInvoiceId}
        onClose={() => {
          setShowLockBlockedModal(false)
          setLockedInvoiceId(null)
        }}
      />
    </>
  )
}
