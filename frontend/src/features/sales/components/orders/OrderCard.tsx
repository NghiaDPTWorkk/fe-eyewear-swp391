import React from 'react'
import type { Order } from '../../types'
import {
  renderOrderCode,
  renderCustomer,
  renderOrderType,
  renderVerificationStatus,
  renderActions
} from '../common/OrderTableColumns'
import { StatusBadge } from '../common'

interface OrderCardProps {
  order: Order
  onVerify: () => void
  onViewDetail: () => void
  onChat: () => void
}

export const OrderCard: React.FC<OrderCardProps> = ({ order, onVerify, onViewDetail, onChat }) => {
  return (
    <tr
      className="border-b border-neutral-50 hover:bg-neutral-50/50 transition-colors group cursor-pointer"
      onClick={onViewDetail}
    >
      <td className="px-4 py-5 text-center">{renderOrderCode(order, onViewDetail)}</td>

      <td className="px-6 py-5 font-primary text-center">{renderCustomer(order)}</td>

      <td className="px-4 py-5 text-center">
        <div className="flex flex-col items-center">
          <span className="text-sm text-slate-600">
            {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
          </span>
        </div>
      </td>

      <td className="px-4 py-5 text-center">{renderOrderType(order)}</td>

      <td className="px-4 py-5 text-center">{renderVerificationStatus(order)}</td>

      <td className="px-4 py-5 text-center">
        <StatusBadge status={order.status} />
      </td>

      <td className="px-4 py-5 text-center" onClick={(e) => e.stopPropagation()}>
        {renderActions(order, { onOpenDetail: onViewDetail, onChat, onVerify })}
      </td>
    </tr>
  )
}
