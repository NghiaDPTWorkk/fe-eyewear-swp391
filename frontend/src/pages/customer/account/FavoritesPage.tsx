import { useEffect } from 'react'
import { Heart } from 'lucide-react'
import { FavoriteItem } from '@/components/layout/customer/account/favorites/FavoriteItem'
import { Card } from '@/shared/components/ui/card'
import { useWishlistStore } from '@/store/wishlist.store'
import { useNavigate } from 'react-router-dom'

export function FavoritesPage() {
  const { items, isLoading, fetchWishlist, toggleWishlist, isInitialized } = useWishlistStore()
  const navigate = useNavigate()

  useEffect(() => {
    fetchWishlist(true)
  }, [fetchWishlist, isInitialized])

  const isEmpty = items.length === 0

  if (isLoading && !isInitialized) {
    return (
      <div className="flex items-center justify-center p-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" />
      </div>
    )
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-10">
        <h2 className="text-[32px] font-bold text-mint-1200 mb-2">Favorites Items</h2>
        <p className="text-gray-eyewear font-medium">All your favorite items in one place.</p>
      </div>

      {isEmpty ? (
        <Card className="p-20 flex flex-col items-center justify-center border-dashed border-2 border-mint-100 bg-white shadow-sm rounded-[32px]">
          <div className="w-20 h-20 bg-primary-50 rounded-[32px] flex items-center justify-center text-primary-300 mb-8 rotate-12">
            <Heart size={40} fill="currentColor" />
          </div>
          <p className="text-gray-eyewear font-bold text-lg mb-2 text-center">
            Your wishlist is empty
          </p>
          <p className="text-gray-400 font-medium text-center max-w-xs mb-8">
            Explore our collection and save your favorite frames here to shop later.
          </p>
          <button
            onClick={() => navigate('/products')}
            className="bg-mint-1200 text-white px-10 py-5 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-black transition-all"
          >
            Continue Shopping
          </button>
        </Card>
      ) : (
        <div className="flex flex-col">
          {Array.isArray(items) &&
            items.map((item) => (
              <FavoriteItem
                key={item._id || item.id}
                id={item._id || item.id || ''}
                name={item.nameBase}
                brand={item.brand || 'No Brand'}
                image={item.defaultVariantImage || ''}
                price={item.defaultVariantFinalPrice || 0}
                originalPrice={item.defaultVariantPrice}
                discount={
                  item.defaultVariantFinalPrice && item.defaultVariantPrice
                    ? `${Math.round((1 - item.defaultVariantFinalPrice / item.defaultVariantPrice) * 100)}%`
                    : undefined
                }
                frameSize="One Size" // Default for now
                frameColor="Default" // Default for now
                onRemove={() => toggleWishlist(item)}
                onAddToCart={() => navigate(`/product/${item._id || item.id}`)}
              />
            ))}
        </div>
      )}
    </div>
  )
}
