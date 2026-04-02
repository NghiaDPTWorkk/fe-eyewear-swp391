import { useOrderDetail } from '@/features/staff/hooks/orders/useOrders'
import type { OrderResponse } from '@/shared/types'

export default function OrderSummaryOnlyCode({
  orderId,
  price
}: {
  orderId: string
  price?: number
}) {
  const { data: orderApiResponse, isLoading } = useOrderDetail(orderId)
  const orderData = (orderApiResponse as OrderResponse)?.data?.order as any

  if (!orderId) return null

  if (isLoading) {
    return (
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <span className="w-24 h-4 bg-gray-200 rounded animate-pulse"></span>
        <div className="flex items-center gap-2">
          <span className="w-16 h-4 bg-gray-200 rounded animate-pulse"></span>
          <span className="text-xs px-2 py-1 rounded-full bg-mint-100 text-mint-700">
            COMPLETED
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-[20px] transition-all duration-300 hover:border-mint-200 group shadow-sm hover:shadow-md mb-2">
      <div className="flex flex-col gap-1 min-w-0 flex-1">
        <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none">
          Order Identity
        </span>
        <span className="text-sm font-bold text-slate-900 font-mono truncate group-hover:text-mint-600 transition-colors">
          {orderData?.orderCode || orderId.slice(-8).toUpperCase()}
        </span>
      </div>

      <div className="flex flex-col items-end gap-2 flex-shrink-0 ml-4 pl-4 border-l border-slate-50">
        {(price ?? orderData?.price) !== undefined ? (
          <div className="flex items-baseline gap-1">
            <span className="text-[14px] font-black text-slate-900 leading-none tracking-tighter">
              {(price ?? orderData?.price)?.toLocaleString('vi-VN')}
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase leading-none italic">
              ₫
            </span>
          </div>
        ) : (
          <span className="text-[10px] font-bold text-slate-300 italic">No price</span>
        )}

        <div className="px-2.5 py-1 bg-mint-50/50 border border-mint-100 rounded-lg flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-mint-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          <span className="text-[9px] font-black text-mint-600 uppercase tracking-[0.1em]">
            COMPLETED
          </span>
        </div>
      </div>
    </div>
  )
}
