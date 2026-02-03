import React from 'react'
import type { Order } from '../../types'
import { SalesStaffRxRow } from './RxRow'

interface SalesStaffRxTableProps {
  orders: Order[]
  onVerify: (order: Order) => void
  loading?: boolean
}

export const SalesStaffRxTable: React.FC<SalesStaffRxTableProps> = ({
  orders,
  onVerify,
  loading
}) => {
  if (loading)
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-white border-b border-neutral-100 text-xs uppercase text-slate-400 font-medium tracking-wide">
            <tr className="text-center">
              <th className="px-6 py-5">Order Code</th>
              <th className="px-6 py-5 text-left">Lens / Product</th>
              <th className="px-6 py-5">Customer</th>
              <th className="px-6 py-5">Rx Summary</th>
              <th className="px-6 py-5">Verification</th>
              <th className="px-6 py-5">Status</th>
              <th className="px-6 py-5">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {[...Array(5)].map((_, i) => (
              <tr key={i} className="animate-pulse">
                <td className="px-6 py-6">
                  <div className="h-4 bg-gray-100 rounded w-20 mx-auto"></div>
                </td>
                <td className="px-6 py-6">
                  <div className="h-4 bg-gray-100 rounded w-40"></div>
                </td>
                <td className="px-6 py-6">
                  <div className="h-4 bg-gray-100 rounded w-32 mx-auto"></div>
                </td>
                <td className="px-6 py-6">
                  <div className="h-4 bg-gray-100 rounded w-48 mx-auto"></div>
                </td>
                <td className="px-6 py-6">
                  <div className="h-4 bg-gray-100 rounded w-24 mx-auto"></div>
                </td>
                <td className="px-6 py-6">
                  <div className="h-4 bg-gray-100 rounded w-20 mx-auto"></div>
                </td>
                <td className="px-6 py-6">
                  <div className="h-4 bg-gray-100 rounded w-28 mx-auto"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="bg-white border-b border-neutral-100 text-xs uppercase text-slate-400 font-medium tracking-wide">
          <tr className="text-center">
            <th className="px-6 py-5">Order Code</th>
            <th className="px-6 py-5 text-left">Lens / Product</th>
            <th className="px-6 py-5">Customer</th>
            <th className="px-6 py-5">Rx Summary</th>
            <th className="px-6 py-5">Verification</th>
            <th className="px-6 py-5">Status</th>
            <th className="px-6 py-5">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {orders.length === 0 ? (
            <tr>
              <td colSpan={7} className="py-20 text-center text-gray-400 font-medium">
                No prescription orders found.
              </td>
            </tr>
          ) : (
            orders.map((order) => (
              <SalesStaffRxRow key={order._id} order={order} onVerify={() => onVerify(order)} />
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
