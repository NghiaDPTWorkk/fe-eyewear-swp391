import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import OrderHeaderTable from './OrderHeaderTable'
import OrderList from './OrderList'
import { Button } from '@/components'
import { IoTimeOutline, IoChevronForward, IoEyeOutline } from 'react-icons/io5'
import { PATHS } from '@/routes/paths'
import type { OrderTableRow } from '@/shared/types'

export type Order = OrderTableRow

export interface Column<T> {
  header: string | ReactNode
  render: (item: T) => ReactNode
  className?: string // Class cho td á
  headerClassName?: string // Class cho th
}

interface OrderTableProps {
  columns?: Column<Order>[] // Mảng các cột | thuộc tính
  hiddenColumns?: string[] // Mảng các header cột muốn ẩn
  filterType?: string
  role?: 'sales' | 'operation'
  orders?: Order[]
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
  }
}

export default function OrderTable({
  columns,
  hiddenColumns = [],
  filterType,
  role = 'operation',
  orders = []
}: OrderTableProps) {
  const isSales = role === 'sales'
  const navigate = useNavigate()

  const handleViewOrder = (orderId: string) => {
    navigate(PATHS.OPERATIONSTAFF.ORDER_DETAIL(orderId))
  }

  const filteredOrders = filterType
    ? orders.filter((order) => order.orderType?.toLowerCase() === filterType.toLowerCase())
    : orders

  const defaultColumns: Column<Order>[] = [
    {
      header: 'ORDER ID',
      render: (order) => (
        <div className={isSales ? 'flex flex-col items-center' : ''}>
          <div
            className={cn('font-bold text-neutral-900 cursor-pointer', !isSales && 'font-medium')}
            onClick={() => handleViewOrder(order.id)}
          >
            {order.id}
          </div>
          <div
            className={cn(
              'w-12 mt-1 rounded-full overflow-hidden',
              isSales ? 'h-1 bg-neutral-100' : 'h-1.5 bg-gray-200'
            )}
          >
            <div className="bg-emerald-400 h-full w-1/2 rounded-full"></div>
          </div>
        </div>
      ),
      headerClassName: isSales ? 'text-center' : '',
      className: isSales ? 'font-medium text-center' : 'font-medium'
    },
    {
      header: 'TYPE',
      render: (order) => (
        <span
          className={cn(
            'whitespace-nowrap font-bold uppercase tracking-wider',
            isSales
              ? 'px-3 py-1 rounded-full text-[10px]'
              : 'px-3 py-1 rounded-md text-xs font-medium',
            getOrderTypeStyles(order.orderType, role)
          )}
        >
          {order.orderType}
        </span>
      ),
      headerClassName: isSales ? 'text-center' : '',
      className: isSales ? 'text-center' : ''
    },
    {
      header: 'CUSTOMER',
      render: (order) => (
        <div className={cn('text-neutral-900', isSales ? 'font-medium' : '')}>{order.customer}</div>
      )
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
      header: 'STATUS',
      render: (order) => (
        <span
          className={cn(
            'font-bold uppercase tracking-wider whitespace-nowrap',
            isSales
              ? 'px-3 py-1 rounded-full text-[10px]'
              : 'px-3 py-1 rounded-md text-xs font-medium',
            order.statusColor
          )}
        >
          {order.currentStatus}
        </span>
      ),
      headerClassName: 'text-center',
      className: 'text-center'
    },
    {
      header: 'ORDER AT',
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
        <div className={`flex items-center justify-center gap-3`}>
          {!isSales && (
            <Button
              variant="ghost"
              size="sm"
              colorScheme="secondary"
              className="p-2"
              onClick={() => handleViewOrder(order.id)}
            >
              <IoEyeOutline size={20} />
            </Button>
          )}
          <Button
            variant={isSales ? 'ghost' : 'solid'}
            colorScheme="primary"
            size="sm"
            className={
              isSales ? 'p-2 h-8 w-8 text-primary-500' : 'text-xs rounded-xl h-8 px-4 font-bold'
            }
            isDisabled={!order.isNextActive}
            title={isSales ? 'Details' : 'Next'}
            rightIcon={!isSales ? <IoChevronForward /> : undefined}
            onClick={() => handleViewOrder(order.id)}
          >
            {isSales && <IoChevronForward size={18} />}
            {!isSales && 'Next'}
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
        <OrderHeaderTable columns={activeColumns} role={role} />
        <OrderList orders={filteredOrders} columns={activeColumns} role={role} />
      </table>
    </div>
  )
}
