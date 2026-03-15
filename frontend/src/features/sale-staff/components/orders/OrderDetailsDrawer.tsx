import { useEffect, useState, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { IoEyeOutline, IoBodyOutline } from 'react-icons/io5'

import { OrderType } from '@/shared/utils/enums/order.enum'

import { useSalesStaffAction } from '@/features/sale-staff/hooks/useSalesStaffAction'
import {
  useSalesStaffInvoices as useSalesStaffOrders,
  useSalesStaffOrderDetail
} from '@/features/sale-staff/hooks/useSalesStaffInvoices'
import ConfirmationModal from '@/shared/components/ui/ConfirmationModal'

import { OrderDrawerActions } from './drawer/OrderDrawerActions'
import { OrderDrawerCustomer } from './drawer/OrderDrawerCustomer'
import { OrderDrawerHeader } from './drawer/OrderDrawerHeader'
import { OrderDrawerItems } from './drawer/OrderDrawerItems'
import { OrderDrawerRxVerify } from './drawer/OrderDrawerRxVerify'
import { OrderDrawerTimeline } from './drawer/OrderDrawerTimeline'
import { OrderDrawerUpdateStatus } from './drawer/OrderDrawerUpdateStatus'

export const OrderDetailsDrawer: React.FC<{
  isOpen: boolean
  onClose: () => void
  orderId: string | null
  onUpdate?: () => void
  onViewFullDetails?: () => void
}> = ({ isOpen, onClose, orderId, onUpdate, onViewFullDetails }) => {
  const navigate = useNavigate()
  const { fetchInvoices: invalidateOrders } = useSalesStaffOrders()
  const {
    data: order,
    isLoading,
    refetch
  } = useSalesStaffOrderDetail(isOpen && orderId ? orderId : '')
  const { approveInvoice, rejectInvoice, approveOrder, rejectOrder, processing } =
    useSalesStaffAction()

  const [view, setView] = useState<'main' | 'status' | 'rx'>('main')
  const [status, setStatus] = useState<string | null>(null)

  const handleClose = () => {
    setView('main')
    onClose()
  }

  useEffect(() => {
    if (isOpen && orderId) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, orderId])

  const steps = useMemo(() => {
    if (!order) return []
    const s = order.status
    return [
      {
        label: 'Order Placed',
        time: order.createdAt
          ? new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : '',
        status: 'completed' as const
      },
      {
        label: 'Payment Confirmed',
        time: '',
        status: ([
          'DEPOSITED',
          'WAITING_ASSIGN',
          'PROCESSING',
          'COMPLETED',
          'APPROVED',
          'VERIFIED'
        ].includes(s)
          ? 'completed'
          : 'pending') as 'completed' | 'pending' | 'current'
      },
      {
        label: 'In Production',
        time: '',
        status: (['PROCESSING', 'COMPLETED', 'APPROVED', 'VERIFIED'].includes(s)
          ? 'completed'
          : s === 'WAITING_ASSIGN'
            ? 'current'
            : 'pending') as 'completed' | 'pending' | 'current'
      },
      {
        label: 'Quality Check',
        time: '',
        status: (['COMPLETED', 'APPROVED', 'VERIFIED'].includes(s)
          ? 'completed'
          : s === 'PROCESSING'
            ? 'current'
            : 'pending') as 'completed' | 'pending' | 'current'
      },
      {
        label: 'Ready to Ship',
        time: '',
        status: (['COMPLETED', 'APPROVED', 'VERIFIED'].includes(s) ? 'completed' : 'pending') as
          | 'completed'
          | 'pending'
          | 'current'
      }
    ]
  }, [order])

  const isPrescription = order?.type?.includes(OrderType.MANUFACTURING) || false
  const isApproved = ['APPROVED', 'VERIFIED', 'COMPLETED'].includes(order?.status || '')

  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean
    action: 'approve' | 'reject' | null
  }>({
    isOpen: false,
    action: null
  })

  const handleActionClick = (action: 'approve' | 'reject') => {
    setConfirmState({
      isOpen: true,
      action
    })
  }

  const executeAction = async () => {
    const action = confirmState.action
    if (!order || !action) return

    let success = false
    if (view === 'rx') {
      success =
        action === 'approve'
          ? await approveOrder(order._id)
          : await rejectOrder(order._id, order.invoiceId)
    } else {
      if (order.invoiceId) {
        success =
          action === 'approve'
            ? await approveInvoice(order.invoiceId)
            : await rejectInvoice(order.invoiceId)
      }
    }

    if (success) {
      refetch()
      invalidateOrders()
      onUpdate?.()
      if (view === 'rx' || view === 'status') {
        setView('main')
      }
      setConfirmState({ isOpen: false, action: null })
    }
  }

  const handleViewDetail = () => {
    if (!order) return
    handleClose()
    if (onViewFullDetails) {
      onViewFullDetails()
      return
    }
    if (isPrescription) {
      const isVerified =
        order.status === 'VERIFIED' || order.status === 'APPROVED' || order.status === 'COMPLETED'
      navigate(`/sale-staff/orders/${order._id}/verify-rx${isVerified ? '?mode=readonly' : ''}`)
    } else if (order.type?.includes(OrderType.PRE_ORDER)) {
      navigate(`/sale-staff/orders/${order._id}/pre-order`)
    } else {
      navigate(`/sale-staff/orders/${order._id}/regular`)
    }
  }

  if (!isOpen) return null
  return createPortal(
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" onClick={handleClose} />
      <div className="relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 overflow-hidden">
        {view === 'main' && (
          <div className="flex-1 flex flex-col min-h-0">
            <OrderDrawerHeader
              orderCode={order?.orderCode}
              status={order?.status}
              orderTypeLabel={
                order?.type?.includes(OrderType.MANUFACTURING)
                  ? 'Prescription'
                  : order?.type?.includes(OrderType.PRE_ORDER)
                    ? 'Pre-order'
                    : 'Regular'
              }
              onClose={handleClose}
            />
            <div
              className={`flex-1 overflow-y-auto px-6 py-2 space-y-8 ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
            >
              <OrderDrawerCustomer order={order || null} />
              <OrderDrawerItems order={order || null} />
              <OrderDrawerTimeline steps={steps} />
            </div>
            <OrderDrawerActions
              isPrescription={isPrescription}
              isApproved={isApproved}
              onUpdateStatus={() => setView('status')}
              onViewFull={handleViewDetail}
            />
          </div>
        )}
        {view === 'status' && (
          <OrderDrawerUpdateStatus
            onBack={() => setView('main')}
            selectedStatus={status}
            setSelectedStatus={setStatus}
            onConfirm={() => {
              setView('main')
            }}
          />
        )}
        {view === 'rx' && (
          <OrderDrawerRxVerify
            order={order || null}
            onBack={() => setView('main')}
            onApprove={() => handleActionClick('approve')}
            onReject={() => handleActionClick('reject')}
            processing={processing}
          />
        )}
      </div>
      <ConfirmationModal
        isOpen={confirmState.isOpen}
        onClose={() => setConfirmState({ ...confirmState, isOpen: false })}
        onConfirm={executeAction}
        title={
          confirmState.action === 'approve'
            ? 'Approve Order Verification'
            : confirmState.action === 'reject'
              ? 'Reject Order Verification'
              : 'Confirm Action'
        }
        message={
          confirmState.action === 'approve' ? (
            <span className="text-slate-600">
              You are about to <span className="font-bold text-mint-600">APPROVE</span> this
              prescription/order. Please ensure all details have been verified for accuracy.
            </span>
          ) : (
            <span className="text-slate-600">
              You are about to <span className="font-bold text-rose-600">REJECT</span> this order.
              This action will notify the customer and may require a reason.
            </span>
          )
        }
        details={
          <div className="space-y-4">
            {}
            <div className="bg-slate-50/60 rounded-2xl p-4 border border-slate-100 space-y-3">
              <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-wider pb-2 border-b border-slate-100">
                <span className="text-slate-400">Order Information</span>
                <span className="text-mint-600 font-mono">
                  #{order?.orderCode || order?._id?.slice(-8)}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-0.5">
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest">Customer</p>
                  <p className="text-xs font-bold text-slate-900">{order?.customerName || 'N/A'}</p>
                </div>
                <div className="space-y-0.5 text-right">
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest">Phone</p>
                  <p className="text-xs font-bold text-slate-900">{order?.customerPhone || '—'}</p>
                </div>
                <div className="space-y-0.5 col-span-2">
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest">Category</p>
                  <p className="text-xs font-semibold text-slate-700 italic">
                    {isPrescription ? '🔬 Prescription (Manufacturing) Order' : '📦 Regular Order'}
                  </p>
                </div>
              </div>
            </div>

            {}
            {isPrescription && order?.products?.[0]?.lens?.parameters ? (
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
                      {(['right', 'left'] as const).map((side) => {
                        const params = order.products[0].lens?.parameters[side]
                        const label = side === 'right' ? 'OD' : 'OS'
                        const colorClass =
                          side === 'right'
                            ? 'text-indigo-600 bg-indigo-50/30'
                            : 'text-emerald-600 bg-emerald-50/30'
                        const accentClass =
                          side === 'right' ? 'text-indigo-500' : 'text-emerald-500'
                        const fmt = (v?: number) =>
                          v !== undefined ? (v > 0 ? '+' : '') + v.toFixed(2) : '0.00'
                        return (
                          <tr key={side}>
                            <td className={`py-3 px-3 font-bold ${colorClass}`}>{label}</td>
                            <td className="py-3 px-2 text-center font-semibold text-slate-700">
                              {fmt(params?.SPH)}
                            </td>
                            <td className="py-3 px-2 text-center font-semibold text-slate-700">
                              {fmt(params?.CYL)}
                            </td>
                            <td className={`py-3 px-2 text-center font-semibold ${accentClass}`}>
                              {params?.AXIS || 0}°
                            </td>
                            <td className="py-3 px-2 text-center font-semibold text-slate-500">
                              {fmt(params?.ADD)}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                  {}
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
                      {order.products[0].lens.parameters.PD || 64}mm
                    </span>
                  </div>
                </div>

                {}
                {order.products[0].prescriptionImageUrl && (
                  <div className="rounded-2xl overflow-hidden border border-indigo-100 bg-indigo-50/30">
                    <p className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest px-3 pt-2 pb-1">
                      Prescription Image
                    </p>
                    <img
                      src={order.products[0].prescriptionImageUrl}
                      alt="Prescription"
                      className="w-full max-h-40 object-contain"
                    />
                  </div>
                )}
              </div>
            ) : isPrescription ? (
              <div className="py-5 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                No prescription parameters on record
              </div>
            ) : null}
          </div>
        }
        confirmText={confirmState.action === 'approve' ? 'Confirm Approval' : 'Proceed Rejection'}
        type={confirmState.action === 'approve' ? 'info' : 'danger'}
        isLoading={processing}
      />
    </div>,
    document.body
  )
}
export default OrderDetailsDrawer
