import type { ReactNode } from 'react'
import { IoTimeOutline, IoEyeOutline, IoChevronForward } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'

import OrderHeaderTable from '@/features/sales/components/orders/OrderHeaderTable'
import { cn } from '@/lib/utils'
import { PATHS } from '@/routes/paths'
import { Button } from '@/shared/components/ui-core'

export interface Order {
  id: string
  orderType: string
  customer: string
  item: string
  waitingFor?: string
  currentStatus: string
  prescriptionStatus?: 'PENDING_CONFIRMATION' | 'CONFIRMED' | 'REJECTED'
  timeElapsed: string
  createdAt: string // For sorting
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
  role?: 'sales' | 'operations'
  onConfirmPrescription?: (orderId: string) => void
  onRowClick?: (orderId: string) => void
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

const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-001',
    orderType: 'Prescription',
    customer: 'Van A Nguyen',
    item: 'Ray-Ban Aviator',
    prescriptionStatus: 'PENDING_CONFIRMATION',
    currentStatus: 'Pending',
    timeElapsed: '2 mins ago',
    createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    statusColor: 'bg-orange-100 text-orange-700',
    isNextActive: true
  },
  {
    id: 'ORD-002',
    orderType: 'Regular',
    customer: 'Thi B Tran',
    item: 'Oakley Holbrook',
    currentStatus: 'In Production',
    timeElapsed: '1 hour ago',
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    statusColor: 'bg-blue-100 text-blue-700',
    isNextActive: false
  },
  {
    id: 'ORD-003',
    orderType: 'Prescription',
    customer: 'Van C Le',
    item: 'Progressive Lenses',
    prescriptionStatus: 'CONFIRMED',
    currentStatus: 'Ready',
    timeElapsed: 'Today 10:30 AM',
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    statusColor: 'bg-mint-100 text-mint-700',
    isNextActive: true
  },
  {
    id: 'ORD-004',
    orderType: 'Prescription',
    customer: 'Thi D Pham',
    item: 'Bifocal Glasses',
    prescriptionStatus: 'PENDING_CONFIRMATION',
    currentStatus: 'Pending',
    timeElapsed: 'Today 9:15 AM',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    statusColor: 'bg-orange-100 text-orange-700',
    isNextActive: true
  },
  {
    id: 'ORD-005',
    orderType: 'Regular',
    customer: 'Van E Hoang',
    item: 'Sunglasses',
    currentStatus: 'Completed',
    timeElapsed: 'Yesterday 5:00 PM',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    statusColor: 'bg-emerald-100 text-emerald-700',
    isNextActive: false
  }
]

export function OrderTable({
  columns,
  hiddenColumns = [],
  filterType,
  role = 'operations',
  onConfirmPrescription,
  onRowClick
}: OrderTableProps) {
  const navigate = useNavigate()

  const handleViewOrder = (orderId: string) => {
    if (onRowClick) {
      onRowClick(orderId)
    } else {
      navigate(PATHS.OPERATIONSTAFF.ORDER_DETAIL(orderId))
    }
  }

  const orders = MOCK_ORDERS

  // Sort by creation time (newest first)
  const sortedOrders = [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  const filteredOrders = filterType
    ? sortedOrders.filter((order) => order.orderType === filterType)
    : sortedOrders

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
      header: 'PRESCRIPTION STATUS',
      render: (order) => {
        if (order.orderType !== 'Prescription') return <span className="text-neutral-400">—</span>

        const statusConfig = {
          PENDING_CONFIRMATION: {
            label: 'Needs Confirmation',
            className: 'bg-orange-50 text-orange-700 border-orange-200',
            showDot: true
          },
          CONFIRMED: {
            label: 'Confirmed',
            className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
            showDot: false
          },
          REJECTED: {
            label: 'Rejected',
            className: 'bg-red-50 text-red-700 border-red-200',
            showDot: false
          }
        }

        const config = order.prescriptionStatus ? statusConfig[order.prescriptionStatus] : null

        if (!config) return <span className="text-neutral-400">—</span>

        return (
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider whitespace-nowrap border ${config.className}`}
          >
            {config.showDot && <span className="w-1.5 h-1.5 bg-orange-500 rounded-full" />}
            {config.label}
          </span>
        )
      }
    },
    {
      header: 'CREATED AT',
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
      render: (order) => {
        const needsConfirmation =
          role === 'sales' &&
          order.orderType === 'Prescription' &&
          order.prescriptionStatus === 'PENDING_CONFIRMATION'

        return (
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              colorScheme="secondary"
              className="p-2 hover:bg-mint-50 hover:text-mint-600 transition-all rounded-lg"
              onClick={() => handleViewOrder(order.id)}
            >
              <IoEyeOutline size={20} />
            </Button>
            {needsConfirmation ? (
              <Button
                variant="solid"
                colorScheme="primary"
                size="sm"
                className="text-xs font-bold rounded-xl px-4 hover:shadow-lg hover:shadow-mint-100 transition-all active:scale-95 border-none"
                onClick={() => onConfirmPrescription?.(order.id)}
              >
                Confirm
              </Button>
            ) : (
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
            )}
          </div>
        )
      }
    }
  ]

  const activeColumns = (columns || defaultColumns).filter(
    (col) => !hiddenColumns.includes(col.header as string)
  )

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-neutral-100">
      <table className="w-full text-left border-collapse">
        <OrderHeaderTable columns={activeColumns} />
        <tbody className="divide-y divide-neutral-50 bg-white">
          {filteredOrders.length === 0 ? (
            <tr>
              <td
                colSpan={activeColumns.length}
                className="py-20 text-center text-gray-400 font-medium"
              >
                No orders found.
              </td>
            </tr>
          ) : (
            filteredOrders.map((order) => (
              <tr
                key={order.id}
                className="hover:bg-mint-50/30 transition-all cursor-pointer group"
                onClick={() => handleViewOrder(order.id)}
              >
                {activeColumns.map((col, colIndex) => (
                  <td
                    key={colIndex}
                    className={cn('px-6 py-6 align-middle text-sm', col.className)}
                  >
                    {col.render(order)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
