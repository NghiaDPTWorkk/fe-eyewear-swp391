import type { ReactNode } from 'react'
import { IoTimeOutline, IoEyeOutline, IoChevronForward } from 'react-icons/io5'
import { Button } from '@/components'
import { cn } from '@/lib/utils'

export interface Order {
  id: string
  orderType: string
  customer: string
  item: string
  waitingFor?: string
  currentStatus: string
  timeElapsed: string
  statusColor: string
  isNextActive: boolean
}

export interface Column<T> {
  header: string | ReactNode
  render: (item: T) => ReactNode
  className?: string
  headerClassName?: string
}

interface OrderTableProps {
  columns?: Column<Order>[]
  hiddenColumns?: string[]
  filterType?: string
}

const getOrderTypeStyles = (type: string) => {
  switch (type) {
    case 'Đơn Thường':
      return 'bg-emerald-50 text-emerald-600'
    case 'Pre-order':
      return 'bg-amber-50 text-amber-600'
    case 'Prescription':
      return 'bg-indigo-50 text-indigo-600'
    default:
      return 'bg-neutral-100 text-neutral-600'
  }
}

export default function OrderTable({ columns, hiddenColumns = [], filterType }: OrderTableProps) {
  const orders: Order[] = [
    {
      id: 'ORD-001',
      orderType: 'Đơn Thường',
      customer: 'Nguyễn Văn A',
      item: 'SKU-001',
      waitingFor: 'Tròng Chemi 5.5',
      currentStatus: 'Processing',
      timeElapsed: '2h 15m',
      statusColor: 'bg-blue-50 text-blue-600',
      isNextActive: true
    },
    {
      id: 'ORD-002',
      orderType: 'Pre-order',
      customer: 'Trần Thị B',
      item: 'SKU-001',
      waitingFor: 'Gọng Titan',
      currentStatus: 'Lens Edging & Mounting',
      timeElapsed: '3h 45m',
      statusColor: 'bg-indigo-50 text-indigo-600',
      isNextActive: false
    },
    {
      id: 'PRE-003',
      orderType: 'Pre-order',
      customer: 'Lê Văn C',
      item: 'SKU-001',
      currentStatus: 'Awaiting Stock',
      timeElapsed: '5d 2h',
      statusColor: 'bg-amber-50 text-amber-600',
      isNextActive: true
    },
    {
      id: 'ORD-004',
      orderType: 'Prescription',
      customer: 'Phạm Thị D',
      item: 'SKU-001',
      currentStatus: 'Pending QC',
      timeElapsed: '45m',
      statusColor: 'bg-gray-100 text-gray-600',
      isNextActive: true
    },
    {
      id: 'ORD-005',
      orderType: 'Đơn Thường',
      customer: 'Hoàng Văn E',
      item: 'SKU-001',
      currentStatus: 'Packed',
      timeElapsed: '1h 30m',
      statusColor: 'bg-emerald-50 text-emerald-600',
      isNextActive: true
    }
  ]

  const filteredOrders = filterType
    ? orders.filter((order) => order.orderType === filterType)
    : orders

  const defaultColumns: Column<Order>[] = [
    {
      header: 'MÃ ĐƠN',
      render: (order) => (
        <div>
          <div>{order.id}</div>
          <div className="w-12 h-1.5 bg-neutral-100 rounded-full mt-1 overflow-hidden">
            <div className="bg-mint-500 h-full rounded-full w-1/2"></div>
          </div>
        </div>
      ),
      className: 'font-medium'
    },
    {
      header: 'LOẠI ĐƠN',
      render: (order) => (
        <span
          className={`px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap ${getOrderTypeStyles(
            order.orderType
          )}`}
        >
          {order.orderType}
        </span>
      )
    },
    {
      header: 'CUSTOMER',
      render: (order) => order.customer
    },
    {
      header: 'ITEMS',
      render: (order) => order.item,
      className: 'text-gray-400'
    },
    {
      header: 'WAITING FOR',
      render: (order) => order.waitingFor || '-',
      className: 'text-purple-600 font-medium'
    },
    {
      header: 'TRẠNG THÁI',
      render: (order) => (
        <span className={`px-3 py-1 rounded-md text-xs font-medium ${order.statusColor}`}>
          {order.currentStatus}
        </span>
      )
    },
    {
      header: 'ORDER AT',
      render: (order) => (
        <div className="flex items-center gap-1.5">
          <IoTimeOutline />
          {order.timeElapsed}
        </div>
      ),
      className: 'text-neutral-500'
    },
    {
      header: 'ACTION',
      headerClassName: 'text-center',
      render: (order) => (
        <div className="flex items-center justify-center gap-4">
          <Button className="text-blue-500 hover:text-blue-700">
            <IoEyeOutline size={20} />
          </Button>
          <button
            className={`flex items-center gap-1 px-4 py-1.5 rounded-lg text-white text-xs font-medium transition-colors ${
              order.isNextActive
                ? 'bg-emerald-500 hover:bg-emerald-600'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
            disabled={!order.isNextActive}
          >
            Next <IoChevronForward />
          </button>
        </div>
      )
    }
  ]

  const activeColumns = (columns || defaultColumns).filter(
    (col) => !hiddenColumns.includes(col.header as string)
  )

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <OrderHeaderTable columns={activeColumns} />
        <OrderList orders={filteredOrders} columns={activeColumns} />
      </table>
    </div>
  )
}

function OrderHeaderTable({ columns }: { columns: Column<Order>[] }) {
  return (
    <thead>
      <tr className="border-b border-gray-100">
        {columns.map((col, idx) => (
          <th
            key={idx}
            className={cn(
              'px-4 py-3 text-[11px] font-bold text-neutral-400 uppercase tracking-wider',
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

function OrderList({ orders, columns }: { orders: Order[]; columns: Column<Order>[] }) {
  return (
    <tbody className="divide-y divide-gray-50">
      {orders.map((order) => (
        <tr key={order.id} className="group hover:bg-gray-50/50 transition-colors">
          {columns.map((col, idx) => (
            <td key={idx} className={cn('px-4 py-4 text-sm text-gray-600', col.className)}>
              {col.render(order)}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  )
}
