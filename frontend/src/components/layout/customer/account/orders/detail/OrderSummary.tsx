import { Card } from '@/shared/components/ui/card'
import { PriceTag } from '@/shared/components/ui/price-tag'

interface OrderSummaryProps {
  totalPrice: number
  totalDiscount: number
}

export function OrderSummary({ totalPrice, totalDiscount }: OrderSummaryProps) {
  return (
    <Card className="p-6 border-mint-100/50">
      <h3 className="font-bold text-mint-1200 mb-6 pb-4 border-b border-mint-50">Summary</h3>
      <div className="space-y-4">
        <div className="flex justify-between text-sm font-medium">
          <span className="text-gray-400">Subtotal</span>
          <PriceTag price={totalPrice + totalDiscount} className="text-mint-1200" />
        </div>
        <div className="flex justify-between text-sm font-medium">
          <span className="text-gray-400">Shipping</span>
          <span className="text-green-600 font-bold uppercase text-[10px]">Free</span>
        </div>
        {totalDiscount > 0 && (
          <div className="flex justify-between text-sm font-medium">
            <span className="text-gray-400">Discount</span>
            <span className="text-danger-500">-${totalDiscount}</span>
          </div>
        )}
        <div className="pt-4 border-t border-mint-50 flex justify-between items-end">
          <span className="font-bold text-mint-1200">Total Price</span>
          <PriceTag price={totalPrice} className="text-2xl font-black text-mint-1200" />
        </div>
      </div>
    </Card>
  )
}
