import React, { type ReactNode } from 'react'
import { IoEyeOutline, IoChevronForward, IoTimeOutline } from 'react-icons/io5'

// Column definition interface
export interface ColumnDef<T> {
  key: string
  header: string
  render: (item: T) => ReactNode
  headerClassName?: string
  cellClassName?: string
}

// Order data type
export interface Order {
  id: string
  customer: string
  item: string
  currentStatus: string
  timeElapsed: string
  statusColor: string
  isNextActive: boolean
}

// Default column definitions for order table
export const defaultOrderColumns: ColumnDef<Order>[] = [
  {
    key: 'id',
    header: 'Order ID',
    cellClassName: 'px-6 py-4 font-medium',
    render: (order) => (
      <div>
        <div>{order.id}</div>
        <div className="w-12 h-1.5 bg-gray-200 rounded-full mt-1">
          <div className="bg-emerald-400 h-full rounded-full w-1/2"></div>
        </div>
      </div>
    )
  },
  {
    key: 'customer',
    header: 'Customer',
    cellClassName: 'px-6 py-4',
    render: (order) => order.customer
  },
  {
    key: 'item',
    header: 'Items',
    cellClassName: 'px-6 py-4 text-gray-400',
    render: (order) => order.item
  },
  {
    key: 'status',
    header: 'Current Status',
    cellClassName: 'px-6 py-4',
    render: (order) => (
      <span className={`px-3 py-1 rounded-md text-xs font-medium ${order.statusColor}`}>
        {order.currentStatus}
      </span>
    )
  },
  {
    key: 'time',
    header: 'Time Elapsed',
    cellClassName: 'px-6 py-4 text-gray-500',
    render: (order) => (
      <div className="flex items-center gap-1.5">
        <IoTimeOutline />
        {order.timeElapsed}
      </div>
    )
  },
  {
    key: 'actions',
    header: 'Actions',
    headerClassName: 'text-center',
    cellClassName: 'px-6 py-4',
    render: (order) => (
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
    )
  }
]
