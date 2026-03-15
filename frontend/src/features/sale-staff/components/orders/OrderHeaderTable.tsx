import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

interface ColumnHeader {
  header: string | ReactNode
  headerClassName?: string
}

interface OrderHeaderTableProps {
  columns: ColumnHeader[]
  role?: 'sales' | 'operation'
}

export default function OrderHeaderTable({ columns, role = 'operation' }: OrderHeaderTableProps) {
  const isSales = role === 'sales'

  return (
    <thead>
      <tr className={cn('border-b border-neutral-100', isSales ? 'bg-white' : 'bg-neutral-50/50')}>
        {columns.map((col, index) => (
          <th
            key={index}
            className={cn(
              'px-6 py-5 text-[10px] font-semibold uppercase tracking-widest',
              isSales ? 'text-[#a4a9c1]' : 'text-neutral-500 tracking-wider text-[11px]',
              col.header === 'ACTION' || (isSales && col.header === 'ORDER ID')
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
