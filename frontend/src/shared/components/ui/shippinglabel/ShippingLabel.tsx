import { IoCarOutline, IoPrintOutline } from 'react-icons/io5'
import { useOrderDetail, useInvoiceDetail } from '@/features/staff/hooks/orders/useOrders'
import type { OrderResponse } from '@/shared/types'
import type { AdminInvoiceDetailResponse } from '@/shared/types/admin-invoice.types'
import FormatSecretPhone from '@/shared/components/ui/formatsecrectphone/FormatSecrectPhone'

interface ShippingLabelProps {
  orderId?: string
}

export default function ShippingLabel({ orderId }: ShippingLabelProps) {
  // ── Step 1: Lấy order để lấy invoiceId ──────────────────────────────────
  const { data: orderApiResponse, isLoading: isOrderLoading } = useOrderDetail(orderId || '')

  const orderData = (orderApiResponse as OrderResponse)?.data?.order as any
  const invoiceId: string | undefined = orderData?.invoiceId

  // ── Step 2: Lấy invoice theo invoiceId ──────────────────────────────────
  const { data: invoiceApiResponse, isLoading: isInvoiceLoading } = useInvoiceDetail(invoiceId)

  const invoiceData = (invoiceApiResponse as AdminInvoiceDetailResponse)?.data

  // ── Derived values ───────────────────────────────────────────────────────
  const isLoading = isOrderLoading || isInvoiceLoading

  const invoiceCode = invoiceData?.invoiceCode || '—'
  const fullName = invoiceData?.fullName || '—'
  const phone = invoiceData?.phone || '—'
  const street = invoiceData?.address?.street || ''
  const ward = invoiceData?.address?.ward || ''
  const city = invoiceData?.address?.city || ''
  const country = invoiceData?.address?.country || 'Vietnam'

  const fullAddress = [street, ward, city, country].filter(Boolean).join(', ')

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-mint-200 border-t-4 border-t-mint-400">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <IoCarOutline /> Shipping Information
      </h3>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-6 gap-3">
          <div className="w-8 h-8 rounded-full border-4 border-mint-100 border-t-mint-500 animate-spin" />
          <p className="text-xs text-neutral-400">Loading shipping info...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Invoice Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Method</label>
            <div className="p-3 bg-gray-100 rounded-lg font-mono font-medium text-gray-800 tracking-wide text-center border border-gray-200">
              {invoiceCode}
            </div>
            <div className="mt-1 text-xs text-gray-500 text-right">Auto generated</div>
          </div>

          {/* Shipping Address */}
          <div className="pt-4 border-t border-gray-100">
            <div className="text-sm font-medium text-gray-700 mb-2">Shipping Address</div>
            <div className="text-sm text-gray-900 font-semibold">{fullName}</div>
            <div className="text-sm text-gray-600">
              <FormatSecretPhone phone={phone} />
            </div>
            {fullAddress && (
              <div className="text-sm text-gray-600 mt-1">{fullAddress}</div>
            )}
          </div>
          {/* Print button */}
          <button className="w-full py-2.5 bg-blue-100 text-blue-700 rounded-lg font-medium hover:bg-blue-200 transition-colors flex items-center justify-center gap-2">
            <IoPrintOutline size={18} /> Shipping Label
          </button>
        </div>
      )}
    </div>
  )
}
