import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  IoClose,
  IoCheckmarkCircle,
  IoArrowBack,
  IoRadioButtonOn,
  IoRadioButtonOff,
  IoAlertCircleOutline
} from 'react-icons/io5'
import { Button } from '@/components'
import { cn } from '@/lib/utils'

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
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)

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

  const statusOptions = [
    { label: 'In Production', color: 'bg-[#dcfce7] text-[#15803d] border-[#bbf7d0]' },
    { label: 'Quality Check', color: 'bg-[#fef3c7] text-[#b45309] border-[#fde68a]' },
    { label: 'Ready to Ship', color: 'bg-[#dbeafe] text-[#1d4ed8] border-[#bfdbfe]' },
    { label: 'Shipped', color: 'bg-[#f3e8ff] text-[#7e22ce] border-[#e9d5ff]' },
    { label: 'Delivered', color: 'bg-[#f3f4f6] text-[#374151] border-[#e5e7eb]' },
    { label: 'On Hold', color: 'bg-[#fee2e2] text-[#b91c1c] border-[#fecaca]' }
  ]

  const handleUpdateClick = () => {
    setSelectedStatus(orderData.status)
    setIsUpdatingStatus(true)
  }

  const handleConfirmUpdate = () => {
    // In real app, call API
    console.warn('Updating order status to:', selectedStatus)
    setIsUpdatingStatus(false)
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
          <div className="flex items-center justify-between p-6 pb-4">
            <div>
              <h2 className="text-2xl font-bold text-[#0f172a] tracking-tight">Order Details</h2>
              <p className="text-slate-400 text-base mt-1 font-medium">{orderData.id}</p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all"
            >
              <IoClose size={24} />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto min-h-0 px-6 py-2 space-y-8 scrollbar-thin scrollbar-thumb-gray-200">
            {/* Status Section */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest">
                STATUS
              </h3>
              <span className="inline-block px-6 py-2 bg-[#dcfce7] text-[#15803d] text-[11px] font-bold uppercase tracking-widest rounded-full border border-[#bbf7d0] cursor-pointer shadow-sm">
                {orderData.status}
              </span>
            </div>

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
                <div className="w-16 h-16 bg-gray-50 rounded-xl shrink-0 flex items-center justify-center border border-gray-100 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=2080&auto=format&fit=crop"
                    className="w-full h-full object-cover mix-blend-multiply opacity-80"
                    alt="Item"
                  />
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

            {/* Order Timeline */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                Order Timeline
              </h3>
              <div className="relative pl-2 space-y-6">
                {/* Vertical Line */}
                <div className="absolute left-[19px] top-3 bottom-1 w-[2px] bg-gray-100" />

                {orderData.timeline.map((step, index) => {
                  const isCompleted = step.status === 'completed'
                  const isCurrent = step.status === 'current'

                  return (
                    <div key={index} className="relative flex gap-4 group">
                      <div className="relative z-10">
                        {isCompleted ? (
                          <div className="w-10 h-10 rounded-full bg-emerald-400 text-white flex items-center justify-center ring-4 ring-white shadow-sm shadow-emerald-100/50">
                            <IoCheckmarkCircle size={22} className="text-white" />
                          </div>
                        ) : isCurrent ? (
                          <div className="w-10 h-10 rounded-full bg-white border-2 border-emerald-400 text-emerald-400 flex items-center justify-center ring-4 ring-white shadow-md">
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-50 border-2 border-gray-100 flex items-center justify-center ring-4 ring-white">
                            <div className="w-2.5 h-2.5 bg-gray-300 rounded-full" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 pt-2">
                        <div className="flex flex-col">
                          <h4
                            className={`font-semibold text-[13px] ${isCurrent ? 'text-emerald-500' : isCompleted ? 'text-gray-900' : 'text-gray-400'} transition-colors`}
                          >
                            {step.label}
                          </h4>
                          {step.time !== 'Pending' && (
                            <p className="text-[11px] text-gray-400 font-medium mt-0.5">
                              {step.time}
                            </p>
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
          <div className="p-6 pt-4 border-t border-gray-50 flex gap-4 bg-white">
            <Button
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-100/50 font-semibold rounded-2xl h-12 transition-all active:scale-95 border-none"
              size="lg"
              onClick={handleUpdateClick}
            >
              Update Status
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold rounded-2xl h-12 transition-all active:scale-95"
              size="lg"
              onClick={onViewFullDetails}
            >
              View Full Details
            </Button>
          </div>
        </div>

        {/* Update Status View (Slide in from right) */}
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
            <button
              onClick={() => setIsUpdatingStatus(false)}
              className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all cursor-pointer group"
            >
              <IoArrowBack
                size={22}
                className="group-hover:-translate-x-0.5 transition-transform"
              />
            </button>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 tracking-tight">Update Status</h2>
              <p className="text-gray-500 text-xs mt-0.5">
                Select the next phase for {orderData.id}
              </p>
            </div>
          </div>

          {/* Status Selection List */}
          <div className="flex-1 overflow-y-auto min-h-0 p-6 space-y-3 scrollbar-thin scrollbar-thumb-gray-200">
            <div className="mb-6 p-4 bg-blue-50/50 rounded-2xl border border-blue-100 flex gap-3 items-start">
              <IoAlertCircleOutline className="text-blue-500 mt-0.5" size={18} />
              <p className="text-xs text-blue-700 font-medium leading-relaxed">
                Changing order status will notify the customer and trigger downstream laboratory
                workflows.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest pl-2 mb-3">
                AVAILABLE STATUSES
              </h3>
              {statusOptions.map((option) => {
                const isSelected = selectedStatus === option.label
                const isCurrentStatus = orderData.status === option.label

                return (
                  <button
                    key={option.label}
                    onClick={() => setSelectedStatus(option.label)}
                    className={cn(
                      'w-full p-4 rounded-xl border flex items-center justify-between transition-all group',
                      isSelected
                        ? 'bg-emerald-50 border-emerald-200 ring-4 ring-emerald-500/5 shadow-sm'
                        : 'bg-white border-gray-100 hover:border-emerald-200 hover:bg-gray-50/50 shadow-none border'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn('w-2.5 h-2.5 rounded-full', option.color.split(' ')[0])} />
                      <span
                        className={cn(
                          'text-sm font-semibold',
                          isSelected ? 'text-emerald-900' : 'text-gray-700'
                        )}
                      >
                        {option.label}
                        {isCurrentStatus && (
                          <span className="ml-2 text-[10px] font-bold text-[#15803d] bg-[#dcfce7] px-2.5 py-1 rounded-full border border-[#bbf7d0]">
                            Current
                          </span>
                        )}
                      </span>
                    </div>
                    {isSelected ? (
                      <IoRadioButtonOn className="text-emerald-500" size={20} />
                    ) : (
                      <IoRadioButtonOff
                        className="text-gray-300 group-hover:text-emerald-300"
                        size={20}
                      />
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Footer Actions for Update */}
          <div className="p-6 pt-4 border-t border-gray-50 flex gap-4 bg-neutral-50/50">
            <Button
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-100 font-semibold rounded-2xl h-12 transition-all active:scale-95 border-none"
              size="lg"
              onClick={handleConfirmUpdate}
              disabled={selectedStatus === orderData.status}
            >
              Confirm Update
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
