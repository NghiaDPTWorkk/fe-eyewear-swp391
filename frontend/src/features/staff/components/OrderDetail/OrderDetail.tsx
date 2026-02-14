import { useSalesStaffOrderDetail } from '@/features/sales/hooks/useSalesStaffInvoices'

import {
  IoPrintOutline,
  IoPencilOutline,
  IoMailOutline,
  IoCallOutline,
  IoLocationOutline,
  IoCheckmarkCircle,
  IoEyeOutline,
  IoCalendarOutline,
  IoDocumentTextOutline,
  IoCubeOutline,
  IoWalletOutline,
  IoArrowBackOutline,
  IoGlassesOutline,
  IoListOutline,
  IoTimeOutline,
  IoInformationCircleOutline
} from 'react-icons/io5'
import { Card, Button } from '@/shared/components/ui-core'
import { cn } from '@/lib/utils'

interface OrderDetailProps {
  orderId: string
  onBack: () => void
  isPreOrder?: boolean
}

export default function OrderDetail({ orderId, onBack }: OrderDetailProps) {
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
        <Button onClick={onBack} variant="outline" colorScheme="neutral">
          Go Back
        </Button>
      </div>
    )
  }

  // Transform data
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
      email: realOrder.invoice?.email || 'No email provided',
      phone: realOrder.customerPhone || realOrder.invoice?.phone || 'No phone provided',
      avatar: (realOrder.customerName || realOrder.invoice?.fullName || 'G')
        .charAt(0)
        .toUpperCase(),
      since: 'Member'
    },
    shippingAddress: realOrder.invoice?.address || 'Store Pickup',
    items: (realOrder.products || []).map((p: any, idx: number) => ({
      id: idx,
      name: p.product?.product_name || p.product?.sku || 'Eyewear Product',
      sku: p.product?.sku || 'N/A',
      brand: 'Premium collection',
      price: `${(p.product?.pricePerUnit || 0).toLocaleString()} ₫`,
      quantity: p.quantity,
      lens: p.lens
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
        icon: IoDocumentTextOutline
      },
      {
        title: 'Current Stage',
        time: 'Active',
        desc: `Order is currently in ${realOrder.status} stage`,
        icon: IoTimeOutline
      }
    ],
    transactions: [
      {
        id: `TRX-${(realOrder.orderCode || '').slice(-6)}`,
        date: realOrder.createdAt ? new Date(realOrder.createdAt).toLocaleDateString() : 'N/A',
        method: 'Bank Transfer',
        amount: `${(realOrder.price || 0).toLocaleString()} ₫`,
        status: 'Success'
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
        return 'bg-amber-50 text-amber-600 border-amber-100'
    }
  }

  return (
    <div className="space-y-8 pb-24 animate-in fade-in slide-in-from-right-4 duration-500 font-sans bg-transparent">
      {/* Header Profile Section */}
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
                Order #{order.id}
              </h1>
              <span
                className={cn(
                  'px-3 py-1 text-[10px] font-semibold uppercase tracking-widest rounded-lg border',
                  getStatusColor(order.status)
                )}
              >
                {order.status}
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium text-slate-400 uppercase tracking-widest">
              <span className="flex items-center gap-1.5">
                <IoCalendarOutline size={14} /> {order.date}
              </span>
              <span className="w-1 h-1 bg-slate-300 rounded-full" />
              <span className="flex items-center gap-1.5">
                <IoCubeOutline size={14} /> {order.items.length} Items
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            colorScheme="neutral"
            className="bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-semibold rounded-2xl px-6 h-12 transition-all border shadow-sm"
            leftIcon={<IoPrintOutline size={20} />}
          >
            Print Invoice
          </Button>
          <Button
            className="bg-mint-600 hover:bg-mint-700 text-white font-semibold rounded-2xl px-6 h-12 transition-all shadow-lg shadow-mint-100 active:scale-[0.98] border-none"
            leftIcon={<IoPencilOutline size={20} />}
          >
            Update Status
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Main Information */}
        <div className="xl:col-span-8 space-y-8">
          {/* Order Items Table-style Card */}
          <Card className="p-0 overflow-hidden border-none shadow-xl shadow-slate-200/40 ring-1 ring-neutral-100/50 bg-white rounded-[32px]">
            <div className="px-8 py-6 border-b border-slate-50 bg-slate-50/20 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-xl shadow-sm text-mint-600 border border-slate-100">
                  <IoListOutline size={20} />
                </div>
                <h2 className="text-lg font-semibold text-slate-800 tracking-tight">
                  Order Summary
                </h2>
              </div>
              <button className="text-xs font-semibold text-mint-600 uppercase tracking-widest hover:text-mint-700 transition-colors">
                Export Details
              </button>
            </div>

            <div className="p-2">
              {order.items.map((item, i) => (
                <div
                  key={i}
                  className="p-6 rounded-[24px] hover:bg-slate-50/40 transition-all duration-300 group"
                >
                  <div className="flex items-start gap-6">
                    <div className="w-28 h-28 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-200 shadow-sm">
                      <IoGlassesOutline size={48} />
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-[10px] font-semibold text-mint-500 uppercase tracking-[0.2em] mb-1">
                            {item.brand}
                          </p>
                          <h3 className="text-base font-semibold text-slate-800 tracking-tight group-hover:text-mint-600 transition-colors">
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

                      {/* Lens configuration */}
                      {item.lens && (
                        <div className="mt-4 p-4 bg-emerald-50/30 rounded-2xl border border-emerald-100/40 space-y-3">
                          <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-2">
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

            {/* Price Footer */}
            <div className="px-8 py-8 bg-slate-50/30 border-t border-slate-50">
              <div className="max-w-xs ml-auto space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                    Subtotal
                  </span>
                  <span className="text-sm font-bold text-slate-700">{order.subtotal}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                    Shipping
                  </span>
                  <span className="text-sm font-bold text-slate-700">{order.shipping}</span>
                </div>
                <div className="flex justify-between items-center pb-2">
                  <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                    Tax
                  </span>
                  <span className="text-sm font-bold text-slate-700">{order.tax}</span>
                </div>
                <div className="pt-5 border-t border-slate-200/60 flex justify-between items-center">
                  <span className="text-sm font-semibold text-slate-900 uppercase tracking-widest">
                    Total Amount
                  </span>
                  <span className="text-2xl font-bold text-mint-600 tracking-tight">
                    {order.total}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Activity Timeline */}
          <Card className="p-8 border-none shadow-xl shadow-slate-200/40 ring-1 ring-neutral-100/50 bg-white rounded-[32px]">
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
                      <h4 className="text-sm font-semibold text-slate-800">{item.title}</h4>
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

        {/* Sidebar */}
        <div className="xl:col-span-4 space-y-8">
          {/* Customer Card */}
          <Card className="p-8 border-none shadow-xl shadow-slate-200/40 ring-1 ring-neutral-100/50 bg-white rounded-[32px] overflow-hidden relative group">
            <div className="absolute -right-4 -top-4 w-32 h-32 bg-mint-50 rounded-full opacity-50 group-hover:scale-110 transition-transform duration-500" />
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-[0.2em] mb-6 relative">
              Customer Profile
            </h2>

            <div className="relative flex flex-col items-center text-center pb-8 border-b border-slate-100">
              <div className="w-20 h-20 bg-mint-100 text-mint-600 rounded-[28px] flex items-center justify-center font-semibold text-2xl border-4 border-white shadow-xl mb-4 transition-all">
                {order.customer.avatar}
              </div>
              <h3 className="text-lg font-semibold text-slate-900 tracking-tight">
                {order.customer.name}
              </h3>
              <p className="px-3 py-1 bg-mint-50 text-mint-600 text-[10px] font-semibold uppercase tracking-widest rounded-full mt-2">
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
              <button className="w-full mt-4 py-3 text-xs font-semibold text-mint-600 bg-mint-50/50 hover:bg-mint-50 border border-mint-100/50 rounded-xl transition-all uppercase tracking-widest active:scale-95">
                View History
              </button>
            </div>
          </Card>

          {/* Delivery & Address */}
          <Card className="p-8 border-none shadow-xl shadow-slate-200/40 ring-1 ring-neutral-100/50 bg-white rounded-[32px]">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-[0.2em] mb-6">
              Fulfillment Details
            </h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-mint-500 shrink-0 shadow-sm border border-slate-100">
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
              <div className="flex gap-4 pt-6 border-t border-slate-50">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-mint-500 shrink-0 shadow-sm border border-slate-100">
                  <IoWalletOutline size={20} />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                    Billing Method
                  </p>
                  <p className="text-sm font-semibold text-slate-700 leading-relaxed">
                    Same as Shipping
                  </p>
                  <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-500 uppercase tracking-widest h-6">
                    <IoCheckmarkCircle /> Verified
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Transactions & Memo Row */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Transactions Section - Now at bottom left */}
        <div className="xl:col-span-8">
          <Card className="p-0 overflow-hidden border-none shadow-xl shadow-slate-200/40 ring-1 ring-neutral-100/50 bg-white rounded-[32px]">
            <div className="px-8 py-6 border-b border-slate-50 flex items-center gap-3">
              <div className="p-2 bg-slate-50 rounded-xl text-slate-500">
                <IoWalletOutline size={20} />
              </div>
              <h2 className="text-lg font-semibold text-slate-800 tracking-tight">
                Transaction History
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 text-[10px] uppercase font-semibold text-slate-400 tracking-[0.15em]">
                  <tr>
                    <th className="px-8 py-5">TXN ID</th>
                    <th className="px-8 py-5">DATE</th>
                    <th className="px-8 py-5 text-right">AMOUNT</th>
                    <th className="px-8 py-5 text-center">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {order.transactions.map((trx, j) => (
                    <tr key={j} className="hover:bg-slate-50/30 transition-colors">
                      <td className="px-8 py-6 font-mono text-xs font-semibold text-slate-900 uppercase">
                        {trx.id}
                      </td>
                      <td className="px-8 py-6 text-xs font-medium text-slate-500">{trx.date}</td>
                      <td className="px-8 py-6 text-right font-semibold text-slate-900">
                        {trx.amount}
                      </td>
                      <td className="px-8 py-6 text-center">
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-semibold uppercase tracking-widest rounded-lg border border-emerald-100">
                          {trx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Internal Memo - Now at bottom right */}
        <div className="xl:col-span-4 h-full">
          <Card className="h-full p-8 border-none shadow-xl shadow-slate-200/40 ring-1 ring-neutral-100/50 bg-amber-50/40 rounded-[32px] border border-amber-50 relative overflow-hidden flex flex-col">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <IoDocumentTextOutline size={120} />
            </div>
            <h2 className="text-[10px] font-semibold text-amber-600/70 uppercase tracking-[0.2em] mb-4 flex items-center gap-2 relative">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              Staff Memo
            </h2>
            <textarea
              className="w-full flex-1 min-h-[150px] p-4 rounded-3xl border border-amber-100 bg-white/60 focus:outline-none focus:ring-4 focus:ring-amber-200/20 text-sm font-semibold text-slate-700 resize-none shadow-inner"
              placeholder="Add private staff instructions..."
              style={{ scrollbarWidth: 'none' }}
            />
            <div className="flex justify-end mt-4">
              <button className="text-[10px] font-semibold text-amber-700 uppercase tracking-[0.2em] hover:text-amber-900 transition-colors">
                Save Changes
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
