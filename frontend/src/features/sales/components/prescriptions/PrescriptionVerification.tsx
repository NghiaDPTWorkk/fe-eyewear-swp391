import { useState } from 'react'
import { IoCheckmark, IoClose } from 'react-icons/io5'
import { useSearchParams } from 'react-router-dom'

import { useSalesStaffAction, useSalesStaffOrderDetail } from '@/features/sales/hooks'
import { useProfile } from '@/features/staff/hooks/useProfile'
import { Button, ConfirmationModal } from '@/shared/components/ui-core'
import { TranscriptionForm } from './TranscriptionForm'
import { LabOperationsTimeline } from './LabOperationsTimeline'
import { PrescriptionHeroSection } from './PrescriptionHeroSection'
import { RejectionModal } from '../common/RejectionModal'

interface PrescriptionParameters {
  left: { SPH: number; CYL: number; AXIS: number; ADD: number }
  right: { SPH: number; CYL: number; AXIS: number; ADD: number }
  PD: number
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
  const { approveOrder, rejectOrder, processing, error: actionError } = useSalesStaffAction()
  const { data: profileData } = useProfile()
  const [searchParams] = useSearchParams()
  const mode = searchParams.get('mode')

  const isReadOnlyParams = mode === 'readonly'

  const { data: order, isLoading: loading, refetch } = useSalesStaffOrderDetail(orderId)

  const [localParameters, setLocalParameters] = useState<PrescriptionParameters | null>(null)
  const [localNote, setLocalNote] = useState('')

  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [confirmAction, setConfirmAction] = useState<'approve' | 'reject' | null>(null)

  const lens = order?.products?.[0]?.lens
  const parameters = lens?.parameters

  const handleApprove = () => {
    setConfirmAction('approve')
    setIsConfirmOpen(true)
  }

  const handleReject = () => {
    setConfirmAction('reject')
    setIsConfirmOpen(true)
  }

  const handleConfirm = async () => {
    const rawParams = localParameters ||
      parameters || {
        left: { SPH: 0, CYL: 0, AXIS: 0, ADD: 0 },
        right: { SPH: 0, CYL: 0, AXIS: 0, ADD: 0 },
        PD: 64
      }

    const finalParams = {
      ...rawParams,
      left: rawParams.left
        ? {
            SPH: Number(rawParams.left.SPH) || 0,
            CYL: Number(rawParams.left.CYL) || 0,
            AXIS: Number(rawParams.left.AXIS) || 0,
            ADD: Number(rawParams.left.ADD) || 0
          }
        : { SPH: 0, CYL: 0, AXIS: 0, ADD: 0 },
      right: rawParams.right
        ? {
            SPH: Number(rawParams.right.SPH) || 0,
            CYL: Number(rawParams.right.CYL) || 0,
            AXIS: Number(rawParams.right.AXIS) || 0,
            ADD: Number(rawParams.right.ADD) || 0
          }
        : { SPH: 0, CYL: 0, AXIS: 0, ADD: 0 },
      PD: Number(rawParams.PD) || 64
    }

    const finalNote = localNote !== '' ? localNote : ((parameters as any)?.note ?? '')

    const success = await approveOrder(orderId, { parameters: finalParams, note: finalNote })
    // Always close modal so user can see toast and form errors
    setIsConfirmOpen(false)

    if (success) {
      refetch()
      onActionSuccess?.()
    }
  }

  const handleConfirmReject = async (note: string) => {
    const success = await rejectOrder(orderId, order?.invoiceId, note)
    setIsConfirmOpen(false)
    if (success) {
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

  const isReadOnly = isReadOnlyParams || isApproved || isRejected

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
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
      </div>

      {actionError && (
        <div className="bg-rose-50 border border-rose-100 p-5 rounded-3xl flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500 shadow-sm border-l-[6px] border-l-rose-500">
          <div className="w-12 h-12 rounded-2xl bg-rose-500 flex items-center justify-center shrink-0 shadow-lg shadow-rose-200">
            <IoClose className="text-white" size={24} />
          </div>
          <div className="flex-1">
            <h4 className="text-[11px] font-bold text-rose-500 uppercase tracking-widest mb-1.5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              Quick Notification: Verification Error
            </h4>
            <div className="text-sm font-bold text-rose-900 leading-tight">{actionError}</div>
          </div>
        </div>
      )}

      <PrescriptionHeroSection order={order} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <TranscriptionForm
            parameters={localParameters || parameters}
            onParametersChange={setLocalParameters}
            note={
              isApproved
                ? order.staffNote || (parameters as any)?.note || ''
                : localNote || (parameters as any)?.note || ''
            }
            onNoteChange={setLocalNote}
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
            rejectionNote={
              isRejected ? order.invoice?.rejectedNote || order.rejectedNote || '' : ''
            }
          />
        </div>

        <div className="xl:col-span-1">
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
        error={actionError}
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
        serverError={actionError}
      />
    </div>
  )
}
