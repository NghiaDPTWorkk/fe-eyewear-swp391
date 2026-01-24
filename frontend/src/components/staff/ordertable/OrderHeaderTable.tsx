import { cn } from '@/lib/utils'
import type { Column, Order } from './OrderTable'

interface OrderHeaderTableProps {
  columns: Column<Order>[]
}

export default function OrderHeaderTable({ columns }: OrderHeaderTableProps) {
  return (
    <thead>
      <tr className="border-b border-neutral-200 bg-neutral-50/50">
        {columns.map((col, index) => (
          <th
            key={index}
            className={cn(
              'px-4 py-3.5 text-[11px] font-bold text-neutral-500 uppercase tracking-wider',
              col.headerClassName
            )}
          >
            {col.header}
          </th>
        ))}
      </tr>
    </thead>
  )
}
