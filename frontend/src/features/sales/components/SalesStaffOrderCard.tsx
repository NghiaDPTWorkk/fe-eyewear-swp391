import React from 'react'
import {
  IoCheckmarkCircleOutline,
  IoEyeOutline,
  IoChatbubbleEllipsesOutline
} from 'react-icons/io5'
import { cn } from '@/lib/utils'
import type { Order } from '../types'

interface SalesStaffOrderCardProps {
  order: Order
  onVerify: () => void
  onViewDetail: () => void
  onChat: () => void
}

export const SalesStaffOrderCard: React.FC<SalesStaffOrderCardProps> = ({
  order,
  onVerify,
  onViewDetail,
  onChat
}) => {
  const isMfg = order.type?.includes('MANUFACTURING')
  const isPreorder = order.type?.includes('PRE-ORDER') as any // Assuming type might have this or derive it
  const isVerified =
    order.status === 'VERIFIED' || order.status === 'APPROVED' || order.status === 'COMPLETED'

  // Categorize for UI display based on image
  const orderTypeLabel = isMfg ? 'PRESCRIPTION' : isPreorder ? 'PRE-ORDER' : 'REGULAR'

  return (
    <tr
      className="border-b border-neutral-50 hover:bg-neutral-50/30 transition-colors group cursor-pointer"
      onClick={onViewDetail}
    >
      <td className="px-4 py-6 text-center">
        <span className="text-sm font-semibold text-emerald-500 uppercase">{order.orderCode}</span>
      </td>

      <td className="px-6 py-6 font-primary text-center">
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-slate-700">
            {order.customerName || 'Guest User'}
          </span>
          <span className="text-[11px] text-slate-400 font-normal">
            {order.customerPhone || '+1 (555) 012-3456'}
          </span>
        </div>
      </td>

      <td className="px-4 py-6 text-center">
        <div className="flex flex-col items-center">
          <span className="text-sm text-slate-500 font-medium">
            {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
          </span>
        </div>
      </td>

      <td className="px-4 py-6 text-center">
        <span
          className={cn(
            'px-3 py-1 rounded-lg text-[9px] font-semibold uppercase tracking-wider',
            isMfg
              ? 'bg-indigo-50 text-indigo-500'
              : isPreorder
                ? 'bg-amber-50 text-amber-500'
                : 'bg-slate-50 text-slate-400'
          )}
        >
          {orderTypeLabel}
        </span>
      </td>

      <td className="px-4 py-6 text-center">
        {isMfg ? (
          <span
            className={cn(
              'px-3 py-1 rounded-lg text-[9px] font-semibold uppercase tracking-wider',
              isVerified
                ? 'bg-emerald-50 text-emerald-500 border border-emerald-100'
                : 'bg-amber-50 text-amber-500 border border-amber-100'
            )}
          >
            {isVerified ? 'VERIFIED' : 'NOT VERIFIED'}
          </span>
        ) : (
          <span className="text-slate-300 font-medium">-</span>
        )}
      </td>

      <td className="px-4 py-6 text-center">
        <span
          className={cn(
            'px-4 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border',
            order.status === 'PROCESSING'
              ? 'bg-blue-50 text-blue-500 border-blue-100'
              : order.status === 'COMPLETED'
                ? 'bg-emerald-50 text-emerald-500 border-emerald-100'
                : 'bg-slate-50 text-slate-400 border-slate-100'
          )}
        >
          {order.status}
        </span>
      </td>

      <td className="px-4 py-6 text-center">
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onViewDetail()
            }}
            className="text-slate-400 hover:text-slate-600 transition-colors"
            title="View Details"
          >
            <IoEyeOutline size={18} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onChat()
            }}
            className="text-blue-400 hover:text-blue-600 transition-colors"
            title="Chat with Customer"
          >
            <IoChatbubbleEllipsesOutline size={18} />
          </button>
          {isMfg && !isVerified && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onVerify()
              }}
              className="text-emerald-400 hover:text-emerald-500 transition-colors"
              title="Quick Verify"
            >
              <IoCheckmarkCircleOutline size={18} />
            </button>
          )}
        </div>
      </td>
    </tr>
  )
}
