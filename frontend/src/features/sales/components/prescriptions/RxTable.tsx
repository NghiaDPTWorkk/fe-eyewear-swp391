import React from 'react'
import type { Order } from '../../types'
import { SalesStaffRxRow } from './RxRow'

interface SalesStaffRxTableProps {
  orders: Order[]
  onVerify: (order: Order) => void
  onReject: (order: Order) => void
  loading?: boolean
}

export const SalesStaffRxTable: React.FC<SalesStaffRxTableProps> = ({
  orders,
  onVerify,
  onReject,
  loading
}) => {
  if (loading)
    return (
      <div className="p-20 flex flex-col items-center justify-center text-gray-400">
        <div className="w-10 h-10 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium animate-pulse">Scanning prescriptions...</p>
      </div>
    )

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="bg-white border-b border-neutral-100 text-[10px] uppercase text-slate-400 font-semibold tracking-widest">
          <tr className="text-center">
            <th className="px-6 py-5">Order Code</th>
            <th className="px-6 py-5 text-left">Lens / Product</th>
            <th className="px-6 py-5">Customer</th>
            <th className="px-6 py-5">Rx Summary</th>
            <th className="px-6 py-5">Status</th>
            <th className="px-6 py-5">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {orders.length === 0 ? (
            <tr>
              <td colSpan={5} className="py-20 text-center text-gray-400 font-medium">
                No prescription orders found.
              </td>
            </tr>
          ) : (
            orders.map((order) => (
              <SalesStaffRxRow
                key={order._id}
                order={order}
                onVerify={() => onVerify(order)}
                onReject={() => onReject(order)}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
