import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  IoCloseOutline,
  IoReceiptOutline,
  IoImageOutline,
  IoOpenOutline,
  IoPersonOutline,
  IoCashOutline,
  IoCalendarOutline,
  IoShieldCheckmarkOutline,
  IoAlertCircleOutline
} from 'react-icons/io5'
import { RETURN_TICKET_REASONS, type ReturnTicketData } from '@/shared/types/return-ticket.types'
import { salesService } from '@/features/sales/services/salesService'
import ReturnTicketStatusBadge from './ReturnTicketStatusBadge'

interface ReturnTicketDrawerProps {
  ticket: ReturnTicketData | null
  open: boolean
  onClose: () => void
  currentStaffId: string
  onGoToVerify: (ticket: ReturnTicketData) => void
}

function InfoRow({
  label,
  value,
  isLoading = false
}: {
  label: string
  value: React.ReactNode
  isLoading?: boolean
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
        {label}
      </span>
      {isLoading ? (
        <div className="h-4 w-24 bg-slate-200 animate-pulse rounded mt-1" />
      ) : (
        <span className="text-sm font-semibold text-slate-800 break-all">{value}</span>
      )}
    </div>
  )
}

function truncateId(id: string) {
  if (!id) return '-'
  return id.length > 20 ? `${id.slice(0, 8)}…${id.slice(-6)}` : id
}

function resolveReasonLabel(reason: string) {
  const found = RETURN_TICKET_REASONS.find((r) => r.value === reason)
  return found ? found.label : reason
}

export default function ReturnTicketDrawer({
  ticket,
  open,
  onClose,
  currentStaffId,
  onGoToVerify
}: ReturnTicketDrawerProps) {
  const overlayRef = useRef<HTMLDivElement>(null)

  // Context State
  const [customerName, setCustomerName] = useState<string>('')
  const [orderCode, setOrderCode] = useState<string>('')
  const [staffName, setStaffName] = useState<string>('')
  const [isLoadingContext, setIsLoadingContext] = useState(false)

  // Reset state when ticket changes
  useEffect(() => {
    if (ticket) {
      setCustomerName('')
      setOrderCode('')
      setStaffName(ticket.staffName || '')
    }
  }, [ticket])

  // Fetch contextual names
  useEffect(() => {
    const fetchContext = async () => {
      if (!ticket || !open) return
      setIsLoadingContext(true)
      try {
        const [customerRes, orderRes] = await Promise.all([
          salesService.getCustomerById(ticket.customerId).catch(() => null),
          salesService.getOrderById(ticket.orderId).catch(() => null)
        ])

        if (customerRes) {
          const cData = customerRes.data || customerRes
          setCustomerName(cData.fullName || cData.name || '')
        }

        if (orderRes?.success) {
          setOrderCode(orderRes.data.order.orderCode || '')
        }

        if (ticket.staffVerify && !staffName) {
          const staffRes = await salesService.getStaffById(ticket.staffVerify).catch(() => null)
          if (staffRes?.success && staffRes.data?.name) {
            setStaffName(staffRes.data.name)
          }
        }
      } catch (err) {
        console.error('Failed to fetch return ticket context', err)
      } finally {
        setIsLoadingContext(false)
      }
    }

    fetchContext()
  }, [ticket, open, staffName])

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (open) window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  // Prevent body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  if (!ticket) return null

  const isUnassigned = !ticket.staffVerify
  const isMyTicket = ticket.staffVerify === currentStaffId
  const isOtherStaff = !isUnassigned && !isMyTicket

  const canVerify = isMyTicket || isUnassigned

  const actionLabel = isUnassigned ? 'Claim & Verify' : 'Process Ticket'

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        ref={overlayRef}
        onClick={onClose}
        className={`fixed inset-0 z-[1000] bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Drawer Panel */}
      <div
        className={`fixed top-0 right-0 z-[1001] h-full w-full max-w-[480px] bg-white shadow-2xl flex flex-col
          transition-transform duration-300 ease-out
          ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-white to-slate-50/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
              <IoReceiptOutline className="text-emerald-600" size={18} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">Return Ticket</h2>
              <p className="text-[11px] text-slate-400 font-medium font-mono">
                #{truncateId(ticket.id)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ReturnTicketStatusBadge status={ticket.status} />
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-700"
            >
              <IoCloseOutline size={20} />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Assignment Banner */}
          {isOtherStaff && (
            <div className="flex items-start gap-3 p-3.5 bg-amber-50 border border-amber-200 rounded-xl">
              <IoAlertCircleOutline className="text-amber-500 mt-0.5 shrink-0" size={18} />
              <div>
                <p className="text-xs font-bold text-amber-700">Assigned to Another Staff</p>
                <p className="text-[11px] text-amber-600 mt-0.5">
                  This ticket is being handled by a different staff member. View only.
                </p>
              </div>
            </div>
          )}

          {isMyTicket && (
            <div className="flex items-start gap-3 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl">
              <IoShieldCheckmarkOutline className="text-emerald-600 mt-0.5 shrink-0" size={18} />
              <div>
                <p className="text-xs font-bold text-emerald-700">Assigned to You</p>
                <p className="text-[11px] text-emerald-600 mt-0.5">
                  You are responsible for verifying this ticket.
                </p>
              </div>
            </div>
          )}

          {/* Basic Info */}
          <div className="bg-slate-50 rounded-2xl p-4 space-y-3.5">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              Ticket Info
            </p>
            <InfoRow
              label="Order ID"
              isLoading={isLoadingContext}
              value={
                <span className="text-blue-600 font-mono">
                  {orderCode || truncateId(ticket.orderId)}
                </span>
              }
            />
            <InfoRow
              label="Customer ID"
              isLoading={isLoadingContext}
              value={
                <span className="text-slate-600 font-mono">
                  {customerName || truncateId(ticket.customerId)}
                </span>
              }
            />
            <InfoRow label="Reason" value={resolveReasonLabel(ticket.reason)} />
            <InfoRow label="Quantity" value={`${ticket.quantity} item(s)`} />
          </div>

          {/* Financials */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <IoCashOutline className="text-emerald-600" size={16} />
              <p className="text-[11px] font-bold text-emerald-700 uppercase tracking-widest">
                Refund Amount
              </p>
            </div>
            <p className="text-3xl font-bold text-emerald-600 tracking-tight">
              {ticket.money?.toLocaleString('vi-VN')}
              <span className="ml-1 text-sm font-medium text-emerald-500">đ</span>
            </p>
          </div>

          {/* Staff Verify */}
          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
            <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center">
              <IoPersonOutline className="text-slate-400" size={16} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Assigned Staff
              </p>
              <div className="text-sm font-semibold text-slate-700">
                {isLoadingContext ? (
                  <div className="h-4 w-24 bg-slate-200 animate-pulse rounded mt-1" />
                ) : staffName ? (
                  staffName
                ) : ticket.staffVerify ? (
                  <span className="font-mono text-[13px]">{truncateId(ticket.staffVerify)}</span>
                ) : (
                  <span className="text-slate-400 font-normal italic">Not assigned yet</span>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          {ticket.description && (
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                Customer Description
              </p>
              <div className="text-sm text-slate-700 leading-relaxed bg-slate-50 border border-slate-100 rounded-xl p-4">
                {ticket.description}
              </div>
            </div>
          )}

          {/* Media */}
          {ticket.media && ticket.media.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <IoImageOutline className="text-slate-400" size={15} />
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Evidence Photos ({ticket.media.length})
                </p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {ticket.media.map((url, i) => (
                  <a
                    key={i}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative aspect-square overflow-hidden rounded-xl border border-slate-200 hover:border-emerald-400 transition-all"
                  >
                    <img
                      src={url}
                      alt={`Evidence ${i + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src =
                          'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=200&h=200&fit=crop'
                      }}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                      <IoOpenOutline
                        className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        size={20}
                      />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-start gap-2 p-3 bg-slate-50 rounded-xl">
              <IoCalendarOutline className="text-slate-400 mt-0.5 shrink-0" size={14} />
              <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                  Created
                </p>
                <p className="text-xs font-semibold text-slate-700 mt-0.5">{ticket.createdAt}</p>
              </div>
            </div>
            <div className="flex items-start gap-2 p-3 bg-slate-50 rounded-xl">
              <IoCalendarOutline className="text-slate-400 mt-0.5 shrink-0" size={14} />
              <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                  Updated
                </p>
                <p className="text-xs font-semibold text-slate-700 mt-0.5">{ticket.updatedAt}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/60 space-y-2.5">
          {canVerify && (
            <button
              onClick={() => onGoToVerify(ticket)}
              className="w-full h-11 bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] text-white font-bold rounded-xl
                flex items-center justify-center gap-2 text-sm transition-all shadow-lg shadow-emerald-100"
            >
              <IoShieldCheckmarkOutline size={18} />
              {actionLabel}
            </button>
          )}
          <button
            onClick={onClose}
            className="w-full h-10 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 font-semibold
              rounded-xl flex items-center justify-center text-sm transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </>,
    document.body
  )
}
