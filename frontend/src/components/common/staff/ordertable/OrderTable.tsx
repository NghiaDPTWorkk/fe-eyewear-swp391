import type { ReactNode } from 'react'
import OrderHeaderTable from './OrderHeaderTable'
import OrderList from './OrderList'
import { IoEyeOutline, IoChevronForward, IoTimeOutline } from 'react-icons/io5'

export interface Order {
  id: string
  customer: string
  item: string
  waitingFor?: string
  currentStatus: string
  timeElapsed: string
  statusColor: string
  isNextActive: boolean
}

// Định nghĩa cấu trúc 1 cột
export interface Column<T> {
  header: string | ReactNode // Tiêu đề cột (Text hoặc Component)
  render: (item: T) => ReactNode // Hàm hiển thị dữ liệu cho từng dòng
  className?: string // Class cho td (cell)
  headerClassName?: string // Class cho th (header)
}

interface OrderTableProps {
  columns?: Column<Order>[] // Mảng các cột
}

export default function OrderTable({ columns }: OrderTableProps) {
  // Mock data
  const orders: Order[] = [
    {
      id: 'PRE-001',
      customer: 'Nguyen Van A',
      item: 'SKU-001',
      waitingFor: 'Tròng Chemi 5.5',
      currentStatus: 'Awaiting Stock',
      timeElapsed: '2d 5h',
      statusColor: 'bg-orange-100 text-orange-600',
      isNextActive: true
    },
    {
      id: 'PRE-002',
      customer: 'Tran Thi B',
      item: 'SKU-001',
      waitingFor: 'Gọng Titan',
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

  // Default Columns nếu không truyền props
  const defaultColumns: Column<Order>[] = [
    {
      header: 'Order ID',
      render: (order) => (
        <div>
          <div>{order.id}</div>
          <div className="w-12 h-1.5 bg-gray-200 rounded-full mt-1">
            <div className="bg-emerald-400 h-full rounded-full w-1/2"></div>
          </div>
        </div>
      ),
      className: 'font-medium'
    },
    {
      header: 'Customer',
      render: (order) => order.customer
    },
    {
      header: 'Items',
      render: (order) => order.item,
      className: 'text-gray-400'
    },
    // Ví dụ cột Waiting For (mặc định có thể comment lại hoặc để đó)
    {
      header: 'Waiting For',
      render: (order) => order.waitingFor || '-',
      className: 'text-purple-600 font-medium'
    },
    {
      header: 'Current Status',
      render: (order) => (
        <span className={`px-3 py-1 rounded-md text-xs font-medium ${order.statusColor}`}>
          {order.currentStatus}
        </span>
      )
    },
    {
      header: 'Time Elapsed',
      render: (order) => (
        <div className="flex items-center gap-1.5">
          <IoTimeOutline />
          {order.timeElapsed}
        </div>
      ),
      className: 'text-gray-500'
    },
    {
      header: 'Actions',
      headerClassName: 'text-center',
      render: (order) => (
        <div className="flex items-center justify-center gap-4">
          <button className="text-blue-500 hover:text-blue-700">
            <IoEyeOutline size={20} />
          </button>
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

  const activeColumns = columns || defaultColumns

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="w-full text-left border-collapse">
        <OrderHeaderTable columns={activeColumns} />
        <OrderList orders={orders} columns={activeColumns} />
      </table>
    </div>
  )
}
