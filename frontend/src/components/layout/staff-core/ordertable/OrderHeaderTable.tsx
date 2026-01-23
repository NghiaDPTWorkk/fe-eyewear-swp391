import React from 'react'
import type { Column, Order } from './OrderTable'

interface OrderHeaderTableProps {
  columns: Column<Order>[]
}

export default function OrderHeaderTable({ columns }: OrderHeaderTableProps) {
  return (
    <thead>
      <tr className="border-b border-gray-50 text-xs bg-gray-100 font-bold text-gray-400 uppercase tracking-wider cursor-default select-none">
        {columns.map((col, index) => (
          <th key={index} className={`px-6 py-4 ${col.headerClassName || ''}`}>
            {col.header}
          </th>
        ))}
      </tr>
    </thead>
  )
}
