import { cn } from '@/lib/utils'
import type { Column, Order } from './OrderTable'

interface OrderListProps {
  orders: Order[]
  columns: Column<Order>[]
  role?: 'sales' | 'operation'
}

export default function OrderList({ orders, columns, role = 'operation' }: OrderListProps) {
  const isSales = role === 'sales'

  return (
    <tbody className="divide-y divide-neutral-50">
      {orders.map((order, orderIndex) => (
        <tr key={orderIndex} className="group hover:bg-neutral-50/50 transition-colors">
          {columns.map((col, colIndex) => (
            <td
              key={colIndex}
              className={cn(
                'px-4 py-4 text-sm text-gray-600 align-middle',
                col.header === 'ACTION' ||
                  (isSales && col.header === 'ORDER ID') ||
                  (!isSales && col.header === 'MÃ ĐƠN')
                  ? 'text-center'
                  : '',
                col.className
              )}
            >
              {col.render(order)}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  )
}
