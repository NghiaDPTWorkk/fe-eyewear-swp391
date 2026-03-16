import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import { IoArrowForward, IoClose, IoEyeOutline, IoBodyOutline } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import { salesService } from '@/features/sales/services/salesService'
import type { Invoice, OrderDetail } from '../../types'
import { Button, ConfirmationModal } from '@/shared/components/ui-core'
import { OrderType } from '@/shared/utils/enums/order.enum'
import { useSalesStaffAction } from '../../hooks/useSalesStaffAction'
import { cn } from '@/lib/utils'

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
  const navigate = useNavigate()
  const { approveOrder, processing } = useSalesStaffAction()
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<OrderDetail | null>(null)
  const [loadingDetails, setLoadingDetails] = useState(false)

  if (!isOpen || !invoice) return null

  const handleApproveOrder = async (e: React.MouseEvent, orderId: string) => {
    e.stopPropagation()
    setSelectedOrderId(orderId)
    setLoadingDetails(true)
    setShowConfirmModal(true)

    try {
      const res = await salesService.getOrderById(orderId)
      setSelectedOrderDetails(res.data.order)
    } catch (err) {
      console.error('Failed to fetch order details:', err)
    } finally {
      setLoadingDetails(false)
    }
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
          {}
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

          {}
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
                {invoice.orders?.map((order, idx) => {
                  const orderTypes = Array.isArray(order.type)
                    ? order.type
                    : order.type
                      ? [order.type]
                      : [OrderType.NORMAL]

                  const hasManufacturing = orderTypes.some((t: OrderType | string) =>
                    String(t).includes(OrderType.MANUFACTURING)
                  )
                  const hasPreOrder = orderTypes.some((t: OrderType | string) =>
                    String(t).includes(OrderType.PRE_ORDER)
                  )

                  const getSimplifiedStatus = (order: { status: string }) => {
                    const status = (order.status || 'PENDING').toUpperCase()
                    const isRejected = ['REJECT', 'REJECTED', 'CANCELED'].includes(status)

                    if (isRejected) {
                      return {
                        label: 'REJECTED',
                        className: 'bg-rose-50 text-rose-600 border-rose-100'
                      }
                    }

                    const isAccepted = [
                      'VERIFIED',
                      'APPROVE',
                      'APPROVED',
                      'WAITING_ASSIGN',
                      'ASSIGNED',
                      'MAKING',
                      'PACKAGING',
                      'COMPLETED',
                      'ONBOARD',
                      'DELIVERED',
                      'DELIVERING',
                      'SHIPPED',
                      'PROCESSING'
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

                  const isApprovable = displayStatus.label === 'NEED VERIFY'

                  const displayType = (() => {
                    if (hasManufacturing || order.isPrescription) return 'PRESCRIPTION'
                    if (hasPreOrder) return 'PRE-ORDER'
                    return (orderTypes.join(' & ') || 'REGULAR').toUpperCase()
                  })()

                  return (
                    <div
                      key={order.id}
                      className="group relative bg-white border border-neutral-100 rounded-2xl p-5 hover:border-primary-300 hover:shadow-xl hover:shadow-primary-100/20 transition-all cursor-pointer ring-1 ring-transparent hover:ring-primary-100"
                      onClick={() => {
                        let pathSuffix = 'regular'
                        if (hasManufacturing || order.isPrescription) {
                          pathSuffix = 'verify-rx'
                        } else if (hasPreOrder) {
                          pathSuffix = 'pre-order'
                        }
                        const path = `/sale-staff/orders/${order.id}/${pathSuffix}`
                        navigate(`${path}?from=${window.location.pathname}&invoiceId=${invoice.id}`)
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
                            {displayType}
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
                              onClick={(e) => handleApproveOrder(e, order.id)}
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
                  <span className="text-slate-500 font-normal uppercase tracking-wider text-[10px]">
                    Final Price
                  </span>
                  <span className="font-semibold text-primary-700 text-lg font-heading">
                    {invoice.finalPrice}
                  </span>
                </div>
                <div className="flex justify-between gap-6 text-sm">
                  <span className="text-slate-500 font-normal whitespace-nowrap uppercase tracking-wider text-[10px]">
                    Shipping Address
                  </span>
                  <span className="text-slate-700 font-medium text-right leading-relaxed">
                    {invoice.address}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {}
          <div className="p-6 border-t border-neutral-100 bg-white">
            <button
              onClick={() =>
                navigate(
                  `/sale-staff/orders?status=${invoice.status}&search=${invoice.invoiceCode}`
                )
              }
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
        onClose={() => {
          setShowConfirmModal(false)
          setSelectedOrderDetails(null)
        }}
        onConfirm={confirmApproveOrder}
        title="Approve Order"
        message="Are you sure you want to verify and approve this order? This will move it to the next processing stage."
        details={
          loadingDetails ? (
            <div className="py-8 flex flex-col items-center justify-center gap-3">
              <div className="w-6 h-6 border-2 border-mint-500/20 border-t-mint-500 rounded-full animate-spin" />
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Fetching Order Details...
              </p>
            </div>
          ) : selectedOrderDetails ? (
            <div className="space-y-4">
              {}
              <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100/50 space-y-3">
                <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-wider">
                  <span className="text-slate-400">Order Information</span>
                  <span className="text-mint-600">
                    #{selectedOrderDetails.orderCode || selectedOrderId?.slice(-8)}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest">Customer</p>
                    <p className="text-xs font-bold text-slate-900">{invoice.fullName}</p>
                  </div>
                  <div className="space-y-1 text-right">
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest">Phone</p>
                    <p className="text-xs font-bold text-slate-900">{invoice.phone}</p>
                  </div>
                </div>
              </div>

              {}
              {selectedOrderDetails.products?.[0]?.lens?.parameters && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 px-1">
                    <div className="w-6 h-6 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500 border border-indigo-100">
                      <IoEyeOutline size={14} />
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      Prescription Parameters (RX)
                    </span>
                  </div>
                  <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                    <table className="w-full text-[11px] border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-slate-400">
                          <th className="py-2.5 px-3 text-left font-bold w-12">EYE</th>
                          <th className="py-2.5 px-2 font-bold text-center">SPH</th>
                          <th className="py-2.5 px-2 font-bold text-center">CYL</th>
                          <th className="py-2.5 px-2 font-bold text-center">AXIS</th>
                          <th className="py-2.5 px-2 font-bold text-center">ADD</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {['right', 'left'].map((side) => {
                          const isRight = side === 'right'
                          const params =
                            selectedOrderDetails.products[0].lens?.parameters[
                              side as 'right' | 'left'
                            ]
                          const label = isRight ? 'OD' : 'OS'
                          const colorClass = isRight
                            ? 'text-indigo-600 bg-indigo-50/30'
                            : 'text-emerald-600 bg-emerald-50/30'
                          const accentClass = isRight ? 'text-indigo-500' : 'text-emerald-500'

                          return (
                            <tr key={side}>
                              <td className={cn('py-3 px-3 font-bold', colorClass)}>{label}</td>
                              <td className="py-3 px-2 text-center font-semibold text-slate-700">
                                {params?.SPH !== undefined
                                  ? (params.SPH > 0 ? '+' : '') + params.SPH.toFixed(2)
                                  : '0.00'}
                              </td>
                              <td className="py-3 px-2 text-center font-semibold text-slate-700">
                                {params?.CYL !== undefined
                                  ? (params.CYL > 0 ? '+' : '') + params.CYL.toFixed(2)
                                  : '0.00'}
                              </td>
                              <td
                                className={cn('py-3 px-2 text-center font-semibold', accentClass)}
                              >
                                {params?.AXIS || 0}°
                              </td>
                              <td className="py-3 px-2 text-center font-semibold text-slate-500">
                                {params?.ADD !== undefined
                                  ? (params.ADD > 0 ? '+' : '') + params.ADD.toFixed(2)
                                  : '—'}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                    <div className="bg-blue-50/50 p-3 flex justify-between items-center border-t border-blue-100/50">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-md bg-blue-100 flex items-center justify-center text-blue-600">
                          <IoBodyOutline size={12} />
                        </div>
                        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                          Pupillary Distance (PD)
                        </span>
                      </div>
                      <span className="text-sm font-bold text-blue-700">
                        {selectedOrderDetails.products[0].lens.parameters.PD || 64}mm
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="py-8 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
              No detailed parameters available
            </div>
          )
        }
        confirmText="Approve Order"
        cancelText="Cancel"
        isLoading={processing}
        type="info"
      />
    </>,
    document.body
  )
}
