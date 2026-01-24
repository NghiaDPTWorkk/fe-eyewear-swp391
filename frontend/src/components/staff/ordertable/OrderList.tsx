import type { Column, Order } from './OrderTable'

interface OrderListProps {
  orders: Order[]
  columns: Column<Order>[]
}

export default function OrderList({ orders, columns }: OrderListProps) {
  return (
    <tbody className="divide-y divide-gray-50">
      {orders.map((order, orderIndex) => (
        <tr
          key={orderIndex}
          className="hover:bg-gray-50 transition-colors text-sm text-gray-700 cursor-default select-none"
        >
          {columns.map((col, colIndex) => (
            <td key={colIndex} className={`px-6 py-4 ${col.className || ''}`}>
              {col.render(order)}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  )
}
