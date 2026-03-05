import OrderSummaryOnlyCode from '@/shared/components/ui/ordersummary/OrderSummaryOnlyCode'
import { IoPrintOutline } from 'react-icons/io5'

interface ShippingInfoPanelProps {
  invoiceCode: string
  fullName: string
  phone: string
  carrier: string
  address: string
  status: string
  isProcessingShipping: boolean
  shipCode?: string
  hasShipCode?: boolean
  orders: { id: string; price?: number }[]
  onPrintLabel: () => void
  onProcessShipping: () => void
}

export default function ShippingInfoPanel({
  invoiceCode,
  fullName,
  phone,
  carrier,
  address,
  status,
  isProcessingShipping,
  shipCode,
  hasShipCode,
  orders,
  onPrintLabel,
  onProcessShipping
}: ShippingInfoPanelProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-neutral-100 p-6 sticky top-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
        Shipping Information
      </h2>

      {/* Invoice Info */}
      <div className="mb-4 pb-4 border-b border-gray-200">
        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Invoice ID</p>
        <p className="text-base font-semibold text-gray-900">{invoiceCode}</p>
        <p className="text-sm text-gray-600 mt-1">Customer: {fullName}</p>
        <p className="text-sm text-gray-600 mt-1">Phone number: {phone}</p>
      </div>

      {/* Carrier */}
      <div className="mb-4">
        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Delivery Method</p>
        <p className="w-full px-6 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 border-2 border-solid bg-white text-gray-600 border-gray-200">
          {carrier}
        </p>
        {shipCode ? (
          <>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1 mt-4">Ship Code</p>
            <p className="w-full px-6 py-5 rounded-xl font-mono text-lg tracking-wider transition-all flex items-center justify-center gap-2 border-2 border-dashed bg-gray-50 text-gray-800 border-gray-300 hover:bg-mint-50 hover:border-mint-700 cursor-pointer ">
              {shipCode}
            </p>
          </>
        ) : (
          <p className="text-xs text-gray-500 mt-1">Auto-generated</p>
        )}
      </div>

      {/* Shipping Address */}
      <div className="mb-6">
        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Shipping Address</p>
        <p className="text-sm text-gray-700 leading-relaxed">{address}</p>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 mb-6">
        <button
          onClick={onProcessShipping}
          disabled={status !== 'COMPLETED' || isProcessingShipping || hasShipCode}
          className={`w-full px-6 py-3 rounded-lg transition-all shadow-sm flex items-center justify-center gap-2 ${
            status === 'COMPLETED' && !isProcessingShipping && !hasShipCode
              ? 'bg-mint-600 text-white hover:bg-mint-700 transform hover:-translate-y-1 font-medium'
              : hasShipCode || status === 'READY_TO_SHIP'
                ? 'bg-mint-100 text-mint-700 cursor-not-allowed border border-mint-200 font-bold uppercase tracking-wider text-sm'
                : 'bg-gray-100 text-gray-500 cursor-not-allowed border border-gray-200 font-bold uppercase tracking-wider text-sm'
          }`}
        >
          {isProcessingShipping
            ? 'Processing...'
            : status === 'COMPLETED' && !hasShipCode
              ? 'Process Shipping'
              : status.replace(/_/g, ' ')}
        </button>

        <button
          onClick={onPrintLabel}
          disabled={status !== 'READY_TO_SHIP'}
          className={`w-full px-6 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 border-2 ${
            status === 'READY_TO_SHIP'
              ? 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
              : 'bg-gray-50 text-gray-400 border-transparent cursor-not-allowed'
          }`}
        >
          <IoPrintOutline size={20} />
          Print Shipping Label
        </button>
      </div>

      {/* Order Summary */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-xs text-gray-500 uppercase tracking-wide mb-3">Order Summary</p>
        <div className="space-y-2">
          {orders.map((order) => (
            <OrderSummaryOnlyCode key={order.id} orderId={order.id} price={order.price} />
          ))}
        </div>
      </div>
    </div>
  )
}
