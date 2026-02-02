/* eslint-disable max-lines */
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Button } from '@/shared/components/ui/button'
import { IoTimeOutline, IoChevronForward } from 'react-icons/io5'
import { PATHS } from '@/routes/paths'
import type { Order as DomainOrder } from '../../types'

const formatTimeElapsed = (dateString?: string) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000)

  if (diffInMinutes < 60) return `${diffInMinutes}m ago`
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours}h ago`
  const diffInDays = Math.floor(diffInHours / 24)
  return `${diffInDays}d ago`
}

export interface OrderRow {
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
  original: DomainOrder
}

export interface Column<T> {
  header: string | ReactNode
  render: (item: T) => ReactNode
  className?: string
  headerClassName?: string
}

interface OrderTableProps {
  orders?: DomainOrder[]
  loading?: boolean
  onRowClick?: (id: string, order?: DomainOrder) => void
  onReviewRx?: (id: string) => void
  onNotifyCustomer?: (customerId: string) => void
  filterType?: string
  hiddenColumns?: string[]
}

const getOrderTypeStyles = (type: string) => {
  if (type.includes('Regular')) return 'bg-emerald-50 text-emerald-600'
  if (type.includes('Pre-order')) return 'bg-amber-50 text-amber-600'
  if (type.includes('Prescription')) return 'bg-indigo-50 text-indigo-600'
  return 'bg-neutral-50 text-neutral-600'
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'PENDING':
    case 'WAITING_ASSIGN':
      return 'bg-amber-100 text-amber-700'
    case 'PROCESSING':
      return 'bg-blue-100 text-blue-700'
    case 'COMPLETED':
    case 'APPROVED':
    case 'VERIFIED':
      return 'bg-emerald-100 text-emerald-700'
    case 'REJECTED':
      return 'bg-red-100 text-red-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

export default function OrderTable({
  orders = [],
  loading,
  onRowClick,
  filterType,
  hiddenColumns = []
}: OrderTableProps) {
  const navigate = useNavigate()

  const handleViewOrder = (order: OrderRow) => {
    if (onRowClick) {
      onRowClick(order.id, order.original)
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

  const mapToRow = (order: DomainOrder): OrderRow => {
    const isPrescription =
      order.type?.includes('MANUFACTURING') || order.products?.some((p) => p.lens)
    const isPreOrder = order.type?.includes('PRE-ORDER')

    let typeStr = 'Regular'
    if (isPrescription) typeStr = 'Prescription'
    if (isPreOrder) typeStr = 'Pre-order'

    const productName =
      order.products?.[0]?.product?.product_name || order.products?.[0]?.lens?.sku || 'Unknown Item'

    return {
      id: order._id,
      orderType: typeStr,
      customer: order.customerName || 'Guest',
      item: productName,
      waitingFor: '-',
      currentStatus: order.status,
      timeElapsed: order.createdAt ? formatTimeElapsed(order.createdAt) : 'N/A',
      statusColor: getStatusColor(order.status),
      isNextActive: true,
      isApproved: order.status === 'APPROVED',
      original: order
    }
  }

  const tableData: OrderRow[] = orders
    .map(mapToRow)
    .filter((row) => (filterType ? row.orderType === filterType : true))

  const columns: Column<OrderRow>[] = [
    {
      header: 'ORDER ID',
      render: (row) => (
        <div className="flex flex-col items-center">
          <div
            className="font-bold text-neutral-900 cursor-pointer hover:text-primary-600"
            onClick={() => handleViewOrder(row)}
          >
            {row.original.orderCode || row.id.substring(0, 8)}
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
      render: (row) => (
        <span
          className={cn(
            'whitespace-nowrap font-bold uppercase tracking-wider px-3 py-1 rounded-full text-[10px]',
            getOrderTypeStyles(row.orderType)
          )}
        >
          {row.orderType}
        </span>
      ),
      headerClassName: 'text-center',
      className: 'text-center'
    },
    {
      header: 'CUSTOMER',
      render: (row) => <div className="text-neutral-900 font-medium">{row.customer}</div>
    },
    {
      header: 'ITEMS',
      render: (row) => row.item,
      className: 'text-neutral-400 font-medium text-center',
      headerClassName: 'text-center'
    },
    {
      header: 'WAITING FOR',
      render: (row) => row.waitingFor || '-',
      className: 'text-purple-600 font-medium text-center',
      headerClassName: 'text-center'
    },
    {
      header: 'STATUS',
      render: (row) => (
        <span
          className={cn(
            'font-bold uppercase tracking-wider whitespace-nowrap px-3 py-1 rounded-full text-[10px]',
            row.statusColor
          )}
        >
          {row.currentStatus}
        </span>
      ),
      headerClassName: 'text-center',
      className: 'text-center'
    },
    {
      header: 'ORDER AT',
      render: (row) => (
        <div className="flex items-center gap-1.5 justify-center">
          <IoTimeOutline className="text-neutral-400" />
          <span className="text-neutral-500">{row.timeElapsed}</span>
        </div>
      ),
      headerClassName: 'text-center',
      className: 'text-center'
    },
    {
      header: 'ACTION',
      headerClassName: 'text-center w-32',
      render: (row) => (
        <div className="flex items-center justify-center gap-3">
          <Button
            variant="ghost"
            colorScheme="primary"
            size="sm"
            className="p-2 h-8 w-8 text-primary-500"
            disabled={!row.isNextActive}
            title="View Details"
            onClick={() => handleViewOrder(row)}
          >
            <IoChevronForward size={18} />
          </Button>
        </div>
      )
    }
  ]

  const activeColumns = columns.filter((col) => !hiddenColumns.includes(col.header as string))

  if (loading) {
    return (
      <div className="p-20 flex flex-col items-center justify-center text-gray-400">
        <div className="w-10 h-10 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium animate-pulse">Loading orders...</p>
      </div>
    )
  }

  if (tableData.length === 0) {
    return <div className="p-20 text-center text-gray-400 font-medium">No orders found.</div>
  }

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
          {tableData.map((row, index) => (
            <tr
              key={row.id}
              className={cn(
                'border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer',
                index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
              )}
              onClick={() => handleViewOrder(row)}
            >
              {activeColumns.map((col, colIndex) => (
                <td key={colIndex} className={cn('px-4 py-4 text-sm', col.className)}>
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
