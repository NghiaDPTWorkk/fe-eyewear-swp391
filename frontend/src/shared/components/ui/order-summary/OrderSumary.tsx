import { useOrderDetail, useInvoiceDetail } from '@/features/staff/hooks/orders/useOrders'
import type { OrderResponse } from '@/shared/types'
import type { AdminInvoiceDetailResponse } from '@/shared/types/admin-invoice.types'
import FormatSecretPhone from '@/shared/components/ui/format-secret-phone/FormatSecrectPhone'

export default function OrderSumary({ orderId }: { orderId?: string }) {
  const { data: orderApiResponse, isLoading: isOrderLoading } = useOrderDetail(orderId || '')
  const orderData = (orderApiResponse as OrderResponse)?.data?.order as any
  const invoiceId: string | undefined = orderData?.invoiceId

  const { data: invoiceApiResponse, isLoading: isInvoiceLoading } = useInvoiceDetail(invoiceId)
  const invoiceData = (invoiceApiResponse as AdminInvoiceDetailResponse)?.data

  const isLoading = isOrderLoading || isInvoiceLoading
  const fullName = invoiceData?.fullName || '—'
  const phone = invoiceData?.phone || '—'

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-mint-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between py-1 border-b border-gray-50">
          <span className="text-gray-500">Order ID:</span>
          <span className="font-medium text-gray-900 truncate max-w-[200px]">
            {orderData?.orderCode || orderId || '—'}
          </span>
        </div>
        <div className="flex justify-between py-1 border-b border-gray-50">
          <span className="text-gray-500">Customer:</span>
          {isLoading ? (
            <span className="w-24 h-4 bg-gray-100 rounded animate-pulse" />
          ) : (
            <span className="font-medium text-gray-900">{fullName}</span>
          )}
        </div>
        <div className="flex justify-between py-1 border-b border-gray-50">
          <span className="text-gray-500">Phone:</span>
          {isLoading ? (
            <span className="w-24 h-4 bg-gray-100 rounded animate-pulse" />
          ) : (
            <span className="font-medium text-gray-900">
              <FormatSecretPhone phone={phone} />
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
