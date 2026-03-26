import { useMemo } from 'react'
import { Card } from '@/shared/components/ui/card'
import { PriceTag } from '@/shared/components/ui/price-tag'
import { FileText } from 'lucide-react'
import type { InvoiceItem } from '@/shared/types/invoice.types'

interface OrderItemListProps {
  items: InvoiceItem[]
}

export function OrderItemList({ items }: OrderItemListProps) {
  // Group identical items and calculate quantities since API doesn't provide quantity field
  const { groupedItems, totalPieces } = useMemo(() => {
    if (!Array.isArray(items)) return { groupedItems: [], totalPieces: 0 }

    const resultMap = new Map<string, InvoiceItem & { count: number }>()

    items.forEach((item) => {
      const isManufacturing = item.type?.includes('MANUFACTURING')

      // Create a stable key for grouping
      // We use product_id (preferred) or SKU as the identifier
      const productId = item.product?.product_id || item.product?.sku || 'no-id'
      const lensId = item.lens?.product_id || item.lens?.sku || 'no-lens'

      const groupKey = isManufacturing ? `m-${productId}-${lensId}` : `n-${productId}`

      // Use the quantity from the API if present, otherwise default to 1
      const itemQty = item.quantity || (item as any).qty || 1

      const existing = resultMap.get(groupKey)
      if (existing) {
        existing.count += itemQty
      } else {
        resultMap.set(groupKey, { ...item, count: itemQty })
      }
    })

    const finalItems = Array.from(resultMap.values())
    const total = finalItems.reduce((acc, item) => acc + item.count, 0)

    return {
      groupedItems: finalItems,
      totalPieces: total
    }
  }, [items])

  return (
    <Card className="p-0 border-mint-100/50 overflow-hidden">
      <div className="p-6 border-b border-mint-50 bg-mint-50/10">
        <h3 className="font-bold text-mint-1200 text-sm flex items-center gap-2 uppercase tracking-widest">
          <FileText size={16} className="text-primary-500" />
          Order Items ({totalPieces})
        </h3>
      </div>
      <div className="divide-y divide-mint-50/50">
        {groupedItems.map((item, idx) => (
          <div key={idx} className="p-6">
            {/* Frame Section */}
            {item.product && (
              <div className="flex gap-5 mb-5">
                <div className="w-20 h-20 rounded-xl bg-[#F8FAFB] border border-mint-50/40 flex-shrink-0 p-3">
                  <img
                    src={item.product.detail.imgs[0]}
                    alt={item.product.detail.name}
                    className="w-full h-full object-contain mix-blend-multiply"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-mint-1200 text-[15px] leading-tight">
                      {item.product.detail.name}
                    </h4>
                    <div className="flex flex-col items-end">
                      <PriceTag
                        price={item.product.pricePerUnit}
                        className="text-[15px] font-bold text-mint-1200"
                      />
                      <span className="text-[11px] text-gray-400 mt-1 tracking-widest">
                        Quantity: x{item.count}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3 mt-3">
                    {item.product.detail.options.map((opt) => (
                      <span
                        key={opt._id}
                        className="bg-mint-50/50 text-[9px] font-bold text-gray-500 px-2 py-0.5 rounded-md uppercase tracking-wider"
                      >
                        {opt.attributeName}: {opt.label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {/* Lens Section */}
            {item.lens && (
              <div className="flex gap-4 ml-8 pl-8 border-l border-mint-50 border-dashed">
                <div className="w-14 h-14 rounded-xl bg-primary-50/30 border border-primary-100/20 flex-shrink-0 p-2.5">
                  <img
                    src={item.lens.detail.imgs[0]}
                    alt={item.lens.detail.name}
                    className="w-full h-full object-contain mix-blend-multiply"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-primary-900 text-xs tracking-tight">
                      Standard Lenses: {item.lens.detail.name}
                    </h4>
                    <PriceTag
                      price={item.lens.pricePerUnit}
                      className="text-xs font-bold text-primary-600"
                    />
                  </div>
                  <div className="flex flex-wrap gap-3 mt-1.5">
                    {item.lens.detail.options.map((opt) => (
                      <span
                        key={opt._id}
                        className="text-[9px] font-semibold text-primary-400/80 italic tracking-wide"
                      >
                        {opt.label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  )
}
