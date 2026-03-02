import { IoPrintOutline } from 'react-icons/io5'

interface ShippingInfoPanelProps {
  invoiceCode: string
  fullName: string
  carrier: string
  address: string
  canShip: boolean
  shipCode?: string
  orders: string[]
  onPrintLabel: () => void
}

export default function ShippingInfoPanel({
  invoiceCode,
  fullName,
  carrier,
  address,
  canShip,
  shipCode,
  orders,
  onPrintLabel
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
      </div>

      {/* Carrier */}
      <div className="mb-4">
        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Delivery Method</p>
        <p className="text-base font-semibold text-gray-900">{carrier}</p>
        {shipCode ? (
          <p className="text-xs text-mint-600 mt-1 font-medium bg-mint-50 inline-block px-2 py-1 rounded">
            Ship Code: {shipCode}
          </p>
        ) : (
          <p className="text-xs text-gray-500 mt-1">Auto-generated</p>
        )}
      </div>

      {/* Shipping Address */}
      <div className="mb-6">
        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Shipping Address</p>
        <p className="text-sm text-gray-700 leading-relaxed">{address}</p>
      </div>

      {/* Print Label Button */}
      <button
        onClick={onPrintLabel}
        disabled={!canShip}
        className={`w-full px-6 py-3 rounded-lg font-medium transition-all shadow-lg flex items-center justify-center gap-2 border-2 ${
          canShip
            ? 'bg-mint-900 text-white border-mint-900 hover:bg-mint-700 hover:border-mint-700 transform hover:-translate-y-1 shadow-mint-200'
            : 'bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed'
        }`}
      >
        <IoPrintOutline size={20} />
        Print Shipping Label
      </button>

      {/* Order Summary */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-xs text-gray-500 uppercase tracking-wide mb-3">Order Summary</p>
        <div className="space-y-2">
          {orders.map((orderId) => (
            <div
              key={orderId}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <span className="text-sm font-medium text-gray-900 font-mono">
                {orderId.slice(-8).toUpperCase()}
              </span>
              <span className="text-xs px-2 py-1 rounded-full bg-mint-100 text-mint-700">
                COMPLETED
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
