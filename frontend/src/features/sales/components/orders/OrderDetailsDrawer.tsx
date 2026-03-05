import { useEffect, useState, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'

import { OrderType } from '@/shared/utils/enums/order.enum'

import { useSalesStaffAction } from '@/features/sales/hooks/useSalesStaffAction'
import {
  useSalesStaffInvoices as useSalesStaffOrders,
  useSalesStaffOrderDetail
} from '@/features/sales/hooks/useSalesStaffInvoices'
import ConfirmationModal from '@/shared/components/ui-core/confirm-modal/ConfirmationModal'

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

  // Confirmation Modal State
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean
    action: 'approve' | 'reject' | null
  }>({
    isOpen: false,
    action: null
  })

  // Triggered by the child components (buttons)
  const handleActionClick = (action: 'approve' | 'reject') => {
    setConfirmState({
      isOpen: true,
      action
    })
  }

  // Actual logic executed after confirmation
  const executeAction = async () => {
    const action = confirmState.action
    if (!order || !action) return

    let success = false
    if (view === 'rx') {
      // For Manufacturing/Prescription orders
      success =
        action === 'approve'
          ? await approveOrder(order._id)
          : await rejectOrder(order._id, order.invoiceId)
    } else {
      // Default to Invoice level actions
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
      navigate(`/salestaff/orders/${order._id}/verify-rx${isVerified ? '?mode=readonly' : ''}`)
    } else if (order.type?.includes(OrderType.PRE_ORDER)) {
      navigate(`/salestaff/orders/${order._id}/pre-order`)
    } else {
      navigate(`/salestaff/orders/${order._id}/regular`)
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
            <div className="flex justify-between items-center py-2 border-b border-slate-50">
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                Order ID
              </span>
              <span className="text-sm font-bold text-slate-900">{order?.orderCode}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-50">
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                Customer
              </span>
              <span className="text-sm font-bold text-slate-900">
                {order?.customerName || 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                Category
              </span>
              <span className="text-sm font-italic text-slate-600 italic">
                {isPrescription ? 'Prescription Order' : 'Regular Order'}
              </span>
            </div>
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
