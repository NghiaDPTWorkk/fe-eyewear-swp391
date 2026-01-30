import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import OrderHeaderTable from './OrderHeaderTable'
import OrderList from './OrderList'
import { IoGlassesOutline } from 'react-icons/io5'
import { PATHS } from '@/routes/paths'

export interface Order {
  id: string
  orderType: string
  customer: string
  item: string
  waitingFor?: string
  currentStatus: string
  prescriptionStatus?: 'PENDING_CONFIRMATION' | 'CONFIRMED' | 'REJECTED'
  timeElapsed: string
  createdAt?: string
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
  role?: 'sales' | 'operation'
  onRowClick?: (orderId: string) => void
  onConfirmPrescription?: (orderId: string) => void
}

export default function OrderTable({
  columns,
  hiddenColumns = [],
  filterType,
  role = 'operation',
  onRowClick,
  onConfirmPrescription
}: OrderTableProps) {
  const navigate = useNavigate()

  const handleViewOrder = (orderId: string) => {
    if (onRowClick) {
      onRowClick(orderId)
    } else {
      navigate(PATHS.OPERATIONSTAFF.ORDER_DETAIL(orderId))
    }
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
      currentStatus: 'Lens Edging',
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
      prescriptionStatus: 'PENDING_CONFIRMATION',
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
      header: 'SKU / PRODUCT',
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
      ),
      className: 'pl-10 px-6 py-6'
    },
    {
      header: 'ORDER ID',
      render: (order) => (
        <div
          className="text-sm font-medium text-emerald-500 cursor-pointer hover:text-emerald-600 transition-colors"
          onClick={() => handleViewOrder(order.id)}
        >
          {order.id}
        </div>
      ),
      headerClassName: 'text-center',
      className: 'text-center px-6 py-6'
    },
    {
      header: 'CUSTOMER',
      render: (order) => (
        <div>
          <div className="text-sm font-semibold text-[#3d4465]">{order.customer}</div>
          <div className="text-[11px] text-[#a4a9c1] font-medium">+1 (555) 012-3456</div>
        </div>
      ),
      className: 'px-6 py-6'
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
            className={cn(
              'inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider whitespace-nowrap border',
              config.className
            )}
          >
            {config.showDot && <span className="w-1.5 h-1.5 bg-orange-500 rounded-full" />}
            {config.label}
          </span>
        )
      },
      className: 'px-6 py-6'
    },
    {
      header: 'LAB STATUS',
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
      ),
      headerClassName: 'text-center',
      className: 'text-center px-6 py-6'
    },
    {
      header: 'ACTIONS',
      headerClassName: 'text-right pr-10',
      className: 'text-right pr-10 py-6',
      render: (order) => {
        const needsConfirmation =
          role === 'sales' &&
          order.orderType === 'Prescription' &&
          order.prescriptionStatus === 'PENDING_CONFIRMATION'

        return (
          <div className="flex items-center justify-end gap-2">
            {needsConfirmation && (
              <button
                className="bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-xl hover:bg-emerald-600 transition-all shadow-sm shadow-emerald-100"
                onClick={() => onConfirmPrescription?.(order.id)}
              >
                Confirm
              </button>
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
        <OrderHeaderTable columns={activeColumns} role={role} />
        <OrderList
          orders={filteredOrders}
          columns={activeColumns}
          role={role}
          onRowClick={handleViewOrder}
        />
      </table>
    </div>
  )
}
