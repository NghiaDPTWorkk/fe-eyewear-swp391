import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { IoClose, IoAlertCircleOutline } from 'react-icons/io5'
import { Button } from '@/components'
import { cn } from '@/lib/utils'
import { httpClient } from '@/api/apiClients'
import { DrawerPrescriptionSummary } from './DrawerPrescriptionSummary'
import { DrawerOrderTimeline } from './DrawerOrderTimeline'
import { DrawerStatusUpdateView } from './DrawerStatusUpdateView'

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
  customer: { name: string; phone: string }
  item: { name: string; qty: number; price: number }
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

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) return
      setLoading(true)
      try {
        const orderResponse = await httpClient.get<any>(`/admin/orders/${orderId}`)
        const ord =
          orderResponse.data?.order || orderResponse.data?.data?.order || orderResponse.data
        if (!ord) return

        let invoiceData = null
        const invoiceId = ord.invoiceId || ord.invoice?._id
        if (invoiceId) {
          try {
            const invResponse = await httpClient.get<any>(`/admin/invoices/${invoiceId}`)
            invoiceData = invResponse.data?.invoice || invResponse.data?.data || invResponse.data
          } catch {
            invoiceData = null
          }
        }

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
        const products = ord.products || []
        const firstProduct = products[0] || {}
        const productDetail = firstProduct.product?.detail || firstProduct.lens?.detail || {}

        setOrderData({
          id: ord.orderCode || `OD_${ord._id}`,
          status: ord.status || 'PENDING',
          isPrescription: orderType === 'Prescription' || ord.type?.includes('MANUFACTURING'),
          isApproved: isApproved,
          customer: { name: customerName, phone: customerPhone },
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
    if (isOpen && orderId) fetchOrderDetails()
  }, [isOpen, orderId, orderType, isApproved])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  if (loading || !orderData) {
    return createPortal(
      <div className="fixed inset-0 z-50 flex justify-end">
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" onClick={onClose} />
        <div className="relative w-full max-w-md h-full bg-white shadow-2xl flex items-center justify-center animate-in slide-in-from-right duration-300">
          <div className="text-gray-500">Loading...</div>
        </div>
      </div>,
      document.body
    )
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex justify-end transition-opacity duration-300">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" onClick={onClose} />
      <div className="relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 overflow-hidden">
        <div
          className={cn(
            'flex-1 flex flex-col transition-all duration-300',
            isUpdatingStatus
              ? '-translate-x-full opacity-0 pointer-events-none'
              : 'translate-x-0 opacity-100'
          )}
        >
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
              className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full ml-4"
            >
              <IoClose size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-2 space-y-8">
            {orderData.isPrescription && orderData.prescription && (
              <DrawerPrescriptionSummary prescription={orderData.prescription} />
            )}
            {orderData.isPrescription && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex gap-3 items-start animate-pulse">
                <IoAlertCircleOutline className="text-amber-500 shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="text-sm font-semibold text-amber-900">High Prescription Warning</p>
                  <p className="text-xs text-amber-700 mt-1">
                    SPH {'>'} 4.00. Advise high-index lenses (1.67/1.74).
                  </p>
                  <button
                    className="mt-2 text-xs font-semibold text-amber-600 hover:text-amber-700 underline"
                    onClick={() => orderId && onNotifyCustomer?.(orderId)}
                  >
                    Send advice via Chat
                  </button>
                </div>
              </div>
            )}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest">
                Customer Information
              </h3>
              <div className="bg-gray-50/50 border border-gray-100 p-5 rounded-2xl space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-medium">Name</span>
                  <span className="font-semibold text-gray-900">{orderData.customer.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-medium">Phone</span>
                  <span className="font-semibold text-gray-900">{orderData.customer.phone}</span>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest">
                Order Items
              </h3>
              <div className="bg-white border border-gray-100 p-4 rounded-2xl flex gap-4 items-center shadow-sm">
                <div className="w-16 h-16 bg-gray-50 rounded-xl shrink-0 border border-gray-100 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=2080&auto=format&fit=crop"
                    className="w-full h-full object-cover opacity-80"
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
            <DrawerOrderTimeline timeline={orderData.timeline} />
          </div>

          <div className="p-6 pt-4 border-t border-gray-50 flex flex-col gap-3 bg-white">
            <Button
              className="w-full h-14 font-semibold rounded-2xl bg-mint-600 hover:bg-mint-700 text-white border-none text-sm group shadow-lg"
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

        <div
          className={cn(
            'absolute inset-0 bg-white transition-all duration-300 z-20',
            isUpdatingStatus
              ? 'translate-x-0 opacity-100'
              : 'translate-x-full opacity-0 pointer-events-none'
          )}
        >
          <DrawerStatusUpdateView
            orderId={orderData.id}
            currentStatus={orderData.status}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            onConfirm={() => {
              setIsUpdatingStatus(false)
            }}
            onBack={() => setIsUpdatingStatus(false)}
          />
        </div>
      </div>
    </div>,
    document.body
  )
}
