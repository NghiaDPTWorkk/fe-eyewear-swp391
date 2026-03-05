import { Button } from '@/components'
import { cn } from '@/lib/utils'
import { Heart, ShoppingCart, Glasses } from 'lucide-react'
import { useWishlistStore } from '@/store/wishlist.store'
import type { StandardProduct } from '@/shared/types/product.types'
import { ProductType } from '@/shared/utils/enums/product.enum'
import { toast } from 'react-hot-toast'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store'
import { VNDPrice } from '@/shared/components/ui/vnd-price/VNDPrice'

export interface ProductCardProps {
  id: string
  name: string
  brand?: string
  image?: string
  price: number
  discountPrice?: number
  salePercent?: number
  type?: ProductType
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
  type = ProductType.FRAME,
  onAddToCart,
  onAddToWishlist,
  onClick,
  className
}: ProductCardProps) {
  const { isInWishlist, toggleWishlist } = useWishlistStore()
  const isFavorite = isInWishlist(id)

  const location = useLocation()
  const navigate = useNavigate()

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(id)
    }
  }

  const handleAddToWishlist = async () => {
    // Auth check
    const isAuth = useAuthStore.getState().isAuthenticated || !!localStorage.getItem('access_token')
    if (!isAuth) {
      toast.error('Please login to add items to wishlist')
      navigate('/login', { state: { from: location } })
      return
    }

    // If external handler provided, use it
    if (onAddToWishlist) {
      onAddToWishlist(id)
      return
    }

    // Otherwise use internal store logic
    try {
      const product: StandardProduct = {
        id,
        _id: id,
        nameBase: name,
        brand: brand || null,
        defaultVariantImage: image,
        defaultVariantPrice: price,
        defaultVariantFinalPrice: discountPrice || price,
        type,
        slugBase: '', // Reconstructing enough for store/UI
        skuBase: '',
        categories: []
      }
      await toggleWishlist(product)
      toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites')
    } catch (error) {
      console.error('Wishlist toggle error:', error)
      toast.error('Failed to update favorites')
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
        className="absolute top-3 right-3 z-10 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:opacity-100 transition-all hover:bg-white hover:scale-110"
        aria-label="Add to wishlist"
      >
        <Heart
          className={cn(
            'w-4 h-4 transition-colors',
            isFavorite
              ? 'text-primary-500 fill-primary-500'
              : 'text-gray-eyewear hover:text-primary-500'
          )}
        />
      </button>

      {/* Product Image - Full width, no padding */}
      <div className="aspect-square bg-gradient-to-br from-mint-100 to-mint-200 flex items-center justify-center overflow-hidden relative">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
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
                <VNDPrice amount={price} />
              </span>
            )}
            <span className="text-primary-500 font-bold text-xl">
              <VNDPrice amount={finalPrice} />
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
