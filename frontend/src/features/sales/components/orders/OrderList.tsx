import React from 'react'
import { Card } from '@/components'
import type { Order } from '../../types'
import { OrderCard } from './OrderCard'

interface OrderListProps {
  orders: Order[]
  onVerify: (order: Order) => void
  onViewDetail: (order: Order) => void
  onChat: (order: Order) => void
  loading?: boolean
}

export const OrderList: React.FC<OrderListProps> = ({
  orders,
  onVerify,
  onViewDetail,
  onChat,
  loading
}) => {
  if (loading)
    return (
      <div className="p-20 flex flex-col items-center justify-center text-gray-400">
        <div className="w-10 h-10 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium animate-pulse">Fetching orders...</p>
      </div>
    )

  return (
    <Card className="p-0 overflow-hidden border border-neutral-200 shadow-sm bg-white rounded-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-white border-b border-neutral-100 text-xs uppercase text-slate-400 font-medium tracking-wide">
            <tr>
              <th className="px-6 py-5 text-center w-28">Order Code</th>
              <th className="px-6 py-5">Customer Name</th>
              <th className="px-6 py-5 text-center">Date</th>
              <th className="px-6 py-5 text-center">Type</th>
              <th className="px-6 py-5 text-center">Verification</th>
              <th className="px-6 py-5 text-center">Status</th>
              <th className="px-6 py-5 text-center w-40">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-20 text-center text-gray-400 font-medium">
                  No records found matching your criteria.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <OrderCard
                  key={order._id}
                  order={order}
                  onVerify={() => onVerify(order)}
                  onViewDetail={() => onViewDetail(order)}
                  onChat={() => onChat(order)}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
