import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { IoCheckmark, IoClose } from 'react-icons/io5'
import { useSearchParams } from 'react-router-dom'

import { useSalesStaffAction } from '@/features/sales/hooks/useSalesStaffAction'
import { useSalesStaffOrderDetail } from '@/features/sales/hooks/useSalesStaffInvoices'
import { useProfile } from '@/features/staff/hooks/useProfile'
import { Button, ConfirmationModal } from '@/shared/components/ui-core'

import { ImageViewer } from './ImageViewer'
import { TranscriptionForm } from './TranscriptionForm'
import { OrderDetailsSidebar } from './OrderDetailsSidebar'
import { CommunicationHub } from './CommunicationHub'
import { LabOperationsTimeline } from './LabOperationsTimeline'
import { RejectionModal } from '../common/RejectionModal'

interface PrescriptionParameters {
  left: { SPH: string | number; CYL: string | number; AXIS: string | number; ADD: string | number }
  right: { SPH: string | number; CYL: string | number; AXIS: string | number; ADD: string | number }
  PD: string | number
  [key: string]: any
}

interface PrescriptionVerificationProps {
  orderId: string
  onBack: () => void
  onActionSuccess?: () => void
}

const formatDate = (dateString?: string) => {
  if (!dateString) return ''
  try {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  } catch {
    return dateString
  }
}

export default function PrescriptionVerification({
  orderId,
  onBack,
  onActionSuccess
}: PrescriptionVerificationProps) {
  const { approveOrder, rejectOrder, processing } = useSalesStaffAction()
  const { data: profileData } = useProfile()
  const [searchParams] = useSearchParams()
  const mode = searchParams.get('mode')
  const isReadOnly = mode === 'readonly'

  const { data: order, isLoading: loading, refetch } = useSalesStaffOrderDetail(orderId)
  const [rotation, setRotation] = useState(0)
  const [zoom, setZoom] = useState(100)

  // Prescription Parameters State
  const [localParameters, setLocalParameters] = useState<PrescriptionParameters | null>(null)

  // Confirmation Modal State
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [confirmAction, setConfirmAction] = useState<'approve' | 'reject' | null>(null)

  const handleApprove = () => {
    // Basic validation before opening modal
    const params = localParameters || parameters
    if (params) {
      if (
        (params.right?.SPH === '' || params.right?.SPH === undefined) &&
        (params.left?.SPH === '' || params.left?.SPH === undefined)
      ) {
        toast.error('SPH values cannot be empty')
        return
      }

      // Check PD
      const pdVal = parseFloat(String(params.PD))
      if (isNaN(pdVal) || pdVal < 40 || pdVal > 90) {
        toast.error('PD must be between 40 and 90')
        return
      }

      // Check AXIS
      const rightAxis = parseFloat(String(params.right?.AXIS))
      const leftAxis = parseFloat(String(params.left?.AXIS))
      if (rightAxis < 0 || rightAxis > 180 || leftAxis < 0 || leftAxis > 180) {
        toast.error('AXIS must be between 0 and 180')
        return
      }
    }

    setConfirmAction('approve')
    setIsConfirmOpen(true)
  }

  const handleReject = () => {
    setConfirmAction('reject')
    setIsConfirmOpen(true)
  }

  const handleConfirm = async () => {
    // Priority: 1. Local changes, 2. Existing order data (parameters variable), 3. Default empty params
    const rawParams = (localParameters ||
      parameters || {
        left: { SPH: 0, CYL: 0, AXIS: 0, ADD: 0 },
        right: { SPH: 0, CYL: 0, AXIS: 0, ADD: 0 },
        PD: 64
      }) as any

    // Ensure they are numbers before sending to API
    const finalParams = {
      ...rawParams,
      left: {
        SPH: parseFloat(String(rawParams.left?.SPH || 0)),
        CYL: parseFloat(String(rawParams.left?.CYL || 0)),
        AXIS: parseFloat(String(rawParams.left?.AXIS || 0)),
        ADD: parseFloat(String(rawParams.left?.ADD || 0))
      },
      right: {
        SPH: parseFloat(String(rawParams.right?.SPH || 0)),
        CYL: parseFloat(String(rawParams.right?.CYL || 0)),
        AXIS: parseFloat(String(rawParams.right?.AXIS || 0)),
        ADD: parseFloat(String(rawParams.right?.ADD || 0))
      },
      PD: parseFloat(String(rawParams.PD || 64))
    }

    const success = await approveOrder(orderId, { parameters: finalParams })
    if (success) {
      toast.success('Prescription approved')
      setIsConfirmOpen(false)
      refetch()
      onActionSuccess?.()
    }
  }

  const handleConfirmReject = async (note: string) => {
    const success = await rejectOrder(orderId, order?.invoiceId, note)
    if (success) {
      toast.success('Prescription rejected')
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
            <span className="px-3 py-1 bg-mint-50 text-mint-600 font-semibold rounded-full text-[10px] border border-mint-200 tracking-widest flex items-center gap-1.5 shadow-sm">
              <IoCheckmark size={14} className="text-mint-600" /> Verified
            </span>
          ) : isRejected ? (
            <span className="px-3 py-1 bg-rose-50 text-rose-600 font-semibold rounded-full text-[10px] border border-rose-200 tracking-widest shadow-sm">
              <IoClose size={14} className="text-rose-600 inline mr-1" /> Rejected
            </span>
          ) : isPending ? (
            <span className="px-3 py-1 bg-amber-50 text-amber-600 font-semibold rounded-full text-[10px] border border-amber-200 tracking-widest shadow-sm uppercase">
              Pending
            </span>
          ) : (
            <span className="px-3 py-1 bg-white text-slate-400 font-semibold rounded-full text-[10px] border border-neutral-100 tracking-widest">
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
            parameters={localParameters || parameters}
            onParametersChange={setLocalParameters}
            isReadOnly={isReadOnly}
            isApproved={isApproved}
            isRejected={isRejected}
            processing={processing}
            handleApprove={handleApprove}
            handleReject={handleReject}
            assignStaff={order.assignStaff || undefined}
            staffName={order.staffName || profileData?.data?.name}
            actionTime={formatDate(
              isApproved
                ? order.approvedAt || order.completedAt || order.updatedAt
                : order.rejectedAt || order.updatedAt
            )}
            rejectionNote={order.rejectionNote || (order.invoice as any)?.note}
          />
        </div>

        {/* Right Column: Information & Operations (Sidebar) */}
        <div className="space-y-5">
          <OrderDetailsSidebar order={order} />
          <CommunicationHub customerName={order.customerName || undefined} />
          <LabOperationsTimeline order={order} />
        </div>
      </div>

      <ConfirmationModal
        isOpen={isConfirmOpen && confirmAction === 'approve'}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirm}
        title="Approve Prescription"
        message="Are you sure you want to approve this prescription? This will move the order to the next stage."
        details={
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-medium">Order ID</span>
              <span className="text-slate-900 font-bold uppercase tracking-tight">
                #{orderId.slice(-8)}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-medium">Customer</span>
              <span className="text-slate-900 font-bold">{order?.customerName}</span>
            </div>
          </div>
        }
        confirmText="Approve"
        type="info"
        isLoading={processing}
      />

      <RejectionModal
        isOpen={isConfirmOpen && confirmAction === 'reject'}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmReject}
        title="Reject Prescription"
        message="Are you sure you want to reject this prescription? This will reject the entire invoice."
        details={
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-medium">Order ID</span>
              <span className="text-slate-900 font-bold uppercase tracking-tight">
                #{orderId.slice(-8)}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-medium">Customer</span>
              <span className="text-slate-900 font-bold">{order?.customerName}</span>
            </div>
          </div>
        }
        confirmText="Reject Now"
        isLoading={processing}
      />
    </div>
  )
}
