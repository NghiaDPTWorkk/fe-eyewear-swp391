import React from 'react'
import type { ColumnConfig } from './OrderTable'

interface OrderHeaderTableProps {
  columns: ColumnConfig
}

export default function OrderHeaderTable({ columns }: OrderHeaderTableProps) {
  return (
    <thead>
      <tr className="border-b border-gray-50 text-xs bg-gray-100 font-bold text-gray-400 uppercase tracking-wider">
        {columns.showOrderId && <th className="px-6 py-4">Order ID</th>}
        {columns.showCustomer && <th className="px-6 py-4">Customer</th>}
        {columns.showItem && <th className="px-6 py-4">Items</th>}
        {columns.showWaitingFor && <th className="px-6 py-4">Waiting For</th>}
        {columns.showStatus && <th className="px-6 py-4">Current Status</th>}
        {columns.showTimeElapsed && <th className="px-6 py-4">Time Elapsed</th>}
        {columns.showActions && <th className="px-6 py-4 text-center">Actions</th>}
      </tr>
    </thead>
  )
}
