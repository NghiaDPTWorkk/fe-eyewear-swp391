import { Card } from '@/shared/components/ui/card'
import { PriceTag } from '@/shared/components/ui/price-tag'

interface OrderSummaryProps {
  feeShip: number
  totalPrice: number
  totalDiscount: number
}

export function OrderSummary({ totalPrice, totalDiscount, feeShip }: OrderSummaryProps) {
  return (
    <Card className="p-6 border-mint-100/50">
      <h3 className="text-[16px] font-bold mint-1200 uppercase tracking-[0.15em] mb-6 border-b border-mint-50/50">
        Summary
      </h3>
      <div className="space-y-4">
        <div className="flex justify-between text-xs font-semibold items-center">
          <span className="text-gray-400 uppercase tracking-wide ">Subtotal</span>
          <PriceTag price={totalPrice + totalDiscount - feeShip} className="text-mint-1200" />
        </div>
        <div className="flex justify-between text-xs font-semibold items-center">
          <span className="text-gray-400 uppercase tracking-wide">Shipping</span>
          <span className="text-primary-600 font-bold uppercase tracking-widest text-[9px]">
            <PriceTag price={feeShip} className="text-mint-1200" />
          </span>
        </div>
        {totalDiscount > 0 && (
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-gray-400 uppercase tracking-wide">Discount</span>
            <span className="text-danger-500">-${totalDiscount}</span>
          </div>
        )}
        <div className="pt-5 border-t border-mint-50/50 flex justify-between items-end">
          <span className="text-xs font-bold text-mint-1200 uppercase tracking-widest">
            Total Price
          </span>
          <PriceTag
            price={totalPrice}
            className="text-2xl font-bold text-mint-1200 tracking-tight"
          />
        </div>
      </div>
    </Card>
  )
}
