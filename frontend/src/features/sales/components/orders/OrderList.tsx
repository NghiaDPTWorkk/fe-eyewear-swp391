import { cn } from '@/lib/utils'
import type { Column, Order } from './OrderTable'

interface OrderListProps {
  orders: Order[]
  columns: Column<Order>[]
  role?: 'sales' | 'operation'
  onRowClick?: (orderId: string) => void
}

export default function OrderList({
  orders,
  columns,
  role = 'operation',
  onRowClick
}: OrderListProps) {
  const isSales = role === 'sales'

  return (
    <tbody className="divide-y divide-neutral-50">
      {orders.map((order, orderIndex) => (
        <tr
          key={orderIndex}
          className={cn(
            'group hover:bg-neutral-50/50 transition-colors',
            onRowClick && 'cursor-pointer'
          )}
          onClick={() => onRowClick?.(order.id)}
        >
          {columns.map((col, colIndex) => (
            <td
              key={colIndex}
              className={cn(
                'px-4 py-4 text-sm text-gray-600',
                col.header === 'ACTION' || (isSales && col.header === 'ORDER ID')
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
