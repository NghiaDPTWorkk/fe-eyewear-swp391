import { useState } from 'react'
import {
  IoPersonOutline,
  IoCubeOutline,
  IoDocumentTextOutline,
  IoCheckmarkCircle,
  IoCloseCircleOutline,
  IoAlertCircleOutline,
  IoShieldCheckmark
} from 'react-icons/io5'
import { Card, Button } from '@/components'
import { ArrowLeft } from 'lucide-react'
import { useUpdateReturnStatus } from '@/features/manager/hooks/useUpdateReturnStatus'
import { useStaffVerify } from '@/features/manager/hooks/useStaffVerify'
import { useAuthStore } from '@/store'
import type { ReturnTicket } from '@/shared/types'

interface ReturnDetailsProps {
  ticket: ReturnTicket
  onBack: () => void
  onStatusChanged?: () => void
}

const STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-orange-50 text-orange-600 border-orange-100',
  IN_PROGRESS: 'bg-blue-50 text-blue-600 border-blue-100',
  APPROVED: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  REJECTED: 'bg-red-50 text-red-600 border-red-100',
  CANCEL: 'bg-gray-50 text-gray-500 border-gray-200',
  DELIVERING: 'bg-indigo-50 text-indigo-600 border-indigo-100',
  RETURNED: 'bg-teal-50 text-teal-600 border-teal-100'
}

const REASON_LABELS: Record<string, string> = {
  DAMAGE: 'Damaged Product',
  WRONG_ITEM: 'Wrong Item Received',
  NOT_EXPECTED: 'Product Not As Expected',
  OTHER: 'Other Reason'
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export default function ReturnDetails({ ticket, onBack, onStatusChanged }: ReturnDetailsProps) {
  const updateStatus = useUpdateReturnStatus()
  const staffVerify = useStaffVerify()
  const user = useAuthStore((s) => s.user)

  const [actionFeedback, setActionFeedback] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)

  // Check if this ticket has been staff-verified
  const isStaffVerified = !!ticket.staffVerify
  const isAlreadyResolved = ['APPROVED', 'REJECTED', 'CANCEL', 'RETURNED'].includes(ticket.status)

  const handleStaffVerify = () => {
    setActionFeedback(null)
    staffVerify.mutate(ticket.id, {
      onSuccess: () => {
        setActionFeedback({
          type: 'success',
          message: 'You have registered as the verifier for this ticket. You can now approve or reject.'
        })
        onStatusChanged?.()
      },
      onError: (err: any) => {
        setActionFeedback({
          type: 'error',
          message: err?.response?.data?.message || 'Failed to staff-verify. Please try again.'
        })
      }
    })
  }

  const handleApprove = () => {
    setActionFeedback(null)
    updateStatus.mutate(
      { id: ticket.id, status: 'approved' },
      {
        onSuccess: () => {
          setActionFeedback({
            type: 'success',
            message: 'Return ticket has been approved successfully!'
          })
          onStatusChanged?.()
        },
        onError: (err: any) => {
          setActionFeedback({
            type: 'error',
            message: err?.response?.data?.message || 'Failed to approve. Please try again.'
          })
        }
      }
    )
  }

  const handleReject = () => {
    setActionFeedback(null)
    updateStatus.mutate(
      { id: ticket.id, status: 'rejected' },
      {
        onSuccess: () => {
          setActionFeedback({ type: 'success', message: 'Return ticket has been rejected.' })
          onStatusChanged?.()
        },
        onError: (err: any) => {
          setActionFeedback({
            type: 'error',
            message: err?.response?.data?.message || 'Failed to reject. Please try again.'
          })
        }
      }
    )
  }

  const isMutating = updateStatus.isPending || staffVerify.isPending

  return (
    <div className="space-y-6 pb-12 animate-in fade-in slide-in-from-right-4 duration-300">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center bg-white hover:bg-mint-50 rounded-xl shadow-sm transition-all duration-300 border border-neutral-100 hover:border-mint-200 hover:shadow-md hover:-translate-x-0.5 active:scale-90 group"
          >
            <ArrowLeft
              size={20}
              className="text-neutral-500 group-hover:text-mint-600 transition-colors stroke-[2.5px]"
            />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900">Return Detail</h1>
            <div className="flex items-center gap-2 text-sm text-neutral-500 mt-1">
              <span>#{ticket.id.slice(-8)}</span>
              <span>•</span>
              <span>{formatDate(ticket.createdAt)}</span>
            </div>
          </div>
        </div>
        <span
          className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border shadow-sm ${STATUS_STYLES[ticket.status] || 'bg-gray-50 text-gray-500 border-gray-200'}`}
        >
          {ticket.status.replace('_', ' ')}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Ticket Info */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <IoPersonOutline className="text-lg text-neutral-400" />
              <h2 className="font-semibold text-lg text-neutral-900">Ticket Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-neutral-400 uppercase tracking-wide">
                    Return Ticket ID
                  </label>
                  <div className="font-medium text-neutral-900 mt-1 font-mono text-sm">
                    {ticket.id}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-neutral-400 uppercase tracking-wide">
                    Customer ID
                  </label>
                  <div className="font-medium text-neutral-900 mt-1 font-mono text-sm">
                    {ticket.customerId}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-neutral-400 uppercase tracking-wide">
                    Staff Verify
                  </label>
                  <div className="font-medium text-neutral-900 mt-1">
                    {ticket.staffVerify ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-semibold border border-emerald-100">
                        <IoShieldCheckmark className="text-emerald-500" />
                        Verified
                      </span>
                    ) : (
                      <span className="text-slate-400 italic">Not verified yet</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-neutral-400 uppercase tracking-wide">
                    Original Order ID
                  </label>
                  <div className="font-medium text-mint-600 mt-1 font-mono text-sm">
                    {ticket.orderId}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-neutral-400 uppercase tracking-wide">
                    Created At
                  </label>
                  <div className="font-medium text-neutral-900 mt-1">
                    {formatDate(ticket.createdAt)}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-neutral-400 uppercase tracking-wide">
                    Updated At
                  </label>
                  <div className="font-medium text-neutral-900 mt-1">
                    {formatDate(ticket.updatedAt)}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Return Items (SKUs) */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <IoCubeOutline className="text-lg text-neutral-400" />
              <h2 className="font-semibold text-lg text-neutral-900">Return Items</h2>
            </div>
            <div className="space-y-3">
              {ticket.skus && ticket.skus.length > 0 ? (
                ticket.skus.map((sku, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-neutral-50 rounded-xl">
                    <div className="w-10 h-10 bg-mint-100 rounded-lg flex items-center justify-center">
                      <IoCubeOutline className="text-mint-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-neutral-900 text-sm">SKU: {sku}</h3>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-slate-400 italic">No SKU information available</div>
              )}
            </div>
          </Card>

          {/* Return Reason */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <IoDocumentTextOutline className="text-lg text-neutral-400" />
              <h2 className="font-semibold text-lg text-neutral-900">Return Reason</h2>
            </div>
            <div className="space-y-6">
              <div>
                <span className="text-sm font-medium text-neutral-500 mr-2">Reason Category</span>
                <span className="px-3 py-1 bg-red-50 text-red-600 rounded-lg text-sm font-semibold">
                  {REASON_LABELS[ticket.reason] || ticket.reason}
                </span>
              </div>
              {ticket.description && (
                <div>
                  <label className="text-sm font-semibold text-neutral-700 block mb-2">
                    Customer Description
                  </label>
                  <div className="bg-neutral-50 p-4 rounded-xl text-neutral-700 text-sm leading-relaxed">
                    {ticket.description}
                  </div>
                </div>
              )}
              {ticket.media && ticket.media.length > 0 && (
                <div>
                  <label className="text-sm font-semibold text-neutral-700 block mb-2">
                    Customer Photos
                  </label>
                  <div className="flex gap-4 flex-wrap">
                    {ticket.media.map((photo, i) => (
                      <img
                        key={i}
                        src={photo}
                        alt="Customer evidence"
                        className="w-24 h-24 object-cover rounded-xl border border-neutral-200 hover:border-mint-400 transition-colors cursor-pointer"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right column - Actions */}
        <div className="space-y-6">
          {/* Money / Refund Info */}
          <Card className="p-6">
            <h2 className="font-semibold text-lg text-neutral-900 mb-6">Refund Amount</h2>
            <div className="flex justify-between items-center py-4">
              <span className="font-semibold text-neutral-900">Total Refund</span>
              <span className="font-semibold text-2xl text-mint-600">
                {ticket.money?.toLocaleString('vi-VN')}₫
              </span>
            </div>
          </Card>

          {/* Action Feedback */}
          {actionFeedback && (
            <Card
              className={`p-4 border ${actionFeedback.type === 'success' ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}
            >
              <p
                className={`text-sm font-medium ${actionFeedback.type === 'success' ? 'text-emerald-700' : 'text-red-700'}`}
              >
                {actionFeedback.message}
              </p>
            </Card>
          )}

          {/* Step 1: Staff Verify (required before approve/reject) */}
          {!isAlreadyResolved && !isStaffVerified && (
            <Card className="p-6 border-2 border-blue-200 bg-blue-50/30">
              <h2 className="font-semibold text-lg text-neutral-900 mb-2">Staff Verification</h2>
              <p className="text-sm text-slate-500 mb-5">
                You must verify this ticket first before you can approve or reject it.
              </p>
              <Button
                isFullWidth
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold h-12 rounded-xl shadow-lg shadow-blue-100 transition-all hover:-translate-y-0.5"
                leftIcon={<IoShieldCheckmark size={20} />}
                onClick={handleStaffVerify}
                disabled={isMutating}
              >
                {staffVerify.isPending ? 'Verifying...' : 'Staff Verify'}
              </Button>
            </Card>
          )}

          {/* Step 2: Approve / Reject (only after staff-verified) */}
          {!isAlreadyResolved && isStaffVerified && (
            <Card className="p-6">
              <h2 className="font-semibold text-lg text-neutral-900 mb-2">Refund Decision</h2>
              <p className="text-sm text-emerald-600 font-medium mb-5 flex items-center gap-1.5">
                <IoShieldCheckmark /> Staff verified — you can now approve or reject.
              </p>
              <div className="space-y-3">
                <Button
                  isFullWidth
                  className="bg-mint-600 hover:bg-mint-700 text-white font-semibold h-12 rounded-xl shadow-lg shadow-mint-100 transition-all hover:-translate-y-0.5"
                  leftIcon={<IoCheckmarkCircle size={20} />}
                  onClick={handleApprove}
                  disabled={isMutating}
                >
                  {updateStatus.isPending ? 'Processing...' : 'Approve Refund'}
                </Button>
                <Button
                  isFullWidth
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold h-12 rounded-xl shadow-lg shadow-red-100 transition-all hover:-translate-y-0.5"
                  leftIcon={<IoCloseCircleOutline size={20} />}
                  onClick={handleReject}
                  disabled={isMutating}
                >
                  {updateStatus.isPending ? 'Processing...' : 'Reject Refund'}
                </Button>
              </div>
            </Card>
          )}

          {/* Already resolved */}
          {isAlreadyResolved && (
            <Card className="p-6 bg-slate-50 border-slate-200">
              <div className="text-center text-sm text-slate-500 font-medium">
                This ticket has been <span className="font-bold">{ticket.status}</span>. No further
                action needed.
              </div>
            </Card>
          )}

          {/* Decision Guidelines */}
          {!isAlreadyResolved && (
            <Card className="p-5 bg-amber-50 border-amber-100">
              <div className="flex items-center gap-2 mb-3 text-amber-800">
                <IoAlertCircleOutline className="text-xl" />
                <h3 className="font-semibold uppercase tracking-wider text-xs">
                  Decision Guidelines
                </h3>
              </div>
              <ul className="text-xs space-y-2 text-amber-800/80 list-disc pl-4 font-medium">
                <li>
                  <strong>Step 1:</strong> Click "Staff Verify" to register yourself as verifier
                </li>
                <li>
                  <strong>Step 2:</strong> Review photos and description, then approve or reject
                </li>
                <li>Manufacturing defects = Full refund</li>
                <li>Customer damage = Reject or partial refund</li>
              </ul>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
