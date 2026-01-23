import React from 'react'
import type { ColumnDef } from './columnDefs'

interface OrderHeaderTableProps<T> {
  columns: ColumnDef<T>[]
}

export default function OrderHeaderTable<T>({ columns }: OrderHeaderTableProps<T>) {
  return (
    <thead>
      <tr className="border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
        {columns.map((column) => (
          <th key={column.key} className={column.headerClassName || 'px-6 py-4'}>
            {column.header}
          </th>
        ))}
      </tr>
    </thead>
  )
}
