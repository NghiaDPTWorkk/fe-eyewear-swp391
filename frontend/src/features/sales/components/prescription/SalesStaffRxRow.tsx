import React from 'react'
import { cn } from '@/lib/utils'
import type { Order } from '../../types'
import { SalesStaffRxActions } from './SalesStaffRxActions'

interface SalesStaffRxRowProps {
  order: Order
  onVerify: () => void
  onReject: () => void
}

export const SalesStaffRxRow: React.FC<SalesStaffRxRowProps> = ({ order, onVerify, onReject }) => {
  const rx = order.lensParameter
  const rxSummary = rx ? `S:${rx.SPH} C:${rx.CYL} A:${rx.AXIS} P:${rx.PD}` : 'Not provided'

  return (
    <tr className="border-b border-neutral-50 hover:bg-neutral-50/50 transition-colors group text-center">
      <td className="px-6 py-5">
        <span className="text-sm font-bold text-primary-500">ORD-{order.id}</span>
      </td>
      <td className="px-6 py-5 text-left">
        <div className="flex flex-col">
          <span className="text-sm font-bold text-slate-700">
            {order.productName || 'Custom Lens'}
          </span>
          <span className="text-[11px] text-slate-400 font-medium">Prescription Eyewear</span>
        </div>
      </td>
      <td className="px-6 py-5">
        <span className="text-[12px] font-medium text-slate-600 bg-slate-50 px-2 py-1 rounded">
          {rxSummary}
        </span>
      </td>
      <td className="px-6 py-5">
        <span
          className={cn(
            'px-3 py-1 rounded-full text-[10px] font-bold uppercase border',
            order.status === 'WAITING_ASSIGN'
              ? 'bg-amber-50 text-amber-500 border-amber-100'
              : 'bg-blue-50 text-blue-500 border-blue-100'
          )}
        >
          {order.status === 'WAITING_ASSIGN' ? 'Waiting Verify' : 'Processing'}
        </span>
      </td>
      <td className="px-6 py-5">
        <SalesStaffRxActions order={order} onVerify={onVerify} onReject={onReject} />
      </td>
    </tr>
  )
}
