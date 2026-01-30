import React, { type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import OrderHeaderTable from './OrderHeaderTable'
import OrderList from './OrderList'
import {
  IoChevronForward,
  IoGlassesOutline,
  IoChatbubbleEllipsesOutline,
  IoEyeOutline,
  IoCheckmarkCircleOutline
} from 'react-icons/io5'
import { PATHS } from '@/routes/paths'
import { IconButton } from '@/shared/components/ui/icon-button'

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
  onRowClick?: (orderId: string, order?: Order) => void
  onNotifyCustomer?: (orderId: string) => void
  onReviewRx?: (orderId: string) => void
}

export default function OrderTable({
  columns,
  hiddenColumns = [],
  filterType,
  role = 'operation',
  onRowClick,
  onNotifyCustomer,
  onReviewRx
}: OrderTableProps) {
  const navigate = useNavigate()

  const handleViewOrder = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId)
    if (!order) return

    if (role === 'sales') {
      // Sales role: Open drawer for Prescription, navigate for others
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

  const orders: Order[] = [
    {
      id: 'ORD-001',
      orderType: 'Prescription',
      customer: 'Van A Nguyen',
      customerId: 'c1',
      customerPhone: '+1 (555) 012-3456',
      item: 'SKU-001',
      waitingFor: 'Chemi 5.5 Lens',
      currentStatus: 'Processing',
      timeElapsed: '2h 15m',
      statusColor: 'bg-blue-100 text-blue-700',
      isNextActive: true,
      isApproved: false
    },
    {
      id: 'ORD-002',
      orderType: 'Pre-order',
      customer: 'Thi B Tran',
      customerId: 'c2',
      customerPhone: '+1 (555) 012-3456',
      item: 'SKU-001',
      waitingFor: 'Titan Frame',
      currentStatus: 'Lens Edging',
      timeElapsed: '3h 45m',
      statusColor: 'bg-purple-100 text-purple-700',
      isNextActive: false,
      isStockAvailable: true
    },
    {
      id: 'PRE-003',
      orderType: 'Pre-order',
      customer: 'Van C Le',
      customerId: 'c3',
      customerPhone: '+1 (555) 012-3456',
      item: 'SKU-001',
      currentStatus: 'Awaiting Stock',
      timeElapsed: '5d 2h',
      statusColor: 'bg-orange-100 text-orange-700',
      isNextActive: true,
      isStockAvailable: false
    },
    {
      id: 'ORD-004',
      orderType: 'Prescription',
      customer: 'Thi D Pham',
      customerId: 'c1',
      customerPhone: '+1 (555) 012-3456',
      item: 'SKU-001',
      currentStatus: 'Pending QC',
      timeElapsed: '45m',
      statusColor: 'bg-gray-100 text-gray-700',
      isNextActive: true,
      isApproved: true
    },
    {
      id: 'ORD-005',
      orderType: 'Regular',
      customer: 'Van E Hoang',
      customerId: 'c2',
      customerPhone: '+1 (555) 012-3456',
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
            handleViewOrder(order.id, order)
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
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation()
                    handleViewOrder(order.id, order)
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
                    onClick={(e: React.MouseEvent) => {
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
                    onClick={(e: React.MouseEvent) => {
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
      header: 'SKU / PRODUCT',
      headerClassName: 'px-4 text-center',
      className: 'px-4 py-6 text-center',
      render: (order) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-50 rounded-xl border border-emerald-100/50 flex items-center justify-center text-emerald-600 shrink-0">
            <IoGlassesOutline size={20} />
          </div>
          <div>
            <div className="text-sm font-semibold text-[#3d4465]">{order.item}</div>
            <div className="text-[11px] text-[#a4a9c1] font-medium">Ray-Ban Aviator Gold</div>
          </div>
        </div>
      )
    },
    {
      header: 'ORDER ID',
      headerClassName: 'px-4 text-center',
      className: 'px-4 py-6 text-center',
      render: (order) => (
        <div
          className="text-sm font-medium text-emerald-500 cursor-pointer hover:text-emerald-600 transition-colors"
          onClick={() => handleViewOrder(order.id)}
        >
          {order.id}
        </div>
      )
    },
    {
      header: 'CUSTOMER',
      headerClassName: 'px-4 text-center',
      className: 'px-4 py-6 text-center',
      render: (order) => (
        <div>
          <div className="text-sm font-semibold text-[#3d4465]">{order.customer}</div>
          <div className="text-[11px] text-[#a4a9c1] font-medium">+1 (555) 012-3456</div>
        </div>
      )
    },
    {
      header: 'LENS DETAILS',
      headerClassName: 'px-4 text-center',
      className: 'px-4 py-6 text-center',
      render: () => (
        <div>
          <div className="text-sm font-semibold text-[#3d4465]">Progressive</div>
          <div className="text-[10px] text-[#a4a9c1] font-medium uppercase tracking-widest">
            HIGH INDEX 1.67
          </div>
        </div>
      )
    },
    {
      header: 'DATE',
      headerClassName: 'px-4 text-center',
      className: 'px-4 py-6 text-center',
      render: () => <div className="text-sm font-medium text-[#3d4465]">Oct 24, 2023</div>
    },
    {
      header: 'LAB STATUS',
      headerClassName: 'px-4 text-center',
      className: 'px-4 py-6 text-center',
      render: (order) => (
        <div className="flex justify-center">
          <span
            className={cn(
              'px-4 py-1.5 rounded-full text-[9px] font-semibold uppercase tracking-widest border shadow-sm bg-white',
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
      header: 'ACTIONS',
      headerClassName: 'pr-10 text-right',
      className: 'pr-10 py-6 text-right',
      render: (order) => (
        <button
          className="text-neutral-300 hover:text-emerald-500 hover:bg-emerald-50 transition-all p-2 rounded-xl"
          onClick={(e) => {
            e.stopPropagation()
            handleViewOrder(order.id)
          }}
        >
          <IoChevronForward size={18} />
        </button>
      )
    }
  ]

  const activeColumns = (columns || (role === 'sales' ? salesColumns : defaultColumns)).filter(
    (col) => !hiddenColumns.includes(col.header as string)
  )

  return (
    <div className="w-full overflow-hidden bg-white">
      <div className="w-full overflow-x-auto no-scrollbar scroll-smooth">
        <table className="w-full text-left border-collapse min-w-[1000px] table-fixed">
          <OrderHeaderTable columns={activeColumns} role={role} />
          <OrderList orders={filteredOrders} columns={activeColumns} onRowClick={handleViewOrder} />
        </table>
      </div>
    </div>
  )
}
