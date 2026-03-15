import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import { IoClose, IoArrowForward } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import { salesService } from '@/features/sale-staff/services/salesService'
import type { Invoice, OrderDetail } from '../../types'
import { Button, ConfirmationModal } from '@/shared/components/ui'
import { OrderType } from '@/shared/utils/enums/order.enum'
import { InvoiceStatus } from '@/shared/utils/enums/invoice.enum'
import { useSalesStaffAction } from '../../hooks/useSalesStaffAction'
import { OrderSummaryItem } from './components/OrderSummaryItem'
import { PrescriptionTable } from './components/PrescriptionTable'

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

  const navigateToOrder = (order: any) => {
    const types = Array.isArray(order.type) ? order.type : order.type ? [order.type] : []
    const suffix =
      types.some((t: any) => String(t).includes(OrderType.MANUFACTURING)) || order.isPrescription
        ? 'verify-rx'
        : types.some((t: any) => String(t).includes(OrderType.PRE_ORDER))
          ? 'pre-order'
          : 'regular'
    navigate(
      `/sale-staff/orders/${order.id}/${suffix}?from=${window.location.pathname}&invoiceId=${invoice.id}`
    )
  }

  return createPortal(
    <>
      <div className="fixed inset-0 z-[60] flex justify-end">
        <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm" onClick={onClose} />
        <div className="relative w-full max-w-lg h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          <div className="px-6 py-6 border-b border-neutral-100 flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-3 font-semibold text-slate-900 text-xl">
                <h2>Invoice Details</h2>
                <span className="text-xs text-mint-600 bg-mint-50 px-2.5 py-1 rounded-lg border border-mint-200">
                  {invoice.invoiceCode}
                </span>
              </div>
              <p className="text-sm text-slate-500 font-normal leading-relaxed">
                Customer: <span className="font-medium text-slate-800">{invoice.fullName}</span>
                <span className="mx-2 text-slate-300">•</span>
                {invoice.phone}
              </p>
            </div>
            <Button
              onClick={onClose}
              variant="ghost"
              colorScheme="neutral"
              className="p-2 border-none shadow-none"
            >
              <IoClose size={24} />
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-neutral-50/30">
            <div>
              <div className="flex justify-between items-center mb-5 uppercase text-[10px] font-bold text-slate-400 tracking-widest">
                <h3>Orders Summary</h3>
                <span>{invoice.orders?.length || 0} ITEMS</span>
              </div>
              <div className="space-y-4">
                {invoice.orders
                  ?.filter((o) => {
                    if (invoice.status === InvoiceStatus.REFUNDED)
                      return (Array.isArray(o.type) ? o.type : o.type ? [o.type] : []).some(
                        (t: any) => String(t).includes(OrderType.RETURN)
                      )
                    return true
                  })
                  .map((o, i) => (
                    <OrderSummaryItem
                      key={o.id}
                      order={o}
                      idx={i}
                      onNavigate={() => navigateToOrder(o)}
                      onApprove={async (e) => {
                        e.stopPropagation()
                        setSelectedOrderId(o.id)
                        setLoadingDetails(true)
                        setShowConfirmModal(true)
                        try {
                          const res = await salesService.getOrderById(o.id)
                          setSelectedOrderDetails(res.data.order)
                        } finally {
                          setLoadingDetails(false)
                        }
                      }}
                      processing={processing}
                    />
                  ))}
              </div>
            </div>
            <div className="bg-white border border-neutral-100 rounded-3xl p-6 space-y-5 shadow-sm uppercase text-[10px]">
              <h4 className="font-bold text-slate-900 border-b border-neutral-50 pb-3">
                Billing Information
              </h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Final Price</span>
                  <span className="text-lg font-bold text-primary-700">{invoice.finalPrice} đ</span>
                </div>
                <div className="flex justify-between gap-6 uppercase">
                  <span className="whitespace-nowrap">Shipping Address</span>
                  <p className="text-slate-700 font-bold text-right normal-case text-sm leading-relaxed">
                    {invoice.address}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="p-6 border-t border-neutral-100 bg-white">
            <button
              onClick={() =>
                navigate(
                  `/sale-staff/orders?status=${invoice.status}&search=${invoice.invoiceCode}`
                )
              }
              className="w-full py-4 bg-primary-600 text-white rounded-2xl font-bold text-sm shadow-lg hover:bg-primary-700 active:scale-[0.98] flex items-center justify-center gap-3 uppercase tracking-widest group"
            >
              Manage In Invoice <IoArrowForward className="group-hover:translate-x-1" />
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
        onConfirm={async () => {
          if (selectedOrderId) {
            await approveOrder(selectedOrderId)
            setShowConfirmModal(false)
            setSelectedOrderId(null)
          }
        }}
        title="Approve Order"
        message="Are you sure you want to verify and approve this order?"
        details={
          loadingDetails ? (
            <div className="py-8 flex flex-col items-center justify-center gap-3">
              <div className="w-6 h-6 border-2 border-mint-500/20 border-t-mint-500 rounded-full animate-spin" />
              <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">
                Fetching Details...
              </p>
            </div>
          ) : selectedOrderDetails ? (
            <div className="space-y-4">
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-3 font-bold uppercase text-[10px]">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Order Information</span>
                  <span className="text-mint-600">
                    #{selectedOrderDetails.orderCode || selectedOrderId?.slice(-8)}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-slate-400">Customer</p>
                    <p className="text-xs text-slate-900">{invoice.fullName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-400">Phone</p>
                    <p className="text-xs text-slate-900">{invoice.phone}</p>
                  </div>
                </div>
              </div>
              <PrescriptionTable
                parameters={selectedOrderDetails.products?.[0]?.lens?.parameters}
              />
            </div>
          ) : null
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
