/**
 * OrderStatusIndicator Component
 * Shows visual cue for order auto-forwarding to Packaging Department.
 * Used in SaleStaffOrderPage for standard orders.
 */
import { IoArrowForward, IoCheckmarkCircle } from 'react-icons/io5'

interface OrderStatusIndicatorProps {
  status: 'ready' | 'forwarding' | 'sent'
  className?: string
}

const STATUS_CONFIG = {
  ready: {
    label: 'Ready for Packaging',
    bgClass: 'bg-emerald-50 border-emerald-200',
    textClass: 'text-emerald-700',
    icon: IoCheckmarkCircle
  },
  forwarding: {
    label: 'Auto-forwarding...',
    bgClass: 'bg-blue-50 border-blue-200 animate-pulse',
    textClass: 'text-blue-700',
    icon: IoArrowForward
  },
  sent: {
    label: 'Sent to Packaging',
    bgClass: 'bg-gray-50 border-gray-200',
    textClass: 'text-gray-600',
    icon: IoCheckmarkCircle
  }
}

export default function OrderStatusIndicator({
  status,
  className = ''
}: OrderStatusIndicatorProps) {
  const config = STATUS_CONFIG[status]
  const Icon = config.icon

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${config.bgClass} ${className}`}
    >
      <Icon className={`text-sm ${config.textClass}`} />
      <span className={`text-xs font-medium ${config.textClass}`}>{config.label}</span>
    </div>
  )
}
