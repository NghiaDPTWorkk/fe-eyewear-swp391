/* eslint-disable max-lines */
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Button } from '@/shared/components/ui/button'
import { IoTimeOutline, IoChevronForward } from 'react-icons/io5'
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
  isApproved?: boolean
}

export interface Column<T> {
  header: string | ReactNode
  render: (item: T) => ReactNode
  className?: string
  headerClassName?: string
}

interface SaleStaffOrderTableProps {
  onRowClick?: (id: string, order?: Order) => void
  onReviewRx?: (id: string) => void
  onNotifyCustomer?: (customerId: string) => void
  filterType?: string
  hiddenColumns?: string[]
}

const getOrderTypeStyles = (type: string) => {
  switch (type) {
    case 'Regular':
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

export default function SaleStaffOrderTable({
  onRowClick,
  filterType,
  hiddenColumns = []
}: SaleStaffOrderTableProps) {
  const navigate = useNavigate()

  const handleViewOrder = (order: Order) => {
    if (onRowClick) {
      onRowClick(order.id, order)
    } else {
      // Default navigation
      if (order.orderType === 'Prescription') {
        navigate(PATHS.SALESTAFF.VERIFY_RX(order.id))
      } else if (order.orderType === 'Pre-order') {
        navigate(PATHS.SALESTAFF.PRE_ORDER_DETAIL(order.id))
      } else {
        navigate(PATHS.SALESTAFF.REGULAR_DETAIL(order.id))
      }
    }
  }

  // Mock data - replace with real data
  const orders: Order[] = [
    {
      id: 'ORD-001',
      orderType: 'Regular',
      customer: 'Nguyễn Văn A',
      item: 'SKU-001',
      waitingFor: 'Lens Chemi 5.5',
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
      waitingFor: 'Titan Frames',
      currentStatus: 'Lens Edging',
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
      isNextActive: true,
      isApproved: false
    },
    {
      id: 'ORD-005',
      orderType: 'Regular',
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

  const columns: Column<Order>[] = [
    {
      header: 'ORDER ID',
      render: (order) => (
        <div className="flex flex-col items-center">
          <div
            className="font-bold text-neutral-900 cursor-pointer hover:text-primary-600"
            onClick={() => handleViewOrder(order)}
          >
            {order.id}
          </div>
          <div className="w-12 mt-1 h-1 rounded-full overflow-hidden bg-neutral-100">
            <div className="bg-emerald-400 h-full w-1/2 rounded-full"></div>
          </div>
        </div>
      ),
      headerClassName: 'text-center',
      className: 'font-medium text-center'
    },
    {
      header: 'TYPE',
      render: (order) => (
        <span
          className={cn(
            'whitespace-nowrap font-bold uppercase tracking-wider px-3 py-1 rounded-full text-[10px]',
            getOrderTypeStyles(order.orderType)
          )}
        >
          {order.orderType}
        </span>
      ),
      headerClassName: 'text-center',
      className: 'text-center'
    },
    {
      header: 'CUSTOMER',
      render: (order) => <div className="text-neutral-900 font-medium">{order.customer}</div>
    },
    {
      header: 'ITEMS',
      render: (order) => order.item,
      className: 'text-neutral-400 font-medium text-center',
      headerClassName: 'text-center'
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
            'font-bold uppercase tracking-wider whitespace-nowrap px-3 py-1 rounded-full text-[10px]',
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
        <div className="flex items-center gap-1.5 justify-center">
          <IoTimeOutline className="text-neutral-400" />
          <span className="text-neutral-500">{order.timeElapsed}</span>
        </div>
      ),
      headerClassName: 'text-center',
      className: 'text-center'
    },
    {
      header: 'ACTION',
      headerClassName: 'text-center w-32',
      render: (order) => (
        <div className="flex items-center justify-center gap-3">
          <Button
            variant="ghost"
            colorScheme="primary"
            size="sm"
            className="p-2 h-8 w-8 text-primary-500"
            isDisabled={!order.isNextActive}
            title="View Details"
            onClick={() => handleViewOrder(order)}
          >
            <IoChevronForward size={18} />
          </Button>
        </div>
      )
    }
  ]

  const activeColumns = columns.filter((col) => !hiddenColumns.includes(col.header as string))

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50">
            {activeColumns.map((col, index) => (
              <th
                key={index}
                className={cn(
                  'px-4 py-3 text-xs font-bold text-gray-600 uppercase tracking-wider',
                  col.headerClassName
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order, index) => (
            <tr
              key={order.id}
              className={cn(
                'border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer',
                index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
              )}
              onClick={() => handleViewOrder(order)}
            >
              {activeColumns.map((col, colIndex) => (
                <td key={colIndex} className={cn('px-4 py-4 text-sm', col.className)}>
                  {col.render(order)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
