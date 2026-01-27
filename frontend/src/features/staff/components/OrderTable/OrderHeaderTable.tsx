import { cn } from '@/lib/utils'
import type { Column, Order } from './OrderTable'

interface OrderHeaderTableProps {
  columns: Column<Order>[]
  role?: 'sales' | 'operation'
}

export default function OrderHeaderTable({ columns, role = 'operation' }: OrderHeaderTableProps) {
  const isSales = role === 'sales'

  return (
    <thead>
      <tr className="border-b border-neutral-200 bg-neutral-50/50">
        {columns.map((col, index) => (
          <th
            key={index}
            className={cn(
              'px-4 py-3.5 text-[11px] font-bold text-neutral-500 uppercase tracking-wider align-middle',
              // Sales centers Order ID and Action, Operation centers only Action and MÃ ĐƠN
              col.header === 'ACTION' ||
                (isSales && col.header === 'ORDER ID') ||
                (!isSales && col.header === 'MÃ ĐƠN')
                ? 'text-center'
                : '',
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
