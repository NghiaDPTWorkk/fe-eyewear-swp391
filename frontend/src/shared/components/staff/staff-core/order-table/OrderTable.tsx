import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { OrderType } from '@/shared/utils/enums/order.enum'
import { type Order } from './order-utils'

export interface Column<T> {
  header: string | ReactNode
  render: (item: T) => ReactNode
  className?: string
  headerClassName?: string
}

export interface OrderTableProps<T = any> {
  orders?: Order[]
  data?: T[]
  columns?: Column<T>[]
  isLoading?: boolean
  isError?: boolean
  hiddenColumns?: string[]
  filterType?: OrderType
  onRowClick?: (item: T) => void
  emptyMessage?: string
}

export function OrderTable<T>({
  orders,
  data,
  columns,
  isLoading,
  isError,
  hiddenColumns = [],
  onRowClick,
  emptyMessage = 'No active orders found'
}: OrderTableProps<T>) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="w-12 h-12 border-4 border-mint-500/20 border-t-mint-500 rounded-full animate-spin" />
        <p className="mt-4 text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">
          Syncing Data...
        </p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="py-24 text-center">
        <p className="text-red-500 font-bold uppercase tracking-widest text-xs">
          Failed to load data stream
        </p>
      </div>
    )
  }

  if (columns && data) {
    return (
      <div className="bg-white rounded-[32px] border border-neutral-100 shadow-xl shadow-neutral-200/40 overflow-hidden">
        <div className="overflow-x-auto overflow-y-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-neutral-100">
                {columns.map((col, i) => (
                  <th
                    key={i}
                    className={cn(
                      'px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest',
                      col.headerClassName
                    )}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="py-24 text-center">
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[11px]">
                      {emptyMessage}
                    </p>
                  </td>
                </tr>
              ) : (
                data.map((item: any, idx) => (
                  <tr
                    key={item.id || item._id || idx}
                    onClick={() => onRowClick?.(item)}
                    className="group hover:bg-slate-50/80 transition-all cursor-pointer"
                  >
                    {columns.map((col, i) => (
                      <td key={i} className={cn('px-8 py-6 text-sm', col.className)}>
                        {col.render(item)}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  const displayOrders = orders || []
  const isHidden = (label: string) =>
    hiddenColumns.some((col) => col.toUpperCase() === label.toUpperCase())

  return (
    <div className="bg-white rounded-[32px] border border-neutral-100 shadow-xl shadow-neutral-200/40 overflow-hidden">
      <div className="overflow-x-auto overflow-y-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-neutral-100">
              {!isHidden('ORDER') && (
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Order
                </th>
              )}
              {!isHidden('TYPE') && (
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Type
                </th>
              )}
              {!isHidden('CUSTOMER') && (
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Customer
                </th>
              )}
              {!isHidden('ITEM') && (
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Item
                </th>
              )}
              {!isHidden('STATION') && (
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Station
                </th>
              )}
              {!isHidden('TIME') && (
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                  Time
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-50">
            {displayOrders.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-24 text-center">
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-[11px]">
                    {emptyMessage}
                  </p>
                </td>
              </tr>
            ) : (
              displayOrders.map((order) => (
                <tr
                  key={order.id}
                  onClick={() => onRowClick?.(order as any)}
                  className="group hover:bg-slate-50/80 transition-all cursor-pointer"
                >
                  {!isHidden('ORDER') && (
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-black text-slate-900">
                          #{order.orderCode?.split('_')[1] || order.id.slice(-8).toUpperCase()}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                          ID: {order.id.slice(-6)}
                        </span>
                      </div>
                    </td>
                  )}
                  {!isHidden('TYPE') && (
                    <td className="px-8 py-6">
                      <span
                        className={cn(
                          'px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border',
                          order.orderType === OrderType.MANUFACTURING
                            ? 'bg-purple-50 text-purple-600 border-purple-100'
                            : order.orderType === OrderType.PRE_ORDER
                              ? 'bg-amber-50 text-amber-600 border-amber-100'
                              : 'bg-blue-50 text-blue-600 border-blue-100'
                        )}
                      >
                        {order.orderType}
                      </span>
                    </td>
                  )}
                  {!isHidden('CUSTOMER') && (
                    <td className="px-8 py-6">
                      <span className="text-sm font-bold text-slate-700">{order.customer}</span>
                    </td>
                  )}
                  {!isHidden('ITEM') && (
                    <td className="px-8 py-6">
                      <span className="text-sm font-medium text-slate-600">{order.item}</span>
                    </td>
                  )}
                  {!isHidden('STATION') && (
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={cn(
                            'w-2 h-2 rounded-full animate-pulse',
                            order.statusColor.split(' ')[0]
                          )}
                        />
                        <span
                          className={cn(
                            'px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest',
                            order.statusColor
                          )}
                        >
                          {order.currentStatus}
                        </span>
                      </div>
                    </td>
                  )}
                  {!isHidden('TIME') && (
                    <td className="px-8 py-6 text-right">
                      <span className="text-sm font-black text-slate-900 tracking-tighter">
                        {order.timeElapsed}
                      </span>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
