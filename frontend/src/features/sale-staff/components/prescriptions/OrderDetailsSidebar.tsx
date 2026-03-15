import React from 'react'
import { IoPersonOutline, IoCalendarOutline, IoCubeOutline, IoWalletOutline } from 'react-icons/io5'
import { Button, Card } from '@/shared/components/ui'

interface OrderDetailsSidebarProps {
  order: any
}

export const OrderDetailsSidebar: React.FC<OrderDetailsSidebarProps> = ({ order }) => {
  const formatPrice = (amount: number) => `${Number(amount || 0).toLocaleString()} ₫`

  const products: any[] = order?.products || []
  const totalPrice =
    order?.price ||
    products.reduce((sum: number, p: any) => {
      return sum + (p.product?.pricePerUnit || 0) * (p.quantity || 1)
    }, 0)

  return (
    <Card className="p-5 border border-gray-200 shadow-sm rounded-xl bg-white">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium text-slate-800 text-sm">Order Details</h3>
        <Button
          variant="ghost"
          colorScheme="neutral"
          className="text-slate-400 text-[10px] font-medium hover:text-mint-600 hover:bg-mint-50/50 transition-all uppercase tracking-widest px-2 h-7"
        >
          Modify
        </Button>
      </div>
      <div className="space-y-4">
        {}
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
            <IoPersonOutline className="text-gray-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Customer</p>
            <p className="text-sm font-medium text-gray-900">
              {order.customerName || order.invoice?.fullName || 'N/A'}
            </p>
            <p className="text-[10px] text-gray-400">
              {order.customerPhone || order.invoice?.phone || 'N/A'}
            </p>
          </div>
        </div>

        {}
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
            <IoCalendarOutline className="text-gray-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Timeline</p>
            <p className="text-sm font-medium text-gray-900">
              {order.createdAt ? new Date(order.createdAt).toLocaleString() : 'N/A'}
            </p>
          </div>
        </div>

        {}
        {products.length > 0 && (
          <div className="pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-500 flex items-center gap-1.5 mb-3">
              <IoCubeOutline className="text-gray-400" size={14} />
              Items ({products.length})
            </p>
            <div className="space-y-2">
              {products.map((p: any, idx: number) => (
                <div
                  key={idx}
                  className="bg-gray-50 rounded-xl p-3 border border-gray-100 space-y-1"
                >
                  <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-gray-800 truncate">
                        {p.product?.product_name || p.product?.sku || 'Eyewear Product'}
                      </p>
                      <p className="text-[10px] font-mono text-gray-400 mt-0.5">
                        SKU: {p.product?.sku || 'N/A'}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-gray-900 whitespace-nowrap">
                      {formatPrice(p.product?.pricePerUnit || 0)}
                    </span>
                  </div>

                  {}
                  {p.lens && (
                    <div className="mt-2 pt-2 border-t border-gray-200/60 grid grid-cols-2 gap-1">
                      <div className="text-[10px] text-gray-400">
                        <span className="font-semibold text-gray-600">Lens: </span>
                        {p.lens.sku || 'N/A'}
                      </div>
                      <div className="text-[10px] text-gray-400 text-right">
                        {formatPrice(p.lens.pricePerUnit || 0)}
                      </div>
                    </div>
                  )}

                  <div className="text-[10px] text-mint-600 font-medium">
                    Qty × {p.quantity || 1}
                  </div>
                </div>
              ))}
            </div>

            {}
            <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500 flex items-center gap-1.5">
                <IoWalletOutline size={14} /> Total Value
              </span>
              <span className="text-base font-bold text-mint-600">{formatPrice(totalPrice)}</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
