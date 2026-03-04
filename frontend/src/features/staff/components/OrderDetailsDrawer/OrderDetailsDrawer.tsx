import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  IoClose,
  IoCheckmarkCircle,
  IoArrowBackOutline,
  IoRadioButtonOn,
  IoRadioButtonOff,
  IoAlertCircleOutline
} from 'react-icons/io5'
import { Button } from '@/components'
import { cn } from '@/lib/utils'
import { httpClient } from '@/api/apiClients'

interface OrderDetailsDrawerProps {
  isOpen: boolean
  onClose: () => void
  orderId: string | null
  orderType?: 'Regular' | 'Pre-order' | 'Prescription'
  isApproved?: boolean
  onViewFullDetails?: () => void
  onNotifyCustomer?: (orderId: string) => void
}

interface OrderData {
  id: string
  status: string
  isPrescription: boolean
  isApproved?: boolean
  customer: {
    name: string
    phone: string
  }
  item: {
    name: string
    qty: number
    price: number
  }
  prescription?: {
    od: { sph: string; cyl: string; axis: string; add: string }
    os: { sph: string; cyl: string; axis: string; add: string }
    pd: string
    lensType: string
  }
  timeline: Array<{
    label: string
    time: string
    date: string
    status: 'completed' | 'current' | 'pending'
  }>
}

export default function OrderDetailsDrawer({
  isOpen,
  onClose,
  orderId,
  orderType,
  isApproved,
  onViewFullDetails,
  onNotifyCustomer
}: OrderDetailsDrawerProps) {
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const [orderData, setOrderData] = useState<OrderData | null>(null)
  const [loading, setLoading] = useState(false)

  // Fetch order details when drawer opens
  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) return

      setLoading(true)
      try {
         
        // Fetch order data
        const orderResponse = await httpClient.get<any>(`/admin/orders/${orderId}`)
        const ord =
          orderResponse.data?.order || orderResponse.data?.data?.order || orderResponse.data

        if (!ord) {
          setLoading(false)
          return
        }

        // Try to fetch invoice data if we have invoiceId
        let invoiceData = null
        const invoiceId = ord.invoiceId || ord.invoice?._id
        if (invoiceId) {
          try {
            const invResponse = await httpClient.get<any>(`/admin/invoices/${invoiceId}`)
            invoiceData = invResponse.data?.invoice || invResponse.data?.data || invResponse.data
          } catch {
            // Invoice fetch failed, continue without it
          }
        }

        // Transform the data
        const customerName =
          invoiceData?.fullName ||
          invoiceData?.customer?.fullName ||
          ord.invoice?.fullName ||
          ord.invoice?.customer?.fullName ||
          ord.customerName ||
          'Guest'

        const customerPhone =
          invoiceData?.phone ||
          invoiceData?.customer?.phone ||
          ord.invoice?.phone ||
          ord.invoice?.customer?.phone ||
          ord.customerPhone ||
          'Not provided'

        // Get first product for display
        const products = ord.products || []
        const firstProduct = products[0] || {}
        const productDetail = firstProduct.product?.detail || firstProduct.lens?.detail || {}

        setOrderData({
          id: ord.orderCode || `OD_${ord._id}`,
          status: ord.status || 'PENDING',
          isPrescription: orderType === 'Prescription' || ord.type?.includes('MANUFACTURING'),
          isApproved: isApproved,
          customer: {
            name: customerName,
            phone: customerPhone
          },
          item: {
            name: productDetail.name || 'Product',
            qty: firstProduct.quantity || 1,
            price: firstProduct.product?.pricePerUnit || firstProduct.lens?.pricePerUnit || 0
          },
          prescription: firstProduct.lens?.parameters
            ? {
                od: {
                  sph: String(firstProduct.lens.parameters.right?.SPH || 0),
                  cyl: String(firstProduct.lens.parameters.right?.CYL || 0),
                  axis: String(firstProduct.lens.parameters.right?.AXIS || 0),
                  add: String(firstProduct.lens.parameters.right?.ADD || 0)
                },
                os: {
                  sph: String(firstProduct.lens.parameters.left?.SPH || 0),
                  cyl: String(firstProduct.lens.parameters.left?.CYL || 0),
                  axis: String(firstProduct.lens.parameters.left?.AXIS || 0),
                  add: String(firstProduct.lens.parameters.left?.ADD || 0)
                },
                pd: String(firstProduct.lens.parameters.PD || 0) + 'mm',
                lensType: productDetail.name || 'Prescription Lens'
              }
            : undefined,
          timeline: [
            {
              label: 'Order Placed',
              time: ord.createdAt
                ? new Date(ord.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })
                : '',
              date: 'Today',
              status: 'completed'
            },
            { label: 'Payment Confirmed', time: '', date: '', status: 'completed' },
            { label: 'In Production', time: '', date: '', status: 'current' },
            { label: 'Quality Check', time: 'Pending', date: '', status: 'pending' },
            { label: 'Ready to Ship', time: 'Pending', date: '', status: 'pending' }
          ]
        })
      } catch (error) {
        console.error('Failed to fetch order details:', error)
      } finally {
        setLoading(false)
      }
    }

    if (isOpen && orderId) {
      fetchOrderDetails()
    }
  }, [isOpen, orderId, orderType, isApproved])

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Reset status when drawer is closed to avoid state persistence between opens
  if (!isOpen && isUpdatingStatus) {
    setIsUpdatingStatus(false)
  }

  if (!isOpen) return null

  // Show loading state
  if (loading || !orderData) {
    return createPortal(
      <div className="fixed inset-0 z-50 flex justify-end transition-opacity duration-300">
        <div
          className="absolute inset-0 bg-black/20 backdrop-blur-[1px] transition-opacity"
          onClick={onClose}
        />
        <div className="relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 overflow-hidden">
          <div className="flex-1 flex items-center justify-center">
            <div className="text-gray-500">Loading...</div>
          </div>
        </div>
      </div>,
      document.body
    )
  }

  const statusOptions = [
    { label: 'In Production', color: 'bg-[#dcfce7] text-[#15803d] border-[#bbf7d0]' },
    { label: 'Quality Check', color: 'bg-[#fef3c7] text-[#b45309] border-[#fde68a]' },
    { label: 'Ready to Ship', color: 'bg-[#dbeafe] text-[#1d4ed8] border-[#bfdbfe]' },
    { label: 'Shipped', color: 'bg-[#f3e8ff] text-[#7e22ce] border-[#e9d5ff]' },
    { label: 'Delivered', color: 'bg-[#f3f4f6] text-[#374151] border-[#e5e7eb]' },
    { label: 'On Hold', color: 'bg-[#fee2e2] text-[#b91c1c] border-[#fecaca]' }
  ]

  const handleConfirmUpdate = () => {
    // In real app, call API
    console.warn('Updating order status to:', selectedStatus)
    setIsUpdatingStatus(false)
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex justify-end transition-opacity duration-300">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-[1px] transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 overflow-hidden">
        {/* Main Content Area (Absolute positioned to allow for swapping) */}
        <div
          className={cn(
            'flex-1 flex flex-col min-h-0 transition-all duration-300 ease-in-out',
            isUpdatingStatus
              ? '-translate-x-full opacity-0 pointer-events-none'
              : 'translate-x-0 opacity-100'
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-50 bg-gray-50/10">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span
                  className={cn(
                    'px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider',
                    orderType === 'Pre-order'
                      ? 'bg-amber-50 text-amber-600 border border-amber-100'
                      : orderType === 'Prescription'
                        ? 'bg-blue-50 text-blue-600 border border-blue-100'
                        : 'bg-neutral-50 text-neutral-500 border border-neutral-100'
                  )}
                >
                  {orderType} Order
                </span>
                <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-widest rounded-full border border-emerald-100 shadow-sm">
                  {orderData.status}
                </span>
              </div>
              <h2 className="text-2xl font-semibold text-[#0f172a] tracking-tight">
                Order Details
              </h2>
              <p className="text-slate-400 text-sm font-medium mt-1">{orderData.id}</p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all ml-4"
            >
              <IoClose size={24} />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto min-h-0 px-6 py-2 space-y-8 scrollbar-thin scrollbar-thumb-gray-200">
            {/* Order Status & Type Section */}

            {/* Prescription Summary Section */}
            {orderData.isPrescription && orderData.prescription && (
              <div className="space-y-3 pt-2">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest">
                  Prescription Summary
                </h3>
                <div className="bg-emerald-50/30 border border-emerald-100/50 rounded-2xl overflow-hidden shadow-sm">
                  <table className="w-full text-[11px] border-collapse">
                    <thead>
                      <tr className="bg-emerald-100/30 text-emerald-700 font-bold uppercase tracking-tight">
                        <th className="py-2 px-3 text-left">Eye</th>
                        <th className="py-2 px-1 text-center font-bold">SPH</th>
                        <th className="py-2 px-1 text-center font-bold">CYL</th>
                        <th className="py-2 px-1 text-center font-bold">AXIS</th>
                        <th className="py-2 px-1 text-center font-bold">ADD</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-emerald-100/30">
                      <tr>
                        <td className="py-2 px-3 font-bold text-gray-700">OD (Right)</td>
                        <td className="py-2 px-1 text-center text-gray-600 font-medium">
                          {orderData.prescription.od.sph}
                        </td>
                        <td className="py-2 px-1 text-center text-gray-600">
                          {orderData.prescription.od.cyl}
                        </td>
                        <td className="py-2 px-1 text-center text-gray-600">
                          {orderData.prescription.od.axis}
                        </td>
                        <td className="py-2 px-1 text-center text-gray-600">
                          {orderData.prescription.od.add}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-bold text-gray-700">OS (Left)</td>
                        <td className="py-2 px-1 text-center text-gray-600 font-medium">
                          {orderData.prescription.os.sph}
                        </td>
                        <td className="py-2 px-1 text-center text-gray-600">
                          {orderData.prescription.os.cyl}
                        </td>
                        <td className="py-2 px-1 text-center text-gray-600">
                          {orderData.prescription.os.axis}
                        </td>
                        <td className="py-2 px-1 text-center text-gray-600">
                          {orderData.prescription.os.add}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="p-3 bg-white/50 border-t border-emerald-100/30 flex justify-between items-center text-[11px]">
                    <span className="text-gray-500 font-medium uppercase tracking-wider">
                      PD (Dist)
                    </span>
                    <span className="text-emerald-700 font-bold">{orderData.prescription.pd}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Prescription Warning (Business Rule) */}
            {orderData.isPrescription && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex gap-3 items-start animate-pulse">
                <IoAlertCircleOutline className="text-amber-500 shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="text-sm font-semibold text-amber-900">High Prescription Warning</p>
                  <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                    This order has SPH {'>'} 4.00. Please advise the customer to use high-index
                    lenses (1.67 or 1.74) for better weight and aesthetics.
                  </p>
                  <button
                    className="mt-2 text-xs font-semibold text-amber-600 hover:text-amber-700 underline underline-offset-2"
                    onClick={() => orderId && onNotifyCustomer?.(orderId)}
                  >
                    Send advice via Chat
                  </button>
                </div>
              </div>
            )}

            {/* Customer Info */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest">
                Customer Information
              </h3>
              <div className="bg-gray-50/50 border border-gray-100 p-5 rounded-2xl space-y-3 text-sm">
                <div className="flex justify-between items-center group">
                  <span className="text-gray-500 font-medium">Name</span>
                  <span className="font-semibold text-gray-900">{orderData.customer.name}</span>
                </div>
                <div className="flex justify-between items-center group">
                  <span className="text-gray-500 font-medium">Phone</span>
                  <span className="font-semibold text-gray-900">{orderData.customer.phone}</span>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest">
                Order Items
              </h3>
              <div className="bg-white border border-gray-100 p-4 rounded-2xl flex gap-4 items-center shadow-sm">
                <div className="w-16 h-16 bg-gray-50 rounded-xl shrink-0 flex items-center justify-center border border-gray-100 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=2080&auto=format&fit=crop"
                    className="w-full h-full object-cover mix-blend-multiply opacity-80"
                    alt="Item"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 truncate">{orderData.item.name}</h4>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">
                    Qty: {orderData.item.qty}
                  </p>
                </div>
                <span className="font-semibold text-gray-900">
                  ${orderData.item.price.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Order Timeline */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest">
                Order Timeline
              </h3>
              <div className="relative pl-2 space-y-6">
                {/* Vertical Line */}
                <div className="absolute left-[19px] top-3 bottom-1 w-[2px] bg-gray-100" />

                {orderData.timeline.map((step, index) => {
                  const isCompleted = step.status === 'completed'
                  const isCurrent = step.status === 'current'

                  return (
                    <div key={index} className="relative flex gap-4 group">
                      <div className="relative z-10">
                        {isCompleted ? (
                          <div className="w-10 h-10 rounded-full bg-emerald-400 text-white flex items-center justify-center ring-4 ring-white shadow-sm shadow-emerald-100/50">
                            <IoCheckmarkCircle size={22} className="text-white" />
                          </div>
                        ) : isCurrent ? (
                          <div className="w-10 h-10 rounded-full bg-white border-2 border-emerald-400 text-emerald-400 flex items-center justify-center ring-4 ring-white shadow-md">
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-50 border-2 border-gray-100 flex items-center justify-center ring-4 ring-white">
                            <div className="w-2.5 h-2.5 bg-gray-300 rounded-full" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 pt-2">
                        <div className="flex flex-col">
                          <h4
                            className={`font-semibold text-[13px] ${isCurrent ? 'text-emerald-500' : isCompleted ? 'text-gray-900' : 'text-gray-400'} transition-colors`}
                          >
                            {step.label}
                          </h4>
                          {step.time !== 'Pending' && (
                            <p className="text-[11px] text-gray-400 font-medium mt-0.5">
                              {step.time}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-6 pt-4 border-t border-gray-50 flex flex-col gap-3 bg-white">
            <Button
              className={cn(
                'w-full h-14 font-semibold rounded-2xl transition-all active:scale-[0.98] border-none text-sm group shadow-lg',
                orderType === 'Prescription' && !isApproved
                  ? 'bg-mint-600 hover:bg-mint-700 text-white shadow-mint-100'
                  : 'bg-mint-600 hover:bg-mint-700 text-white shadow-mint-100'
              )}
              size="lg"
              onClick={onViewFullDetails}
            >
              {orderType === 'Prescription' && !isApproved
                ? '✓ Verify Prescription'
                : orderType === 'Prescription'
                  ? 'View Prescription Details'
                  : orderType === 'Pre-order'
                    ? 'View Pre-order Details'
                    : 'View Order Details'}
            </Button>
          </div>
        </div>

        {/* Update Status View (Slide in from right) */}
        <div
          className={cn(
            'absolute inset-0 flex flex-col bg-white transition-all duration-300 ease-in-out z-20',
            isUpdatingStatus
              ? 'translate-x-0 opacity-100'
              : 'translate-x-full opacity-0 pointer-events-none'
          )}
        >
          {/* Header */}
          <div className="p-6 pb-4 border-b border-neutral-50 flex items-center gap-4">
            <button
              onClick={() => setIsUpdatingStatus(false)}
              className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all cursor-pointer group"
            >
              <IoArrowBackOutline
                size={22}
                className="group-hover:-translate-x-0.5 transition-transform"
              />
            </button>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 tracking-tight">Update Status</h2>
              <p className="text-gray-500 text-xs mt-0.5">
                Select the next phase for {orderData.id}
              </p>
            </div>
          </div>

          {/* Status Selection List */}
          <div className="flex-1 overflow-y-auto min-h-0 p-6 space-y-3 scrollbar-thin scrollbar-thumb-gray-200">
            <div className="mb-6 p-4 bg-blue-50/50 rounded-2xl border border-blue-100 flex gap-3 items-start">
              <IoAlertCircleOutline className="text-blue-500 mt-0.5" size={18} />
              <p className="text-xs text-blue-700 font-medium leading-relaxed">
                Changing order status will notify the customer and trigger downstream laboratory
                workflows.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest pl-2 mb-3">
                AVAILABLE STATUSES
              </h3>
              {statusOptions.map((option) => {
                const isSelected = selectedStatus === option.label
                const isCurrentStatus = orderData.status === option.label

                return (
                  <button
                    key={option.label}
                    onClick={() => setSelectedStatus(option.label)}
                    className={cn(
                      'w-full p-4 rounded-xl border flex items-center justify-between transition-all group',
                      isSelected
                        ? 'bg-emerald-50 border-emerald-200 ring-4 ring-emerald-500/5 shadow-sm'
                        : 'bg-white border-gray-100 hover:border-emerald-200 hover:bg-gray-50/50 shadow-none border'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn('w-2.5 h-2.5 rounded-full', option.color.split(' ')[0])} />
                      <span
                        className={cn(
                          'text-sm font-semibold',
                          isSelected ? 'text-emerald-900' : 'text-gray-700'
                        )}
                      >
                        {option.label}
                        {isCurrentStatus && (
                          <span className="ml-2 text-[10px] font-semibold text-[#15803d] bg-[#dcfce7] px-2.5 py-1 rounded-full border border-[#bbf7d0]">
                            Current
                          </span>
                        )}
                      </span>
                    </div>
                    {isSelected ? (
                      <IoRadioButtonOn className="text-emerald-500" size={20} />
                    ) : (
                      <IoRadioButtonOff
                        className="text-gray-300 group-hover:text-emerald-300"
                        size={20}
                      />
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Footer Actions for Update */}
          <div className="p-6 pt-4 border-t border-gray-50 flex gap-4 bg-neutral-50/50">
            <Button
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-100 font-semibold rounded-2xl h-12 transition-all active:scale-95 border-none"
              size="lg"
              onClick={handleConfirmUpdate}
              disabled={selectedStatus === orderData.status}
            >
              Confirm Update
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-gray-200 bg-white hover:bg-gray-50 text-gray-600 font-semibold rounded-2xl h-12 transition-all active:scale-95"
              size="lg"
              onClick={() => setIsUpdatingStatus(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
