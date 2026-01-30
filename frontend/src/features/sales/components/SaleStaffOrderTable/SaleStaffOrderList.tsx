import { cn } from '@/lib/utils'
import type { Column, Order } from './SaleStaffOrderTable'

interface SaleStaffOrderListProps {
  orders: Order[]
  columns: Column<Order>[]
  onRowClick?: (orderId: string, order?: Order) => void
}

export default function SaleStaffOrderList({
  orders,
  columns,
  onRowClick
}: SaleStaffOrderListProps) {
  return (
    <tbody className="divide-y divide-neutral-50">
      {orders.map((order, orderIndex) => (
        <tr
          key={orderIndex}
          className={cn(
            'group hover:bg-neutral-50/50 transition-colors',
            onRowClick && 'cursor-pointer'
          )}
          onClick={() => onRowClick?.(order.id, order)}
        >
          {columns.map((col, colIndex) => (
            <td key={colIndex} className={cn('px-0 py-4 text-sm text-gray-600', col.className)}>
              {col.render(order)}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  )
}
