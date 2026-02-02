/* eslint-disable max-lines */
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  IoClose,
  IoCheckmarkCircle,
  IoCheckmark,
  IoArrowBackOutline,
  IoRadioButtonOn,
  IoRadioButtonOff,
  IoAlertCircleOutline
} from 'react-icons/io5'
import { Button } from '@/components'
import { cn } from '@/lib/utils'
import { useSalesStaffOrders } from '@/features/sales/hooks/useSalesStaffOrders'
import { useSalesStaffAction } from '@/features/sales/hooks/useSalesStaffAction'

import type { OrderDetail } from '@/features/sales/types'

interface OrderDetailsDrawerProps {
  isOpen: boolean
  onClose: () => void
  orderId: string | null
  onUpdate?: () => void
}

export const OrderDetailsDrawer: React.FC<OrderDetailsDrawerProps> = ({
  isOpen,
  onClose,
  orderId,
  onUpdate
}) => {
  const { fetchOrderDetail } = useSalesStaffOrders()
  const { approveInvoice, rejectInvoice, processing } = useSalesStaffAction()
  const [order, setOrder] = useState<OrderDetail | null>(null)

  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const [showRxVerify, setShowRxVerify] = useState(false)

  // Prevent body scroll when drawer is open
  useEffect(() => {
    let mounted = true
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      if (orderId) {
        fetchOrderDetail(orderId).then((data) => {
          if (data && mounted) setOrder(data)
        })
      }
    } else {
      document.body.style.overflow = 'unset'
      // Reset states when closed
    }
    return () => {
      mounted = false
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, orderId, fetchOrderDetail])

  const handleClose = () => {
    setShowRxVerify(false)
    setIsUpdatingStatus(false)
    onClose()
  }

  if (!isOpen) return null

  const isPrescription = order?.type?.includes('MANUFACTURING')
  const isPreOrder = order?.type?.includes('PRE-ORDER')
  const isApproved =
    ['APPROVED', 'VERIFIED', 'COMPLETED', 'DEPOSITED'].includes(order?.status || '') ||
    (isPrescription && ['VERIFIED'].includes(order?.status || ''))

  // Timeline Helper
  const getTimelineSteps = (status: string) => {
    const steps = [
      {
        label: 'Order Placed',
        time: order?.createdAt
          ? new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : '10:30 AM',
        status: 'completed'
      },
      {
        label: 'Payment Confirmed',
        time: order?.createdAt
          ? new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : '10:32 AM',
        status: [
          'DEPOSITED',
          'WAITING_ASSIGN',
          'PROCESSING',
          'COMPLETED',
          'APPROVED',
          'VERIFIED'
        ].includes(status)
          ? 'completed'
          : 'pending'
      },
      {
        label: 'In Production',
        time: order?.startedAt
          ? new Date(order.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : '',
        status: ['PROCESSING', 'COMPLETED', 'APPROVED', 'VERIFIED'].includes(status)
          ? 'completed'
          : status === 'WAITING_ASSIGN'
            ? 'current'
            : 'pending'
      },
      {
        label: 'Quality Check',
        time: '',
        status: ['COMPLETED', 'APPROVED', 'VERIFIED'].includes(status)
          ? 'completed'
          : status === 'PROCESSING'
            ? 'current'
            : 'pending'
      },
      {
        label: 'Ready to Ship',
        time: order?.completedAt
          ? new Date(order.completedAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            })
          : '',
        status: ['COMPLETED', 'APPROVED', 'VERIFIED'].includes(status) ? 'completed' : 'pending'
      }
    ]
    return steps
  }

  const timelineSteps = order ? getTimelineSteps(order.status) : []

  // Mock Prescription Data Extraction (Fallbacks)
  const lensParams = order?.products?.[0]?.lens?.parameters as any
  const rxData = {
    od: lensParams?.right || { sph: '+0.00', cyl: '0.00', axis: '0', add: '0.00' },
    os: lensParams?.left || { sph: '+0.00', cyl: '0.00', axis: '0', add: '0.00' },
    pd: lensParams?.PD || '64mm'
  }

  const handleApproveVerify = async () => {
    if (order?.invoiceId) {
      if (await approveInvoice(order.invoiceId)) {
        const updated = await fetchOrderDetail(order._id)
        if (updated) setOrder(updated)
        onUpdate?.()
        setShowRxVerify(false)
      }
    }
  }

  const handleRejectVerify = async () => {
    if (order?.invoiceId) {
      if (await rejectInvoice(order.invoiceId)) {
        const updated = await fetchOrderDetail(order._id)
        if (updated) setOrder(updated)
        onUpdate?.()
        setShowRxVerify(false)
      }
    }
  }

  const statusOptions = [
    { label: 'In Production', color: 'bg-[#dcfce7] text-[#15803d] border-[#bbf7d0]' },
    { label: 'Quality Check', color: 'bg-[#fef3c7] text-[#b45309] border-[#fde68a]' },
    { label: 'Ready to Ship', color: 'bg-[#dbeafe] text-[#1d4ed8] border-[#bfdbfe]' },
    { label: 'Shipped', color: 'bg-[#f3e8ff] text-[#7e22ce] border-[#e9d5ff]' },
    { label: 'Delivered', color: 'bg-[#f3f4f6] text-[#374151] border-[#e5e7eb]' },
    { label: 'On Hold', color: 'bg-[#fee2e2] text-[#b91c1c] border-[#fecaca]' }
  ]

  return createPortal(
    <div className="fixed inset-0 z-50 flex justify-end transition-opacity duration-300">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-[1px] transition-opacity"
        onClick={handleClose}
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 overflow-hidden">
        {/* Main Content Area (Absolute positioned) */}
        <div
          className={cn(
            'flex-1 flex flex-col min-h-0 transition-all duration-300 ease-in-out',
            isUpdatingStatus || showRxVerify
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
                    isPreOrder
                      ? 'bg-amber-50 text-amber-600 border border-amber-100'
                      : isPrescription
                        ? 'bg-blue-50 text-blue-600 border border-blue-100'
                        : 'bg-neutral-50 text-neutral-500 border border-neutral-100'
                  )}
                >
                  {isPrescription ? 'Prescription' : isPreOrder ? 'Pre-order' : 'Regular'} Order
                </span>
                <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-widest rounded-full border border-emerald-100 shadow-sm">
                  {order?.status}
                </span>
              </div>
              <h2 className="text-2xl font-semibold text-[#0f172a] tracking-tight">
                Order Details
              </h2>
              <p className="text-slate-400 text-sm font-medium mt-1">
                {order?.orderCode || orderId}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all ml-4"
            >
              <IoClose size={24} />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto min-h-0 px-6 py-2 space-y-8 scrollbar-thin scrollbar-thumb-gray-200">
            {/* Prescription Summary Section (Read Only) */}
            {isPrescription && (
              <div className="space-y-3 pt-2">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest">
                  Prescription Summary
                </h3>
                <div className="bg-emerald-50/30 border border-emerald-100/50 rounded-2xl overflow-hidden shadow-sm">
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
                          {rxData.od.sph}
                        </td>
                        <td className="py-2 px-1 text-center text-gray-600">{rxData.od.cyl}</td>
                        <td className="py-2 px-1 text-center text-gray-600">{rxData.od.axis}</td>
                        <td className="py-2 px-1 text-center text-gray-600">{rxData.od.add}</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-bold text-gray-700">OS (Left)</td>
                        <td className="py-2 px-1 text-center text-gray-600 font-medium">
                          {rxData.os.sph}
                        </td>
                        <td className="py-2 px-1 text-center text-gray-600">{rxData.os.cyl}</td>
                        <td className="py-2 px-1 text-center text-gray-600">{rxData.os.axis}</td>
                        <td className="py-2 px-1 text-center text-gray-600">{rxData.os.add}</td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="p-3 bg-white/50 border-t border-emerald-100/30 flex justify-between items-center text-[11px]">
                    <span className="text-gray-500 font-medium uppercase tracking-wider">
                      PD (Dist)
                    </span>
                    <span className="text-emerald-700 font-bold">{rxData.pd}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Prescription Warning (Business Rule) */}
            {isPrescription && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex gap-3 items-start animate-pulse">
                <IoAlertCircleOutline className="text-amber-500 shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="text-sm font-semibold text-amber-900">High Prescription Warning</p>
                  <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                    This order has SPH {'>'} 4.00. Please advise the customer to use high-index
                    lenses (1.67 or 1.74) for better weight and aesthetics.
                  </p>
                  <button
                    className="mt-2 text-xs font-semibold text-amber-600 hover:text-amber-700 underline underline-offset-2"
                    onClick={() => alert('Chat open')}
                  >
                    Send advice via Chat
                  </button>
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
                  <span className="font-semibold text-gray-900">{order?.customerName}</span>
                </div>
                <div className="flex justify-between items-center group">
                  <span className="text-gray-500 font-medium">Phone</span>
                  <span className="font-semibold text-gray-900">{order?.customerPhone}</span>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest">
                Order Items
              </h3>
              {order?.products.map((p, i) => (
                <div
                  key={i}
                  className="bg-white border border-gray-100 p-4 rounded-2xl flex gap-4 items-center shadow-sm"
                >
                  <div className="w-16 h-16 bg-gray-50 rounded-xl shrink-0 flex items-center justify-center border border-gray-100 overflow-hidden">
                    {/* Placeholder Image */}
                    <div className="text-xs text-gray-300">Img</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 truncate">{p.product.sku}</h4>
                    <p className="text-xs text-gray-500 font-medium mt-0.5">
                      Qty: {p.quantity} - {p.product.product_name}
                    </p>
                  </div>
                  <span className="font-semibold text-gray-900">
                    ${p.product.pricePerUnit.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Order Timeline */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest">
                Order Timeline
              </h3>
              <div className="relative pl-2 space-y-6">
                <div className="absolute left-[19px] top-3 bottom-1 w-[2px] bg-gray-100" />
                {timelineSteps.map((step, index) => {
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
                          {step.time && (
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
          <div className="p-6 pt-4 border-t border-gray-50 flex flex-col gap-3 bg-white">
            <Button
              className={cn(
                'w-full h-14 font-semibold rounded-2xl transition-all active:scale-[0.98] border-none text-sm group shadow-lg',
                isPrescription && !isApproved
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-100'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-100'
              )}
              size="lg"
              onClick={() => {
                if (isPrescription && !isApproved) {
                  setShowRxVerify(true)
                } else {
                  // Navigate to details page logic if needed, or just close
                  onClose()
                  window.location.href = `/salestaff/orders/${order?._id}`
                }
              }}
            >
              {isPrescription && !isApproved ? '✓ Verify Prescription' : 'View Full Order Details'}
            </Button>

            {/* Update Status Button (Secondary) */}
            <Button
              variant="outline"
              className="w-full h-12 font-semibold rounded-2xl bg-white border-gray-200 hover:bg-gray-50 text-gray-700"
              onClick={() => setIsUpdatingStatus(true)}
            >
              Update Status
            </Button>
          </div>
        </div>

        {/* Rx Verify View (Slide in from right) */}
        {isPrescription && showRxVerify && (
          <div
            className={cn(
              'absolute inset-0 flex flex-col bg-white transition-all duration-300 ease-in-out z-20',
              showRxVerify
                ? 'translate-x-0 opacity-100'
                : 'translate-x-full opacity-0 pointer-events-none'
            )}
          >
            <div className="p-6 pb-4 border-b border-neutral-50 flex items-center gap-4">
              <Button
                onClick={() => setShowRxVerify(false)}
                className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all cursor-pointer group"
              >
                <IoArrowBackOutline
                  size={22}
                  className="group-hover:-translate-x-0.5 transition-transform"
                />
              </Button>
              <h2 className="text-lg font-semibold text-gray-900 tracking-tight">
                Verify Prescription
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {(() => {
                const rxProduct = order?.products.find((p) => p.lens)
                const lens = rxProduct?.lens

                if (!order || !lens) {
                  return (
                    <div className="p-4 text-center text-gray-500">
                      No prescription data available.
                    </div>
                  )
                }

                // Cast parameters to any to avoid strict type issues with SPH vs sph
                const params = lens.parameters as any
                const left = params.left || { SPH: 0, CYL: 0, AXIS: 0 }
                const right = params.right || { SPH: 0, CYL: 0, AXIS: 0 }
                const PD = params.PD || params.pd || 0

                const isVerified = order.status === 'VERIFIED' || order.status === 'APPROVED'

                return (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold text-gray-900">Rx Verification</h2>
                      <span
                        className={cn(
                          'px-3 py-1 rounded-full text-xs font-semibold border',
                          isVerified
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                            : 'bg-amber-50 text-amber-600 border-amber-100'
                        )}
                      >
                        {isVerified ? 'VERIFIED' : 'UNVERIFIED'}
                      </span>
                    </div>

                    {/* Parameters Grid */}
                    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden text-sm">
                      {/* Header Row */}
                      <div className="grid grid-cols-4 bg-gray-50/50 border-b border-gray-100 py-2 px-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">
                        <div className="text-left pl-2">Eye</div>
                        <div>SPH</div>
                        <div>CYL</div>
                        <div>AXIS</div>
                      </div>

                      {/* Right Eye (OD) */}
                      <div className="grid grid-cols-4 py-3 px-4 border-b border-gray-50 items-center text-center hover:bg-gray-50 transition-colors">
                        <div className="font-bold text-gray-900 text-left pl-2">OD (Right)</div>
                        <div className="font-mono font-medium text-gray-600">
                          {Number(right.SPH) > 0
                            ? `+${Number(right.SPH).toFixed(2)}`
                            : Number(right.SPH).toFixed(2)}
                        </div>
                        <div className="font-mono font-medium text-gray-600">
                          {Number(right.CYL) > 0
                            ? `+${Number(right.CYL).toFixed(2)}`
                            : Number(right.CYL).toFixed(2)}
                        </div>
                        <div className="font-mono font-medium text-gray-600">{right.AXIS}</div>
                      </div>

                      {/* Left Eye (OS) */}
                      <div className="grid grid-cols-4 py-3 px-4 items-center text-center hover:bg-gray-50 transition-colors">
                        <div className="font-bold text-gray-900 text-left pl-2">OS (Left)</div>
                        <div className="font-mono font-medium text-gray-600">
                          {Number(left.SPH) > 0
                            ? `+${Number(left.SPH).toFixed(2)}`
                            : Number(left.SPH).toFixed(2)}
                        </div>
                        <div className="font-mono font-medium text-gray-600">
                          {Number(left.CYL) > 0
                            ? `+${Number(left.CYL).toFixed(2)}`
                            : Number(left.CYL).toFixed(2)}
                        </div>
                        <div className="font-mono font-medium text-gray-600">{left.AXIS}</div>
                      </div>

                      {/* PD */}
                      <div className="flex justify-between items-center px-6 py-3 border-t border-gray-100 bg-gray-50/30">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          PD (DIST)
                        </span>
                        <span className="text-sm font-bold text-gray-900 font-mono">{PD}mm</span>
                      </div>
                    </div>

                    {/* Actions */}
                    {!isVerified ? (
                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                        <Button
                          onClick={handleRejectVerify}
                          disabled={processing}
                          variant="outline"
                          className="hover:bg-red-50 hover:text-red-600 border-gray-200"
                          leftIcon={<IoClose size={20} />}
                        >
                          Reject
                        </Button>
                        <Button
                          onClick={handleApproveVerify}
                          disabled={processing}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white"
                          leftIcon={<IoCheckmark size={20} />}
                        >
                          Approve & Verify
                        </Button>
                      </div>
                    ) : (
                      <div className="p-5 bg-emerald-50 rounded-xl border border-emerald-100 flex flex-col items-center gap-2 text-emerald-700">
                        <div className="bg-emerald-500 text-white rounded-full p-1">
                          <IoCheckmark size={20} />
                        </div>
                        <div className="text-sm font-bold uppercase tracking-tight">
                          Verified by Staff
                        </div>
                        <div className="text-[11px] font-medium opacity-80 italic">
                          Process completed on{' '}
                          {order.completedAt
                            ? new Date(order.completedAt).toLocaleString()
                            : new Date().toLocaleDateString()}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })()}
            </div>
          </div>
        )}

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
              <IoArrowBackOutline
                size={22}
                className="group-hover:-translate-x-0.5 transition-transform"
              />
            </button>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 tracking-tight">Update Status</h2>
              <p className="text-gray-500 text-xs mt-0.5">Select the next phase</p>
            </div>
          </div>

          {/* Status Selection List */}
          <div className="flex-1 overflow-y-auto min-h-0 p-6 space-y-3 scrollbar-thin scrollbar-thumb-gray-200">
            {/* ... Status options list ... */}
            <div className="space-y-2">
              {statusOptions.map((option) => (
                <button
                  key={option.label}
                  onClick={() => setSelectedStatus(option.label)}
                  className={cn(
                    'w-full p-4 rounded-xl border flex items-center justify-between transition-all group',
                    selectedStatus === option.label
                      ? 'bg-emerald-50 border-emerald-200 ring-4 ring-emerald-500/5 shadow-sm'
                      : 'bg-white border-gray-100 hover:border-emerald-200 hover:bg-gray-50/50 shadow-none border'
                  )}
                >
                  <span
                    className={cn(
                      'text-sm font-semibold',
                      selectedStatus === option.label ? 'text-emerald-900' : 'text-gray-700'
                    )}
                  >
                    {option.label}
                  </span>
                  {selectedStatus === option.label ? (
                    <IoRadioButtonOn className="text-emerald-500" size={20} />
                  ) : (
                    <IoRadioButtonOff className="text-gray-300" size={20} />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 pt-4 border-t border-gray-50 flex gap-4 bg-neutral-50/50">
            <Button
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white"
              size="lg"
              onClick={() => {
                alert('Status update logic would go here')
                setIsUpdatingStatus(false)
              }}
            >
              Confirm Update
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
