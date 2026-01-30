import { cn } from '@/lib/utils'
import type { Column, Order } from './SaleStaffOrderTable'

interface SaleStaffOrderHeaderTableProps {
  columns: Column<Order>[]
  isSales?: boolean
}

export default function SaleStaffOrderHeaderTable({
  columns,
  isSales = true
}: SaleStaffOrderHeaderTableProps) {
  return (
    <thead>
      <tr className={cn('border-b border-neutral-100', isSales ? 'bg-white' : 'bg-neutral-50/50')}>
        {columns.map((col, index) => (
          <th
            key={index}
            className={cn(
              'px-0 py-5 text-[10px] font-bold uppercase tracking-widest text-center',
              isSales ? 'text-[#a4a9c1]' : 'text-neutral-500 tracking-wider text-[11px]',
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
