import { useState, useEffect } from 'react'
import {
  IoCheckmarkCircle,
  IoCloseCircleOutline,
  IoShieldCheckmarkOutline,
  IoReceiptOutline,
  IoImageOutline,
  IoOpenOutline,
  IoRefreshOutline,
  IoCalendarOutline,
  IoCheckmark,
  IoPersonOutline,
  IoAlertCircleOutline
} from 'react-icons/io5'
import { Card } from '@/components'
import { returnTicketService } from '@/features/sales/services/returnTicketService'
import { salesService } from '@/features/sales/services/salesService'
import { RETURN_TICKET_REASONS, type ReturnTicketData } from '@/shared/types/return-ticket.types'
import { cn } from '@/lib/utils'

interface ReturnVerifyPageProps {
  ticket: ReturnTicketData
  onBack: () => void
  onActionSuccess: () => void
  currentStaffId: string
}

function resolveReasonLabel(reason: string) {
  const found = RETURN_TICKET_REASONS.find((r) => r.value === reason)
  return found ? found.label : reason
}

export default function ReturnVerifyView({
  ticket: initialTicket,
  onActionSuccess,
  currentStaffId
}: Omit<ReturnVerifyPageProps, 'onBack'>) {
  const [ticket, setTicket] = useState<ReturnTicketData>(initialTicket!)
  const [action, setAction] = useState<'approve' | 'reject' | null>(null)
  const [rejectNote, setRejectNote] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isClaiming, setIsClaiming] = useState(false)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null)

  // Context Data
  const [orderDetail, setOrderDetail] = useState<any>(null)
  const [customerDetail, setCustomerDetail] = useState<any>(null)
  const [isLoadingContext, setIsLoadingContext] = useState(true)

  // Fetch staff name if ID exists but name doesn't
  useEffect(() => {
    const fetchStaffName = async () => {
      if (ticket.staffVerify && !ticket.staffName) {
        // Optimization: if it's ME, use auth store
        if (ticket.staffVerify === currentStaffId && (initialTicket as any).user?.name) {
          setTicket((prev) => ({ ...prev, staffName: (initialTicket as any).user.name }))
          return
        }

        try {
          const res = await salesService.getStaffById(ticket.staffVerify)
          if (res.success && res.data?.name) {
            setTicket((prev) => ({ ...prev, staffName: res.data.name }))
          }
        } catch (err) {
          console.error('Failed to fetch staff name', err)
        }
      }
    }
    fetchStaffName()
  }, [ticket.staffVerify, ticket.staffName, currentStaffId, initialTicket])

  useEffect(() => {
    const fetchContext = async () => {
      setIsLoadingContext(true)
      try {
        const [orderRes, customerRes] = await Promise.all([
          salesService.getOrderById(ticket.orderId).catch(() => null),
          salesService.getCustomerById(ticket.customerId).catch(() => null)
        ])
        if (orderRes?.success) setOrderDetail(orderRes.data.order)

        // Handle customer response safely - check if it's in a 'data' wrapper
        if (customerRes) {
          const cData = customerRes.data || customerRes
          setCustomerDetail(cData)
        }
      } catch (err) {
        console.error('Failed to fetch context info', err)
      } finally {
        setIsLoadingContext(false)
      }
    }
    fetchContext()
  }, [ticket.orderId, ticket.customerId])

  const isUnassigned = !ticket.staffVerify
  const isMyTicket = ticket.staffVerify === currentStaffId
  const isOtherStaff = !isUnassigned && !isMyTicket

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 3500)
  }

  const handleClaim = async () => {
    setIsClaiming(true)
    try {
      const res = await returnTicketService.claimTicket(ticket.id)
      if (res.success) {
        // According to documentation, we should also move it to in-progress
        await returnTicketService.startProcessing(ticket.id).catch((err) => {
          console.warn('Failed to move ticket to in-progress, but claim was successful', err)
        })

        showToast('success', 'Ticket claimed successfully! You can now verify this return.')

        // Try to find current user name from various possible sources
        const currentUserName = (initialTicket as any).staffName || 'You'

        setTicket((prev) => ({
          ...prev,
          status: 'IN_PROGRESS',
          staffVerify: currentStaffId,
          staffName: currentUserName
        }))
      }
    } catch (err: any) {
      showToast('error', err?.message || 'Failed to claim ticket.')
    } finally {
      setIsClaiming(false)
    }
  }

  const handleSubmit = async () => {
    if (!action) return
    if (action === 'reject' && !rejectNote.trim()) {
      showToast('error', 'Please provide a rejection reason.')
      return
    }

    setIsSubmitting(true)

    try {
      if (action === 'approve') {
        const approvalNote = 'Approved by staff'
        await returnTicketService.approveTicket(ticket.id, approvalNote)
        showToast('success', 'Ticket approved successfully!')
      } else {
        await returnTicketService.rejectTicket(ticket.id, rejectNote)
        showToast('success', 'Ticket rejected.')
      }

      setTimeout(() => {
        onActionSuccess()
      }, 1500)
    } catch (err: any) {
      showToast('error', err?.message || 'Action failed. Please try again.')
      setIsSubmitting(false)
    }
  }

  const isApproved = ticket?.status === 'APPROVED' || ticket?.status === 'RETURNED'
  const isRejected = ticket?.status === 'REJECTED'
  const isPending = ticket?.status === 'PENDING' || ticket?.status === 'IN_PROGRESS'

  if (!ticket) return null

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-10 right-10 z-[99999] flex items-center gap-4 px-6 py-4 rounded-2xl shadow-2xl
            border text-sm font-bold transition-all animate-in slide-in-from-top-4
            ${
              toast.type === 'success'
                ? 'bg-white border-emerald-500 text-emerald-700 ring-4 ring-emerald-500/10'
                : 'bg-white border-red-500 text-red-700 ring-4 ring-red-500/10'
            }`}
        >
          {toast.type === 'success' ? (
            <IoCheckmarkCircle size={24} className="text-emerald-500" />
          ) : (
            <IoAlertCircleOutline size={24} className="text-red-500" />
          )}
          {toast.message}
        </div>
      )}

      {/* Lightbox */}
      {lightboxSrc && (
        <div
          className="fixed inset-0 z-[99999] bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300"
          onClick={() => setLightboxSrc(null)}
        >
          <img
            src={lightboxSrc}
            alt="Evidence"
            className="max-h-[90vh] max-w-full rounded-3xl shadow-2xl ring-1 ring-white/20 px-1 py-1 bg-white/10"
          />
        </div>
      )}

      {/* Status Bar */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span className="font-normal font-heading">Ticket Status:</span>
          {isApproved ? (
            <span className="px-3 py-1 bg-mint-50 text-mint-600 font-bold rounded-full text-[10px] border border-mint-200 uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
              <IoCheckmark size={14} className="text-mint-600" /> APPROVED
            </span>
          ) : isRejected ? (
            <span className="px-3 py-1 bg-rose-50 text-rose-600 font-bold rounded-full text-[10px] border border-rose-200 uppercase tracking-widest shadow-sm">
              <IoCloseCircleOutline size={14} className="text-rose-600 inline mr-1" /> REJECTED
            </span>
          ) : isPending ? (
            <span className="px-3 py-1 bg-amber-50 text-amber-600 font-bold rounded-full text-[10px] border border-amber-200 uppercase tracking-widest shadow-sm">
              PENDING
            </span>
          ) : (
            <span className="px-3 py-1 bg-white text-slate-400 font-bold rounded-full text-[10px] border border-neutral-100 uppercase tracking-widest">
              {ticket.status}
            </span>
          )}
        </div>
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
          Return ID:{' '}
          <span className="text-slate-900/40 select-all ml-1">#{ticket.id.slice(-8)}</span>
        </div>
      </div>

      {/* Assignment Banners */}
      {isOtherStaff && (
        <div className="flex items-start gap-4 p-5 bg-amber-50 border border-amber-200 rounded-2xl shadow-sm animate-in zoom-in-95 duration-300">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
            <IoAlertCircleOutline className="text-amber-600" size={20} />
          </div>
          <div>
            <p className="text-xs font-bold text-amber-900 uppercase tracking-widest">
              Assigned to Another Colleague
            </p>
            <p className="text-sm text-amber-700 mt-1 font-medium leading-relaxed">
              Member <span className="font-bold font-mono">#{ticket.staffVerify?.slice(-6)}</span>{' '}
              is currently handling this ticket.
            </p>
          </div>
        </div>
      )}

      {isUnassigned && !isOtherStaff && (
        <div className="flex items-center justify-between p-6 bg-blue-50/50 border border-blue-100 rounded-2xl overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100/30 rounded-full -translate-y-16 translate-x-16 pointer-events-none group-hover:scale-110 transition-transform duration-700" />
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/20 translate-y-[-2px]">
              <IoShieldCheckmarkOutline className="text-white" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-blue-900 tracking-tight">Available Ticket</h3>
              <p className="text-sm text-blue-600/80 font-medium mt-0.5">
                This ticket is waiting for a staff member. Claim it to start verification.
              </p>
            </div>
          </div>
          <button
            onClick={handleClaim}
            disabled={isClaiming}
            className="relative z-10 px-8 h-12 text-xs font-bold text-white bg-blue-500 hover:bg-blue-600
                rounded-xl transition-all shadow-xl shadow-blue-500/30 active:scale-95 disabled:opacity-50 flex items-center gap-2"
          >
            {isClaiming ? <IoRefreshOutline className="animate-spin" /> : <IoCheckmarkCircle />}
            {isClaiming ? 'Claiming…' : 'CLAIM THIS TICKET'}
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-stretch">
        {/* ROW 1: Evidence Gallery + Order Details */}
        <div className="xl:col-span-2">
          <Card className="p-0 rounded-[32px] border-none shadow-xl shadow-slate-200/40 ring-1 ring-neutral-100/50 overflow-hidden h-full">
            <div className="px-6 py-5 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center border border-amber-100">
                  <IoImageOutline className="text-amber-500" size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">
                    Evidence Gallery
                  </h3>
                  <p className="text-[11px] text-slate-400 font-medium font-heading italic">
                    Visual proof provided by customer
                  </p>
                </div>
              </div>
              <span className="px-4 py-1.5 rounded-full bg-white text-slate-400 text-[10px] font-bold uppercase tracking-widest border border-slate-100">
                {ticket.media?.length || 0} File(s)
              </span>
            </div>

            <div className="p-6">
              {ticket.media && ticket.media.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {ticket.media.map((url, i) => (
                    <button
                      key={i}
                      onClick={() => setLightboxSrc(url)}
                      className="group relative aspect-square overflow-hidden rounded-2xl border border-slate-100
                         bg-slate-50 hover:border-emerald-400 transition-all shadow-sm"
                    >
                      <img
                        src={url}
                        alt={`Evidence ${i + 1}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/30 transition-all flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-white scale-75 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 flex items-center justify-center shadow-xl">
                          <IoOpenOutline className="text-emerald-500" size={20} />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="py-20 flex flex-col items-center justify-center text-slate-400 bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200">
                  <IoImageOutline size={48} className="text-slate-200 mb-2" />
                  <p className="text-sm font-medium">No evidence photos provided</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        <div className="xl:col-span-1">
          <Card className="p-8 rounded-[24px] border-none shadow-xl shadow-slate-200/30 ring-1 ring-slate-100 bg-white relative overflow-hidden group h-full">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-bold text-slate-800">Order Details</h3>
              <span className="text-[10px] font-extrabold text-slate-400 tracking-widest uppercase hover:text-indigo-500 cursor-pointer transition-colors">
                Modify
              </span>
            </div>

            {isLoadingContext ? (
              <div className="space-y-8 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50" />
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-4 bg-slate-50 rounded w-1/4" />
                    <div className="h-4 bg-slate-50 rounded w-1/2" />
                  </div>
                </div>
                <div className="h-32 bg-slate-50 rounded-3xl" />
              </div>
            ) : (
              <div className="space-y-6">
                {/* Customer Section */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100/50">
                    <IoPersonOutline size={20} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                      Customer
                    </p>
                    <div className="space-y-0.5">
                      <p className="text-sm font-bold text-slate-900">
                        {customerDetail?.fullName || customerDetail?.name || 'Customer'}
                      </p>
                      <p className="text-xs font-medium text-slate-500">
                        {customerDetail?.phone || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Timeline Section */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100/50">
                    <IoCalendarOutline size={20} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                      Timeline
                    </p>
                    <p className="text-sm font-bold text-slate-900">{ticket.createdAt || 'N/A'}</p>
                  </div>
                </div>

                {/* Amount Brief */}
                <div className="pt-6 border-t border-slate-100 flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50/50 flex items-center justify-center text-slate-400">
                      <IoReceiptOutline size={16} />
                    </div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                      Total Value
                    </span>
                  </div>
                  <span className="text-xl font-bold text-[#3ea6a0]">
                    {orderDetail?.price?.toLocaleString('vi-VN')} đ
                  </span>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* ROW 2: Statement & Decision + Guidelines */}
        <div className="xl:col-span-2 space-y-6">
          {/* Statement Card */}
          <Card className="p-8 rounded-[32px] border-none shadow-xl shadow-slate-200/40 ring-1 ring-neutral-100/50 bg-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 text-slate-50 pointer-events-none transition-transform duration-1000 group-hover:rotate-12">
              <IoReceiptOutline size={120} />
            </div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-indigo-500" />
                <h3 className="font-bold text-lg text-slate-900 italic tracking-tight font-heading">
                  Customer's Statement
                </h3>
              </div>
              <span className="px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase tracking-widest border border-indigo-100">
                Reason: {resolveReasonLabel(ticket.reason)}
              </span>
            </div>
            <div className="relative z-10 p-6 bg-slate-50/60 rounded-2xl border border-slate-100 text-slate-700 leading-relaxed font-medium italic text-sm">
              “{ticket.description || 'No detailed reasoning provided.'}”
            </div>
          </Card>

          {/* Action Section (Moved here under horizontal request) */}
          <Card className="p-8 rounded-[32px] border-none shadow-xl shadow-slate-200/40 ring-1 ring-neutral-100/50 bg-white relative overflow-hidden group">
            <h2 className="font-bold text-xl text-slate-900 mb-8 italic tracking-tight font-heading">
              Final Decision
            </h2>

            {/* If already completed, show summary instead of buttons */}
            {!isPending ? (
              <div
                className={cn(
                  'p-8 rounded-[32px] border animate-in zoom-in-95 duration-500 space-y-8',
                  isApproved
                    ? 'bg-emerald-50/30 border-emerald-100'
                    : 'bg-rose-50/30 border-rose-100'
                )}
              >
                {/* Header with Icon */}
                <div className="flex items-center gap-6">
                  <div
                    className={cn(
                      'w-16 h-16 rounded-[20px] flex items-center justify-center shrink-0 shadow-lg',
                      isApproved ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                    )}
                  >
                    {isApproved ? <IoCheckmark size={32} /> : <IoCloseCircleOutline size={32} />}
                  </div>
                  <div>
                    <h3
                      className={cn(
                        'text-2xl font-bold tracking-tight',
                        isApproved ? 'text-emerald-700' : 'text-rose-700'
                      )}
                    >
                      {isApproved ? 'Approved and Valid' : 'Disputed and Rejected'}
                    </h3>
                    <p
                      className={cn(
                        'text-xs font-medium opacity-70',
                        isApproved ? 'text-emerald-600' : 'text-rose-600'
                      )}
                    >
                      {isApproved ? 'Approved' : 'Rejected'} on{' '}
                      {ticket.updatedAt || ticket.createdAt}
                    </p>
                  </div>
                </div>

                {/* Staff Info Card */}
                <div className="bg-white/60 p-5 rounded-[24px] border border-white/80 shadow-sm inline-flex items-center gap-4 min-w-[280px]">
                  <div
                    className={cn(
                      'w-10 h-10 rounded-xl flex items-center justify-center',
                      isApproved ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'
                    )}
                  >
                    <IoPersonOutline size={20} />
                  </div>
                  <div className="space-y-0.5">
                    <p
                      className={cn(
                        'text-[10px] font-bold uppercase tracking-widest',
                        isApproved ? 'text-emerald-400' : 'text-rose-400'
                      )}
                    >
                      {isApproved ? 'APPROVED BY' : 'REJECTED BY'}
                    </p>
                    <p className="text-[15px] font-bold text-slate-800">
                      {ticket.staffName || `Staff #${ticket.staffVerify?.slice(-6) || 'System'}`}
                    </p>
                  </div>
                </div>

                {/* Reason Section (Only if note exists) */}
                {(ticket.staffNote || (isRejected && rejectNote)) && (
                  <div className="bg-white p-6 rounded-[28px] border border-white/50 shadow-sm space-y-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          'w-1.5 h-1.5 rounded-full',
                          isApproved ? 'bg-emerald-400' : 'bg-rose-400'
                        )}
                      />
                      <span
                        className={cn(
                          'text-[10px] font-bold uppercase tracking-[0.1em]',
                          isApproved ? 'text-emerald-500' : 'text-rose-500'
                        )}
                      >
                        {isApproved ? 'APPROVAL REMARKS' : 'REJECTION REASON'}
                      </span>
                    </div>
                    <div className="pl-6 border-l-2 border-slate-100 flex items-center min-h-[48px]">
                      <p className="text-sm font-medium text-slate-600 italic leading-relaxed">
                        "{ticket.staffNote || rejectNote}"
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : isMyTicket ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => setAction('approve')}
                    className={cn(
                      'flex items-center justify-between p-5 rounded-2xl border-2 transition-all transform active:scale-95',
                      action === 'approve'
                        ? 'border-emerald-500 bg-emerald-50/80 text-emerald-700 ring-4 ring-emerald-500/10'
                        : 'border-slate-100 bg-slate-50 text-slate-600 hover:bg-slate-100 shadow-sm'
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          'w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm',
                          action === 'approve'
                            ? 'bg-emerald-500 text-white'
                            : 'bg-white text-slate-300'
                        )}
                      >
                        <IoCheckmarkCircle size={20} />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-widest font-heading">
                        Approve Return
                      </span>
                    </div>
                    {action === 'approve' && (
                      <IoCheckmarkCircle className="text-emerald-500" size={20} />
                    )}
                  </button>

                  <button
                    onClick={() => setAction('reject')}
                    className={cn(
                      'flex items-center justify-between p-5 rounded-2xl border-2 transition-all transform active:scale-95',
                      action === 'reject'
                        ? 'border-rose-500 bg-rose-50/80 text-rose-700 ring-4 ring-rose-500/10'
                        : 'border-slate-100 bg-slate-50 text-slate-600 hover:bg-slate-100 shadow-sm'
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          'w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm',
                          action === 'reject' ? 'bg-rose-500 text-white' : 'bg-white text-slate-300'
                        )}
                      >
                        <IoCloseCircleOutline size={20} />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-widest font-heading">
                        Reject Return
                      </span>
                    </div>
                    {action === 'reject' && (
                      <IoCloseCircleOutline className="text-rose-500" size={20} />
                    )}
                  </button>
                </div>

                {action && (
                  <div className="space-y-3 animate-in slide-in-from-top-2 duration-200">
                    <div className="flex items-center gap-2 px-1">
                      <span
                        className={cn(
                          'w-1.5 h-1.5 rounded-full',
                          action === 'approve' ? 'bg-emerald-500' : 'bg-rose-500'
                        )}
                      />
                      <label
                        className={cn(
                          'text-[10px] font-bold uppercase tracking-widest',
                          action === 'approve' ? 'text-emerald-500' : 'text-rose-500'
                        )}
                      >
                        {action === 'approve' ? 'Approval Remarks' : 'Rejection Reason'} *
                      </label>
                    </div>
                    <textarea
                      value={rejectNote}
                      onChange={(e) => setRejectNote(e.target.value)}
                      rows={3}
                      placeholder={
                        action === 'approve'
                          ? 'Provide details for approval (optional)...'
                          : 'Provide specific details for rejection...'
                      }
                      className={cn(
                        'w-full text-sm font-medium p-4 rounded-xl border-2 bg-slate-50/50 focus:outline-none focus:bg-white transition-all resize-none',
                        action === 'approve'
                          ? 'border-slate-100 focus:border-emerald-300'
                          : 'border-slate-100 focus:border-rose-300'
                      )}
                    />
                  </div>
                )}

                <div className="flex justify-end pt-4 border-t border-slate-50">
                  <button
                    onClick={handleSubmit}
                    disabled={!action || isSubmitting}
                    className={cn(
                      'min-w-[240px] h-14 rounded-2xl font-bold text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all active:scale-[0.96] disabled:opacity-30 disabled:grayscale shadow-xl',
                      action === 'reject'
                        ? 'bg-slate-900 hover:bg-black text-white'
                        : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-200'
                    )}
                  >
                    {isSubmitting ? (
                      <>
                        <IoRefreshOutline size={20} className="animate-spin" />
                        Processing…
                      </>
                    ) : (
                      <>
                        {action === 'approve'
                          ? 'Complete Approval'
                          : action === 'reject'
                            ? 'Confirm Rejection'
                            : 'Select Decision'}
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 text-center">
                <p className="text-sm font-medium text-slate-500">
                  Waiting for ticket assignment to take actions.
                </p>
              </div>
            )}
          </Card>
        </div>

        <div className="xl:col-span-1 space-y-6">
          {/* Guidelines sidebar card */}
          <Card className="p-8 rounded-[32px] border-none shadow-xl shadow-slate-200/40 ring-1 ring-neutral-100/50 bg-white space-y-5 overflow-hidden group">
            <div className="flex items-center gap-2 text-indigo-500">
              <IoShieldCheckmarkOutline size={16} />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
                Quality Standard
              </span>
            </div>
            <h4 className="text-xl font-bold font-heading italic text-slate-900 border-b border-slate-50 pb-4">
              Verification Guide
            </h4>
            <div className="space-y-4">
              {[
                'Inspect evidence photos for structural damage',
                'Confirm reason aligns with return policy',
                'Verify item description matches return goods',
                'Double check refund amount calculation'
              ].map((step, idx) => (
                <div
                  key={idx}
                  className="flex gap-3 text-[12px] font-medium text-slate-500 hover:text-indigo-600 transition-colors"
                >
                  <span className="w-5 h-5 rounded-lg bg-slate-100 flex items-center justify-center text-slate-800 font-extrabold shrink-0 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                    {idx + 1}
                  </span>
                  <span className="leading-tight">{step}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
