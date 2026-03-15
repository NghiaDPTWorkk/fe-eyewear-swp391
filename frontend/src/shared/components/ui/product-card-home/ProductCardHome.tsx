import { cn } from '@/lib/utils'
import { VNDPrice } from '@/shared/components/ui/vnd-price/VNDPrice'

export interface ProductCardHomeProps {
  id: string
  name: string
  brand?: string
  modelCode?: string
  image?: string
  price: number
  discountPrice?: number
  salePercent?: number
  onClick?: (productId: string) => void
  className?: string
}

export function ProductCardHome({
  id,
  name,
  brand,
  modelCode,
  image,
  price,
  discountPrice,
  salePercent,
  onClick,
  className
}: ProductCardHomeProps) {
  const handleClick = () => {
    if (onClick) {
      onClick(id)
    }
  }

  const hasSale = salePercent && salePercent > 0
  const finalPrice = discountPrice || price || 0
  const originalPrice = price || 0

  return (
    <div
      className={cn(
        'bg-white rounded-lg overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg group',
        className
      )}
      onClick={handleClick}
    >
      {}
      <div className="relative aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-mint-200 to-mint-300">
            <span className="text-gray-400 text-sm">No Image</span>
          </div>
        )}

        {}
        {hasSale && (
          <div className="absolute top-2 right-2 bg-primary-500 text-white px-2 py-1 rounded text-xs font-bold">
            -{salePercent}%
          </div>
        )}
      </div>

      {}
      <div className="p-3 text-center">
        {}
        {modelCode && <p className="text-xs text-gray-500 mb-1">{modelCode}</p>}

        {}
        <h3 className="text-sm font-semibold text-mint-1200 mb-2 uppercase tracking-wide">
          {brand || name}
        </h3>

        {}
        <div className="flex items-center justify-center gap-2">
          {hasSale && (
            <span className="text-xs text-gray-400 line-through">
              <VNDPrice amount={originalPrice} />
            </span>
          )}
          <span className="text-base font-bold text-primary-500">
            <VNDPrice amount={finalPrice} />
          </span>
        </div>
      </div>
    </div>
  )
}
