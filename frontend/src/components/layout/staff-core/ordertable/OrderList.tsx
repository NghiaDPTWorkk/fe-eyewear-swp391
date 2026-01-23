import React from 'react'
import type { ColumnDef } from './columnDefs'

interface OrderListProps<T> {
  orders: T[]
  columns: ColumnDef<T>[]
}

export default function OrderList<T>({ orders, columns }: OrderListProps<T>) {
  return (
    <tbody className="divide-y divide-gray-50">
      {orders.map((order, rowIndex) => (
        <tr key={rowIndex} className="hover:bg-gray-50 transition-colors text-sm text-gray-700">
          {columns.map((column) => (
            <td key={column.key} className={column.cellClassName || 'px-6 py-4'}>
              {column.render(order)}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  )
}
