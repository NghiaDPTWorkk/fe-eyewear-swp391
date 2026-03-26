import React from 'react'
import { Card } from '@/shared/components/ui-core'

interface PrescriptionHeroSectionProps {
  order: any
}

export const PrescriptionHeroSection: React.FC<PrescriptionHeroSectionProps> = ({ order }) => {
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    })
      .format(amount || 0)
      .replace('₫', 'đ')
  }

  const products = order?.products || []

  const subtotal =
    order?.invoice?.subTotal ||
    products.reduce((sum: number, p: any) => {
      const itemTotal = (p.product?.pricePerUnit || 0) + (p.lens?.pricePerUnit || 0)
      return sum + itemTotal * (p.quantity || 1)
    }, 0)

  const discount = order?.invoice?.totalDiscount || 0
  const shipping = order?.invoice?.shippingFee || 10000
  const total = subtotal

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <Card className="lg:col-span-2 p-5 md:p-6 border border-gray-100 shadow-sm rounded-xl bg-white flex flex-col min-h-[400px]">
        <h2 className="text-sm font-bold text-slate-800 mb-6 uppercase tracking-wider flex items-center gap-2">
          <div className="w-1 h-3 bg-mint-500 rounded-full" />
          Order Summary
        </h2>

        <div className="flex-1 space-y-4">
          {products.map((p: any, idx: number) => {
            const rowTotalPrice =
              ((p.product?.pricePerUnit || 0) + (p.lens?.pricePerUnit || 0)) * (p.quantity || 1)

            return (
              <div key={idx} className="flex gap-6 items-start py-2">
                <div className="w-20 h-20 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                  <svg viewBox="0 0 24 24" fill="none" className="w-10 h-10 text-slate-200">
                    <path
                      d="M4 12C4 12 5 7 12 7C19 7 20 12 20 12C20 12 19 17 12 17C5 17 4 12 4 12Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-[9px] font-bold text-mint-600 uppercase tracking-widest mb-1">
                    {p.product?.category || 'Premium Collection'}
                  </p>
                  <h4 className="text-sm font-bold text-slate-700 leading-tight">
                    {p.product?.product_name || 'Eyewear Frame'}
                  </h4>

                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-2">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                        Serial
                      </span>
                      <span className="text-[11px] text-slate-600 font-mono font-bold uppercase">
                        {p.product?.sku || 'N/A'}
                      </span>
                    </div>
                    {p.lens && (
                      <div className="flex flex-col border-l border-slate-100 pl-6">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                          Lens
                        </span>
                        <span className="text-[11px] text-mint-600 font-bold uppercase">
                          {p.lens.sku}
                          <span className="ml-1 text-slate-400 font-normal">
                            ({formatPrice(p.lens.pricePerUnit)})
                          </span>
                        </span>
                      </div>
                    )}
                    <div className="flex flex-col border-l border-slate-100 pl-6">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                        Qty
                      </span>
                      <span className="text-[11px] text-slate-600 font-bold">
                        X{p.quantity || 1}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold text-slate-800 font-mono">
                    {formatPrice(rowTotalPrice)}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6 pt-6 border-t border-slate-50">
          <div className="bg-slate-50/70 rounded-2xl p-5 border border-slate-100 flex flex-col justify-start min-h-[140px]">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                Order Note
              </p>
            </div>
            <p className="text-[12px] font-medium text-slate-500 italic leading-relaxed">
              "{order.notes || order.invoice?.note || 'No special instructions'}"
            </p>
          </div>

          <div className="space-y-4 px-1 flex flex-col justify-center border-l border-slate-50/50 pl-6">
            <div className="space-y-3">
              {products.map((p: any, idx: number) => (
                <div key={idx} className="flex flex-col gap-0.5">
                  <div className="flex justify-between text-[11px] font-bold">
                    <span className="text-slate-600 uppercase tracking-tight truncate max-w-[150px]">
                      {p.product?.product_name || 'EYEWEAR FRAME'} x{p.quantity || 1}
                    </span>
                    <span className="text-slate-700 font-mono">
                      {formatPrice(
                        ((p.product?.pricePerUnit || 0) + (p.lens?.pricePerUnit || 0)) *
                          (p.quantity || 1)
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-[9px] text-slate-400 italic font-medium">
                    <span>Base Price (Frame + Lens)</span>
                    <span>
                      {formatPrice((p.product?.pricePerUnit || 0) + (p.lens?.pricePerUnit || 0))}
                    </span>
                  </div>
                </div>
              ))}

              <div className="pt-2 border-t border-slate-100/50 flex flex-col gap-2">
                <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                  <span>Shipping Fee</span>
                  <span className="text-slate-600">+ {formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between text-[10px] font-bold text-rose-500 uppercase tracking-widest leading-none">
                  <span>Discount Applied</span>
                  <span>- {formatPrice(discount)}</span>
                </div>
              </div>
            </div>

            <div className="pt-5 border-t border-slate-100 flex justify-between items-center py-2">
              <span className="text-[13px] font-black text-slate-900 uppercase tracking-[0.12em]">
                Verified Total
              </span>
              <span className="text-3xl font-black text-mint-500 font-mono tracking-tighter leading-none">
                {formatPrice(total)}
              </span>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-5 md:p-6 border border-gray-100 shadow-sm rounded-xl bg-white flex flex-col min-h-[400px]">
        <h2 className="text-sm font-bold text-slate-800 mb-6 uppercase tracking-wider flex items-center gap-2">
          <div className="w-1 h-3 bg-mint-500 rounded-full" />
          Customer Profile
        </h2>

        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="relative mb-5">
            <div className="w-20 h-20 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-3xl font-black text-mint-600 shadow-sm uppercase">
              {order.customerName?.[0] || 'C'}
            </div>
          </div>
          <h3 className="text-base font-bold text-slate-800 mb-1.5 tracking-tight">
            {order.customerName || order.invoice?.fullName || 'Valued Customer'}
          </h3>
        </div>

        <div className="pt-6 space-y-4 border-t border-slate-50">
          <div className="group pl-2">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              Email Address
            </p>
            <p className="text-[12px] font-bold text-slate-700">
              {order.customerEmail || order.invoice?.email || 'customer@example.com'}
            </p>
          </div>

          <div className="group pl-2">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              Contact Method
            </p>
            <p className="text-[12px] font-bold text-slate-700 font-mono">
              {order.customerPhone || order.invoice?.phone || '0910-000-000'}
            </p>
          </div>
          <div className="group pl-2 mt-4">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 font-mono">
              Shipping Address
            </p>
            <p className="text-[12px] font-bold text-slate-700 leading-relaxed truncate-2-lines">
              {(() => {
                const addr = order.invoice?.address
                if (!addr) return 'Store Pickup'
                if (typeof addr === 'string') return addr
                return (
                  [addr.street, addr.ward, addr.city, addr.country].filter(Boolean).join(', ') ||
                  'Store Pickup'
                )
              })()}
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
