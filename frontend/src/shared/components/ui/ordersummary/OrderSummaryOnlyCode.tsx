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
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <span className="text-sm font-medium text-gray-900 font-mono">
        {orderData?.orderCode || orderId.slice(-8).toUpperCase()}
      </span>
      <div className="flex items-center gap-3">
        {(price ?? orderData?.price) !== undefined && (
          <span className="text-sm font-semibold text-neutral-600">
            {(price ?? orderData?.price)?.toLocaleString('vi-VN')} ₫
          </span>
        )}
        <span className="text-xs px-2 py-1 rounded-full bg-mint-100 text-mint-700">COMPLETED</span>
      </div>
    </div>
  )
}
