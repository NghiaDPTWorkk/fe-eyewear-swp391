import { IoGlassesOutline, IoEyeOutline } from 'react-icons/io5'
import { Card } from '@/shared/components/ui'

interface OrderItem {
  name: string
  sku: string
  brand: string
  price: string
  quantity: number
  lens?: any
}

interface OrderDetailSummaryProps {
  items: OrderItem[]
  subtotal: string
  shipping: string
  tax: string
  total: string
  isPreOrder?: boolean
  note?: string
}

export function OrderDetailSummary({
  items,
  subtotal,
  shipping,
  tax,
  total,
  isPreOrder,
  note
}: OrderDetailSummaryProps) {
  return (
    <Card className="xl:col-span-8 h-full flex flex-col p-0 overflow-hidden border border-slate-100/50 shadow-xl shadow-slate-200/40 bg-white rounded-[32px]">
      <div className="px-8 py-6 border-b border-slate-50 bg-slate-50/20">
        <h2 className="text-lg font-semibold text-slate-800 tracking-tight">
          {isPreOrder ? 'Pre-order Summary' : 'Order Summary'}
        </h2>
      </div>
      <div>
        {items.map((item, i) => (
          <div
            key={i}
            className="p-6 rounded-[24px] hover:bg-slate-50/40 transition-all duration-300 group"
          >
            <div className="flex items-start gap-6">
              <div className="w-28 h-28 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-200 shadow-sm transition-all group-hover:shadow-md group-hover:scale-[1.02]">
                <IoGlassesOutline size={48} />
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
                {item.lens && (
                  <div className="mt-4 p-4 rounded-2xl border bg-mint-50/30 border-mint-100/40 space-y-3">
                    <p className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 text-mint-600">
                      <IoEyeOutline size={14} /> Prescription details included
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col md:flex-row bg-slate-50/10 mt-auto">
        <div className="flex-1 p-6">
          {note ? (
            <div className="p-6 rounded-[24px] border bg-mint-50/60 border-mint-100/60 h-full flex flex-col justify-center">
              <p className="text-sm font-medium text-slate-700 italic leading-relaxed">
                &ldquo;{note}&rdquo;
              </p>
            </div>
          ) : (
            <div className="h-full rounded-[24px] border border-dashed border-slate-200 flex items-center justify-center text-slate-400 min-h-[140px]">
              <span className="text-xs uppercase tracking-widest font-semibold opacity-50">
                No attached note
              </span>
            </div>
          )}
        </div>
        <div className="w-full md:w-[380px] shrink-0 p-6 bg-slate-50/40 rounded-3xl space-y-4 text-sm">
          <div className="flex justify-between font-semibold text-slate-400">
            <span>Subtotal</span>
            <span className="text-slate-700">{subtotal}</span>
          </div>
          <div className="flex justify-between font-semibold text-slate-400">
            <span>Shipping</span>
            <span className="text-slate-700">{shipping}</span>
          </div>
          <div className="flex justify-between font-semibold text-slate-400 pb-3">
            <span>Tax</span>
            <span className="text-slate-700">{tax}</span>
          </div>
          <div className="pt-2 flex justify-between items-center text-slate-900">
            <span className="font-bold uppercase tracking-widest">
              {isPreOrder ? 'Deposit' : 'Total'}
            </span>
            <span className="text-2xl font-bold text-mint-600">{total}</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
