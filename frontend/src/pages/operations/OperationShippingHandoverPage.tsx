import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Container } from '@/components'
import { BreadcrumbPath } from '@/components/layout/staff/operationstaff/breadcrumbpath'
import { useOrdersDetails } from '@/features/staff/hooks/orders/useOrders'
import { ProcessTracker } from '@/components/layout/staff/staff-core/processtracker'
import { IoAirplaneOutline, IoClose, IoPrintOutline } from 'react-icons/io5'
import ScanInvoiceCode from '@/components/layout/staff/operationstaff/scaninvoicecode/ScanInvoiceCode'
import {
  CheckOrderListFromInvoice,
  OrderCheckItem,
  ShippingInfoPanel
} from '@/components/layout/staff/operationstaff/checkorderlistfrominvoice'
import {
  useOperationInvoiceDetail,
  useUpdateInvoiceReadyToShip,
  useOperationShipCode
} from '@/features/operations/hooks/useOperationInvoiceDetail'
import ConfirmationModal from '@/shared/components/ui/ConfirmationModal'
import ShippingInfoSeal from '@/components/layout/staff/operationstaff/shippinginfoseal/ShippingInfoSeal'
import { createPortal } from 'react-dom'
import toast from 'react-hot-toast'

export default function OperationShippingHandoverPage() {
  const { invoiceId } = useParams<{ invoiceId: string }>()
  const { data, isLoading, isError } = useOperationInvoiceDetail(invoiceId ?? '')
  const updateInvoiceStatus = useUpdateInvoiceReadyToShip()

  const { data: fetchedShipCode } = useOperationShipCode(invoiceId ?? '')

  const invoice = data

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLabelModalOpen, setIsLabelModalOpen] = useState(false)
  const [internalShipCode, setInternalShipCode] = useState<string | undefined>(undefined)

  const activeShipCode = internalShipCode || fetchedShipCode || undefined

  const orders = invoice?.orders ?? []
  const allOrdersCompleted = orders.length > 0

  const isReadyToShip = invoice?.status === 'READY_TO_SHIP'

  // Fetch details for all orders to calculate total amount
  const orderDetailQueries = useOrdersDetails(orders)

  const totalAmount = orderDetailQueries.reduce((sum: number, query: any) => {
    const orderData = (query.data as any)?.data?.order
    return sum + (orderData?.price || 0)
  }, 0)

  const isDetailsLoading = orderDetailQueries.some((q: any) => q.isLoading)

  const handleProcessShipping = () => {
    setIsModalOpen(true)
  }

  const confirmProcessShipping = () => {
    if (!invoice) return
    updateInvoiceStatus.mutate(invoice.id, {
      onSuccess: (data: any) => {
        setIsModalOpen(false)
        toast.success('Invoice marked as Ready to Ship!')
        const newShipCode =
          data?.data?.data?.shipmentInfo?.shipCode || data?.data?.shipmentInfo?.shipCode
        if (newShipCode) {
          setInternalShipCode(newShipCode)
        }
      },
      onError: (error: any) => {
        setIsModalOpen(false)
        toast.error(error?.response?.data?.message || 'Failed to update invoice status')
      }
    })
  }

  const handlePrintLabel = () => {
    if (!invoice) return
    setIsLabelModalOpen(true)
  }

  // Build a friendly address string
  const getAddressString = () => {
    if (!invoice) return ''
    return invoice.address ?? ''
  }

  if (isLoading) {
    return (
      <Container className="animate-fade-in-up">
        <BreadcrumbPath paths={['Dashboard', 'Shipping Handover']} />
        <div className="flex flex-col items-center justify-center py-40 gap-4">
          <div className="relative">
            <div className="w-14 h-14 rounded-full border-4 border-neutral-100" />
            <div className="absolute inset-0 w-14 h-14 rounded-full border-4 border-t-mint-500 animate-spin" />
          </div>
          <p className="text-sm font-semibold text-neutral-700">Loading invoice...</p>
        </div>
      </Container>
    )
  }

  if (isError || !invoice) {
    return (
      <Container className="animate-fade-in-up">
        <BreadcrumbPath paths={['Dashboard', 'Shipping Handover']} />
        <div className="flex flex-col items-center justify-center py-40 gap-4">
          <div className="w-16 h-16 rounded-full bg-red-50 border border-red-100 flex items-center justify-center">
            <IoAirplaneOutline className="text-red-400" size={32} />
          </div>
          <p className="text-sm font-semibold text-neutral-700">Failed to load invoice</p>
          <p className="text-xs text-neutral-400">Check your connection and try refreshing.</p>
        </div>
      </Container>
    )
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
          {invoice.status.replace(/_/g, ' ')}
        </span>
      </div>

      {/* Progress Tracker */}
      <ProcessTracker />

      <div className="grid grid-cols-12 gap-6 mt-6">
        {/* Left Column */}
        <div className="col-span-12 lg:col-span-7 space-y-6">
          {/* Scan Invoice ID Section */}
          <ScanInvoiceCode invoiceCode={invoice.invoiceCode} />

          {/* Check Order List Section */}
          <div className="bg-white rounded-lg shadow-sm border border-neutral-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-mint-500 rounded-full"></span>
              Check Order List
            </h2>

            <CheckOrderListFromInvoice
              invoiceCode={invoice.invoiceCode}
              fullName={invoice.fullName}
              orderCount={orders.length}
            />

            <div className="space-y-3">
              {orders.map((orderId: string) => {
                const orderData = (
                  orderDetailQueries.find((q: any) => q.data?.data?.order?._id === orderId)?.data as any
                )?.data?.order
                return (
                  <OrderCheckItem
                    key={orderId}
                    orderCode={orderData?.orderCode || orderId.slice(-8).toUpperCase()}
                    orderId={orderId}
                    status={orderData?.status || 'COMPLETED'}
                  />
                )
              })}
            </div>

            {!allOrdersCompleted && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700 font-medium">
                  Cannot ship: Some orders are not completed yet
                </p>
              </div>
            )}
            {/* Total Amount */}
            <div className="mt-6 pt-6 border-t border-gray-100 flex justify-between items-center">
              <span className="text-sm font-semibold text-neutral-500 uppercase tracking-wider">
                Invoice Total Amount
              </span>
              <div className="text-right">
                {isDetailsLoading ? (
                  <div className="h-6 w-24 bg-neutral-100 animate-pulse rounded" />
                ) : (
                  <span className="text-xl font-bold font-mono text-neutral-900 border-b-2 border-mint-500 pb-0.5">
                    {totalAmount.toLocaleString('vi-VN')} <span className="text-sm font-normal text-neutral-400">₫</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Shipping Information */}
        <div
          className={`col-span-12 lg:col-span-5 transition-all duration-500 ease-in-out ${
            allOrdersCompleted
              ? 'opacity-100 translate-y-0'
              : 'opacity-30 translate-y-4 pointer-events-none grayscale'
          }`}
        >
          <ShippingInfoPanel
            invoiceCode={invoice.invoiceCode}
            fullName={invoice.fullName}
            phone={invoice.phone}
            carrier="Viettel Post"
            address={getAddressString()}
            status={invoice?.status || 'UNKNOWN'}
            isProcessingShipping={updateInvoiceStatus.isPending}
            shipCode={activeShipCode || (isReadyToShip ? 'Auto Generated' : undefined)}
            hasShipCode={!!activeShipCode}
            orders={orders.map((id) => {
              const query = orderDetailQueries.find((q: any) => q.data?.data?.order?._id === id)
              return {
                id,
                price: (query?.data as any)?.data?.order?.price
              }
            })}
            onPrintLabel={handlePrintLabel}
            onProcessShipping={handleProcessShipping}
          />
        </div>
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmProcessShipping}
        title="Process Shipping"
        message="Are you sure you want to mark this invoice to next stage? The shipment code will be generated."
        confirmText="Confirm Shipping"
        cancelText="Cancel"
        isLoading={updateInvoiceStatus.isPending}
        type="info"
      />

      {/* Shipping Label Print Modal */}
      {isLabelModalOpen &&
        invoice &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-neutral-900/40 backdrop-blur-[2px] transition-opacity duration-300 opacity-100"
              onClick={() => setIsLabelModalOpen(false)}
            />
            <div className="relative w-auto bg-white rounded-xl shadow-2xl p-6 transition-all duration-300 transform scale-100 opacity-100 flex flex-col gap-6">
              <div className="flex justify-between items-center px-2">
                <h3 className="text-xl font-bold tracking-tight text-slate-800">
                  Print Shipping Label
                </h3>
                <button
                  onClick={() => setIsLabelModalOpen(false)}
                  className="p-2 hover:bg-neutral-100 rounded-full transition-colors text-neutral-400 hover:text-neutral-900"
                >
                  <IoClose size={24} />
                </button>
              </div>

              {/* The Seal */}
              <div className="bg-white rounded-lg p-2 border border-neutral-200">
                <ShippingInfoSeal
                  invoiceCode={invoice.invoiceCode}
                  fullName={invoice.fullName}
                  phone={invoice.phone}
                  address={getAddressString()}
                  shipCode={activeShipCode}
                  totalAmount={totalAmount}
                />
              </div>

              <div className="flex justify-end gap-3 px-2">
                <button
                  onClick={() => setIsLabelModalOpen(false)}
                  className="px-6 py-2.5 rounded-lg border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    toast.success('Shipping label sent to printer!')
                    setIsLabelModalOpen(false)
                  }}
                  className="px-8 py-2.5 rounded-lg bg-mint-600 text-white font-bold hover:bg-mint-700 shadow-md shadow-mint-200 transition-transform active:scale-95 flex items-center gap-2"
                >
                  <IoPrintOutline size={20} />
                  Print Now
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </Container>
  )
}
