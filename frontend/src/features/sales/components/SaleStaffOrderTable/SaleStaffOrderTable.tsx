/* eslint-disable max-lines */
import React, { type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import SaleStaffOrderHeaderTable from './SaleStaffOrderHeaderTable'
import SaleStaffOrderList from './SaleStaffOrderList'
import {
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

import { useLayoutStore } from '@/store/layout.store'
import type { Order as SharedOrder } from '../../types'

interface SaleStaffOrderTableProps {
  orders?: SharedOrder[]
  loading?: boolean
  columns?: Column<Order>[]
  hiddenColumns?: string[]
  filterType?: string
  onRowClick?: (orderId: string, order?: Order) => void
  onNotifyCustomer?: (orderId: string) => void
  onReviewRx?: (orderId: string) => void
}

export default function SaleStaffOrderTable({
  orders: externalOrders,
  loading,
  columns,
  hiddenColumns = [],
  filterType,
  onRowClick,
  onNotifyCustomer,
  onReviewRx
}: SaleStaffOrderTableProps) {
  const navigate = useNavigate()
  const { sidebarCollapsed } = useLayoutStore()

  const orders: Order[] = (externalOrders || []).map((o) => {
    let type: 'Regular' | 'Pre-order' | 'Prescription' = 'Regular'
    if (o.isPrescription) type = 'Prescription'
    else if (o.orderType?.includes('PREORDER') || o.orderType === 'PRE-ORDER') type = 'Pre-order'

    return {
      id: o.id.toString(),
      orderType: type,
      customer: o.customerName || 'Customer',
      customerId: (o.invoiceId || o.id).toString(),
      customerPhone: '',
      item: o.productName || 'Product',
      currentStatus: o.status,
      timeElapsed: 'Active',
      statusColor:
        o.status === 'COMPLETED' ? 'bg-mint-100 text-mint-700' : 'bg-blue-100 text-blue-700',
      isNextActive: true,
      isApproved: o.status !== 'WAITING_ASSIGNED'
    }
  })

  if (loading) {
    return (
      <div className="p-20 flex flex-col items-center justify-center text-gray-400 bg-white">
        <div className="w-10 h-10 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium animate-pulse">Loading orders...</p>
      </div>
    )
  }
  const handleViewOrder = (orderId: string) => {
    // ... logic
    const order = orders.find((o) => o.id === orderId)
    if (!order) return

    // SaleStaff role logic
    if (order.orderType === 'Prescription') {
      onRowClick?.(orderId, order)
    } else if (order.orderType === 'Pre-order') {
      navigate(PATHS.SALESTAFF.PRE_ORDER_DETAIL(orderId))
    } else {
      navigate(PATHS.SALESTAFF.REGULAR_DETAIL(orderId))
    }
  }

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
      headerClassName: cn(
        'px-4 text-center',
        !sidebarCollapsed ? 'hidden 2xl:table-cell' : 'hidden lg:table-cell'
      ),
      className: cn(
        'px-4 py-6 text-center',
        !sidebarCollapsed ? 'hidden 2xl:table-cell' : 'hidden lg:table-cell'
      ),
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
      headerClassName: cn(
        'px-4 text-center',
        !sidebarCollapsed ? 'hidden 2xl:table-cell' : 'hidden lg:table-cell'
      ),
      className: cn(
        'px-4 py-6 text-center',
        !sidebarCollapsed ? 'hidden 2xl:table-cell' : 'hidden lg:table-cell'
      ),
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
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation()
                      onNotifyCustomer?.(order.customerId)
                    }}
                  />
                ) : (
                  <div className="w-[32px]" />
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

  const activeColumns = (columns || salesColumns).filter(
    (col) => !hiddenColumns.includes(col.header as string)
  )

  return (
    <div className="w-full overflow-hidden bg-white">
      <div className="w-full overflow-x-auto no-scrollbar scroll-smooth">
        <table className="w-full text-left border-collapse min-w-[1000px] table-fixed">
          <SaleStaffOrderHeaderTable columns={activeColumns} isSales={true} />
          <SaleStaffOrderList
            orders={filteredOrders}
            columns={activeColumns}
            onRowClick={handleViewOrder}
          />
        </table>
      </div>
    </div>
  )
}
