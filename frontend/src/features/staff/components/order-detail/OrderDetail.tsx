import { useSalesStaffOrderDetail } from '@/features/sale-staff/hooks/useSalesStaffInvoices'
import {
  IoCalendarOutline,
  IoCubeOutline,
  IoArrowBackOutline,
  IoTimeOutline,
  IoInformationCircleOutline,
  IoDocumentTextOutline,
  IoWalletOutline
} from 'react-icons/io5'
import { Card } from '@/shared/components/ui'
import { cn } from '@/lib/utils'
import { OrderDetailSummary } from './components/OrderDetailSummary'
import { OrderDetailSidebar } from './components/OrderDetailSidebar'

interface OrderDetailProps {
  orderId: string
  onBack: () => void
  isPreOrder?: boolean
  children?: React.ReactNode
}

export default function OrderDetail({ orderId, onBack, isPreOrder, children }: OrderDetailProps) {
  const { data: realOrder, isLoading, error } = useSalesStaffOrderDetail(orderId)

  if (isLoading)
    return (
      <div className="flex h-96 items-center justify-center bg-white rounded-3xl border border-slate-100 shadow-sm">
        <div className="w-12 h-12 border-4 border-mint-500/20 border-t-mint-500 rounded-full animate-spin" />
      </div>
    )
  if (error || !realOrder)
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-4 bg-white rounded-3xl border border-slate-100 shadow-sm">
        <IoInformationCircleOutline size={32} className="text-rose-500" />
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm"
        >
          Go Back
        </button>
      </div>
    )

  const order = {
    id: realOrder.orderCode || realOrder._id,
    date: realOrder.createdAt
      ? new Date(realOrder.createdAt).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        })
      : 'N/A',
    status: realOrder.status?.toUpperCase() || 'PENDING',
    priceVal: realOrder.price || 0,
    subtotal: `${(realOrder.price || 0).toLocaleString()} ₫`,
    shipping: '0 ₫',
    tax: '0 ₫',
    total: `${(realOrder.price || 0).toLocaleString()} ₫`,
    customer: {
      name: realOrder.customerName || realOrder.invoice?.fullName || 'Guest Customer',
      email: realOrder.customerEmail || realOrder.invoice?.email || 'No email provided',
      phone: realOrder.customerPhone || realOrder.invoice?.phone || 'No phone provided',
      avatar: (realOrder.customerName || realOrder.invoice?.fullName || 'G')
        .charAt(0)
        .toUpperCase(),
      since: 'Member'
    },
    note: realOrder.note || '',
    shippingAddress: (() => {
      const addr = realOrder.invoice?.address as any
      if (!addr) return 'Store Pickup'
      if (typeof addr === 'string') return addr
      return (
        [addr.street, addr.ward, addr.city, addr.country].filter(Boolean).join(', ') ||
        'Store Pickup'
      )
    })(),
    items: (realOrder.products || []).map((p: any, idx: number) => ({
      id: idx,
      name: p.product?.product_name || p.product?.sku || 'Eyewear Product',
      sku: p.product?.sku || 'N/A',
      brand: 'PREMIUM COLLECTION',
      price: `${(p.product?.pricePerUnit || 0).toLocaleString()} ₫`,
      quantity: p.quantity,
      lens: p.lens
    })),
    timeline: isPreOrder
      ? [
          {
            title: 'Pre-order Placed',
            time: realOrder.createdAt
              ? new Date(realOrder.createdAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })
              : '',
            desc: 'Deposit confirmed',
            icon: IoWalletOutline
          },
          {
            title: 'Estimated Arrival',
            time: '14-21 DAYS',
            desc: 'Expected at warehouse',
            icon: IoTimeOutline
          }
        ]
      : [
          {
            title: 'Order Created',
            time: realOrder.createdAt
              ? new Date(realOrder.createdAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })
              : '',
            desc: 'Registered in system',
            icon: IoDocumentTextOutline
          },
          {
            title: 'Current Stage',
            time: 'ACTIVE',
            desc: `In ${realOrder.status?.toLowerCase().replace(/_/g, ' ') || 'pending'} stage`,
            icon: IoTimeOutline
          }
        ]
  }

  const getStatusColor = (s: string) => {
    if (['COMPLETED', 'DELIVERED'].includes(s))
      return 'bg-emerald-50 text-emerald-600 border-emerald-100'
    if (['REJECTED', 'CANCELED'].includes(s)) return 'bg-rose-50 text-rose-600 border-rose-100'
    if (['MAKING', 'PROCESSING'].includes(s))
      return 'bg-indigo-50 text-indigo-600 border-indigo-100'
    return 'bg-mint-100/50 text-mint-700 border-mint-200'
  }

  return (
    <div className="space-y-12 pb-24 font-sans relative">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <button
            onClick={onBack}
            className="w-12 h-12 flex items-center justify-center text-slate-400 bg-white border border-slate-100 rounded-2xl hover:shadow-md transition-all shrink-0"
          >
            <IoArrowBackOutline size={22} />
          </button>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
                {isPreOrder ? 'PRE-ORDER' : 'ORDER'} #{order.id}
              </h1>
              <span
                className={cn(
                  'px-3 py-1 text-[10px] font-semibold uppercase tracking-widest rounded-lg border',
                  isPreOrder
                    ? 'bg-mint-50 text-mint-600 border-mint-100'
                    : getStatusColor(order.status)
                )}
              >
                {isPreOrder ? 'PRE-ORDER' : order.status}
              </span>
              {isPreOrder && (
                <span className="px-3 py-1 bg-rose-50 text-rose-600 border border-rose-100 text-[10px] font-bold uppercase rounded-lg">
                  DEPOSIT PAID
                </span>
              )}
            </div>
            <div className="flex items-center gap-4 text-xs font-medium text-slate-400 tracking-widest uppercase">
              <span className="flex items-center gap-1.5">
                <IoCalendarOutline size={14} /> {order.date}
              </span>
              <span className="w-1 h-1 bg-slate-200 rounded-full" />
              <span className="flex items-center gap-1.5">
                <IoCubeOutline size={14} /> {order.items.length} Items
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        <div className="contents">
          <OrderDetailSummary
            items={order.items}
            subtotal={order.subtotal}
            shipping={order.shipping}
            tax={order.tax}
            total={order.total}
            isPreOrder={isPreOrder}
            note={order.note}
          />
          <Card className="xl:col-span-8 h-full flex flex-col p-6 border border-slate-100/50 shadow-xl bg-white rounded-[32px]">
            <h2 className="text-lg font-semibold text-slate-800 mb-8">Activity Flow</h2>
            <div className="relative space-y-8 pl-4">
              <div className="absolute left-[23px] top-2 bottom-2 w-0.5 bg-slate-100" />
              {order.timeline.map((item, i) => (
                <div key={i} className="relative flex gap-6">
                  <div className="z-10 w-5 h-5 rounded-full bg-white border-4 border-mint-500 shadow-sm" />
                  <div className="flex-1 -mt-1">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="text-sm font-bold text-slate-800">{item.title}</h4>
                      <span className="text-[10px] font-semibold text-slate-400 bg-slate-50 px-2 py-1 rounded-md">
                        {item.time}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
        <OrderDetailSidebar customer={order.customer} shippingAddress={order.shippingAddress}>
          {children}
        </OrderDetailSidebar>
      </div>
    </div>
  )
}
