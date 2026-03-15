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
      <Card className="p-0 overflow-hidden border border-neutral-200 shadow-sm bg-white rounded-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white border-b border-neutral-100 text-[10px] text-slate-400 font-bold tracking-widest">
              <tr>
                <th className="px-6 py-5 text-center w-28 pr-12">ORDER CODE</th>
                <th className="px-6 py-5">CUSTOMER NAME</th>
                <th className="px-6 py-5 text-center">DATE</th>
                <th className="px-6 py-5 text-center">TYPE</th>
                <th className="px-6 py-5 text-center">VERIFICATION</th>
                <th className="px-6 py-5 text-center">STATUS</th>
                <th className="px-6 py-5 text-center w-40">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {[...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-4 py-6">
                    <div className="h-4 bg-gray-100 rounded w-20 mx-auto"></div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="h-4 bg-gray-100 rounded w-32 mx-auto"></div>
                  </td>
                  <td className="px-4 py-6">
                    <div className="h-4 bg-gray-100 rounded w-24 mx-auto"></div>
                  </td>
                  <td className="px-4 py-6">
                    <div className="h-4 bg-gray-100 rounded w-16 mx-auto"></div>
                  </td>
                  <td className="px-4 py-6">
                    <div className="h-4 bg-gray-100 rounded w-24 mx-auto"></div>
                  </td>
                  <td className="px-4 py-6">
                    <div className="h-4 bg-gray-100 rounded w-20 mx-auto"></div>
                  </td>
                  <td className="px-4 py-6">
                    <div className="h-4 bg-gray-100 rounded w-28 mx-auto"></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    )

  return (
    <Card className="p-0 overflow-hidden border border-neutral-200 shadow-sm bg-white rounded-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-white border-b border-neutral-100 text-[10px] text-slate-400 font-bold tracking-widest">
            <tr>
              <th className="px-6 py-5 text-center w-28 pr-12">ORDER CODE</th>
              <th className="px-6 py-5">CUSTOMER NAME</th>
              <th className="px-6 py-5 text-center">DATE</th>
              <th className="px-6 py-5 text-center">TYPE</th>
              <th className="px-6 py-5 text-center">VERIFICATION</th>
              <th className="px-6 py-5 text-center">STATUS</th>
              <th className="px-6 py-5 text-center w-40">ACTIONS</th>
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
