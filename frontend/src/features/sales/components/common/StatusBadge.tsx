/**
 * StatusBadge Component
 * Consistent status indicator for orders across all SaleStaff pages.
 */
import { cn } from '@/lib/utils'
import { COLORS, STYLES } from '../../constants/saleStaffDesignSystem'

type StatusType = 'pending' | 'processing' | 'completed' | 'rejected' | 'delayed' | 'arrived'

interface StatusBadgeProps {
  status: StatusType
  label?: string
  className?: string
}

const STATUS_CONFIG: Record<StatusType, { label: string; className: string }> = {
  pending: { label: 'Pending', className: COLORS.status.pending },
  processing: { label: 'Processing', className: COLORS.status.processing },
  completed: { label: 'Completed', className: COLORS.status.completed },
  rejected: { label: 'Rejected', className: COLORS.status.rejected },
  delayed: { label: 'Delayed', className: COLORS.status.delayed },
  arrived: { label: 'Arrived', className: COLORS.status.arrived }
}

export default function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status]
  return (
    <span className={cn(STYLES.statusBadge, config.className, className)}>
      {label || config.label}
    </span>
  )
}
