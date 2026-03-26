import { useSalesStaffOrderDetail } from '@/features/sales/hooks'

import {
  IoMailOutline,
  IoCallOutline,
  IoLocationOutline,
  IoEyeOutline,
  IoCalendarOutline,
  IoDocumentTextOutline,
  IoCubeOutline,
  IoArrowBackOutline,
  IoGlassesOutline,
  IoTimeOutline,
  IoInformationCircleOutline
} from 'react-icons/io5'
import { Card } from '@/shared/components/ui-core'
import { cn } from '@/lib/utils'
import { formatPrice, toTitleCase } from '@/shared/utils'

interface OrderDetailProps {
  orderId: string
  onBack: () => void
  isPreOrder?: boolean
  children?: React.ReactNode
}

export default function OrderDetail({ orderId, onBack, isPreOrder, children }: OrderDetailProps) {
  const { data: realOrder, isLoading, error } = useSalesStaffOrderDetail(orderId)

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center bg-white rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-mint-500/20 border-t-mint-500 rounded-full animate-spin" />
          <p className="text-slate-400 font-medium animate-pulse">Loading order details...</p>
        </div>
      </div>
    )
  }

  if (error || !realOrder) {
    return (
      <div className="flex h-96 items-center justify-center flex-col gap-4 bg-white rounded-3xl border border-slate-100 shadow-sm">
        <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center text-rose-500">
          <IoInformationCircleOutline size={32} />
        </div>
        <p className="text-slate-600 font-semibold">Failed to load order details</p>
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-colors"
        >
          Go Back
        </button>
      </div>
    )
  }

  const order = {
    id: realOrder.orderCode || realOrder._id,
    date: realOrder.createdAt
      ? new Date(realOrder.createdAt).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        })
      : 'N/A',
    status:
      realOrder.invoice?.status === 'CANCELED' || realOrder.invoice?.status === 'CANCEL'
        ? 'CANCELED'
        : realOrder.status?.toUpperCase() || 'PENDING',
    priceVal: realOrder.price || 0,
    subtotal: formatPrice(realOrder.price || 0),
    shipping: formatPrice(realOrder.invoice?.feeShip || 0),
    tax: formatPrice(0),
    discount: formatPrice(realOrder.invoice?.totalDiscount || 0),
    total: formatPrice(realOrder.price || 0),

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
      price: formatPrice(p.product?.pricePerUnit || 0),
      quantity: p.quantity,
      lens: p.lens,
      image:
        p.product?.image ||
        p.product?.thumbnail ||
        p.product?.imageUrl ||
        p.product?.defaultVariantImage ||
        p.product?.product_image
    })),
    timeline: [
      {
        title: 'Order Created',
        time: realOrder.createdAt
          ? new Date(realOrder.createdAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            })
          : '',
        desc: 'New order registered in system',
        icon: IoDocumentTextOutline,
        ts: realOrder.createdAt
      },
      realOrder.approvedAt && {
        title: 'Order Approved',
        time: new Date(realOrder.approvedAt).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        }),
        desc: 'Prescription/Order verified by staff',
        icon: IoEyeOutline,
        ts: realOrder.approvedAt
      },
      realOrder.rejectedAt && {
        title: 'Order Rejected',
        time: new Date(realOrder.rejectedAt).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        }),
        desc: `Rejected: ${realOrder.rejectionNote || 'No reason provided'}`,
        icon: IoInformationCircleOutline,
        ts: realOrder.rejectedAt
      },
      realOrder.assignedAt && {
        title: 'Technician Assigned',
        time: new Date(realOrder.assignedAt).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        }),
        desc: 'Staff assigned to production',
        icon: IoCubeOutline,
        ts: realOrder.assignedAt
      },
      realOrder.startedAt && {
        title: 'In Production',
        time: new Date(realOrder.startedAt).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        }),
        desc: 'Glasse crafting in progress',
        icon: IoTimeOutline,
        ts: realOrder.startedAt
      },
      realOrder.completedAt && {
        title: 'Completed',
        time: new Date(realOrder.completedAt).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        }),
        desc: 'Order is ready for delivery',
        icon: IoGlassesOutline,
        ts: realOrder.completedAt
      }
    ]
      .filter((t): t is any => !!t && !!t.ts)
      .sort((a, b) => new Date(a.ts).getTime() - new Date(b.ts).getTime()),
    transactions: [
      {
        id: `TRX-${(realOrder.orderCode || '').slice(-6)}`,
        date: realOrder.createdAt ? new Date(realOrder.createdAt).toLocaleDateString() : 'N/A',
        method: isPreOrder ? 'DEPOSIT PAYMENT' : 'BANK TRANSFER',
        amount: formatPrice(realOrder.price || 0),
        status: 'SUCCESS'
      }
    ]
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
      case 'DELIVERED':
        return 'bg-emerald-50 text-emerald-600 border-emerald-100'
      case 'REJECTED':
      case 'CANCELED':
        return 'bg-rose-50 text-rose-600 border-rose-100'
      case 'MAKING':
      case 'PROCESSING':
        return 'bg-indigo-50 text-indigo-600 border-indigo-100'
      default:
        return 'bg-mint-100/50 text-mint-700 border-mint-200'
    }
  }

  return (
    <div className="space-y-12 pb-24 font-sans relative">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <button
            onClick={onBack}
            className="w-12 h-12 flex items-center justify-center text-slate-400 hover:text-slate-900 bg-white border border-slate-100 rounded-2xl transition-all hover:shadow-md active:scale-95 shrink-0"
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
                  'px-3 py-1 text-[10px] font-semibold tracking-widest rounded-lg border',
                  isPreOrder
                    ? 'bg-mint-50 text-mint-600 border-mint-100'
                    : getStatusColor(order.status)
                )}
              >
                {isPreOrder ? 'Pre-order' : toTitleCase(order.status)}
              </span>
              {isPreOrder && (
                <span className="px-3 py-1 bg-rose-50 text-rose-600 border border-rose-100 text-[10px] font-bold uppercase tracking-widest rounded-lg">
                  DEPOSIT PAID
                </span>
              )}
            </div>
            <div className="flex items-center gap-4 text-xs font-medium text-slate-400 uppercase tracking-widest">
              <span className="flex items-center gap-1.5">
                <IoCalendarOutline size={14} /> {order.date}
              </span>
              <span className="w-1 h-1 bg-slate-300 rounded-full" />
              <span className="flex items-center gap-1.5">
                <IoCubeOutline size={14} /> {order.items.length} Items
              </span>
              {isPreOrder && (
                <>
                  <span className="w-1 h-1 bg-slate-300 rounded-full" />
                  <span className="flex items-center gap-1.5 text-emerald-500 font-bold">
                    <IoTimeOutline size={14} /> ETA: 2-3 WEEKS
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-stretch">
        <div className="contents">
          <Card className="xl:col-span-8 order-1 h-full flex flex-col p-0 overflow-hidden border border-slate-100/50 shadow-xl shadow-slate-200/40 bg-white rounded-[32px]">
            <div className="px-8 py-6 border-b border-slate-50 bg-slate-50/20">
              <h2 className="text-lg font-semibold text-slate-800 tracking-tight">
                {isPreOrder ? 'Pre-order Summary' : 'Order Summary'}
              </h2>
            </div>

            <div>
              {order.items.map((item, i) => (
                <div
                  key={i}
                  className="p-6 rounded-[24px] hover:bg-slate-50/40 transition-all duration-300 group"
                >
                  <div className="flex items-start gap-6">
                    <div className="w-28 h-28 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-200 shadow-sm transition-all group-hover:shadow-md group-hover:scale-[1.02] overflow-hidden">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <IoGlassesOutline size={48} />
                      )}
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] mb-1 text-mint-600">
                            {item.brand}
                          </p>
                          <h3 className="text-base font-semibold text-slate-800 tracking-tight transition-colors group-hover:text-mint-600">
                            {item.name}
                          </h3>
                        </div>
                        <span className="text-base font-bold text-slate-900 tracking-tight">
                          {item.price}
                        </span>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-xs">
                          <span className="text-slate-400 font-medium">SKU:</span>
                          <span className="text-slate-700 font-semibold ml-1.5 font-mono">
                            {item.sku}
                          </span>
                        </div>
                        <div className="text-xs">
                          <span className="text-slate-400 font-medium tracking-tight">
                            Quantity:
                          </span>
                          <span className="text-slate-700 font-semibold ml-1.5 uppercase tracking-widest text-[11px]">
                            x{item.quantity}
                          </span>
                        </div>
                      </div>

                      {item.lens && (
                        <div className="mt-4 p-4 rounded-2xl border bg-mint-50/30 border-mint-100/40 space-y-3">
                          <p className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 text-mint-600">
                            <IoEyeOutline size={14} /> Prescription details included
                          </p>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/60 p-2.5 rounded-xl border border-white">
                              <p className="text-[9px] font-semibold text-slate-400 uppercase mb-1">
                                Right Eye (OD)
                              </p>
                              <p className="text-[11px] font-semibold text-slate-700">
                                SPH: {item.lens.parameters?.right?.SPH || '0.00'}
                              </p>
                            </div>
                            <div className="bg-white/60 p-2.5 rounded-xl border border-white">
                              <p className="text-[9px] font-semibold text-slate-400 uppercase mb-1">
                                Left Eye (OS)
                              </p>
                              <p className="text-[11px] font-semibold text-slate-700">
                                SPH: {item.lens.parameters?.left?.SPH || '0.00'}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col md:flex-row bg-slate-50/10 mt-auto">
              <div className="flex-1 p-6 relative">
                {order.note ? (
                  <div className="p-6 rounded-[24px] border relative overflow-hidden h-full flex flex-col justify-center bg-mint-50/60 border-mint-100/60">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                      <IoDocumentTextOutline size={80} />
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] flex items-center gap-2 mb-3 text-mint-600">
                      <span className="w-2 h-2 rounded-full bg-mint-400" />
                      Order Note
                    </p>
                    <p className="text-sm font-medium text-slate-700 italic leading-relaxed relative z-10 line-clamp-3">
                      &ldquo;{order.note}&rdquo;
                    </p>
                  </div>
                ) : (
                  <div className="h-full rounded-[24px] border border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 gap-2 min-h-[140px]">
                    <IoDocumentTextOutline size={24} className="opacity-20" />
                    <span className="text-xs uppercase tracking-widest font-semibold opacity-50">
                      No attached note
                    </span>
                  </div>
                )}
              </div>

              <div className="w-full md:w-[320px] lg:w-[380px] shrink-0 p-8 bg-white border-l border-slate-50 relative overflow-hidden">
                <div className="space-y-6">
                  {/* Item Breakdown */}
                  <div className="space-y-4">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-2">
                      Item Breakdown
                    </p>
                    {order.items.map((item: any, i: number) => (
                      <div key={i} className="space-y-1">
                        <div className="flex justify-between items-start text-sm font-semibold">
                          <span className="text-slate-800 truncate max-w-[180px]">
                            {item.name}{' '}
                            <span className="text-mint-600 font-bold ml-1">x{item.quantity}</span>
                          </span>
                          <span className="text-slate-900 font-mono tracking-tight">
                            {formatPrice(
                              (parseFloat(item.price.replace(/[^\d]/g, '')) || 0) * item.quantity
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-400 font-medium italic">
                          <span>Unit Price</span>
                          <span>{item.price}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-6 border-t border-slate-100 flex flex-col gap-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] px-1">
                      Total Amount
                    </span>
                    <div className="flex justify-between items-baseline px-1">
                      <span className="text-4xl font-black tracking-tighter text-mint-600 font-mono">
                        {order.total}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="xl:col-span-8 order-3 h-full flex flex-col p-6 border border-slate-100/50 shadow-xl shadow-slate-200/40 bg-white rounded-[32px]">
            <h2 className="text-lg font-semibold text-slate-800 tracking-tight mb-8">
              Activity Flow
            </h2>
            <div className="relative space-y-8 pl-4">
              <div className="absolute left-[23px] top-2 bottom-2 w-0.5 bg-slate-100" />
              {order.timeline.map((item, i) => (
                <div key={i} className="relative flex gap-6 group">
                  <div className="relative z-10 w-5 h-5 rounded-full bg-white border-4 border-mint-500 shadow-sm" />
                  <div className="flex-1 -mt-1">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="text-sm font-bold text-slate-800">{item.title}</h4>
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-md">
                        {item.time}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 leading-relaxed font-normal">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="contents">
          <Card className="xl:col-span-4 order-2 h-full flex flex-col p-6 border border-slate-100/50 shadow-xl shadow-slate-200/40 bg-white rounded-[32px] overflow-hidden relative group">
            <div className="absolute -right-4 -top-4 w-32 h-32 rounded-full opacity-50 bg-mint-50 group-hover:scale-110 transition-transform duration-500" />
            <h2 className="text-lg font-semibold text-slate-800 tracking-tight mb-6 relative z-10">
              Customer Profile
            </h2>
            <div className="relative flex flex-col items-center text-center pb-8 border-b border-slate-100">
              <div className="w-20 h-20 rounded-[28px] flex items-center justify-center font-semibold text-2xl border-4 border-white shadow-xl mb-4 transition-all bg-mint-100 text-mint-600">
                {order.customer.avatar}
              </div>
              <h3 className="text-lg font-semibold text-slate-900 tracking-tight">
                {order.customer.name}
              </h3>
              <p className="px-3 py-1 text-[10px] font-semibold uppercase tracking-widest rounded-full mt-2 bg-mint-50 text-mint-600">
                {order.customer.since}
              </p>
            </div>
            <div className="space-y-5 pt-8">
              <div className="flex flex-col gap-1.5">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <IoMailOutline /> Email
                </p>
                <p className="text-sm font-semibold text-slate-700 truncate">
                  {order.customer.email}
                </p>
              </div>
              <div className="flex flex-col gap-1.5">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <IoCallOutline /> Contact
                </p>
                <p className="text-sm font-semibold text-slate-700">{order.customer.phone}</p>
              </div>
              <div className="flex flex-col gap-1.5 pt-4 border-t border-slate-50">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  Customer Status
                </p>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <p className="text-xs font-bold text-slate-700 uppercase tracking-tighter">
                    {order.customer.name === 'Guest Customer' ? 'Guest' : 'Active Member'}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="xl:col-span-4 order-4 h-full flex flex-col p-6 border border-slate-100/50 shadow-xl shadow-slate-200/40 bg-white rounded-[32px]">
            <h2 className="text-lg font-semibold text-slate-800 tracking-tight mb-6">
              Order Detail
            </h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 shadow-sm border border-slate-100 text-mint-500">
                  <IoLocationOutline size={20} />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                    Shipping Address
                  </p>
                  <p className="text-sm font-semibold text-slate-700 leading-relaxed">
                    {order.shippingAddress}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {children && <div className="xl:col-span-12 order-5 w-full">{children}</div>}
        </div>
      </div>
    </div>
  )
}
