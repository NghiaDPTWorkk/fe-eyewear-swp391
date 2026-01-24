import type { ReactNode } from 'react'
import OrderHeaderTable from './OrderHeaderTable'
import OrderList from './OrderList'
import { IoTimeOutline, IoEyeOutline, IoChevronForward } from 'react-icons/io5'

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

// Định nghĩa cấu trúc 1 cột
export interface Column<T> {
  header: string | ReactNode // Tiêu đề cột (Text hoặc Component)
  render: (item: T) => ReactNode // Hàm hiển thị dữ liệu cho từng dòng
  className?: string // Class cho td á
  headerClassName?: string // Class cho th
}

interface OrderTableProps {
  columns?: Column<Order>[] // Mảng các cột
  hiddenColumns?: string[] // Mảng các header cột muốn ẩn
  filterType?: string // Loại đơn muốn lọc
}

const getOrderTypeStyles = (type: string) => {
  switch (type) {
    case 'Đơn Thường':
      return 'bg-green-100 text-green-700'
    case 'Pre-order':
      return 'bg-yellow-100 text-yellow-700'
    case 'Prescription':
      return 'bg-blue-100 text-blue-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

export default function OrderTable({ columns, hiddenColumns = [], filterType }: OrderTableProps) {
  // Mock data mốt thay sau
  const orders: Order[] = [
    {
      id: 'ORD-001',
      orderType: 'Đơn Thường',
      customer: 'Nguyễn Văn A',
      item: 'SKU-001',
      waitingFor: 'Tròng Chemi 5.5',
      currentStatus: 'Processing',
      timeElapsed: '2h 15m',
      statusColor: 'bg-blue-100 text-blue-600',
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
      statusColor: 'bg-purple-100 text-purple-600',
      isNextActive: false
    },
    {
      id: 'PRE-003',
      orderType: 'Pre-order',
      customer: 'Lê Văn C',
      item: 'SKU-001',
      currentStatus: 'Awaiting Stock',
      timeElapsed: '5d 2h',
      statusColor: 'bg-orange-100 text-orange-600',
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
      statusColor: 'bg-blue-100 text-blue-600',
      isNextActive: true
    }
  ]

  const filteredOrders = filterType
    ? orders.filter((order) => order.orderType === filterType)
    : orders

  // Default Columns nếu không truyền props
  const defaultColumns: Column<Order>[] = [
    {
      header: 'MÃ ĐƠN',
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
      className: 'text-gray-500'
    },
    {
      header: 'ACTION',
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
