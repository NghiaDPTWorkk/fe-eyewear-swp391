import React from 'react'
import { IoGlassesOutline } from 'react-icons/io5'
import { cn } from '@/lib/utils'
import type { Order } from '../types'
import { SalesStaffActionButtons } from './SalesStaffActionButtons'

interface SalesStaffOrderCardProps {
  order: Order
  onVerify: () => void
  onReject: () => void
  onViewDetail: () => void
}

export const SalesStaffOrderCard: React.FC<SalesStaffOrderCardProps> = ({
  order,
  onVerify,
  onReject,
  onViewDetail
}) => {
  return (
    <tr className="border-b border-neutral-50 hover:bg-neutral-50/30 transition-colors group">
      <td className="px-4 py-6 text-center">
        <span className="text-sm font-bold text-primary-500 cursor-pointer" onClick={onViewDetail}>
          {order.id}
        </span>
      </td>
      <td className="px-6 py-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-500">
            <IoGlassesOutline size={20} />
          </div>
          <div className="flex flex-col">
            <div className="text-[13px] font-bold text-slate-700 uppercase tracking-tight">
              SKU-{order.id}
            </div>
            <div className="text-[11px] text-slate-400 font-medium">
              {order.productName || 'Ray-Ban Aviator Gold'}
            </div>
          </div>
        </div>
      </td>
      <td className="px-4 py-6 text-center">
        <div className="flex flex-col items-center">
          <span className="text-sm font-bold text-slate-700">
            {order.customerName || 'Guest User'}
          </span>
          <span className="text-[11px] text-slate-400 font-medium">+1 (555) 012-3456</span>
        </div>
      </td>
      <td className="px-4 py-6 text-center">
        <span
          className={cn(
            'px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider',
            order.status === 'WAITING_ASSIGN'
              ? 'bg-slate-50 text-slate-400/80 border border-slate-100'
              : 'bg-blue-50 text-blue-500 border border-blue-100'
          )}
        >
          {order.status === 'WAITING_ASSIGN' ? 'Pending QC' : 'Processing'}
        </span>
      </td>
      <td className="px-4 py-6 text-center">
        <SalesStaffActionButtons
          order={order}
          onVerify={onVerify}
          onReject={onReject}
          onViewDetail={onViewDetail}
        />
      </td>
    </tr>
  )
}
