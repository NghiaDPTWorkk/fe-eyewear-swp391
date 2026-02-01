import { Button } from '@/components'
import { cn } from '@/lib/utils'
import { Heart, ShoppingCart, Glasses } from 'lucide-react'

export interface ProductCardProps {
  id: string
  name: string
  brand?: string
  image?: string
  price: number
  discountPrice?: number
  salePercent?: number
  onAddToCart?: (productId: string) => void
  onAddToWishlist?: (productId: string) => void
  onClick?: (productId: string) => void
  className?: string
}

export function ProductCard({
  id,
  name,
  brand,
  image,
  price,
  discountPrice,
  salePercent,
  onAddToCart,
  onAddToWishlist,
  onClick,
  className
}: ProductCardProps) {
  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(id)
    }
  }

  const handleAddToWishlist = () => {
    if (onAddToWishlist) {
      onAddToWishlist(id)
    }
  }

  const hasSale = salePercent && salePercent > 0
  const finalPrice = discountPrice || price || 0

  const handleCardClick = () => {
    if (onClick) {
      onClick(id)
    }
  }

  return (
    <div
      onClick={handleCardClick}
      className={cn(
        'bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group relative cursor-pointer',
        className
      )}
    >
      {/* Sale Badge - Top left corner with opacity */}
      {hasSale && (
        <div className="absolute top-0 left-0 z-10 bg-primary-500/90 text-white px-3 py-1.5 rounded-br-2xl text-xs font-bold shadow-lg">
          -{salePercent}%
        </div>
      )}

      {/* Wishlist Button */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          handleAddToWishlist()
        }}
        className="absolute top-3 right-3 z-10 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:scale-110"
        aria-label="Add to wishlist"
      >
        <Heart className="w-4 h-4 text-gray-eyewear hover:text-primary-500 transition-colors" />
      </button>

      {/* Product Image - Full width, no padding */}
      <div className="aspect-square bg-gradient-to-br from-mint-100 to-mint-200 flex items-center justify-center overflow-hidden relative">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <Glasses className="w-32 h-32 text-primary-500 opacity-60 group-hover:opacity-80 transition-opacity" />
        )}
      </div>

      {/* Product Info */}
      <div className="p-5">
        {brand && (
          <p className="text-xs text-primary-500 font-semibold mb-1 uppercase tracking-wide">
            {brand}
          </p>
        )}
        {/* Fixed height for title to prevent layout shift */}
        <h3 className="font-bold text-mint-1200 mb-3 line-clamp-2 text-lg min-h-[3.5rem]">
          {name}
        </h3>

        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            {hasSale && (
              <span className="text-xs text-gray-eyewear line-through">
                ${price.toLocaleString()}
              </span>
            )}
            <span className="text-primary-500 font-bold text-xl">
              ${finalPrice.toLocaleString()}
            </span>
          </div>
          {onAddToCart && (
            <Button
              onClick={(e) => {
                e.stopPropagation()
                handleAddToCart()
              }}
              className="w-12 h-12 bg-primary-500 text-white rounded-full flex items-center justify-center hover:bg-primary-600 transition-all hover:scale-110 shadow-md"
            >
              <ShoppingCart className="w-6 h-6" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
