import type { ReactNode } from 'react'
import OrderHeaderTable from './OrderHeaderTable'
import OrderList from './OrderList'
import { Button } from '@/components'
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
  role?: 'sales' | 'operation' // Phân biệt vai trò để hiển thị UI khác nhau
}

const getOrderTypeStyles = (type: string, role: string) => {
  if (role === 'sales') {
    switch (type) {
      case 'Normal':
        return 'bg-emerald-50 text-emerald-600'
      case 'Pre-order':
        return 'bg-amber-50 text-amber-600'
      case 'Prescription':
        return 'bg-indigo-50 text-indigo-600'
      default:
        return 'bg-neutral-50 text-neutral-600'
    }
  } else {
    // Original styles for operations (Vietnamese)
    switch (type) {
      case 'Đơn Thường':
        return 'bg-emerald-50 text-emerald-600'
      case 'Pre-order':
        return 'bg-amber-50 text-amber-600'
      case 'Prescription':
        return 'bg-indigo-50 text-indigo-600'
      default:
        return 'bg-neutral-50 text-neutral-600'
    }
  }
}

export default function OrderTable({
  columns,
  hiddenColumns = [],
  filterType,
  role = 'operation'
}: OrderTableProps) {
  const isSales = role === 'sales'

  const orders: Order[] = [
    {
      id: 'ORD-001',
      orderType: isSales ? 'Normal' : 'Đơn Thường',
      customer: 'Nguyễn Văn A',
      item: 'SKU-001',
      waitingFor: isSales ? 'Lens Chemi 5.5' : 'Tròng Chemi 5.5',
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
      waitingFor: isSales ? 'Titan Frames' : 'Gọng Titan',
      currentStatus: isSales ? 'Lens Edging' : 'LENS EDGING & MOUNTING',
      timeElapsed: '3h 45m',
      statusColor: 'bg-purple-100 text-purple-600',
      isNextActive: false
    },
    {
      id: 'PRE-003',
      orderType: 'Pre-order',
      customer: 'Lê Văn C',
      item: 'SKU-001',
      currentStatus: isSales ? 'Awaiting Stock' : 'AWAITING STOCK',
      timeElapsed: '5d 2h',
      statusColor: 'bg-orange-100 text-orange-600',
      isNextActive: true
    },
    {
      id: 'ORD-004',
      orderType: 'Prescription',
      customer: 'Phạm Thị D',
      item: 'SKU-001',
      currentStatus: isSales ? 'Pending QC' : 'PENDING QC',
      timeElapsed: '45m',
      statusColor: 'bg-gray-100 text-gray-600',
      isNextActive: true
    },
    {
      id: 'ORD-005',
      orderType: isSales ? 'Normal' : 'Đơn Thường',
      customer: 'Hoàng Văn E',
      item: 'SKU-001',
      currentStatus: isSales ? 'Packed' : 'PACKED',
      timeElapsed: '1h 30m',
      statusColor: 'bg-blue-100 text-blue-600',
      isNextActive: true
    }
  ]

  const filteredOrders = filterType
    ? orders.filter((order) => order.orderType === filterType)
    : orders

  // Default Columns (Phân biệt UI theo role)
  const defaultColumns: Column<Order>[] = [
    {
      header: isSales ? 'ORDER ID' : 'MÃ ĐƠN',
      render: (order) => (
        <div className={isSales ? 'flex flex-col items-center' : ''}>
          <div className="font-bold text-neutral-900">{order.id}</div>
          <div className="w-12 h-1 bg-neutral-100 rounded-full mt-1 overflow-hidden">
            <div className="bg-emerald-400 h-full w-1/2"></div>
          </div>
        </div>
      ),
      headerClassName: isSales ? 'text-center' : '',
      className: isSales ? 'font-medium text-center' : 'font-medium'
    },
    {
      header: isSales ? 'TYPE' : 'LOẠI ĐƠN',
      render: (order) => (
        <span
          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap ${getOrderTypeStyles(
            order.orderType,
            role
          )}`}
        >
          {order.orderType}
        </span>
      ),
      headerClassName: isSales ? 'text-center' : '',
      className: isSales ? 'text-center' : ''
    },
    {
      header: isSales ? 'CUSTOMER' : 'CUSTOMER',
      render: (order) => <div className="font-medium text-neutral-900">{order.customer}</div>
    },
    {
      header: 'ITEMS',
      render: (order) => order.item,
      className: isSales ? 'text-neutral-400 font-medium text-center' : 'text-gray-400',
      headerClassName: isSales ? 'text-center' : ''
    },
    {
      header: 'WAITING FOR',
      render: (order) => order.waitingFor || '-',
      className: 'text-purple-600 font-medium text-center',
      headerClassName: 'text-center'
    },
    {
      header: isSales ? 'STATUS' : 'TRẠNG THÁI',
      render: (order) => (
        <span
          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap ${order.statusColor}`}
        >
          {order.currentStatus}
        </span>
      ),
      headerClassName: 'text-center',
      className: 'text-center'
    },
    {
      header: isSales ? 'DATE' : 'ORDER AT',
      render: (order) => (
        <div className={`flex items-center gap-1.5 ${isSales ? 'justify-center' : ''}`}>
          <IoTimeOutline className={isSales ? 'text-neutral-400' : ''} />
          <span className={isSales ? 'text-neutral-500' : ''}>{order.timeElapsed}</span>
        </div>
      ),
      headerClassName: isSales ? 'text-center' : '',
      className: isSales ? 'text-center' : 'text-gray-500'
    },
    {
      header: 'ACTION',
      headerClassName: 'text-center w-32',
      render: (order) => (
        <div className={`flex items-center justify-center ${isSales ? 'gap-1' : 'gap-2'}`}>
          <Button
            variant="ghost"
            size="sm"
            colorScheme="neutral"
            className={
              isSales ? 'p-2 h-8 w-8 text-neutral-400 hover:text-primary-500' : 'p-2 h-8 w-8'
            }
            title={isSales ? 'View Details' : ''}
          >
            <IoEyeOutline size={18} />
          </Button>
          <Button
            variant={isSales ? 'ghost' : 'solid'}
            colorScheme="primary"
            size="sm"
            className={isSales ? 'p-2 h-8 w-8' : 'text-xs rounded-xl h-8 px-4 font-bold'}
            isDisabled={!order.isNextActive}
            title={isSales ? 'Next Step' : ''}
            rightIcon={!isSales ? <IoChevronForward /> : undefined}
          >
            {isSales ? <IoChevronForward size={18} /> : 'Next'}
          </Button>
        </div>
      )
    }
  ]

  const activeColumns = (columns || defaultColumns).filter(
    (col) => !hiddenColumns.includes(col.header as string)
  )

  return (
    <div className="overflow-x-auto bg-white rounded-lg">
      <table className="w-full text-left border-collapse">
        <OrderHeaderTable columns={activeColumns} role={role} />
        <OrderList orders={filteredOrders} columns={activeColumns} role={role} />
      </table>
    </div>
  )
}
