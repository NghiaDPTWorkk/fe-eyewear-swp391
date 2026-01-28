import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import OrderHeaderTable from './OrderHeaderTable'
import OrderList from './OrderList'
import { Button } from '@/components'
import { IoTimeOutline, IoEyeOutline, IoChevronForward } from 'react-icons/io5'
import { PATHS } from '@/routes/paths'

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
      return 'bg-neutral-50 text-neutral-600'
  }
}

export default function OrderTable({ columns, hiddenColumns = [], filterType }: OrderTableProps) {
  const navigate = useNavigate()

  const handleViewOrder = (orderId: string) => {
    navigate(PATHS.OPERATIONSTAFF.ORDER_DETAIL(orderId))
  }

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
        <div className="flex items-center justify-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            colorScheme="secondary"
            className="p-2"
            onClick={() => handleViewOrder(order.id)}
          >
            <IoEyeOutline size={20} />
          </Button>
          <Button
            variant="solid"
            colorScheme="primary"
            size="sm"
            className="text-xs"
            isDisabled={!order.isNextActive}
            rightIcon={<IoChevronForward />}
            onClick={() => handleViewOrder(order.id)}
          >
            Next
          </Button>
        </div>
      )
    }
  ]

  const activeColumns = (columns || defaultColumns).filter(
    (col) => !hiddenColumns.includes(col.header as string)
  )

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="w-full text-left border-collapse">
        <OrderHeaderTable columns={activeColumns} />
        <OrderList orders={filteredOrders} columns={activeColumns} />
      </table>
    </div>
  )
}
