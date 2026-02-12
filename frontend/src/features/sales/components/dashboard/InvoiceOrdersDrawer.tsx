import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import { IoArrowForward, IoClose } from 'react-icons/io5'

import { Button, ConfirmationModal } from '@/shared/components/ui-core'
import { OrderType } from '@/shared/utils/enums/order.enum'
import { useSalesStaffAction } from '../../hooks/useSalesStaffAction'
import type { Invoice } from '../../types'

interface InvoiceOrdersDrawerProps {
  isOpen: boolean
  onClose: () => void
  invoice: Invoice | null
}

export const InvoiceOrdersDrawer: React.FC<InvoiceOrdersDrawerProps> = ({
  isOpen,
  onClose,
  invoice
}) => {
  const { approveOrder, processing } = useSalesStaffAction()
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)

  if (!isOpen || !invoice) return null

  const handleApproveOrder = async (e: React.MouseEvent, orderId: string) => {
    e.stopPropagation()
    setSelectedOrderId(orderId)
    setShowConfirmModal(true)
  }

  const confirmApproveOrder = async () => {
    if (selectedOrderId) {
      await approveOrder(selectedOrderId)
      setShowConfirmModal(false)
      setSelectedOrderId(null)
    }
  }

  return createPortal(
    <>
      <div className="fixed inset-0 z-[60] flex justify-end">
        <div
          className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
        <div className="relative w-full max-w-lg h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="px-6 py-6 border-b border-neutral-100 flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-semibold text-slate-900 font-heading">
                  Invoice Details
                </h2>
                <span className="text-xs font-medium text-mint-600 bg-mint-100/50 px-2.5 py-1 rounded-lg border border-mint-200/50 font-mono tracking-tight">
                  {invoice.invoiceCode}
                </span>
              </div>
              <p className="text-sm text-slate-500 font-normal leading-relaxed">
                Customer: <span className="font-medium text-slate-800">{invoice.fullName}</span>
                <span className="mx-2 text-slate-300">•</span>
                <span className="text-slate-500">{invoice.phone}</span>
              </p>
            </div>
            <Button
              onClick={onClose}
              variant="ghost"
              colorScheme="neutral"
              className="p-2 hover:bg-neutral-100 rounded-xl transition-all text-slate-400 hover:text-slate-600 active:scale-95 border-none shadow-none"
            >
              <IoClose size={24} />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-neutral-50/30">
            <div>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-xs uppercase tracking-wide font-medium text-slate-400 flex items-center gap-2">
                  Orders Summary
                </h3>
                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-xs font-medium">
                  {invoice.orders?.length || 0} ITEMS
                </span>
              </div>

              <div className="space-y-4">
                {invoice.orders?.map((order: any, idx) => {
                  // Safely handle order.type which can be array, string, or undefined
                  const orderTypes = Array.isArray(order.type)
                    ? order.type
                    : order.type
                      ? [order.type]
                      : [OrderType.NORMAL]

                  const hasManufacturing = orderTypes.some((t: any) =>
                    String(t).includes(OrderType.MANUFACTURING)
                  )
                  const hasPreOrder = orderTypes.some((t: any) =>
                    String(t).includes(OrderType.PRE_ORDER)
                  )

                  const isApprovable =
                    hasManufacturing &&
                    !['APPROVED', 'COMPLETED', 'DELIVERED', 'ONBOARD'].includes(order.status)

                  const getSimplifiedStatus = (order: any) => {
                    const status = (order.status || 'PENDING').toUpperCase()
                    const isRejected = ['REJECT', 'REJECTED', 'CANCELED'].includes(status)

                    if (isRejected) {
                      return {
                        label: 'REJECTED',
                        className: 'bg-rose-50 text-rose-600 border-rose-100'
                      }
                    }

                    // Normal orders or manufacturing orders in accepted states
                    const isAccepted =
                      !hasManufacturing ||
                      [
                        'VERIFIED',
                        'APPROVED',
                        'WAITING_ASSIGN',
                        'ASSIGNED',
                        'MAKING',
                        'PACKAGING',
                        'COMPLETED',
                        'ONBOARD',
                        'DELIVERED',
                        'DELIVERING'
                      ].includes(status)

                    if (isAccepted) {
                      return {
                        label: 'ACCEPTED',
                        className: 'bg-emerald-50 text-emerald-600 border-emerald-100'
                      }
                    }

                    return {
                      label: 'NEED VERIFY',
                      className: 'bg-amber-50 text-amber-600 border-amber-100'
                    }
                  }

                  const displayStatus = getSimplifiedStatus(order)

                  return (
                    <div
                      key={order.id || order._id}
                      className="group relative bg-white border border-neutral-100 rounded-2xl p-5 hover:border-primary-300 hover:shadow-xl hover:shadow-primary-100/20 transition-all cursor-pointer ring-1 ring-transparent hover:ring-primary-100"
                      onClick={() => {
                        let pathSuffix = 'regular'
                        if (hasManufacturing || order.isPrescription) {
                          pathSuffix = 'verify-rx'
                        } else if (hasPreOrder) {
                          pathSuffix = 'pre-order'
                        }
                        const path = `/salestaff/orders/${order.id || order._id}/${pathSuffix}`
                        window.location.href = `${path}?from=${window.location.pathname}&invoiceId=${invoice.id}`
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                            <span className="text-xs text-mint-600 font-medium uppercase tracking-wide">
                              Order #{String(idx + 1).padStart(2, '0')}
                            </span>
                          </div>
                          <span className="text-base font-medium text-slate-900 group-hover:text-primary-700 transition-colors font-heading tracking-tight">
                            {orderTypes.join(' & ')}
                          </span>
                        </div>
                        <div className="flex flex-col items-end gap-2 text-right">
                          <span
                            className={`px-3 py-1 rounded-full text-[10px] font-semibold tracking-wide border ${displayStatus.className}`}
                          >
                            {displayStatus.label}
                          </span>
                          {isApprovable && (
                            <Button
                              size="sm"
                              className="text-[9px] h-7 bg-emerald-500 hover:bg-emerald-600 text-white border-none shadow-sm mt-1"
                              disabled={processing}
                              onClick={(e) => handleApproveOrder(e, order.id || order._id)}
                            >
                              Approve Order
                            </Button>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-5 pt-4 border-t border-neutral-50">
                        <span className="text-xs text-slate-400 font-normal group-hover:text-slate-600 transition-colors">
                          Click to view details
                        </span>
                        <div className="w-8 h-8 rounded-full bg-neutral-50 flex items-center justify-center group-hover:bg-primary-500 group-hover:text-white transition-all transform group-hover:translate-x-1">
                          <IoArrowForward
                            size={14}
                            className="group-hover:translate-x-0.5 transition-transform"
                          />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="bg-white border border-neutral-100 rounded-3xl p-6 space-y-5 shadow-sm">
              <h4 className="text-xs font-medium text-slate-900 uppercase tracking-wide border-b border-neutral-50 pb-3">
                Billing Information
              </h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 font-normal">Final Price</span>
                  <span className="font-semibold text-primary-700 text-lg font-heading">
                    {invoice.finalPrice}
                  </span>
                </div>
                <div className="flex justify-between gap-6 text-sm">
                  <span className="text-slate-500 font-normal whitespace-nowrap">
                    Shipping Address
                  </span>
                  <span className="text-slate-700 font-medium text-right leading-relaxed">
                    {invoice.address}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-neutral-100 bg-white">
            <button
              onClick={() => (window.location.href = `/salestaff/orders?invoiceId=${invoice.id}`)}
              className="w-full py-4 bg-primary-600 text-white rounded-2xl font-medium text-sm shadow-lg shadow-primary-100 hover:bg-primary-700 active:scale-[0.98] transition-all flex items-center justify-center gap-3 tracking-tight group"
            >
              Manage All Orders in Invoice
              <IoArrowForward className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={confirmApproveOrder}
        title="Approve Order"
        message="Are you sure you want to verify and approve this order? This will move it to the next processing stage."
        confirmText="Approve Order"
        cancelText="Cancel"
        isLoading={processing}
        type="info"
      />
    </>,
    document.body
  )
}
