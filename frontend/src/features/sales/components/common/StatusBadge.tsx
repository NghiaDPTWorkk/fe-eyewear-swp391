/**
 * StatusBadge Component
 * Consistent status indicator for orders across all SaleStaff pages.
 */
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
  WAITING_ASSIGN: { label: 'Waiting Verify', className: COLORS.status.pending },
  DEPOSITED: { label: 'Deposited', className: COLORS.status.pending },
  PROCESSING: { label: 'Processing', className: COLORS.status.processing },
  COMPLETED: { label: 'Completed', className: COLORS.status.completed },
  APPROVED: { label: 'Approved', className: COLORS.status.completed },
  VERIFIED: { label: 'Verified', className: COLORS.status.completed },
  REJECTED: { label: 'Rejected', className: COLORS.status.rejected },
  DELAYED: { label: 'Delayed', className: COLORS.status.delayed },
  ARRIVED: { label: 'Arrived', className: COLORS.status.arrived },
  UNVERIFIED: { label: 'Unverified', className: COLORS.status.rejected }
}

export default function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const upperStatus = status?.toUpperCase() || 'UNKNOWN'
  const config =
    STATUS_CONFIG[upperStatus] ||
    (status
      ? {
          label: status,
          className: 'bg-gray-50 text-gray-500 border-gray-100'
        }
      : {
          label: 'Unknown',
          className: 'bg-gray-50 text-gray-500 border-gray-100'
        })

  return (
    <span className={cn(STYLES.statusBadge, config.className, className)}>
      {label || config.label}
    </span>
  )
}
