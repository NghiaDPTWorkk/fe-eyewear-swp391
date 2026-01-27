import OrderHeaderTable from './OrderHeaderTable'
import OrderList from './OrderList'
import { mockOrders } from './mockData'
import { defaultColumns } from './defaultColumns'
import type { Column, Order } from './types'

interface OrderTableProps {
  columns?: Column<Order>[]
}

export default function OrderTable({ columns }: OrderTableProps) {
  const activeColumns = columns || defaultColumns

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="w-full text-left border-collapse">
        <OrderHeaderTable columns={activeColumns} />
        <OrderList orders={mockOrders} columns={activeColumns} />
      </table>
    </div>
  )
}
