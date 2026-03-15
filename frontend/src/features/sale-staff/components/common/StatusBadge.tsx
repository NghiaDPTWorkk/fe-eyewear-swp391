import { cn } from '@/lib/utils'
import { COLORS, STYLES } from '../../constants/saleStaffDesignSystem'

export type OrderStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'VERIFIED'
  | 'UNVERIFIED'
  | 'WAITING_ASSIGN'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'DEPOSITED'
  | 'DELAYED'
  | 'ARRIVED'

interface StatusBadgeProps {
  status: OrderStatus | string
  label?: string
  className?: string
}

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  PENDING: { label: 'Pending', className: COLORS.status.pending },
  WAITING_ASSIGN: { label: 'Awaiting Assignment', className: COLORS.status.processing },
  DEPOSITED: { label: 'Deposited', className: COLORS.status.pending },
  PROCESSING: { label: 'Processing', className: COLORS.status.processing },
  COMPLETED: { label: 'Completed', className: COLORS.status.completed },
  APPROVED: { label: 'Verified', className: COLORS.status.completed },
  VERIFIED: { label: 'Verified', className: COLORS.status.completed },
  REJECTED: { label: 'Rejected', className: COLORS.status.rejected },
  DELAYED: { label: 'Delayed', className: COLORS.status.delayed },
  ARRIVED: { label: 'Arrived', className: COLORS.status.arrived },
  UNVERIFIED: { label: 'Unverified', className: COLORS.status.rejected }
}

export default function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const upperStatus = status?.toUpperCase() || 'PENDING'
  const config =
    STATUS_CONFIG[upperStatus] ||
    (status
      ? {
          label: status,
          className: 'bg-gray-50 text-gray-500 border-gray-100'
        }
      : {
          label: 'Pending',
          className: COLORS.status.pending
        })

  return (
    <span className={cn(STYLES.statusBadge, config.className, className)}>
      {label || config.label}
    </span>
  )
}
