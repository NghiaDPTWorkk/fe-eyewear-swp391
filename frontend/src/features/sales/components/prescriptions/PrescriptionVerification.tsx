import { useState } from 'react'
import { toast } from 'react-hot-toast'
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
import { useSearchParams } from 'react-router-dom'

import { useSalesStaffAction } from '@/features/sales/hooks/useSalesStaffAction'
import { useSalesStaffOrderDetail } from '@/features/sales/hooks/useSalesStaffInvoices'
import { Button, Card, ConfirmationModal, Input } from '@/shared/components/ui-core'

interface PrescriptionVerificationProps {
  orderId: string
  onBack: () => void
  onActionSuccess?: () => void
}

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
        <p className="text-sm font-normal">Fetching prescription details...</p>
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
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span className="font-normal">Order Status:</span>
          {isApproved ? (
            <span className="px-3 py-1 bg-mint-50 text-mint-600 font-semibold rounded-full text-[10px] border border-mint-200 uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
              <IoCheckmark size={14} className="text-mint-600" /> VERIFIED
            </span>
          ) : isPending ? (
            <span className="px-3 py-1 bg-amber-50 text-amber-600 font-semibold rounded-full text-[10px] border border-amber-200 uppercase tracking-widest shadow-sm">
              PENDING
            </span>
          ) : (
            <span className="px-3 py-1 bg-white text-slate-400 font-semibold rounded-full text-[10px] border border-neutral-100 uppercase tracking-widest">
              {order.status}
            </span>
          )}
        </div>
        <div className="text-[11px] font-semibold text-amber-500 uppercase tracking-widest">
          <span className="text-amber-600">24</span> Pending
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
                <Button
                  onClick={() => setZoom((prev) => Math.min(prev + 10, 200))}
                  variant="ghost"
                  colorScheme="neutral"
                  className="p-1.5 hover:bg-white hover:shadow-sm rounded-lg text-slate-500 transition-all border border-transparent hover:border-slate-200"
                  title="Zoom In"
                >
                  <IoAdd size={18} />
                </Button>
                <span className="text-xs font-mono font-medium text-gray-500 self-center w-12 text-center bg-white px-2 py-0.5 rounded border border-gray-100">
                  {zoom}%
                </span>
                <Button
                  onClick={() => setZoom((prev) => Math.max(prev - 10, 50))}
                  variant="ghost"
                  colorScheme="neutral"
                  className="p-1.5 hover:bg-white hover:shadow-sm rounded-lg text-slate-500 transition-all border border-transparent hover:border-slate-200"
                  title="Zoom Out"
                >
                  <IoRemove size={18} />
                </Button>
                <div className="w-px h-5 bg-gray-300 mx-1 self-center" />
                <Button
                  onClick={() => setRotation((prev) => prev + 90)}
                  variant="ghost"
                  colorScheme="neutral"
                  className="p-1.5 hover:bg-white hover:shadow-sm rounded-lg text-slate-500 transition-all border border-transparent hover:border-slate-200"
                  title="Rotate"
                >
                  <IoRefresh size={18} />
                </Button>
              </div>
            </div>

            <div className="flex-1 bg-neutral-100/50 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] opacity-20" />
              <div className="absolute inset-0 flex items-center justify-center p-6 transition-all duration-300">
                {order.products?.[0]?.prescriptionImageUrl ? (
                  <img
                    src={order.products[0].prescriptionImageUrl}
                    alt="Prescription"
                    className="max-w-full max-h-full object-contain shadow-2xl rounded-sm transition-transform duration-200 ease-out"
                    style={{ transform: `rotate(${rotation}deg) scale(${zoom / 100})` }}
                  />
                ) : (
                  <div
                    className="w-full max-w-sm aspect-[3/4] bg-neutral-100 border-2 border-dashed border-neutral-200 rounded-3xl flex flex-col items-center justify-center p-12 text-center group transition-all"
                    style={{ transform: `rotate(${rotation}deg) scale(${zoom / 100})` }}
                  >
                    <div className="bg-neutral-200/50 px-6 py-12 rounded-2xl border border-neutral-200 shadow-inner">
                      <p className="text-slate-400 font-semibold text-2xl tracking-tighter opacity-50">
                        Prescription Scan
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Data Entry Form */}
          <Card className="p-0 border border-gray-200 overflow-hidden shadow-sm rounded-xl bg-white">
            <div className="px-4 py-3 bg-white border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white text-slate-300 flex items-center justify-center border border-slate-100 shadow-sm">
                  <IoInformationCircleOutline size={20} />
                </div>
                <div>
                  <h3 className="text-base font-medium text-slate-800 tracking-tight">
                    Transcription Data
                  </h3>
                  <p className="text-[10px] font-normal text-slate-400 mt-0.5 uppercase tracking-wide">
                    Prescription details from customer
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white space-y-4">
              {/* Right Eye (OD) */}
              <div className="bg-white p-4 rounded-xl border border-slate-100">
                <h4 className="font-medium text-[10px] text-mint-500 mb-5 flex items-center gap-2 uppercase tracking-[0.3em]">
                  <IoEyeOutline size={16} className="text-mint-400" /> RIGHT EYE (OD)
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-medium text-slate-400 uppercase tracking-[0.15em] pl-1 block text-center">
                      SPH
                    </label>
                    <Input
                      readOnly={isReadOnly}
                      defaultValue={parameters?.right?.SPH || '0.00'}
                      className="bg-white border-slate-200 focus:border-mint-500 focus:ring-mint-500/10 font-normal text-slate-700 text-center h-12 rounded-2xl shadow-sm transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-medium text-slate-400 uppercase tracking-[0.15em] pl-1 block text-center">
                      CYL
                    </label>
                    <Input
                      readOnly={isReadOnly}
                      defaultValue={parameters?.right?.CYL || '0.00'}
                      className="bg-white border-slate-200 focus:border-mint-500 focus:ring-mint-500/10 font-normal text-slate-700 text-center h-12 rounded-2xl shadow-sm transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-medium text-slate-400 uppercase tracking-[0.15em] pl-1 block text-center">
                      AXIS
                    </label>
                    <Input
                      readOnly={isReadOnly}
                      defaultValue={parameters?.right?.AXIS || '0'}
                      className="bg-white border-slate-200 focus:border-mint-500 focus:ring-mint-500/10 font-normal text-slate-700 text-center h-12 rounded-2xl shadow-sm transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-medium text-slate-400 uppercase tracking-[0.15em] pl-1 block text-center">
                      ADD
                    </label>
                    <Input
                      readOnly={isReadOnly}
                      defaultValue="-"
                      className="bg-white border-slate-200 focus:border-mint-500 focus:ring-mint-500/10 font-normal text-slate-700 text-center h-12 rounded-2xl shadow-sm transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Left Eye (OS) */}
              <div className="bg-white p-4 rounded-xl border border-slate-100">
                <h4 className="font-medium text-[10px] text-mint-400 mb-5 flex items-center gap-2 uppercase tracking-[0.3em] opacity-80">
                  <IoEyeOutline size={16} className="text-mint-400" /> LEFT EYE (OS)
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-medium text-slate-400 uppercase tracking-[0.15em] pl-1 block text-center">
                      SPH
                    </label>
                    <Input
                      readOnly={isReadOnly}
                      defaultValue={parameters?.left?.SPH || '0.00'}
                      className="bg-white border-neutral-200 font-normal text-slate-700 text-center h-12 rounded-2xl shadow-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-medium text-slate-400 uppercase tracking-[0.15em] pl-1 block text-center">
                      CYL
                    </label>
                    <Input
                      readOnly={isReadOnly}
                      defaultValue={parameters?.left?.CYL || '0.00'}
                      className="bg-white border-neutral-200 font-normal text-slate-700 text-center h-12 rounded-2xl shadow-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-medium text-slate-400 uppercase tracking-[0.15em] pl-1 block text-center">
                      AXIS
                    </label>
                    <Input
                      readOnly={isReadOnly}
                      defaultValue={parameters?.left?.AXIS || '0'}
                      className="bg-white border-neutral-200 font-normal text-slate-700 text-center h-12 rounded-2xl shadow-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-medium text-slate-400 uppercase tracking-[0.15em] pl-1 block text-center">
                      ADD
                    </label>
                    <Input
                      readOnly={isReadOnly}
                      defaultValue="-"
                      className="bg-white border-neutral-200 font-normal text-slate-700 text-center h-12 rounded-2xl shadow-sm"
                    />
                  </div>
                </div>
              </div>

              {/* PD & Notes Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start pt-2">
                {/* PD Section */}
                <div className="space-y-4">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] pl-1 block">
                    PUPILLARY DISTANCE (PD)
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <Input
                        readOnly={isReadOnly}
                        defaultValue={parameters?.PD || '31.5'}
                        className="font-semibold text-slate-700 text-center border-slate-200 h-14 pr-8 rounded-2xl focus:border-mint-500 focus:ring-mint-500/10 shadow-sm"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-100">
                        R
                      </span>
                    </div>
                    <div className="relative">
                      <Input
                        readOnly={isReadOnly}
                        defaultValue={parameters?.PD || '31.5'}
                        className="font-semibold text-slate-700 text-center border-slate-200 h-14 pr-8 rounded-2xl focus:border-mint-500 focus:ring-mint-500/10 shadow-sm"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-100">
                        L
                      </span>
                    </div>
                  </div>
                </div>

                {/* Notes Section */}
                <div className="space-y-4">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.15em] pl-1 block">
                    NOTES
                  </label>
                  <textarea
                    readOnly={isReadOnly}
                    className="w-full h-14 p-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-mint-500/10 focus:border-mint-500 text-sm font-medium text-slate-700 resize-none bg-white transition-all placeholder:text-slate-300 shadow-sm"
                    placeholder="Enter special instructions for lab technician..."
                  ></textarea>
                </div>
              </div>
            </div>

            {!isReadOnly && !isApproved && (
              <div className="bg-white p-6 flex gap-4 border-t border-slate-100">
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
                  colorScheme="neutral"
                  className="bg-white border-slate-200 text-slate-400 hover:text-red-600 hover:bg-red-50 hover:border-red-200 font-medium h-12 rounded-xl transition-all active:scale-95 shadow-none"
                  leftIcon={<IoClose size={20} />}
                >
                  Reject Order
                </Button>
              </div>
            )}
            {isApproved && (
              <div className="p-6 bg-white border-t border-neutral-50/50">
                <div className="bg-neutral-50/50 border border-neutral-100/50 rounded-[3.5rem] p-10 transition-all hover:bg-neutral-50 duration-500">
                  <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-[1.75rem] bg-mint-200/60 text-white flex items-center justify-center flex-shrink-0 shadow-lg shadow-mint-100/50 transition-transform hover:scale-105">
                        <IoCheckmark size={36} className="text-white stroke-[4]" />
                      </div>
                      <h3 className="text-2xl font-semibold text-mint-600 tracking-tight">
                        Verified and Approved
                      </h3>
                    </div>

                    <div className="max-w-[18rem] bg-white border border-neutral-100 rounded-[2rem] p-4 flex items-center gap-4 shadow-sm transition-all hover:shadow-md ml-[88px]">
                      <div className="w-12 h-12 rounded-2xl bg-neutral-50 flex items-center justify-center border border-neutral-100">
                        <IoPersonOutline className="text-slate-300" size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-[0.2em] mb-1">
                          Verified by
                        </p>
                        <p className="text-sm font-semibold text-slate-800 tracking-tight">
                          {order.assignStaff || 'Sales Staff'}
                        </p>
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
              <h3 className="font-medium text-slate-800 text-sm">Order Details</h3>
              <Button
                variant="ghost"
                colorScheme="neutral"
                className="text-slate-400 text-[10px] font-medium hover:text-mint-600 hover:bg-mint-50/50 transition-all uppercase tracking-widest px-2 h-7"
              >
                Modify
              </Button>
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
              <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
                <IoChatbubblesOutline className="text-slate-400" /> Communication
              </h3>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  colorScheme="neutral"
                  className="p-1.5 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <IoEllipsisHorizontal />
                </Button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-neutral-100">
              <Button className="flex-1 py-3 text-[10px] font-medium uppercase tracking-widest text-mint-600 border-b-2 border-mint-500 bg-white">
                Chat (2)
              </Button>
              <Button
                variant="ghost"
                colorScheme="neutral"
                className="flex-1 py-3 text-[10px] font-medium uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors bg-white hover:bg-slate-50"
              >
                Call
              </Button>
              <Button
                variant="ghost"
                colorScheme="neutral"
                className="flex-1 py-3 text-[10px] font-medium uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors bg-white hover:bg-slate-50"
              >
                History
              </Button>
            </div>

            {/* Chat View */}
            <div className="h-[240px] flex flex-col">
              <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-white">
                {/* Incoming Message */}
                <div className="flex gap-2 items-start max-w-[90%]">
                  <div className="w-6 h-6 rounded-full bg-slate-100 shrink-0 flex items-center justify-center text-[10px] font-bold text-slate-400 border border-slate-200 uppercase">
                    {(order.customerName || 'C').charAt(0)}
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
                    <div className="bg-mint-500 p-2.5 rounded-2xl rounded-tr-none text-xs text-white shadow-sm font-medium">
                      Checking now. Please upload a selfie holding a card for reference if possible.
                    </div>
                    <span className="text-[9px] text-gray-400 mr-1">10:48 AM</span>
                  </div>
                </div>
              </div>

              {/* Input Area */}
              <div className="p-3 border-t border-slate-100 bg-white">
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Type a message..."
                      className="w-full pl-4 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-mint-300 focus:ring-4 focus:ring-mint-500/5 transition-all"
                    />
                  </div>
                  <Button
                    variant="solid"
                    className="p-2.5 bg-mint-600 text-white rounded-xl hover:bg-mint-700 shadow-md shadow-mint-100 transition-all active:scale-95 border-none"
                  >
                    <IoSend size={14} className="text-white" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="p-3 bg-white border-t border-slate-100 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-mint-500 animate-pulse"></div>
                <span className="text-xs font-medium text-slate-400">Customer Online</span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  colorScheme="neutral"
                  className="p-1.5 rounded-full bg-white border border-slate-100 text-slate-400 hover:text-mint-600 hover:border-mint-200 shadow-sm"
                  title="Voice Call"
                >
                  <IoCallOutline />
                </Button>
                <Button
                  variant="ghost"
                  colorScheme="neutral"
                  className="p-1.5 rounded-full bg-white border border-slate-100 text-slate-400 hover:text-mint-600 hover:border-mint-200 shadow-sm"
                  title="Video Call"
                >
                  <IoVideocamOutline />
                </Button>
              </div>
            </div>
          </Card>

          {/* Laboratory Operations Channel */}
          <Card className="p-0 border border-gray-200 shadow-sm overflow-hidden rounded-xl bg-white">
            <div className="p-4 bg-white border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
                <IoConstructOutline className="text-slate-400" /> Lab Operations
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

            <div className="p-3 bg-white border-t border-slate-50 text-center">
              <Button
                variant="outline"
                colorScheme="neutral"
                className="text-xs font-medium text-slate-400 flex items-center justify-center gap-2 hover:text-mint-600 hover:border-mint-200 transition-all uppercase tracking-widest w-full py-2 bg-white"
              >
                <IoMailOutline size={16} /> Contact Lab Manager
              </Button>
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
