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
  const lensProduct = order.products?.find((p) => p.lens)
  const rx = lensProduct?.lens?.parameters
  const rxSummary = rx
    ? `R: ${rx.right?.SPH}/${rx.right?.CYL} L: ${rx.left?.SPH}/${rx.left?.CYL}`
    : '-'

  const productSku = order.products?.[0]?.product?.sku || order.products?.[0]?.lens?.sku || 'N/A'
  const productName = order.products?.[0]?.product?.product_name || 'Prescription Eyewear'

  return (
    <tr
      className="border-b border-neutral-50 hover:bg-neutral-50/50 transition-colors group text-center cursor-pointer"
      onClick={onVerify}
    >
      <td className="px-6 py-5">
        <span className="text-sm font-semibold text-primary-500 uppercase">{order.orderCode}</span>
      </td>
      <td className="px-6 py-5 text-left min-w-[180px]">
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-slate-700">{productSku}</span>
          <span className="text-[11px] text-slate-400 font-normal">{productName}</span>
        </div>
      </td>
      <td className="px-6 py-5 whitespace-nowrap">
        <div className="flex flex-col">
          <span className="text-[13px] font-semibold text-slate-700">
            {order.customerName || 'Guest'}
          </span>
          <span className="text-[10px] text-slate-400 font-normal">{order.customerPhone}</span>
        </div>
      </td>
      <td className="px-6 py-5">
        <span className="text-[12px] font-medium text-slate-600 bg-slate-50/80 px-2 py-1 rounded-lg border border-slate-100">
          {rxSummary}
        </span>
      </td>
      <td className="px-6 py-5">
        <span
          className={cn(
            'px-3 py-1 rounded-full text-[10px] font-semibold uppercase border',
            order.status === 'WAITING_ASSIGN' ||
              order.status === 'PENDING' ||
              order.status === 'DEPOSITED'
              ? 'bg-amber-50 text-amber-600 border-amber-100/50'
              : 'bg-emerald-50 text-emerald-600 border-emerald-100/50'
          )}
        >
          {order.status === 'WAITING_ASSIGN' ? 'Waiting Verify' : order.status}
        </span>
      </td>
      <td className="px-6 py-5">
        <SalesStaffRxActions order={order} onVerify={onVerify} onReject={onReject} />
      </td>
    </tr>
  )
}
