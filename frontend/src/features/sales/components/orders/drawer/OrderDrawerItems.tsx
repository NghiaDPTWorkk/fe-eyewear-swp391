import type { OrderDetail } from '@/features/sales/types'

interface OrderDrawerItemsProps {
  order: OrderDetail | null
}

export const OrderDrawerItems: React.FC<OrderDrawerItemsProps> = ({ order }) => (
  <div className="space-y-3">
    <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide">Order Items</h3>
    {order?.products && order.products.length > 0 ? (
      order.products.map((p, i) => {
        const productImage = p.product?.product_id
          ? `https://api.eyewear.com/images/${p.product.product_id}`
          : null

        return (
          <div
            key={i}
            className="bg-white border border-gray-100 p-4 rounded-2xl flex gap-4 items-center shadow-sm"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shrink-0 flex items-center justify-center border border-gray-200 overflow-hidden">
              {productImage ? (
                <img
                  src={productImage}
                  alt={p.product.product_name || 'Product'}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to placeholder on error
                    e.currentTarget.style.display = 'none'
                    const parent = e.currentTarget.parentElement
                    if (parent) {
                      parent.innerHTML = `
                        <svg class="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      `
                    }
                  }}
                />
              ) : (
                <svg
                  className="w-8 h-8 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-gray-900 truncate uppercase text-sm tracking-tight">
                {p.product?.sku || 'N/A'}
              </h4>
              <p className="text-[11px] text-slate-400 font-normal mt-0.5 truncate">
                {p.product?.product_name || p.product?.sku || 'Eyewear Product'}
              </p>
              <p className="text-[10px] text-mint-600 font-medium mt-1">Qty: {p.quantity || 1}</p>
            </div>
            <span className="font-medium text-slate-700 text-sm whitespace-nowrap">
              ${(p.product?.pricePerUnit || 0).toLocaleString()}
            </span>
          </div>
        )
      })
    ) : (
      <p className="text-sm text-gray-400 text-center py-4">No items found</p>
    )}
  </div>
)
