import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { IoClose, IoCheckmarkCircle } from 'react-icons/io5'
import { Button } from '@/components'

interface OrderDetailsDrawerProps {
  isOpen: boolean
  onClose: () => void
  orderId: string | null
  onViewFullDetails?: () => void
}

export default function OrderDetailsDrawer({
  isOpen,
  onClose,
  orderId,
  onViewFullDetails
}: OrderDetailsDrawerProps) {
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

  // Mock data - in real app fetch based on orderId
  const orderData = {
    id: orderId || 'ORD-2024-1234',
    status: 'In Production',
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
    timeline: [
      { label: 'Order Placed', time: '10:30 AM', date: 'Today', status: 'completed' },
      { label: 'Payment Confirmed', time: '10:32 AM', date: 'Today', status: 'completed' },
      { label: 'In Production', time: '11:15 AM', date: 'Today', status: 'current' },
      { label: 'Quality Check', time: 'Pending', date: '', status: 'pending' },
      { label: 'Ready to Ship', time: 'Pending', date: '', status: 'pending' }
    ]
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex justify-end transition-opacity duration-300">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-[1px] transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 tracking-tight">Order Details</h2>
            <p className="text-gray-500 text-sm mt-0.5">{orderData.id}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <IoClose size={24} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-2 space-y-8">
          {/* Status Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">STATUS</h3>
            <span className="inline-block px-4 py-1 bg-emerald-50 text-emerald-500 font-medium rounded-full text-xs uppercase tracking-wider border border-emerald-100">
              {orderData.status}
            </span>
          </div>

          {/* Customer Info */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
              Customer Information
            </h3>
            <div className="bg-gray-50/50 border border-gray-100 p-5 rounded-2xl space-y-3 text-sm">
              <div className="flex justify-between items-center group">
                <span className="text-gray-500">Name</span>
                <span className="font-medium text-gray-900">{orderData.customer.name}</span>
              </div>
              <div className="flex justify-between items-center group">
                <span className="text-gray-500">Email</span>
                <span className="font-medium text-gray-900 truncate max-w-[200px]">
                  {orderData.customer.email}
                </span>
              </div>
              <div className="flex justify-between items-center group">
                <span className="text-gray-500">Phone</span>
                <span className="font-medium text-gray-900">{orderData.customer.phone}</span>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
              Order Items
            </h3>
            <div className="bg-white border border-gray-100 p-4 rounded-2xl flex gap-4 items-center shadow-sm">
              <div className="w-16 h-16 bg-gray-50 rounded-xl shrink-0 flex items-center justify-center border border-gray-100 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=2080&auto=format&fit=crop"
                  className="w-full h-full object-cover mix-blend-multiply opacity-80"
                  alt="Item"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 truncate">{orderData.item.name}</h4>
                <p className="text-xs text-gray-500 mt-0.5">Qty: {orderData.item.qty}</p>
              </div>
              <span className="font-semibold text-gray-900">
                ${orderData.item.price.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Order Timeline */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
              Order Timeline
            </h3>
            <div className="relative pl-2 space-y-6">
              {/* Vertical Line */}
              <div className="absolute left-[19px] top-3 bottom-4 w-[2px] bg-gray-100" />

              {orderData.timeline.map((step, index) => {
                const isCompleted = step.status === 'completed'
                const isCurrent = step.status === 'current'

                return (
                  <div key={index} className="relative flex gap-4 group">
                    <div className="relative z-10">
                      {isCompleted ? (
                        <div className="w-10 h-10 rounded-full bg-emerald-300 text-white flex items-center justify-center ring-4 ring-white">
                          <IoCheckmarkCircle size={20} className="text-white" />
                        </div>
                      ) : isCurrent ? (
                        <div className="w-10 h-10 rounded-full bg-white border-2 border-emerald-300 text-emerald-400 flex items-center justify-center ring-4 ring-white shadow-sm">
                          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-50 border-2 border-gray-100 flex items-center justify-center ring-4 ring-white">
                          <div className="w-2 h-2 bg-gray-300 rounded-full" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 pt-1.5">
                      <div className="flex flex-col">
                        <h4
                          className={`font-semibold text-sm ${isCurrent ? 'text-emerald-500' : isCompleted ? 'text-gray-900' : 'text-gray-400'} transition-colors`}
                        >
                          {step.label}
                        </h4>
                        {step.time !== 'Pending' && (
                          <p className="text-xs text-gray-400 font-medium mt-0.5">{step.time}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 pt-4 border-t border-gray-50 flex gap-3 bg-white">
          <Button
            className="flex-1 bg-emerald-400 hover:bg-emerald-500 text-white shadow-none font-semibold rounded-xl h-12"
            size="lg"
          >
            Update Status
          </Button>
          <Button
            variant="outline"
            className="flex-1 border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold rounded-xl h-12"
            size="lg"
            onClick={onViewFullDetails}
          >
            View Full Details
          </Button>
        </div>
      </div>
    </div>,
    document.body
  )
}
