import { useState } from 'react'
import { Container } from '@/components'
import { BreadcrumbPath } from '@/components/layout/staff/operationstaff/breadcrumbpath'
import { ProcessTracker } from '@/components/layout/staff/staff-core/processtracker'
import { IoAirplaneOutline, IoCheckmarkCircle, IoPrintOutline } from 'react-icons/io5'

export default function OperationShippingHandoverPage() {
  // Hardcoded invoice data with multiple orders
  const invoiceData = {
    invoiceId: 'INV-2024-001',
    customer: 'Nguyen Van A',
    orders: [
      {
        id: 'ORD-001',
        code: '#RX-001',
        status: 'COMPLETED',
        item: 'RayBan Aviator + Progressive Lens'
      },
      {
        id: 'ORD-002',
        code: '#RX-002',
        status: 'COMPLETED',
        item: 'Oakley Holbrook + Single Vision'
      },
      { id: 'ORD-003', code: '#RX-003', status: 'COMPLETED', item: 'Glasses Case + Cleaning Cloth' }
    ],
    shipping: {
      carrier: 'Viettel Post',
      address: '123 Nguyen Hue Street, District 1, Ho Chi Minh City, 700000, Vietnam'
    }
  }

  const [scannedInvoiceId, setScannedInvoiceId] = useState('')

  // Check if all orders are completed
  const allOrdersCompleted = invoiceData.orders.every((order) => order.status === 'COMPLETED')
  const isInvoiceConfirmed = scannedInvoiceId === invoiceData.invoiceId
  const canShip = isInvoiceConfirmed && allOrdersCompleted

  const handleConfirm = () => {
    if (scannedInvoiceId !== invoiceData.invoiceId) {
      alert('Invoice ID does not match!')
    }
  }

  const handlePrintLabel = () => {
    alert('Printing shipping label for ' + invoiceData.invoiceId)
  }

  return (
    <Container className="animate-fade-in-up">
      {/* Breadcrumb */}
      <BreadcrumbPath paths={['Dashboard', 'Shipping Handover']} />

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
            <IoAirplaneOutline className="text-blue-500" /> Shipping Handover
          </h1>
          <p className="text-sm text-neutral-500 mt-1 font-medium italic opacity-80 uppercase tracking-widest text-[10px]">
            PREPARE INVOICES FOR DELIVERY
          </p>
        </div>
        <span className="px-6 py-2 bg-blue-100 text-blue-700 border border-blue-200 rounded-full text-xs font-bold uppercase tracking-widest">
          {allOrdersCompleted ? 'READY TO SHIP' : 'PENDING'}
        </span>
      </div>

      {/* Progress Tracker */}
      <ProcessTracker />

      <div className="grid grid-cols-12 gap-6 mt-6">
        {/* Left Column */}
        <div className="col-span-12 lg:col-span-7 space-y-6">
          {/* Scan Invoice ID Section */}
          <div className="bg-white rounded-lg shadow-sm border border-neutral-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Scan Invoice ID
            </h2>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Invoice ID</label>
                <input
                  type="text"
                  value={scannedInvoiceId}
                  onChange={(e) => setScannedInvoiceId(e.target.value)}
                  placeholder="Scan or enter invoice ID..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Expected: {invoiceData.invoiceId}</p>
              </div>

              <button
                onClick={handleConfirm}
                disabled={!scannedInvoiceId}
                className={`w-full px-6 py-3 rounded-lg font-medium transition-all ${
                  isInvoiceConfirmed
                    ? 'bg-mint-100 text-mint-700 border-2 border-mint-200 cursor-default'
                    : scannedInvoiceId
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isInvoiceConfirmed ? '✓ Invoice Confirmed' : 'Confirm Invoice'}
              </button>
            </div>
          </div>

          {/* Check Order List Section - Always visible */}
          <div className="bg-white rounded-lg shadow-sm border border-neutral-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-mint-500 rounded-full"></span>
              Check Order List
            </h2>

            <div className="mb-4 pb-4 border-b border-gray-200">
              <p className="text-sm text-gray-600">
                Invoice:{' '}
                <span className="font-semibold text-gray-900">{invoiceData.invoiceId}</span>
              </p>
              <p className="text-sm text-gray-600">
                Customer:{' '}
                <span className="font-semibold text-gray-900">{invoiceData.customer}</span>
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Orders:{' '}
                <span className="font-semibold text-gray-900">{invoiceData.orders.length}</span>
              </p>
            </div>

            <div className="space-y-3">
              {invoiceData.orders.map((order) => (
                <div
                  key={order.id}
                  className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                    order.status === 'COMPLETED'
                      ? 'border-mint-500 bg-mint-50'
                      : 'border-red-300 bg-red-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        order.status === 'COMPLETED'
                          ? 'border-mint-500 bg-mint-500'
                          : 'border-red-400 bg-red-400'
                      }`}
                    >
                      {order.status === 'COMPLETED' ? (
                        <IoCheckmarkCircle className="text-white" size={20} />
                      ) : (
                        <span className="text-white text-xs font-bold">✕</span>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {order.code} - {order.item}
                      </p>
                      <p className="text-xs text-gray-500">Order ID: {order.id}</p>
                    </div>
                  </div>
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-semibold ${
                      order.status === 'COMPLETED'
                        ? 'bg-mint-100 text-mint-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              ))}
            </div>

            {!allOrdersCompleted && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700 font-medium">
                  ⚠️ Cannot ship: Some orders are not completed yet
                </p>
              </div>
            )}

            {allOrdersCompleted && !isInvoiceConfirmed && (
              <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm text-amber-700 font-medium">
                  All orders completed. Please scan and confirm invoice ID to proceed.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Shipping Information */}
        <div
          className={`col-span-12 lg:col-span-5 transition-all duration-500 ease-in-out ${
            canShip
              ? 'opacity-100 translate-y-0'
              : 'opacity-30 translate-y-4 pointer-events-none grayscale'
          }`}
        >
          <div className="bg-white rounded-lg shadow-sm border border-neutral-100 p-6 sticky top-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Shipping Information
            </h2>

            {/* Invoice Info */}
            <div className="mb-4 pb-4 border-b border-gray-200">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Invoice ID</p>
              <p className="text-base font-semibold text-gray-900">{invoiceData.invoiceId}</p>
              <p className="text-sm text-gray-600 mt-1">Customer: {invoiceData.customer}</p>
            </div>

            {/* Carrier */}
            <div className="mb-4">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Delivery Method</p>
              <p className="text-base font-semibold text-gray-900">
                {invoiceData.shipping.carrier}
              </p>
              <p className="text-xs text-gray-500 mt-1">Auto-generated</p>
            </div>

            {/* Shipping Address */}
            <div className="mb-6">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Shipping Address</p>
              <p className="text-sm text-gray-700 leading-relaxed">
                {invoiceData.shipping.address}
              </p>
            </div>

            {/* Print Label Button */}
            <button
              onClick={handlePrintLabel}
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
                {invoiceData.orders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <span className="text-sm font-medium text-gray-900">{order.code}</span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        order.status === 'COMPLETED'
                          ? 'bg-mint-100 text-mint-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
}
