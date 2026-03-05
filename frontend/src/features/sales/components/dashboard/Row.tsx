import React, { useState } from 'react'
import { IoShieldCheckmarkOutline, IoEllipse, IoReceiptOutline } from 'react-icons/io5'

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
  const isApprovable = invoice.hasManufacturing && approvedCount === totalCount && totalCount > 0

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
              invoice.hasManufacturing ? (
                <span className="px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-amber-50 text-amber-600 border border-amber-100 flex items-center gap-1.5 animate-pulse whitespace-nowrap">
                  <IoEllipse size={6} className="text-amber-500" />
                  WAIT VERIFY
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-slate-50 text-slate-400 border border-slate-100 flex items-center gap-1.5 whitespace-nowrap">
                  PENDING
                </span>
              )
            ) : (
              <span className="px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-mint-50 text-mint-600 border border-mint-100 flex items-center gap-1.5 whitespace-nowrap">
                <IoShieldCheckmarkOutline size={12} className="text-mint-600" />
                READY TO APPROVE FINAL
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
              <IoShieldCheckmarkOutline size={18} />
              <span>
                {isApprovable
                  ? 'APPROVE FINAL'
                  : invoice.hasManufacturing
                    ? `${approvedCount}/${totalCount} VERIFIED`
                    : 'VIEW ORDERS'}
              </span>
            </button>
          </div>
        </td>
      </tr>

      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={confirmApprove}
        title="Approve Invoice"
        message={
          <div className="space-y-2">
            <p className="text-slate-600">
              All <span className="text-mint-600 font-semibold">{totalCount} orders</span> for
              invoice{' '}
              <span className="text-slate-900 font-bold font-mono px-1.5 py-0.5 bg-slate-100 rounded">
                {invoice.invoiceCode}
              </span>{' '}
              have been verified.
            </p>
            <p className="text-slate-500 text-sm">
              Are you sure you want to finalize and approve this invoice for the next stage?
            </p>
          </div>
        }
        details={
          <div className="space-y-4 pt-2">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
                Items to Finalize
              </span>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-mint-500 animate-pulse" />
                <span className="text-[11px] font-bold text-mint-600 uppercase">
                  {totalCount} Total
                </span>
              </div>
            </div>

            <div className="max-h-[220px] overflow-y-auto pr-1 space-y-3 custom-scrollbar">
              {invoice.orders?.map((order, i) => (
                <div
                  key={order.id || i}
                  className="group flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 hover:border-mint-200 hover:shadow-md hover:shadow-mint-50/50 transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-mint-50 group-hover:text-mint-600 transition-colors">
                      <IoReceiptOutline size={20} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-700 font-mono tracking-tight leading-none group-hover:text-mint-600 transition-colors">
                          #{order.orderCode || order.id?.slice(-8)}
                        </span>
                        {order.isPrescription && (
                          <span className="px-2 py-0.5 bg-rose-50 text-rose-500 rounded-md text-[8px] font-bold uppercase tracking-tight border border-rose-100/50">
                            RX
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {(Array.isArray(order.type) ? order.type : [order.type || 'REGULAR']).map(
                          (t, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[9px] font-medium uppercase tracking-wide border border-slate-200/50"
                            >
                              {String(t).replace(/_/g, ' ')}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <span
                      className={`px-3 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider border shadow-sm transition-all ${
                        [
                          'VERIFIED',
                          'APPROVE',
                          'APPROVED',
                          'WAITING_ASSIGN',
                          'ASSIGNED',
                          'MAKING',
                          'PACKAGING',
                          'COMPLETED',
                          'ONBOARD'
                        ].includes(String(order.status).toUpperCase())
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-emerald-50'
                          : 'bg-amber-50 text-amber-600 border-amber-100 shadow-amber-50'
                      }`}
                    >
                      {String(order.status).replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-mint-50/40 rounded-2xl border border-mint-100/40">
              <p className="text-[11px] font-medium text-mint-700 leading-relaxed text-center">
                Approved items will move to{' '}
                <span className="font-bold text-mint-900 uppercase">Packaging</span> phase.
              </p>
            </div>
          </div>
        }
        confirmText="Finalize & Approve"
        cancelText="Cancel"
        isLoading={processing}
        type="info"
      />
    </>
  )
}
