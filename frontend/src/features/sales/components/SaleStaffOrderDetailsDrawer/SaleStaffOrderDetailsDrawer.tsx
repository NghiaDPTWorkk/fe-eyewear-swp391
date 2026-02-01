/* eslint-disable max-lines */
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { IoClose, IoArrowBackOutline, IoAlertCircleOutline } from 'react-icons/io5'
import { Button } from '@/components'
import { cn } from '@/lib/utils'

interface OrderDetailsDrawerProps {
  isOpen: boolean
  onClose: () => void
  orderId: string | null
  orderType?: 'Regular' | 'Pre-order' | 'Prescription'
  isApproved?: boolean
  onViewFullDetails?: () => void
  onNotifyCustomer?: (orderId: string) => void
  onUpdateStatus?: (orderId: string, status: 'approve' | 'reject') => void
}

export default function SaleStaffOrderDetailsDrawer({
  isOpen,
  onClose,
  orderId,
  orderType,
  isApproved,
  onViewFullDetails,
  onUpdateStatus
}: OrderDetailsDrawerProps) {
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null)

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  const orderData = {
    id: orderId || 'ORD-2024-1234',
    status: 'In Production',
    isPrescription: orderType === 'Prescription',
    isApproved: isApproved,
    customer: {
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+1 (555) 123-4567'
    },
    item: {
      name: 'Progressive Lenses',
      qty: 1,
      price: 450.0
    },
    prescription: {
      od: { sph: '+2.50', cyl: '-0.75', axis: '180', add: '+2.00' },
      os: { sph: '+2.25', cyl: '-0.50', axis: '175', add: '+2.00' },
      pd: '64mm',
      lensType: 'Progressive High Index 1.67'
    },
    timeline: [
      { label: 'Order Placed', time: '10:30 AM', date: 'Today', status: 'completed' },
      { label: 'Payment Confirmed', time: '10:32 AM', date: 'Today', status: 'completed' },
      { label: 'In Production', time: '11:15 AM', date: 'Today', status: 'current' },
      { label: 'Quality Check', time: 'Pending', date: '', status: 'pending' },
      { label: 'Ready to Ship', time: 'Pending', date: '', status: 'pending' }
    ]
  }

  const handleConfirmAction = () => {
    if (orderId && actionType && onUpdateStatus) {
      onUpdateStatus(orderId, actionType)
      setIsUpdatingStatus(false)
      onClose()
    }
  }

  const openActionModal = (type: 'approve' | 'reject') => {
    setActionType(type)
    setIsUpdatingStatus(true)
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex justify-end transition-opacity duration-300">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-[1px] transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 overflow-hidden">
        {/* Main Content Area (Absolute positioned to allow for swapping) */}
        <div
          className={cn(
            'flex-1 flex flex-col min-h-0 transition-all duration-300 ease-in-out',
            isUpdatingStatus
              ? '-translate-x-full opacity-0 pointer-events-none'
              : 'translate-x-0 opacity-100'
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-50 bg-gray-50/10">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span
                  className={cn(
                    'px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider',
                    orderType === 'Pre-order'
                      ? 'bg-amber-50 text-amber-600 border border-amber-100'
                      : orderType === 'Prescription'
                        ? 'bg-blue-50 text-blue-600 border border-blue-100'
                        : 'bg-neutral-50 text-neutral-500 border border-neutral-100'
                  )}
                >
                  {orderType} Order
                </span>
                <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-widest rounded-full border border-emerald-100 shadow-sm">
                  {orderData.status}
                </span>
              </div>
              <h2 className="text-2xl font-semibold text-[#0f172a] tracking-tight">
                Order Details
              </h2>
              <p className="text-slate-400 text-sm font-medium mt-1">{orderData.id}</p>
            </div>
            <Button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all ml-4"
            >
              <IoClose size={24} />
            </Button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto min-h-0 px-6 py-2 space-y-8 scrollbar-thin scrollbar-thumb-gray-200">
            {orderData.isPrescription && (
              <div className="space-y-3 pt-2">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest">
                  Prescription Summary
                </h3>
                <div className="bg-emerald-50/30 border border-emerald-100/50 rounded-2xl overflow-hidden shadow-sm">
                  {/* ... Table content same as before ... */}
                  <table className="w-full text-[11px] border-collapse">
                    <thead>
                      <tr className="bg-emerald-100/30 text-emerald-700 font-bold uppercase tracking-tight">
                        <th className="py-2 px-3 text-left">Eye</th>
                        <th className="py-2 px-1 text-center font-bold">SPH</th>
                        <th className="py-2 px-1 text-center font-bold">CYL</th>
                        <th className="py-2 px-1 text-center font-bold">AXIS</th>
                        <th className="py-2 px-1 text-center font-bold">ADD</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-emerald-100/30">
                      <tr>
                        <td className="py-2 px-3 font-bold text-gray-700">OD (Right)</td>
                        <td className="py-2 px-1 text-center text-gray-600 font-medium">
                          {orderData.prescription.od.sph}
                        </td>
                        <td className="py-2 px-1 text-center text-gray-600">
                          {orderData.prescription.od.cyl}
                        </td>
                        <td className="py-2 px-1 text-center text-gray-600">
                          {orderData.prescription.od.axis}
                        </td>
                        <td className="py-2 px-1 text-center text-gray-600">
                          {orderData.prescription.od.add}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-bold text-gray-700">OS (Left)</td>
                        <td className="py-2 px-1 text-center text-gray-600 font-medium">
                          {orderData.prescription.os.sph}
                        </td>
                        <td className="py-2 px-1 text-center text-gray-600">
                          {orderData.prescription.os.cyl}
                        </td>
                        <td className="py-2 px-1 text-center text-gray-600">
                          {orderData.prescription.os.axis}
                        </td>
                        <td className="py-2 px-1 text-center text-gray-600">
                          {orderData.prescription.os.add}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="p-3 bg-white/50 border-t border-emerald-100/30 flex justify-between items-center text-[11px]">
                    <span className="text-gray-500 font-medium uppercase tracking-wider">
                      PD (Dist)
                    </span>
                    <span className="text-emerald-700 font-bold">{orderData.prescription.pd}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Customer Info */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest">
                Customer Information
              </h3>
              <div className="bg-gray-50/50 border border-gray-100 p-5 rounded-2xl space-y-3 text-sm">
                <div className="flex justify-between items-center group">
                  <span className="text-gray-500 font-medium">Name</span>
                  <span className="font-semibold text-gray-900">{orderData.customer.name}</span>
                </div>
                <div className="flex justify-between items-center group">
                  <span className="text-gray-500 font-medium">Email</span>
                  <span className="font-semibold text-gray-900 truncate max-w-[200px]">
                    {orderData.customer.email}
                  </span>
                </div>
                <div className="flex justify-between items-center group">
                  <span className="text-gray-500 font-medium">Phone</span>
                  <span className="font-semibold text-gray-900">{orderData.customer.phone}</span>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest">
                Order Items
              </h3>
              <div className="bg-white border border-gray-100 p-4 rounded-2xl flex gap-4 items-center shadow-sm">
                {/* ... Image placeholder ... */}
                <div className="w-16 h-16 bg-gray-50 rounded-xl shrink-0 flex items-center justify-center border border-gray-100 overflow-hidden">
                  <div className="text-xs text-gray-400">Img</div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 truncate">{orderData.item.name}</h4>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">
                    Qty: {orderData.item.qty}
                  </p>
                </div>
                <span className="font-semibold text-gray-900">
                  ${orderData.item.price.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-6 pt-4 border-t border-gray-50 flex flex-col gap-3 bg-white">
            {orderType === 'Pre-order' ? (
              <div className="flex gap-3">
                <Button
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-100 h-12 rounded-xl"
                  onClick={() => openActionModal('approve')}
                >
                  Approve Deposit
                </Button>
                <Button
                  className="flex-1 bg-white border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 h-12 rounded-xl"
                  onClick={() => openActionModal('reject')}
                >
                  Reject Order
                </Button>
              </div>
            ) : (
              <Button
                className={cn(
                  'w-full h-14 font-semibold rounded-2xl transition-all active:scale-[0.98] border-none text-sm group shadow-lg',
                  orderType === 'Prescription' && !isApproved
                    ? 'bg-mint-600 hover:bg-mint-700 text-white shadow-mint-100'
                    : 'bg-mint-600 hover:bg-mint-700 text-white shadow-mint-100'
                )}
                size="lg"
                onClick={onViewFullDetails}
              >
                {orderType === 'Prescription' && !isApproved
                  ? '✓ Verify Prescription'
                  : 'View Details'}
              </Button>
            )}
          </div>
        </div>

        {/* Action Confirmation View (Slide in from right) */}
        <div
          className={cn(
            'absolute inset-0 flex flex-col bg-white transition-all duration-300 ease-in-out z-20',
            isUpdatingStatus
              ? 'translate-x-0 opacity-100'
              : 'translate-x-full opacity-0 pointer-events-none'
          )}
        >
          {/* Header */}
          <div className="p-6 pb-4 border-b border-neutral-50 flex items-center gap-4">
            <Button
              onClick={() => setIsUpdatingStatus(false)}
              className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all cursor-pointer group"
            >
              <IoArrowBackOutline
                size={22}
                className="group-hover:-translate-x-0.5 transition-transform"
              />
            </Button>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 tracking-tight">
                {actionType === 'approve' ? 'Confirm Approval' : 'Confirm Rejection'}
              </h2>
              <p className="text-gray-500 text-xs mt-0.5">
                {actionType === 'approve' ? 'Verify deposit receipt' : 'Reason for rejection'}
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto min-h-0 p-6 space-y-4 scrollbar-thin scrollbar-thumb-gray-200">
            <div
              className={cn(
                'p-4 rounded-2xl border flex gap-3 items-start',
                actionType === 'approve'
                  ? 'bg-emerald-50/50 border-emerald-100'
                  : 'bg-red-50/50 border-red-100'
              )}
            >
              <IoAlertCircleOutline
                className={cn(
                  'mt-0.5',
                  actionType === 'approve' ? 'text-emerald-500' : 'text-red-500'
                )}
                size={20}
              />
              <p
                className={cn(
                  'text-sm font-medium leading-relaxed',
                  actionType === 'approve' ? 'text-emerald-800' : 'text-red-800'
                )}
              >
                {actionType === 'approve'
                  ? 'Are you sure you want to approve this deposit? This will confirm the order and check stock availability.'
                  : 'Are you sure you want to reject this order? This action cannot be undone and the customer will be notified.'}
              </p>
            </div>
          </div>

          {/* Footer Actions for Update */}
          <div className="p-6 pt-4 border-t border-gray-50 flex gap-4 bg-neutral-50/50">
            <Button
              className={cn(
                'flex-1 text-white shadow-lg font-semibold rounded-2xl h-12 transition-all active:scale-95 border-none',
                actionType === 'approve'
                  ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-100'
                  : 'bg-red-500 hover:bg-red-600 shadow-red-100'
              )}
              size="lg"
              onClick={handleConfirmAction}
            >
              Confirm {actionType === 'approve' ? 'Approval' : 'Rejection'}
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-gray-200 bg-white hover:bg-gray-50 text-gray-600 font-semibold rounded-2xl h-12 transition-all active:scale-95"
              size="lg"
              onClick={() => setIsUpdatingStatus(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
