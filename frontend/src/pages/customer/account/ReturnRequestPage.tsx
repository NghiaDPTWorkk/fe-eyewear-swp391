import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { returnService } from '@/features/customer/services/return.service'
import type { OrderListItem } from '@/shared/types/return-ticket.types'
import { Loader2, ArrowLeft, Package, Clock, ShieldCheck, RefreshCcw } from 'lucide-react'
import { ReturnTicketDialog } from '@/components/layout/customer/account/orders/detail/ReturnTicketDialog'
import { PriceTag } from '@/shared/components/ui/price-tag'

export function ReturnRequestPage() {
  const { invoiceId } = useParams<{ invoiceId: string }>()
  const navigate = useNavigate()
  const [orders, setOrders] = useState<OrderListItem[]>([])
  const [existingReturnOrderIds, setExistingReturnOrderIds] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrders = async () => {
      if (!invoiceId) return
      try {
        setIsLoading(true)
        const [ordersRes, ticketsRes] = await Promise.all([
          returnService.getOrdersByInvoice(invoiceId),
          returnService.getReturnTickets(1, 100)
        ])

        if (ordersRes.success) {
          setOrders(ordersRes.data.orderList)
        } else {
          setError(ordersRes.message)
        }

        if (ticketsRes.success) {
          const ids = new Set(ticketsRes.data.returnTicketList.map((t) => t.orderId))
          setExistingReturnOrderIds(ids)
        }
      } catch (err: any) {
        setError('Failed to fetch orders or return status.')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [invoiceId])

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-gray-400 min-h-[500px]">
        <Loader2 className="w-10 h-10 animate-spin mb-4 text-primary-500" />
        <p className="font-bold">Loading orders for return...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-gray-400 min-h-[500px]">
        <p className="text-danger-500 font-bold mb-4">{error}</p>
        <Button onClick={() => navigate(-1)} variant="outline">
          Back to Orders
        </Button>
      </div>
    )
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto pb-20 px-4 md:px-0">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="flex items-center gap-5">
          <button
            onClick={() => navigate(-1)}
            className="p-3.5 bg-white border border-mint-100 hover:bg-mint-50 hover:border-mint-200 rounded-2xl text-mint-1200 transition-all shadow-sm group"
          >
            <ArrowLeft size={22} className="group-hover:-translate-x-0.5 transition-transform" />
          </button>
          <div>
            <h2 className="text-3xl md:text-3xl font-extrabold text-mint-1200 mb-1.5 tracking-tight">
              Return Request
            </h2>
            <div className="flex items-center gap-2 text-gray-400 font-bold text-xs uppercase tracking-widest">
              <span className="text-primary-600">Invoice</span>
              <span className="w-1 h-1 bg-gray-200 rounded-full" />
              <span>#{invoiceId?.replace('HD_', '')}</span>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-4 px-6 py-3 bg-mint-50/50 rounded-2xl border border-mint-100/50">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Status
            </span>
            <span className="text-xs font-bold text-mint-1200 uppercase tracking-widest flex items-center gap-2">
              <ShieldCheck size={14} className="text-primary-500" /> Eligible for Return
            </span>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="mb-10 p-6 bg-gradient-to-r from-primary-50 to-mint-50 rounded-[28px] border border-primary-100/30 flex items-start gap-4">
        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary-600 shadow-sm shrink-0">
          <Clock size={24} />
        </div>
        <div>
          <h4 className="font-bold text-mint-1200 mb-1">Return Policy Reminder</h4>
          <p className="text-sm text-gray-600 leading-relaxed max-w-2xl">
            You can return items within 30 days of delivery. Please ensure products are in their
            original condition and packaging. Selected items will be reviewed by our staff.
          </p>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em] mb-4 ml-2">
          Your Order Items ({orders.length})
        </h3>

        {orders.length > 0 ? (
          orders.map((order) => (
            <Card
              key={order._id}
              className="p-8 border-mint-100/40 bg-white rounded-[32px] hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all group overflow-hidden relative"
            >
              <div className="absolute top-0 left-0 w-2 h-full bg-primary-100 group-hover:bg-primary-500 transition-colors" />

              <div className="flex flex-col lg:flex-row justify-between gap-10">
                <div className="flex-1 space-y-6">
                  {/* Order Header */}
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-mint-50 rounded-xl flex items-center justify-center text-primary-600">
                      <Package size={20} />
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold text-gray-300 uppercase tracking-widest block mb-0.5">
                        Order ID
                      </span>
                      <span className="text-sm font-bold text-mint-1200 uppercase tracking-wider">
                        #{order.orderCode}
                      </span>
                    </div>
                    <div className="ml-4 px-3 py-1 bg-mint-50 text-mint-1200 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                      {order.status}
                    </div>
                  </div>

                  {/* Products within Order */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {order.products.map((item) => (
                      <div
                        key={item._id}
                        className="flex items-center gap-4 p-4 bg-gray-50/50 rounded-2xl border border-gray-100/50 group-hover:bg-white transition-colors"
                      >
                        <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center border border-gray-100 p-2 shrink-0 shadow-sm">
                          <RefreshCcw className="text-gray-200 w-6 h-6 animate-pulse-slow" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-mint-1200 truncate pr-2">
                            {item.product.sku}
                          </p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-[11px] font-bold text-gray-400 flex items-center gap-1">
                              Qty: <span className="text-mint-1200">{item.quantity}</span>
                            </span>
                            <span className="w-1 h-1 bg-gray-200 rounded-full" />
                            <PriceTag
                              price={item.product.pricePerUnit}
                              className="text-[11px] font-bold text-primary-600"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Action Section */}
                <div className="flex flex-col lg:items-end justify-between lg:min-w-[200px] gap-6 lg:border-l border-mint-50 lg:pl-10">
                  <div className="text-left lg:text-right">
                    <span className="text-[10px] font-extrabold text-gray-300 uppercase tracking-widest block mb-1">
                      Total Order Value
                    </span>
                    <PriceTag
                      price={order.price}
                      className="text-3xl font-extrabold text-mint-1200 tracking-tight"
                    />
                  </div>

                  {existingReturnOrderIds.has(order._id) ? (
                    <div className="flex flex-col items-end gap-2">
                      <div className="px-4 py-2 bg-yellow-50 text-yellow-700 border border-yellow-100 rounded-xl text-[10px] font-bold uppercase tracking-wider">
                        Return Requested
                      </div>
                      <Button
                        disabled
                        className="w-full lg:w-auto px-8 h-12 bg-gray-100 text-gray-400 rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] cursor-not-allowed border-none shadow-none"
                      >
                        Already Submitted
                      </Button>
                    </div>
                  ) : (
                    <ReturnTicketDialog
                      orderId={order._id}
                      orderCode={order.orderCode}
                      trigger={
                        <Button className="w-full lg:w-auto px-8 h-12 bg-mint-1200 hover:bg-black text-white rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] transition-all shadow-xl shadow-mint-100/50 transform active:scale-[0.98]">
                          Return Items
                        </Button>
                      }
                    />
                  )}
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="p-24 flex flex-col items-center justify-center border-dashed border-2 border-mint-100 bg-white/50 backdrop-blur-sm rounded-[48px]">
            <div className="w-20 h-20 bg-mint-50 rounded-full flex items-center justify-center mb-6 text-mint-200">
              <Package size={40} />
            </div>
            <p className="text-xl font-bold text-mint-1200 mb-2">No returnable orders</p>
            <p className="text-gray-400 text-sm font-medium">
              This invoice has no orders eligible for return at this time.
            </p>
            <Button
              variant="outline"
              onClick={() => navigate('/account/orders')}
              className="mt-8 rounded-2xl border-mint-100 text-mint-1200 font-bold px-8"
            >
              Back to Orders
            </Button>
          </div>
        )}
      </div>

      {/* Help Footer */}
      <div className="mt-16 p-8 bg-black rounded-[32px] text-white flex flex-col md:flex-row items-center justify-between gap-8 border border-white/10 shadow-2xl">
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 bg-primary-500 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-primary-500/20">
            ?
          </div>
          <div>
            <h4 className="font-bold text-lg mb-1">Need help with your return?</h4>
            <p className="text-gray-400 text-sm font-medium tracking-wide">
              Contact our premium support for white-glove assistance with order issues.
            </p>
          </div>
        </div>
        <button className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all border border-white/5">
          Chat With Expert
        </button>
      </div>
    </div>
  )
}
