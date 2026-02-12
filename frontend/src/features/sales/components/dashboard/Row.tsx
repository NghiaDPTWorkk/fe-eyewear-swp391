import React, { useState } from 'react'
import { IoCheckmarkCircleOutline } from 'react-icons/io5'

import { cn } from '@/lib/utils'
import { ConfirmationModal } from '@/shared/components/ui-core'

import { useSalesStaffAction } from '../../hooks/useSalesStaffAction'
import type { Invoice } from '../../types'

interface RowProps {
  invoice: Invoice
  onClick: () => void
  onActionSuccess: () => void
}

export const Row: React.FC<RowProps> = ({ invoice, onClick, onActionSuccess }) => {
  const { approveInvoice, processing } = useSalesStaffAction()
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  // Calculate approvable status directly from fetched data
  const approvedCount = invoice.approvedOrdersCount || 0
  const totalCount = invoice.totalOrdersCount || 0
  const isApprovable = approvedCount === totalCount && totalCount > 0

  const handleApprove = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!isApprovable) return
    setShowConfirmModal(true)
  }

  const confirmApprove = async () => {
    const success = await approveInvoice(invoice.id)
    if (success) onActionSuccess()
    setShowConfirmModal(false)
  }

  return (
    <>
      <tr
        className="border-b border-neutral-50 hover:bg-neutral-50/50 transition-colors cursor-pointer group"
        onClick={onClick}
      >
        <td className="px-6 py-5">
          <span className="text-sm font-medium text-mint-600 font-mono hover:text-mint-700 transition-colors">
            {invoice.invoiceCode}
          </span>
        </td>
        <td className="px-6 py-5">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-slate-700">{invoice.fullName}</span>
            <span className="text-xs text-slate-400 mt-0.5">{invoice.phone}</span>
          </div>
        </td>
        <td className="px-6 py-5">
          <div className="flex flex-col">
            <span className="text-sm text-slate-600">
              {invoice.createdAt ? invoice.createdAt.split(' ')[1] : 'N/A'}
            </span>
            <span className="text-xs text-slate-400">
              {invoice.createdAt ? invoice.createdAt.split(' ')[0] : ''}
            </span>
          </div>
        </td>
        <td className="px-6 py-5 text-right font-medium text-slate-700">{invoice.finalPrice}</td>
        <td className="px-6 py-5">
          <div className="flex items-center justify-center">
            {!isApprovable ? (
              <span className="px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-amber-50 text-amber-600 border border-amber-100 flex items-center gap-1.5 animate-pulse">
                <div className="w-1 h-1 rounded-full bg-amber-500" />
                Needs Verification
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-mint-50 text-mint-600 border border-mint-100 flex items-center gap-1.5">
                <IoCheckmarkCircleOutline size={12} />
                Ready to Approve
              </span>
            )}
          </div>
        </td>
        <td className="px-6 py-5 text-right">
          <div className="flex items-center justify-end">
            <button
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-medium text-xs border whitespace-nowrap',
                isApprovable && !processing
                  ? 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-100 active:scale-95'
                  : 'bg-neutral-50 text-neutral-400 border-neutral-100 cursor-not-allowed'
              )}
              title={
                isApprovable
                  ? 'Finalize and Approve Invoice'
                  : `Waiting for ${totalCount - approvedCount} more orders to be verified`
              }
              disabled={!isApprovable || processing}
              onClick={handleApprove}
            >
              {isApprovable ? (
                <>
                  <IoCheckmarkCircleOutline size={18} />
                  <span>Approve Final</span>
                </>
              ) : (
                <>
                  <div className="w-1.5 h-1.5 rounded-full bg-neutral-300 mr-1" />
                  <span>
                    {approvedCount}/{totalCount} Verified
                  </span>
                </>
              )}
            </button>
          </div>
        </td>
      </tr>

      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={confirmApprove}
        title="Approve Invoice"
        message={`All ${totalCount} orders for invoice ${invoice.invoiceCode} have been verified. Are you sure you want to finalize this invoice? This will move all orders to the Packaging stage.`}
        confirmText="Finalize & Approve"
        cancelText="Cancel"
        isLoading={processing}
        type="info"
      />
    </>
  )
}
