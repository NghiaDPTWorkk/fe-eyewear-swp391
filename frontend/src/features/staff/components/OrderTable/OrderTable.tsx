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

  const salesColumns: Column<Order>[] = [
    {
      header: 'Order ID',
      headerClassName: 'px-4 text-center w-[120px]',
      className: 'px-4 py-6 text-center',
      render: (order) => (
        <div
          className="text-sm font-semibold text-emerald-500 cursor-pointer hover:text-emerald-600 transition-colors inline-block"
          onClick={(e) => {
            e.stopPropagation()
            handleViewOrder(order.id)
          }}
        >
          {order.id}
        </div>
      )
    },
    {
      header: 'SKU / Product',
      headerClassName: 'px-6 text-center w-[220px]',
      className: 'px-6 py-6 text-center',
      render: (order) => (
        <div className="flex items-center gap-3 justify-center min-w-0">
          <div className="w-10 h-10 bg-emerald-50 rounded-xl border border-emerald-100/50 flex items-center justify-center text-emerald-600 shrink-0">
            <IoGlassesOutline size={20} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold text-[#3d4465] truncate">{order.item}</div>
            <div className="text-[11px] text-[#a4a9c1] font-medium truncate">
              Ray-Ban Aviator Gold
            </div>
          </div>
        </div>
      )
    },
    {
      header: 'Customer',
      headerClassName: 'px-4 text-center w-[200px]',
      className: 'px-4 py-6 text-center',
      render: (order) => (
        <div className="text-center min-w-0">
          <div className="text-sm font-semibold text-[#3d4465] truncate">{order.customer}</div>
          <div className="text-[11px] text-[#a4a9c1] font-medium whitespace-nowrap">
            {order.customerPhone}
          </div>
        </div>
      )
    },
    {
      header: 'Type',
      headerClassName: 'px-4 text-center',
      className: 'px-4 py-6 text-center',
      render: (order) => (
        <div className="flex justify-center">
          <span
            className={cn(
              'px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider',
              order.orderType === 'Prescription'
                ? 'bg-blue-50 text-blue-600'
                : order.orderType === 'Pre-order'
                  ? 'bg-amber-50 text-amber-600'
                  : 'bg-neutral-50 text-neutral-500'
            )}
          >
            {order.orderType}
          </span>
        </div>
      )
    },
    {
      header: 'Approved',
      headerClassName: 'px-4 text-center',
      className: 'px-4 py-6 text-center',
      render: (order) => {
        if (order.orderType !== 'Prescription') {
          return (
            <div className="flex justify-center w-full">
              <span className="text-neutral-300 font-bold text-lg">-</span>
            </div>
          )
        }
        return (
          <div className="flex justify-center">
            <span
              className={cn(
                'px-3 py-1 rounded-full text-[10px] font-bold uppercase ring-1 inline-block',
                order.isApproved
                  ? 'bg-emerald-50 text-emerald-600 ring-emerald-100'
                  : 'bg-red-50 text-red-600 ring-red-100'
              )}
            >
              {order.isApproved ? 'Approved' : 'Pending'}
            </span>
          </div>
        )
      }
    },
    {
      header: 'Lab Status',
      headerClassName: 'px-4 text-center',
      className: 'px-4 py-6 text-center',
      render: (order) => (
        <div className="flex justify-center">
          <span
            className={cn(
              'px-4 py-1.5 rounded-full text-[9px] font-semibold uppercase tracking-widest border bg-white',
              order.statusColor.includes('blue')
                ? 'text-blue-600 border-blue-100 bg-blue-50/30'
                : order.statusColor.includes('emerald') || order.statusColor.includes('mint')
                  ? 'text-emerald-600 border-emerald-100 bg-emerald-50/30'
                  : order.statusColor.includes('amber') || order.statusColor.includes('orange')
                    ? 'text-amber-600 border-amber-100 bg-amber-50/30'
                    : 'text-neutral-500 border-neutral-100'
            )}
          >
            {order.currentStatus}
          </span>
        </div>
      )
    },
    {
      header: 'Actions',
      headerClassName: 'px-4 text-center',
      className: 'px-4 py-6 text-center',
      render: (order) => {
        const isPrescription = order.orderType === 'Prescription'
        const isNotApproved = isPrescription && !order.isApproved
        const isRegular = order.orderType === 'Regular'
        const isPreOrder = order.orderType === 'Pre-order'

        return (
          <div className="flex justify-center items-center">
            <div className="flex items-center justify-center gap-0 w-[120px]">
              {/* Slot 1: View Details (Fixed Width 40px) */}
              <div className="w-10 flex justify-center">
                <IconButton
                  icon={<IoEyeOutline size={18} />}
                  title={
                    isPrescription
                      ? 'View Prescription'
                      : isPreOrder
                        ? 'View Pre-order'
                        : 'View Order'
                  }
                  aria-label="View Details"
                  variant="ghost"
                  colorScheme="primary"
                  size="sm"
                  className="text-slate-600 hover:bg-slate-100"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleViewOrder(order.id)
                  }}
                />
              </div>

              {/* Slot 2: Chat (Fixed Width 40px) */}
              <div className="w-10 flex justify-center">
                {!isRegular ? (
                  <IconButton
                    icon={<IoChatbubbleEllipsesOutline size={18} />}
                    title="Chat with Customer"
                    aria-label="Chat with Customer"
                    variant="ghost"
                    colorScheme="secondary"
                    size="sm"
                    className="text-blue-500 hover:bg-blue-50"
                    onClick={(e) => {
                      e.stopPropagation()
                      onNotifyCustomer?.(order.customerId)
                    }}
                  />
                ) : (
                  <div className="w-[32px]" /> // Placeholder to keep alignment
                )}
              </div>

              {/* Slot 3: Quick Verify Check (Fixed Width 40px) */}
              <div className="w-10 flex justify-center">
                {isNotApproved ? (
                  <IconButton
                    icon={<IoCheckmarkCircleOutline size={18} />}
                    title="Verify Prescription"
                    aria-label="Quick Verify"
                    variant="ghost"
                    colorScheme="primary"
                    size="sm"
                    className="text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50"
                    onClick={(e) => {
                      e.stopPropagation()
                      onReviewRx?.(order.id)
                    }}
                  />
                ) : (
                  <div className="w-[32px]" /> // Placeholder to keep alignment
                )}
              </div>
            </div>
          </div>
        )
      }
    }
  ]

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
      headerClassName: 'px-4 text-center',
      className: 'px-4 py-6 text-center',
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

  const activeColumns = (columns || (role === 'sales' ? salesColumns : defaultColumns)).filter(
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
