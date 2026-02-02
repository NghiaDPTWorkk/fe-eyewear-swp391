import { useEffect, useState, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { useSalesStaffOrders } from '@/features/sales/hooks/useSalesStaffOrders'
import { useSalesStaffAction } from '@/features/sales/hooks/useSalesStaffAction'
import { OrderDrawerHeader } from './drawer/OrderDrawerHeader'
import { OrderDrawerCustomer } from './drawer/OrderDrawerCustomer'
import { OrderDrawerItems } from './drawer/OrderDrawerItems'
import { OrderDrawerTimeline } from './drawer/OrderDrawerTimeline'
import { OrderDrawerActions } from './drawer/OrderDrawerActions'
import { OrderDrawerUpdateStatus } from './drawer/OrderDrawerUpdateStatus'
import { OrderDrawerRxVerify } from './drawer/OrderDrawerRxVerify'
import type { OrderDetail } from '@/features/sales/types'

export const OrderDetailsDrawer: React.FC<{
  isOpen: boolean
  onClose: () => void
  orderId: string | null
  onUpdate?: () => void
  onViewFullDetails?: () => void
}> = ({ isOpen, onClose, orderId, onUpdate, onViewFullDetails }) => {
  const navigate = useNavigate()
  const { fetchOrderDetail } = useSalesStaffOrders()
  const { approveInvoice, rejectInvoice, processing } = useSalesStaffAction()
  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [view, setView] = useState<'main' | 'status' | 'rx'>('main')
  const [status, setStatus] = useState<string | null>(null)

  const handleClose = () => {
    setView('main')
    onClose()
  }

  useEffect(() => {
    if (isOpen && orderId) {
      document.body.style.overflow = 'hidden'
      fetchOrderDetail(orderId).then((data) => data && setOrder(data))
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, orderId, fetchOrderDetail])

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

  const isPrescription = order?.type?.includes('MANUFACTURING') || false
  const isApproved = ['APPROVED', 'VERIFIED', 'COMPLETED', 'DEPOSITED'].includes(
    order?.status || ''
  )

  const handleAction = async (action: 'approve' | 'reject') => {
    if (
      order?.invoiceId &&
      (action === 'approve'
        ? await approveInvoice(order.invoiceId)
        : await rejectInvoice(order.invoiceId))
    ) {
      const updated = await fetchOrderDetail(order._id)
      if (updated) setOrder(updated)
      onUpdate?.()
      setView('main')
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
    } else if (order.type?.includes('PRE-ORDER')) {
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
                isPrescription
                  ? 'Prescription'
                  : order?.type?.includes('PRE-ORDER')
                    ? 'Pre-order'
                    : 'Regular'
              }
              onClose={handleClose}
            />
            <div className="flex-1 overflow-y-auto px-6 py-2 space-y-8">
              <OrderDrawerCustomer order={order} />
              <OrderDrawerItems order={order} />
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
            order={order}
            onBack={() => setView('main')}
            onApprove={() => handleAction('approve')}
            onReject={() => handleAction('reject')}
            processing={processing}
          />
        )}
      </div>
    </div>,
    document.body
  )
}
export default OrderDetailsDrawer
