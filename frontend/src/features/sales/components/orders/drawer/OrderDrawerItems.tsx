import type { OrderDetail } from '@/features/sales/types'

interface OrderDrawerItemsProps {
  order: OrderDetail | null
}

export const OrderDrawerItems: React.FC<OrderDrawerItemsProps> = ({ order }) => (
  <div className="space-y-3">
    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest">Order Items</h3>
    {order?.products.map((p, i) => (
      <div
        key={i}
        className="bg-white border border-gray-100 p-4 rounded-2xl flex gap-4 items-center shadow-sm"
      >
        <div className="w-16 h-16 bg-gray-50 rounded-xl shrink-0 flex items-center justify-center border border-gray-100 overflow-hidden">
          {p.product.product_id ? (
            <img
              src={`https://api.eyewear.com/images/${p.product.product_id}`} // Assuming image path convention
              alt={p.product.product_name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = 'https://placehold.co/200x200/png?text=Frame'
              }}
            />
          ) : (
            <span className="text-[10px] text-gray-300 font-bold uppercase tracking-widest text-center px-1">
              NO IMG
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 truncate uppercase text-sm tracking-tight">
            {p.product.sku}
          </h4>
          <p className="text-[11px] text-slate-400 font-normal mt-0.5 truncate">
            {p.product.product_name || 'Prescription Eyewear'}
          </p>
          <p className="text-[10px] text-indigo-500 font-semibold mt-1">Qty: {p.quantity}</p>
        </div>
        <span className="font-semibold text-slate-700 text-sm whitespace-nowrap">
          ${p.product.pricePerUnit.toLocaleString()}
        </span>
      </div>
    ))}
  </div>
)
