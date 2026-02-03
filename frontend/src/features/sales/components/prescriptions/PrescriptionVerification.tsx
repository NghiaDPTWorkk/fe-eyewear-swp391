/* eslint-disable max-lines */
import { useState } from 'react'
import {
  IoInformationCircleOutline,
  IoCheckmark,
  IoClose,
  IoAdd,
  IoRemove,
  IoRefresh,
  IoEyeOutline,
  IoCalendarOutline,
  IoPersonOutline,
  IoMailOutline,
  IoGlassesOutline,
  IoConstructOutline,
  IoCallOutline,
  IoChatbubblesOutline,
  IoSend,
  IoVideocamOutline,
  IoEllipsisHorizontal
} from 'react-icons/io5'
import { Card, Button, Input } from '@/components'
import { useSalesStaffAction } from '@/features/sales/hooks/useSalesStaffAction'
import { useSalesStaffOrderDetail } from '@/features/sales/hooks/useSalesStaffOrders'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'react-hot-toast'

interface PrescriptionVerificationProps {
  orderId: string
  onBack: () => void
  onActionSuccess?: () => void
}

import ConfirmationModal from '@/shared/components/ui/ConfirmationModal'

export default function PrescriptionVerification({
  orderId,
  onBack,
  onActionSuccess
}: PrescriptionVerificationProps) {
  const { approveOrder, rejectOrder, processing } = useSalesStaffAction()
  const [searchParams] = useSearchParams()
  const mode = searchParams.get('mode')
  const isReadOnly = mode === 'readonly'

  const { data: order, isLoading: loading, refetch } = useSalesStaffOrderDetail(orderId)
  const [rotation, setRotation] = useState(0)
  const [zoom, setZoom] = useState(100)

  // Confirmation Modal State
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [confirmAction, setConfirmAction] = useState<'approve' | 'reject' | null>(null)

  const handleApprove = () => {
    setConfirmAction('approve')
    setIsConfirmOpen(true)
  }

  const handleReject = () => {
    setConfirmAction('reject')
    setIsConfirmOpen(true)
  }

  const handleConfirm = async () => {
    let success = false
    if (confirmAction === 'approve') {
      success = await approveOrder(orderId)
    } else if (confirmAction === 'reject') {
      success = await rejectOrder(orderId, order?.invoiceId)
    }

    if (success) {
      if (confirmAction === 'approve') toast.success('Prescription approved')
      if (confirmAction === 'reject') toast.success('Prescription rejected')

      setIsConfirmOpen(false)
      refetch()
      onActionSuccess?.()
    }
  }

  if (loading) {
    return (
      <div className="p-20 flex flex-col items-center justify-center text-gray-400">
        <div className="w-10 h-10 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium">Fetching prescription details...</p>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="p-20 text-center">
        <p className="text-gray-500">Order not found.</p>
        <Button onClick={onBack} className="mt-4">
          Go Back
        </Button>
      </div>
    )
  }

  const isApproved = ['APPROVED', 'VERIFIED', 'COMPLETED'].includes(order.status)
  const isPending = ['WAITING_ASSIGN', 'PENDING', 'DEPOSITED'].includes(order.status)
  const lens = order.products?.[0]?.lens
  const parameters = lens?.parameters

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
      {/* Status Badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="font-medium">Order Status:</span>
          {isApproved ? (
            <span className="px-3 py-1.5 bg-emerald-50 text-emerald-600 font-medium rounded-lg text-xs border border-emerald-200 uppercase tracking-wide flex items-center gap-1.5">
              <IoCheckmark size={14} /> Verified
            </span>
          ) : isPending ? (
            <span className="px-3 py-1.5 bg-amber-50 text-amber-600 font-medium rounded-lg text-xs border border-amber-200 uppercase tracking-wide">
              Pending Verification
            </span>
          ) : (
            <span className="px-3 py-1.5 bg-orange-50 text-orange-600 font-medium rounded-lg text-xs border border-orange-200 uppercase tracking-wide">
              {order.status}
            </span>
          )}
        </div>
        <div className="text-sm text-gray-500">
          <span className="font-medium text-amber-600">24</span> Pending
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column (Main Content): Image & Data Entry */}
        <div className="xl:col-span-2 space-y-4">
          {/* Image Viewer */}
          <Card className="p-0 overflow-hidden h-[500px] flex flex-col border border-gray-200 shadow-sm rounded-xl bg-white">
            <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200 bg-white">
              <h3 className="font-medium text-gray-700 text-sm flex items-center gap-2">
                <IoEyeOutline /> PRESCRIPTION SCAN
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setZoom((prev) => Math.min(prev + 10, 200))}
                  className="p-1.5 hover:bg-white hover:shadow-sm rounded-lg text-gray-500 transition-all border border-transparent hover:border-gray-200"
                  title="Zoom In"
                >
                  <IoAdd size={18} />
                </button>
                <span className="text-xs font-mono font-medium text-gray-500 self-center w-12 text-center bg-white px-2 py-0.5 rounded border border-gray-100">
                  {zoom}%
                </span>
                <button
                  onClick={() => setZoom((prev) => Math.max(prev - 10, 50))}
                  className="p-1.5 hover:bg-white hover:shadow-sm rounded-lg text-gray-500 transition-all border border-transparent hover:border-gray-200"
                  title="Zoom Out"
                >
                  <IoRemove size={18} />
                </button>
                <div className="w-px h-5 bg-gray-300 mx-1 self-center" />
                <button
                  onClick={() => setRotation((prev) => prev + 90)}
                  className="p-1.5 hover:bg-white hover:shadow-sm rounded-lg text-gray-500 transition-all border border-transparent hover:border-gray-200"
                  title="Rotate"
                >
                  <IoRefresh size={18} />
                </button>
              </div>
            </div>

            <div className="flex-1 bg-neutral-100/50 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] opacity-20" />
              <div className="absolute inset-0 flex items-center justify-center p-6">
                <img
                  src={
                    order.products?.[0]?.prescriptionImageUrl ||
                    'https://placehold.co/600x800/png?text=Prescription+Scan'
                  }
                  alt="Prescription"
                  className="max-w-full max-h-full object-contain shadow-2xl rounded-sm transition-transform duration-200 ease-out"
                  style={{ transform: `rotate(${rotation}deg) scale(${zoom / 100})` }}
                />
              </div>
            </div>
          </Card>

          {/* Data Entry Form */}
          <Card className="p-0 border border-gray-200 overflow-hidden shadow-sm rounded-xl bg-white">
            <div className="px-4 py-3 bg-white border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-mint-50 text-mint-600 flex items-center justify-center border border-mint-100/50 shadow-sm">
                  <IoInformationCircleOutline size={20} />
                </div>
                <div>
                  <h3 className="text-base font-medium text-gray-900 leading-tight">
                    Transcription Data
                  </h3>
                  <p className="text-xs font-normal text-gray-400 mt-0.5">
                    {isReadOnly
                      ? 'Prescription details from customer'
                      : 'Accurately transcribe prescription details'}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white space-y-4">
              {/* Right Eye (OD) */}
              <div className="bg-mint-50/20 p-4 rounded-xl border border-mint-100/50">
                <h4 className="font-medium text-sm text-mint-800 mb-4 flex items-center gap-2">
                  <IoEyeOutline size={18} /> Right Eye (OD)
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-mint-700 uppercase tracking-wide pl-1">
                      SPH
                    </label>
                    <Input
                      readOnly={isReadOnly}
                      defaultValue={parameters?.right?.SPH || '0.00'}
                      className="bg-white border-mint-200 focus:border-mint-500 font-medium text-mint-900 text-center h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-semibold text-mint-700 uppercase tracking-widest pl-1">
                      CYL
                    </label>
                    <Input
                      readOnly={isReadOnly}
                      defaultValue={parameters?.right?.CYL || '0.00'}
                      className="bg-white border-mint-200 focus:border-mint-500 font-semibold text-mint-900 text-center h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-semibold text-mint-700 uppercase tracking-widest pl-1">
                      AXIS
                    </label>
                    <Input
                      readOnly={isReadOnly}
                      defaultValue={parameters?.right?.AXIS || '0'}
                      className="bg-white border-mint-200 focus:border-mint-500 font-semibold text-mint-900 text-center h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-semibold text-mint-700 uppercase tracking-widest pl-1">
                      ADD
                    </label>
                    <Input
                      readOnly={isReadOnly}
                      defaultValue="-"
                      className="bg-white border-mint-200 focus:border-mint-500 font-semibold text-mint-900 text-center h-11"
                    />
                  </div>
                </div>
              </div>

              {/* Left Eye (OS) */}
              <div className="bg-neutral-50/50 p-4 rounded-xl border border-neutral-100">
                <h4 className="font-medium text-sm text-neutral-700 mb-4 flex items-center gap-2">
                  <IoEyeOutline size={18} /> Left Eye (OS)
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-widest pl-1">
                      SPH
                    </label>
                    <Input
                      readOnly={isReadOnly}
                      defaultValue={parameters?.left?.SPH || '0.00'}
                      className="bg-white border-neutral-200 font-semibold text-neutral-900 text-center h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-widest pl-1">
                      CYL
                    </label>
                    <Input
                      readOnly={isReadOnly}
                      defaultValue={parameters?.left?.CYL || '0.00'}
                      className="bg-white border-neutral-200 font-semibold text-neutral-900 text-center h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-widest pl-1">
                      AXIS
                    </label>
                    <Input
                      readOnly={isReadOnly}
                      defaultValue={parameters?.left?.AXIS || '0'}
                      className="bg-white border-neutral-200 font-semibold text-neutral-900 text-center h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-widest pl-1">
                      ADD
                    </label>
                    <Input
                      readOnly={isReadOnly}
                      defaultValue="-"
                      className="bg-white border-neutral-200 font-semibold text-neutral-900 text-center h-11"
                    />
                  </div>
                </div>
              </div>

              {/* PD & Notes Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start pt-2">
                {/* PD Section */}
                <div className="space-y-4">
                  <label className="text-xs font-semibold text-neutral-500 uppercase tracking-widest pl-1 block">
                    Pupillary Distance (PD)
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <Input
                        readOnly={isReadOnly}
                        defaultValue={parameters?.PD || '31.5'}
                        className="font-semibold text-center border-neutral-200 h-12 pr-8 rounded-xl focus:border-mint-500 focus:ring-mint-500/10"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-mint-600 bg-mint-50 px-1.5 py-0.5 rounded-md border border-mint-100">
                        R
                      </span>
                    </div>
                    <div className="relative">
                      <Input
                        readOnly={isReadOnly}
                        defaultValue={parameters?.PD || '31.5'}
                        className="font-semibold text-center border-neutral-200 h-12 pr-8 rounded-xl focus:border-mint-500 focus:ring-mint-500/10"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-mint-600 bg-mint-50 px-1.5 py-0.5 rounded-md border border-mint-100">
                        L
                      </span>
                    </div>
                  </div>
                </div>

                {/* Notes Section */}
                <div className="space-y-4">
                  <label className="text-xs font-semibold text-neutral-500 uppercase tracking-widest pl-1 block">
                    Notes
                  </label>
                  <textarea
                    readOnly={isReadOnly}
                    className="w-full h-12 p-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-4 focus:ring-mint-500/10 focus:border-mint-500 text-sm font-medium resize-none bg-neutral-50/20 transition-all placeholder:text-neutral-300"
                    placeholder="Enter special instructions for lab technician..."
                  ></textarea>
                </div>
              </div>
            </div>

            {!isReadOnly && !isApproved && (
              <div className="bg-neutral-50/80 p-6 flex gap-4 border-t border-neutral-100">
                <Button
                  isFullWidth
                  onClick={handleApprove}
                  isLoading={processing}
                  className="bg-mint-600 hover:bg-mint-700 text-white font-medium h-12 rounded-xl shadow-md shadow-mint-100 transition-all active:scale-95 border-none"
                  leftIcon={<IoCheckmark size={20} />}
                >
                  Verify & Submit to Lab
                </Button>
                <Button
                  isFullWidth
                  onClick={handleReject}
                  isLoading={processing}
                  variant="outline"
                  className="bg-white border-neutral-200 text-neutral-600 hover:text-red-600 hover:bg-red-50 hover:border-red-300 font-medium h-12 rounded-xl transition-all active:scale-95"
                  leftIcon={<IoClose size={20} />}
                >
                  Reject Order
                </Button>
              </div>
            )}
            {isApproved && (
              <div className="p-6 bg-white border-t border-gray-200">
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-2xl p-5 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 shadow-md">
                      <IoCheckmark size={24} className="font-bold" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <h3 className="text-lg font-bold text-emerald-900">
                          ✓ Verified and Approved
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 gap-3">
                        {/* Verified By */}
                        <div className="flex items-center gap-3 bg-white/60 rounded-lg p-3 border border-emerald-100">
                          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                            <IoPersonOutline className="text-emerald-600" size={16} />
                          </div>
                          <div>
                            <p className="text-xs text-emerald-600 font-medium">Verified by</p>
                            <p className="text-sm font-semibold text-emerald-900">
                              {order.assignStaff || 'Sales Staff'}
                            </p>
                          </div>
                        </div>

                        {/* Completion Time */}
                        {order.completedAt && (
                          <div className="flex items-center gap-3 bg-white/60 rounded-lg p-3 border border-emerald-100">
                            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                              <IoCalendarOutline className="text-emerald-600" size={16} />
                            </div>
                            <div>
                              <p className="text-xs text-emerald-600 font-medium">Completed on</p>
                              <p className="text-sm font-semibold text-emerald-900">
                                {new Date(order.completedAt).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}{' '}
                                at{' '}
                                {new Date(order.completedAt).toLocaleTimeString('en-US', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Right Column: Information & Operations (Sidebar) */}
        <div className="space-y-5">
          {/* Order Details Card */}
          <Card className="p-5 border border-gray-200 shadow-sm rounded-xl bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-gray-900 text-sm">Order Details</h3>
              <button className="text-mint-600 text-xs font-medium hover:underline">Edit</button>
            </div>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                  <IoPersonOutline className="text-gray-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Customer</p>
                  <p className="text-sm font-medium text-gray-900">{order.customerName || 'N/A'}</p>
                  <p className="text-[10px] text-gray-400">{order.customerPhone || 'N/A'}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                  <IoGlassesOutline className="text-gray-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Product</p>
                  <p className="text-sm font-medium text-gray-900">
                    {order.products?.[0]?.product?.product_name || 'N/A'}
                  </p>
                  <p className="text-[10px] text-gray-400">
                    SKU: {order.products?.[0]?.product?.sku || 'N/A'}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                  <IoCalendarOutline className="text-gray-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Timeline</p>
                  <p className="text-sm font-medium text-gray-900">
                    {order.createdAt ? new Date(order.createdAt).toLocaleString() : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Customer Communication Hub */}
          <Card className="p-0 border border-gray-200 shadow-sm overflow-hidden bg-white rounded-xl">
            <div className="p-4 bg-white border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-medium text-gray-900 text-sm flex items-center gap-2">
                <IoChatbubblesOutline className="text-mint-500" /> Communication
              </h3>
              <div className="flex gap-1">
                <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                  <IoEllipsisHorizontal />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-100">
              <button className="flex-1 py-2.5 text-xs font-medium text-mint-600 border-b-2 border-mint-500 bg-mint-50/30">
                Chat (2)
              </button>
              <button className="flex-1 py-2.5 text-xs font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50">
                Call
              </button>
              <button className="flex-1 py-2.5 text-xs font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50">
                History
              </button>
            </div>

            {/* Chat View */}
            <div className="h-[240px] flex flex-col">
              <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50/50">
                {/* Incoming Message */}
                <div className="flex gap-2 items-start max-w-[90%]">
                  <div className="w-6 h-6 rounded-full bg-gray-200 shrink-0 overflow-hidden">
                    <img
                      src="https://i.pravatar.cc/100?img=12"
                      alt="Customer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="bg-white p-2.5 rounded-2xl rounded-tl-none border border-gray-200 shadow-sm text-xs text-gray-600">
                      Hi, I think I might have entered my PD wrong. Can you check?
                    </div>
                    <span className="text-[9px] text-gray-400 ml-1">10:45 AM</span>
                  </div>
                </div>

                {/* Outgoing Message */}
                <div className="flex gap-2 items-start max-w-[90%] ml-auto flex-row-reverse">
                  <div className="w-6 h-6 rounded-full bg-mint-100 shrink-0 flex items-center justify-center text-[10px] font-semibold text-mint-600">
                    You
                  </div>
                  <div className="text-right">
                    <div className="bg-mint-500 p-2.5 rounded-2xl rounded-tr-none text-xs text-white shadow-sm">
                      Checking now. Please upload a selfie holding a card for reference if possible.
                    </div>
                    <span className="text-[9px] text-gray-400 mr-1">10:48 AM</span>
                  </div>
                </div>
              </div>

              {/* Input Area */}
              <div className="p-3 border-t border-gray-100 bg-white">
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Type a message..."
                      className="w-full pl-3 pr-3 py-2 rounded-full border border-gray-200 text-xs focus:outline-none focus:border-mint-300 focus:ring-2 focus:ring-mint-100 transition-all"
                    />
                  </div>
                  <button className="p-2 bg-mint-500 text-white rounded-full hover:bg-mint-600 shadow-sm transition-transform active:scale-95">
                    <IoSend size={14} />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-mint-500 animate-pulse"></div>
                <span className="text-xs font-medium text-gray-600">Customer Online</span>
              </div>
              <div className="flex gap-2">
                <button
                  className="p-1.5 rounded-full bg-white border border-gray-200 text-gray-600 hover:text-mint-600 hover:border-mint-200 shadow-sm"
                  title="Voice Call"
                >
                  <IoCallOutline />
                </button>
                <button
                  className="p-1.5 rounded-full bg-white border border-gray-200 text-gray-600 hover:text-blue-600 hover:border-blue-200 shadow-sm"
                  title="Video Call"
                >
                  <IoVideocamOutline />
                </button>
              </div>
            </div>
          </Card>

          {/* Laboratory Operations Channel */}
          <Card className="p-0 border border-gray-200 shadow-sm overflow-hidden rounded-xl bg-white">
            <div className="p-4 bg-mint-50/50 border-b border-mint-100 flex justify-between items-center">
              <h3 className="font-medium text-mint-900 text-sm flex items-center gap-2">
                <IoConstructOutline /> Lab Operations
              </h3>
              <span className="w-2 h-2 bg-mint-500 rounded-full animate-pulse"></span>
            </div>

            <div className="p-4 space-y-4">
              {/* Status Timeline */}
              <div className="relative border-l border-gray-200 ml-1.5 space-y-5 py-2">
                <div className="pl-4 relative">
                  <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-gray-200 border-2 border-white"></div>
                  <p className="text-xs text-gray-500">Technician Review</p>
                  <p className="text-[10px] text-gray-400">Pending assignment</p>
                </div>
                <div className="pl-4 relative">
                  <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-mint-500 border-2 border-white shadow-sm ring-2 ring-mint-50"></div>
                  <p className="text-xs font-medium text-gray-800">Data Transcription</p>
                  <p className="text-[10px] text-gray-500">Started 5m ago by You</p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-gray-50 border-t border-gray-100 text-center">
              <button className="text-xs font-medium text-mint-600 flex items-center justify-center gap-1 hover:underline">
                <IoMailOutline /> Contact Lab Manager
              </button>
            </div>
          </Card>
        </div>
      </div>
      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirm}
        title={confirmAction === 'approve' ? 'Approve Prescription' : 'Reject Prescription'}
        message={
          confirmAction === 'approve'
            ? 'Are you sure you want to approve this prescription? This will move the order to the next stage.'
            : 'Are you sure you want to reject this prescription? This action cannot be undone and will reject the associated invoice.'
        }
        confirmText={confirmAction === 'approve' ? 'Approve' : 'Reject'}
        type={confirmAction === 'approve' ? 'info' : 'danger'}
        isLoading={processing}
      />
    </div>
  )
}
