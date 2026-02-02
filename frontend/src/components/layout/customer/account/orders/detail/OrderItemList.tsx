import { Card } from '@/shared/components/ui/card'
import { PriceTag } from '@/shared/components/ui/price-tag'
import { FileText } from 'lucide-react'
import type { InvoiceItem } from '@/shared/types/invoice.types'

interface OrderItemListProps {
  items: InvoiceItem[]
}

export function OrderItemList({ items }: OrderItemListProps) {
  return (
    <Card className="p-0 border-mint-100/50 overflow-hidden">
      <div className="p-6 border-b border-mint-50 bg-mint-50/20">
        <h3 className="font-bold text-mint-1200 flex items-center gap-2">
          <FileText size={18} className="text-primary-500" />
          Order Items ({items.length})
        </h3>
      </div>
      <div className="divide-y divide-mint-50">
        {items.map((item, idx) => (
          <div key={idx} className="p-6">
            {/* Frame Section */}
            {item.product && (
              <div className="flex gap-4 mb-4">
                <div className="w-20 h-20 rounded-xl bg-gray-50 border border-mint-50 flex-shrink-0 p-2">
                  <img
                    src={item.product.detail.imgs[0]}
                    alt={item.product.detail.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-mint-1200 text-sm">{item.product.detail.name}</h4>
                    <PriceTag
                      price={item.product.pricePerUnit}
                      className="text-sm font-bold text-mint-1200"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {item.product.detail.options.map((opt) => (
                      <span
                        key={opt._id}
                        className="bg-mint-50 text-[10px] font-bold text-gray-500 px-2 py-0.5 rounded uppercase"
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
              <div className="flex gap-4 ml-6 pl-6 border-l-2 border-mint-50 border-dashed">
                <div className="w-16 h-16 rounded-xl bg-primary-50 border border-primary-100 flex-shrink-0 p-2">
                  <img
                    src={item.lens.detail.imgs[0]}
                    alt={item.lens.detail.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-primary-900 text-xs">
                      Standard Lenses: {item.lens.detail.name}
                    </h4>
                    <PriceTag
                      price={item.lens.pricePerUnit}
                      className="text-xs font-bold text-primary-600"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {item.lens.detail.options.map((opt) => (
                      <span
                        key={opt._id}
                        className="text-[10px] font-semibold text-primary-400 italic"
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
