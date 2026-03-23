import type { ReturnTicketStatus } from '@/shared/types/return-ticket.types'

interface ReturnTicketStatusBadgeProps {
  status: ReturnTicketStatus | string
  className?: string
}

const BADGE_MAP: Record<string, { label: string; cls: string }> = {
  PENDING: {
    label: 'Pending',
    cls: 'bg-amber-50 text-amber-600 border-amber-200'
  },
  IN_PROGRESS: {
    label: 'Verified',
    cls: 'bg-emerald-50 text-emerald-600 border-emerald-200'
  },
  APPROVED: {
    label: 'Approved',
    cls: 'bg-emerald-50 text-emerald-600 border-emerald-200'
  },
  REJECTED: {
    label: 'Rejected',
    cls: 'bg-red-50 text-red-600 border-red-200'
  },
  RETURNED: {
    label: 'Returned',
    cls: 'bg-violet-50 text-violet-600 border-violet-200'
  },
  DELIVERING: {
    label: 'Delivering',
    cls: 'bg-sky-50 text-sky-600 border-sky-200'
  },
  CANCEL: {
    label: 'Cancelled',
    cls: 'bg-slate-50 text-slate-500 border-slate-200'
  }
}

export default function ReturnTicketStatusBadge({
  status,
  className = ''
}: ReturnTicketStatusBadgeProps) {
  const key = status?.toUpperCase().replace(/-/g, '_') || 'PENDING'
  const config = BADGE_MAP[key] ?? {
    label: status,
    cls: 'bg-gray-50 text-gray-500 border-gray-200'
  }

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${config.cls} ${className}`}
    >
      {config.label}
    </span>
  )
}
