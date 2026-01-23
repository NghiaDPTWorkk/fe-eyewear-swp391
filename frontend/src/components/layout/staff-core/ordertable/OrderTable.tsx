import React from 'react'
import OrderHeaderTable from './OrderHeaderTable'
import OrderList from './OrderList'
import { defaultOrderColumns, type Order, type ColumnDef } from './columnDefs'

interface OrderTableProps {
  columns?: ColumnDef<Order>[]
  // Future: orders?: Order[] when API is ready
}

export default function OrderTable({ columns = defaultOrderColumns }: OrderTableProps) {
  // Mock data - will be replaced with API fetch in the future
  const orders: Order[] = [
    {
      id: 'PRE-001',
      customer: 'Nguyen Van A',
      item: 'SKU-001',
      currentStatus: 'Awaiting Stock',
      timeElapsed: '2d 5h',
      statusColor: 'bg-orange-100 text-orange-600',
      isNextActive: true
    },
    {
      id: 'PRE-002',
      customer: 'Tran Thi B',
      item: 'SKU-001',
      currentStatus: 'Awaiting Stock',
      timeElapsed: '1d 12h',
      statusColor: 'bg-orange-100 text-orange-600',
      isNextActive: false
    },
    {
      id: 'PRE-003',
      customer: 'Le Van C',
      item: 'SKU-001',
      currentStatus: 'In Stock',
      timeElapsed: '3h 20m',
      statusColor: 'bg-green-100 text-green-600',
      isNextActive: true
    },
    {
      id: 'PRE-004',
      customer: 'Pham Thi D',
      item: 'SKU-001',
      currentStatus: 'Processing',
      timeElapsed: '1h 45m',
      statusColor: 'bg-blue-100 text-blue-600',
      isNextActive: true
    }
  ]

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="w-full text-left border-collapse">
        <OrderHeaderTable columns={columns} />
        <OrderList orders={orders} columns={columns} />
      </table>
    </div>
  )
}
