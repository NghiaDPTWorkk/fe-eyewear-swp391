import { type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import OrderHeaderTable from './OrderHeaderTable'
import OrderList from './OrderList'
import {
  IoGlassesOutline,
  IoChatbubbleEllipsesOutline,
  IoEyeOutline,
  IoCheckmarkCircleOutline
} from 'react-icons/io5'
import { PATHS } from '@/routes/paths'
import { IconButton } from '@/shared/components/ui/icon-button'

/**
 * Enhanced Order interface for the Sales Staff table view
 */
export interface Order {
  id: string
  orderType: 'Regular' | 'Pre-order' | 'Prescription'
  customer: string
  customerId: string
  customerPhone?: string
  item: string
  waitingFor?: string
  currentStatus: string
  timeElapsed: string
  statusColor: string
  isNextActive: boolean
  isApproved?: boolean
  isStockAvailable?: boolean
  prescriptionStatus?: 'PENDING_CONFIRMATION' | 'CONFIRMED' | 'REJECTED'
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
  role?: 'sales' | 'operation'
  orders?: Order[]
  onRowClick?: (orderId: string, order?: Order) => void
  onNotifyCustomer?: (customerId: string) => void
  onReviewRx?: (orderId: string) => void
}

export default function OrderTable({
  columns,
  hiddenColumns = [],
  filterType,
  role = 'sales',
  orders: providedOrders,
  onRowClick,
  onNotifyCustomer,
  onReviewRx
}: OrderTableProps) {
  const navigate = useNavigate()

  // Default mock data if no orders are provided
  const defaultOrders: Order[] = [
    {
      id: 'ORD-7352',
      orderType: 'Prescription',
      customer: 'Leslie Alexander',
      customerId: 'CUST-001',
      customerPhone: '+1 (555) 123-4567',
      item: 'Ray-Ban Aviator',
      waitingFor: 'Lens Grinding',
      currentStatus: 'In Production',
      timeElapsed: '2h 15m',
      statusColor: 'bg-blue-100 text-blue-700',
      isNextActive: true,
      isApproved: false
    },
    {
      id: 'ORD-7351',
      orderType: 'Regular',
      customer: 'Michael Foster',
      customerId: 'CUST-002',
      customerPhone: '+1 (555) 987-6543',
      item: 'Oakley Holbrook',
      currentStatus: 'Packed',
      timeElapsed: '4h 30m',
      statusColor: 'bg-emerald-100 text-emerald-700',
      isNextActive: true
    },
    {
      id: 'ORD-7350',
      orderType: 'Pre-order',
      customer: 'Dries Vincent',
      customerId: 'CUST-003',
      customerPhone: '+1 (555) 456-7890',
      item: 'Gucci GG0061S',
      waitingFor: 'Supplier Shipment',
      currentStatus: 'Awaiting Stock',
      timeElapsed: '2d 5h',
      statusColor: 'bg-amber-100 text-amber-700',
      isNextActive: false,
      isStockAvailable: false
    }
  ]

  const data = providedOrders || defaultOrders

  const filteredOrders = filterType
    ? data.filter((order) => order.orderType === filterType || filterType === 'All')
    : data

  const handleViewOrder = (orderId: string) => {
    const order = data.find((o) => o.id === orderId)
    if (!order) return

    if (role === 'sales') {
      if (order.orderType === 'Prescription') {
        onRowClick?.(orderId, order)
      } else if (order.orderType === 'Pre-order') {
        navigate(PATHS.SALESTAFF.PRE_ORDER_DETAIL(orderId))
      } else {
        navigate(PATHS.SALESTAFF.REGULAR_DETAIL(orderId))
      }
    } else {
      if (onRowClick) {
        onRowClick(orderId, order)
      } else {
        navigate(PATHS.OPERATIONSTAFF.ORDER_DETAIL(orderId))
      }
    }
  }

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
          <div className="min-w-0 flex-1 text-left">
            <div className="text-sm font-semibold text-[#3d4465] truncate">{order.item}</div>
            <div className="text-[11px] text-[#a4a9c1] font-medium truncate">
              Eyewear Collection
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
                ? 'bg-blue-50 text-blue-600 border border-blue-100'
                : order.orderType === 'Pre-order'
                  ? 'bg-amber-50 text-amber-600 border border-amber-100'
                  : 'bg-neutral-50 text-neutral-500 border border-neutral-100'
            )}
          >
            {order.orderType}
          </span>
        </div>
      )
    },
    {
      header: 'Status',
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
      headerClassName: 'px-4 text-center w-[140px]',
      className: 'px-4 py-6 text-center',
      render: (order) => {
        const isPrescription = order.orderType === 'Prescription'
        const isNotApproved = isPrescription && !order.isApproved
        const isRegular = order.orderType === 'Regular'

        return (
          <div className="flex justify-center items-center gap-1">
            <IconButton
              icon={<IoEyeOutline size={18} />}
              title="View Details"
              aria-label="View Details"
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 transition-all"
              onClick={(e) => {
                e.stopPropagation()
                handleViewOrder(order.id)
              }}
            />
            {!isRegular && (
              <IconButton
                icon={<IoChatbubbleEllipsesOutline size={18} />}
                title="Chat with Customer"
                aria-label="Chat"
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-blue-500 hover:bg-blue-50 transition-all"
                onClick={(e) => {
                  e.stopPropagation()
                  onNotifyCustomer?.(order.customerId)
                }}
              />
            )}
            {isNotApproved && (
              <IconButton
                icon={<IoCheckmarkCircleOutline size={18} />}
                title="Verify Prescription"
                aria-label="Verify"
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-orange-500 hover:bg-orange-50 transition-all"
                onClick={(e) => {
                  e.stopPropagation()
                  onReviewRx?.(order.id)
                }}
              />
            )}
          </div>
        )
      }
    }
  ]

  const activeColumns = (columns || salesColumns).filter(
    (col) => !hiddenColumns.includes(col.header as string)
  )

  return (
    <div className="w-full overflow-hidden bg-white">
      <div className="w-full overflow-x-auto no-scrollbar">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <OrderHeaderTable columns={activeColumns} role={role} />
          <OrderList
            orders={filteredOrders}
            columns={activeColumns}
            role={role}
            onRowClick={handleViewOrder}
          />
        </table>
      </div>
    </div>
  )
}
