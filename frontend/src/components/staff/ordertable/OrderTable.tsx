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
    case 'Regular':
    case 'Normal':
    case 'Đơn Thường':
      return 'bg-mint-50 text-mint-700'
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
      orderType: 'Regular',
      customer: 'Van A Nguyen',
      item: 'SKU-001',
      waitingFor: 'Chemi 5.5 Lens',
      currentStatus: 'Processing',
      timeElapsed: '2h 15m',
      statusColor: 'bg-blue-100 text-blue-700',
      isNextActive: true
    },
    {
      id: 'ORD-002',
      orderType: 'Pre-order',
      customer: 'Thi B Tran',
      item: 'SKU-001',
      waitingFor: 'Titan Frame',
      currentStatus: 'Lens Edging & Mounting',
      timeElapsed: '3h 45m',
      statusColor: 'bg-purple-100 text-purple-700',
      isNextActive: false
    },
    {
      id: 'PRE-003',
      orderType: 'Pre-order',
      customer: 'Van C Le',
      item: 'SKU-001',
      currentStatus: 'Awaiting Stock',
      timeElapsed: '5d 2h',
      statusColor: 'bg-orange-100 text-orange-700',
      isNextActive: true
    },
    {
      id: 'ORD-004',
      orderType: 'Prescription',
      customer: 'Thi D Pham',
      item: 'SKU-001',
      currentStatus: 'Pending QC',
      timeElapsed: '45m',
      statusColor: 'bg-gray-100 text-gray-700',
      isNextActive: true
    },
    {
      id: 'ORD-005',
      orderType: 'Regular',
      customer: 'Van E Hoang',
      item: 'SKU-001',
      currentStatus: 'Packed',
      timeElapsed: '1h 30m',
      statusColor: 'bg-mint-100 text-mint-700',
      isNextActive: true
    }
  ]

  const filteredOrders = filterType
    ? orders.filter((order) => order.orderType === filterType)
    : orders

  const defaultColumns: Column<Order>[] = [
    {
      header: 'ORDER ID',
      render: (order) => (
        <div>
          <div
            className="font-bold text-neutral-900 transition-colors hover:text-mint-600 cursor-pointer"
            onClick={() => handleViewOrder(order.id)}
          >
            {order.id}
          </div>
          <div className="w-12 h-1.5 bg-gray-200 rounded-full mt-1 overflow-hidden">
            <div className="bg-mint-400 h-full rounded-full w-1/2"></div>
          </div>
        </div>
      ),
      className: 'font-medium'
    },
    {
      header: 'TYPE',
      render: (order) => (
        <span
          className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider whitespace-nowrap ${getOrderTypeStyles(
            order.orderType
          )}`}
        >
          {order.orderType}
        </span>
      )
    },
    {
      header: 'CUSTOMER',
      render: (order) => <span className="font-medium text-neutral-900">{order.customer}</span>
    },
    {
      header: 'ITEMS',
      render: (order) => order.item,
      className: 'text-gray-400'
    },
    {
      header: 'WAITING FOR',
      render: (order) => order.waitingFor || '-',
      className: 'text-mint-700 font-medium'
    },
    {
      header: 'STATUS',
      render: (order) => (
        <span
          className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider whitespace-nowrap ${order.statusColor}`}
        >
          {order.currentStatus}
        </span>
      )
    },
    {
      header: 'ORDER AT',
      render: (order) => (
        <div className="flex items-center gap-1.5 text-neutral-500">
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
            className="p-2 hover:bg-mint-50 hover:text-mint-600 transition-all rounded-lg"
            onClick={() => handleViewOrder(order.id)}
          >
            <IoEyeOutline size={20} />
          </Button>
          <Button
            variant="solid"
            colorScheme="primary"
            size="sm"
            className="text-xs font-bold rounded-xl px-4 hover:shadow-lg hover:shadow-mint-100 transition-all active:scale-95"
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
    <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-neutral-100">
      <table className="w-full text-left border-collapse">
        <OrderHeaderTable columns={activeColumns} />
        <OrderList orders={filteredOrders} columns={activeColumns} />
      </table>
    </div>
  )
}
