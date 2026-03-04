import {
  IoEyeOutline,
  IoChatbubbleEllipsesOutline,
  IoCheckmarkCircleOutline,
  IoGlassesOutline
} from 'react-icons/io5'
import { cn } from '@/lib/utils'
import StatusBadge from './StatusBadge'
import type { Order } from '../../types'
import { getOrderTypeLabel, isOrderVerified } from '../../utils/orderUtils'

export const renderOrderCode = (order: Order, onClick?: (id: string) => void) => (
  <div
    className="text-sm font-semibold text-emerald-500 cursor-pointer hover:text-emerald-600 transition-colors inline-block"
    onClick={(e) => {
      if (onClick) {
        e.stopPropagation()
        onClick(order._id)
      }
    }}
  >
    {order.orderCode || (order._id ? `ORD-${order._id.slice(-6).toUpperCase()}` : 'N/A')}
  </div>
)

export const renderCustomer = (order: Order) => (
  <div className="flex flex-col">
    <span className="text-sm font-semibold text-slate-700">
      {order.customerName || 'Guest User'}
    </span>
    <span className="text-[11px] text-slate-400 font-normal">
      {order.customerPhone || 'No Phone'}
    </span>
  </div>
)

export const renderProductInfo = (order: Order) => {
  const productSku = order.products?.[0]?.product?.sku || order.products?.[0]?.lens?.sku || 'N/A'
  const productName = order.products?.[0]?.product?.product_name || 'Prescription Eyewear'

  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-emerald-50 rounded-xl border border-emerald-100/50 flex items-center justify-center text-emerald-600 shrink-0">
        <IoGlassesOutline size={20} />
      </div>
      <div className="min-w-0 flex-1 text-left">
        <div className="text-sm font-semibold text-[#3d4465] truncate">{productSku}</div>
        <div className="text-[11px] text-[#a4a9c1] font-medium truncate">{productName}</div>
      </div>
    </div>
  )
}

export const renderOrderType = (order: Order) => {
  const label = getOrderTypeLabel(order)
  return (
    <span
      className={cn(
        'px-3 py-1 rounded-lg text-[9px] font-semibold uppercase tracking-wider',
        label === 'Prescription'
          ? 'bg-indigo-50 text-indigo-500'
          : label === 'Pre-order'
            ? 'bg-amber-50 text-amber-500'
            : 'bg-slate-50 text-slate-400'
      )}
    >
      {label}
    </span>
  )
}

export const renderVerificationStatus = (order: Order) => {
  const isPrescription = order.isPrescription
  const isVerified = isOrderVerified(order)

  if (!isPrescription) return <span className="text-slate-300 font-medium">-</span>

  return (
    <StatusBadge
      status={isVerified ? 'COMPLETED' : 'PENDING'}
      label={isVerified ? 'Verified' : 'Need Verify'}
    />
  )
}

export const renderActions = (
  order: Order,
  {
    onOpenDetail,
    onChat,
    onVerify,
    onReject
  }: {
    onOpenDetail?: () => void
    onChat?: () => void
    onVerify?: () => void
    onReject?: () => void
  }
) => {
  const isVerified = isOrderVerified(order)
  const isPrescription = order.isPrescription

  return (
    <div className="flex items-center justify-center gap-1">
      <div className="w-8 flex justify-center">
        {onOpenDetail && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onOpenDetail()
            }}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-all"
            title="View Details"
          >
            <IoEyeOutline size={18} />
          </button>
        )}
      </div>

      <div className="w-8 flex justify-center">
        {onChat && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onChat()
            }}
            className="p-2 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
            title="Chat with Customer"
          >
            <IoChatbubbleEllipsesOutline size={18} />
          </button>
        )}
      </div>

      <div className="w-8 flex justify-center">
        {onVerify && isPrescription && !isVerified ? (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onVerify()
            }}
            className="p-2 text-emerald-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-lg transition-all"
            title="Quick Verify"
          >
            <IoCheckmarkCircleOutline size={18} />
          </button>
        ) : onReject ? (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onReject()
            }}
            className="p-2 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
            title="Reject Order"
          >
            <IoCheckmarkCircleOutline size={18} className="rotate-45" />
          </button>
        ) : null}
      </div>
    </div>
  )
}
