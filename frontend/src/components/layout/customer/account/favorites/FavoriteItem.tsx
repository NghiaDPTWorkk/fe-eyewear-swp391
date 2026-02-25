import { Card } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { PriceTag } from '@/shared/components/ui/price-tag'
import { VNDPrice } from '@/shared/components/ui/vnd-price/VNDPrice'
import { Trash2 } from 'lucide-react'

interface FavoriteItemProps {
  id: string
  name: string
  brand: string
  image: string
  price: number
  originalPrice?: number
  discount?: string
  frameSize: string
  frameColor: string
  onRemove?: () => void
  onAddToCart?: () => void
}

export function FavoriteItem({
  brand,
  name,
  image,
  price,
  originalPrice,
  discount,
  frameSize,
  frameColor,
  onRemove,
  onAddToCart
}: FavoriteItemProps) {
  return (
    <Card className="p-0 border-mint-100/50 hover:shadow-lg transition-all overflow-hidden group mb-6">
      <div className="flex flex-col sm:flex-row">
        {/* Product Image Area */}
        <div className="w-full sm:w-[45%] bg-[#F9FBFC] p-8 flex items-center justify-center relative min-h-[200px]">
          <span className="absolute top-4 left-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Universal Fit
          </span>
          <img
            src={image}
            alt={name}
            className="w-full h-auto object-contain max-w-[240px] mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
          />
        </div>

        {/* Content Area */}
        <div className="flex-1 p-8 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-4">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-bold text-mint-1200">{brand}</h3>
                  {discount && (
                    <span className="bg-primary-100 text-primary-600 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase">
                      {discount} off
                    </span>
                  )}
                </div>
                <p className="text-sm font-medium text-gray-400">{name}</p>
              </div>
              <button
                onClick={onRemove}
                className="p-2 text-gray-300 hover:text-danger-500 hover:bg-danger-50 rounded-xl transition-all"
              >
                <Trash2 size={20} />
              </button>
            </div>

            <div className="space-y-2 mb-8 mt-6">
              <div className="flex text-xs font-bold text-mint-1200">
                <span className="w-24 text-gray-400 font-semibold">Frame size</span>
                <span>{frameSize}</span>
              </div>
              <div className="flex text-xs font-bold text-mint-1200">
                <span className="w-24 text-gray-400 font-semibold">Frame color</span>
                <span>{frameColor}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-mint-50">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Subtotal
              </span>
              <div className="flex items-baseline gap-2">
                {originalPrice && (
                  <span className="text-xs text-gray-300 line-through font-bold">
                    <VNDPrice amount={originalPrice} />
                  </span>
                )}
                <PriceTag price={price} className="text-xl font-bold text-mint-1200" />
              </div>
            </div>
            <Button
              onClick={onAddToCart}
              className="rounded-xl px-10 py-6 bg-white border border-primary-100 text-primary-600 font-bold text-xs uppercase tracking-[0.2em] shadow-sm hover:bg-primary-600 hover:text-white hover:border-primary-600 transition-all flex items-center gap-2"
            >
              Add to Bag
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
