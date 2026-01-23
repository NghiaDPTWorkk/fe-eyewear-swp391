import React from 'react'
import { IoEyeOutline, IoChevronForward, IoTimeOutline } from 'react-icons/io5'
import type { Order, ColumnConfig } from './OrderTable'

interface OrderListProps {
  orders: Order[]
  columns: ColumnConfig
}

export default function OrderList({ orders, columns }: OrderListProps) {
  return (
    <tbody className="divide-y divide-gray-50">
      {orders.map((order, index) => (
        <tr key={index} className="hover:bg-gray-50 transition-colors text-sm text-gray-700">
          {/* Order ID with progress bar */}
          {columns.showOrderId && (
            <td className="px-6 py-4 font-medium">
              <div>
                <div>{order.id}</div>
                <div className="w-12 h-1.5 bg-gray-200 rounded-full mt-1">
                  <div className="bg-emerald-400 h-full rounded-full w-1/2"></div>
                </div>
              </div>
            </td>
          )}

          {/* Customer */}
          {columns.showCustomer && <td className="px-6 py-4">{order.customer}</td>}

          {/* Items */}
          {columns.showItem && <td className="px-6 py-4 text-gray-400">{order.item}</td>}

          {/* Waiting For - CỘT MỚI */}
          {columns.showWaitingFor && (
            <td className="px-6 py-4 text-purple-600 font-medium">{order.waitingFor || '-'}</td>
          )}

          {/* Current Status */}
          {columns.showStatus && (
            <td className="px-6 py-4">
              <span className={`px-3 py-1 rounded-md text-xs font-medium ${order.statusColor}`}>
                {order.currentStatus}
              </span>
            </td>
          )}

          {/* Time Elapsed */}
          {columns.showTimeElapsed && (
            <td className="px-6 py-4 text-gray-500">
              <div className="flex items-center gap-1.5">
                <IoTimeOutline />
                {order.timeElapsed}
              </div>
            </td>
          )}

          {/* Actions */}
          {columns.showActions && (
            <td className="px-6 py-4">
              <div className="flex items-center justify-center gap-4">
                <button className="text-blue-500 hover:text-blue-700">
                  <IoEyeOutline size={20} />
                </button>
                <button
                  className={`flex items-center gap-1 px-4 py-1.5 rounded-lg text-white text-xs font-medium transition-colors ${
                    order.isNextActive
                      ? 'bg-emerald-500 hover:bg-emerald-600'
                      : 'bg-gray-300 cursor-not-allowed'
                  }`}
                  disabled={!order.isNextActive}
                >
                  Next <IoChevronForward />
                </button>
              </div>
            </td>
          )}
        </tr>
      ))}
    </tbody>
  )
}
