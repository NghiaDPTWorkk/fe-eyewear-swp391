import { useEffect, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import OrderHeaderTable from './OrderHeaderTable'
import OrderList from './OrderList'
import { Button } from '@/components'
import { IoTimeOutline, IoChevronForward, IoEyeOutline } from 'react-icons/io5'
import { PATHS } from '@/routes/paths'
import { useOrderCountStore } from '@/store'
import { OrderType, OrderStatus } from '@/shared/utils/enums/order.enum'

export interface Order {
  id: string
  orderCode?: string // Mã đơn hàng từ backend
  orderType: string
  customer: string
  item: string
  waitingFor?: string
  currentStatus: string
  timeElapsed: string
  statusColor: string
  isNextActive: boolean
  price?: number // Giá đơn hàng
  assignedStaff?: string // Staff được assign
  createdAt: string // For sorting
}

// Định nghĩa cấu trúc 1 cột
export interface Column<T> {
  header: string | ReactNode
  render: (item: T) => ReactNode
  className?: string
  headerClassName?: string
}

interface OrderTableProps {
  orders?: Order[] // Nhận orders từ parent component
  isLoading?: boolean // Trạng thái đang fetch data từ API
  isError?: boolean // Trạng thái lỗi khi fetch API
  columns?: Column<Order>[]
  hiddenColumns?: string[]
  filterType?: string
  role?: 'sales' | 'operation'
  pageType?: 'technical' | 'logistics' | 'packing' | 'all'
}

const getOrderTypeStyles = (type: string, role: string) => {
  if (role === 'sales') {
    switch (type) {
      // ========== START NEW CODE ==========
      case OrderType.NORMAL:
        return 'bg-emerald-50 text-emerald-600'
      case OrderType.PRE_ORDER:
        return 'bg-amber-50 text-amber-600'
      case OrderType.MANUFACTURING:
        return 'bg-indigo-50 text-indigo-600'
      // ========== END NEW CODE ==========
      default:
        return 'bg-neutral-50 text-neutral-600'
    }
  } else {
    // operation staff
    switch (type) {
      case 'all':
        return 'bg-neutral-50 text-neutral-600'
      case OrderType.NORMAL:
        return 'bg-emerald-50 text-emerald-600'
      case OrderType.PRE_ORDER:
        return 'bg-amber-50 text-amber-600'
      case OrderType.MANUFACTURING:
        return 'bg-indigo-50 text-indigo-600'
      case OrderStatus.COMPLETED:
        return 'bg-blue-50 text-blue-600'
      default:
        return 'bg-neutral-50 text-neutral-600'
    }
  }
}

export default function OrderTable({
  orders: ordersFromProps,
  isLoading = false,
  isError = false,
  columns,
  hiddenColumns = [],
  filterType,
  role = 'operation',
  pageType
}: OrderTableProps) {
  const isSales = role === 'sales'
  const navigate = useNavigate()
  const { setCount } = useOrderCountStore()

  const handleViewOrder = (orderId: string) => {
    navigate(PATHS.OPERATIONSTAFF.ORDER_DETAIL(orderId))
  }

  // Dùng orders từ props nếu có, không thì dùng mock data
  const orders = ordersFromProps || []

  const filteredOrders = filterType
    ? orders.filter((order) => order.orderType === filterType)
    : orders

  // Cập nhật count vào store khi có pageType
  useEffect(() => {
    if (pageType) {
      setCount(pageType, filteredOrders.length)
    }
  }, [filteredOrders.length, pageType, setCount])

  const defaultColumns: Column<Order>[] = [
    {
      header: 'ORDER CODE',
      render: (order) => (
        <div className={isSales ? 'flex flex-col items-center' : ''}>
          <div className={cn('font-bold text-neutral-900', !isSales && 'font-medium')}>
            {order.orderCode || order.id}
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
            isDisabled={!order.isNextActive || order.currentStatus === 'COMPLETED'}
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

  // Nếu đang loading, hiển thị loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mint-500"></div>
        <p className="mt-4 text-gray-500">Loading orders...</p>
      </div>
    )
  }

  // Nếu có lỗi, hiển thị error state
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-red-600 font-semibold">Failed to load orders</p>
        <p className="text-gray-500 mt-2">Please try again later</p>
      </div>
    )
  }

  const activeColumns = (columns || defaultColumns).filter(
    (col) => !hiddenColumns.includes(col.header as string)
  )

  if (filteredOrders.length === 0) {
    return (
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full text-left border-collapse">
          <OrderHeaderTable columns={activeColumns} role={role} />
        </table>
        <div className="flex flex-col items-center justify-center py-16">
          <div className="text-gray-400 mb-3">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <p className="text-gray-600 font-semibold text-lg">No orders to process</p>
          <p className="text-gray-400 text-sm mt-1">
            There are currently no orders in this category
          </p>
        </div>
      </div>
    )
  }
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="w-full text-left border-collapse">
        <OrderHeaderTable columns={activeColumns} role={role} />
        <OrderList orders={filteredOrders} columns={activeColumns} role={role} />
      </table>
    </div>
  )
}
