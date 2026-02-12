import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { IoCheckmark, IoClose } from 'react-icons/io5'
import { useSearchParams } from 'react-router-dom'

import { useSalesStaffAction } from '@/features/sales/hooks/useSalesStaffAction'
import { useSalesStaffOrderDetail } from '@/features/sales/hooks/useSalesStaffInvoices'
import { Button, ConfirmationModal } from '@/shared/components/ui-core'

import { ImageViewer } from './ImageViewer'
import { TranscriptionForm } from './TranscriptionForm'
import { OrderDetailsSidebar } from './OrderDetailsSidebar'
import { CommunicationHub } from './CommunicationHub'
import { LabOperationsTimeline } from './LabOperationsTimeline'

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

  const isApproved = [
    'APPROVED',
    'VERIFIED',
    'COMPLETED',
    'MAKING',
    'PACKAGING',
    'DELIVERING',
    'DELIVERED'
  ].includes(order.status?.toUpperCase())
  const isPending = ['WAITING_ASSIGN', 'PENDING', 'DEPOSITED', 'WAITING_VERIFY'].includes(
    order.status?.toUpperCase()
  )
  const isRejected = ['REJECTED', 'CANCELED', 'REJECT'].includes(order.status?.toUpperCase())

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
          ) : isRejected ? (
            <span className="px-3 py-1 bg-rose-50 text-rose-600 font-semibold rounded-full text-[10px] border border-rose-200 uppercase tracking-widest shadow-sm">
              <IoClose size={14} className="text-rose-600 inline mr-1" /> REJECTED
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
          <ImageViewer
            imageUrl={order.products?.[0]?.prescriptionImageUrl}
            zoom={zoom}
            rotation={rotation}
            setZoom={setZoom}
            setRotation={setRotation}
          />

          <TranscriptionForm
            parameters={parameters}
            isReadOnly={isReadOnly}
            isApproved={isApproved}
            isRejected={isRejected}
            processing={processing}
            handleApprove={handleApprove}
            handleReject={handleReject}
            assignStaff={order.assignStaff || undefined}
          />
        </div>

        {/* Right Column: Information & Operations (Sidebar) */}
        <div className="space-y-5">
          <OrderDetailsSidebar order={order} />
          <CommunicationHub customerName={order.customerName || undefined} />
          <LabOperationsTimeline />
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
