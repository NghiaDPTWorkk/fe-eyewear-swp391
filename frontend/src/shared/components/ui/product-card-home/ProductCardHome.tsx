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

  const renderOriginalPrice = (amount: number) => {
    return (
      <span className="relative text-[11px] text-slate-300 font-bold italic tracking-tight">
        <VNDPrice amount={amount} />
        <span className="absolute inset-x-[-2px] top-[55%] h-[1.5px] bg-slate-400/60 -rotate-[4deg] rounded-full" />
      </span>
    )
  }

  return (
    <div
      className={cn(
        'relative bg-white rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)] group border border-slate-50 hover:border-slate-200 mb-2',
        className
      )}
      onClick={handleClick}
    >
      {/* Shine effect overlay */}
      <div className="absolute inset-0 z-30 pointer-events-none overflow-hidden">
        <div className="absolute top-0 -left-[100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/60 to-transparent skew-x-[-25deg] group-hover:left-[150%] transition-all duration-1000 ease-in-out" />
      </div>

      {/* Product Image Container */}
      <div className="relative aspect-[3/2] bg-slate-50/50 flex items-center justify-center overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-100">
            <span className="text-slate-300 font-bold text-[8px] tracking-[0.2em] uppercase">
              No Image
            </span>
          </div>
        )}

        {/* Sale Badge (Bold and clear) */}
        {hasSale && (
          <div className="absolute top-3 right-3 bg-slate-900 text-white px-2.5 py-1 rounded-full text-[8px] font-black tracking-widest z-10 shadow-lg capitalize">
            SALE {salePercent}%
          </div>
        )}

        {/* Subtle Overlay on hover */}
        <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/[0.01] transition-colors duration-500" />
      </div>

      {/* Product Info (Refined spacing and height) */}
      <div className="p-5 text-center relative bg-white">
        {/* Model Code */}
        {modelCode && (
          <p className="text-[8.5px] text-slate-400 mb-1.5 font-black uppercase tracking-[0.15em] leading-none">
            {modelCode}
          </p>
        )}

        {/* Brand Name */}
        <h3 className="text-[14px] font-black text-slate-900 mb-2.5 uppercase tracking-tight line-clamp-1 group-hover:text-primary-600 transition-colors duration-300">
          {brand || name}
        </h3>

        {/* Pricing */}
        <div className="flex flex-col items-center gap-0.5">
          {hasSale && renderOriginalPrice(originalPrice)}
          <span className="text-lg font-black text-primary-600 tracking-tighter">
            <VNDPrice amount={finalPrice} />
          </span>
        </div>

        {/* Action Indicator */}
        <div className="mt-3 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-all duration-700 transform translate-y-2 group-hover:translate-y-0">
          <div className="w-1.5 h-1.5 rounded-full bg-primary-500/80" />
        </div>
      </div>
    </div>
  )
}
