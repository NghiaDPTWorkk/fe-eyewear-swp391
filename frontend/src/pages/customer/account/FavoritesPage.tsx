import { useState } from 'react'
import { Heart } from 'lucide-react'
import { FavoriteItem } from '@/components/layout/customer/account/favorites/FavoriteItem'
import { Card } from '@/shared/components/ui/card'

const MOCK_FAVORITES = [
  {
    id: 'f1',
    brand: 'Emporio Armani',
    name: 'EA3211 Rectangular',
    image:
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=300',
    price: 137.2,
    originalPrice: 196.0,
    discount: '30%',
    frameSize: 'Small (54-16)',
    frameColor: 'Shiny Opaline Azure'
  },
  {
    id: 'f2',
    brand: 'Ray-Ban',
    name: 'Clubmaster Classic',
    image:
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=300',
    price: 154.0,
    frameSize: 'Medium (51-21)',
    frameColor: 'Mock Tortoise'
  }
]

export function FavoritesPage() {
  const [favorites] = useState(MOCK_FAVORITES)

  const isEmpty = favorites.length === 0

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
          <button className="bg-mint-1200 text-white px-10 py-5 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-black transition-all">
            Continue Shopping
          </button>
        </Card>
      ) : (
        <div className="flex flex-col">
          {favorites.map((item) => (
            <FavoriteItem key={item.id} {...item} />
          ))}
        </div>
      )}

      {/* Social Footer */}
      {!isEmpty && (
        <div className="mt-16 text-center">
          <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mb-4">
            Sharing is caring
          </p>
          <div className="flex justify-center gap-4">
            <button className="w-12 h-12 rounded-2xl bg-white border border-mint-100 flex items-center justify-center text-mint-1200 hover:border-primary-500 hover:text-primary-600 transition-all shadow-sm">
              f
            </button>
            <button className="w-12 h-12 rounded-2xl bg-white border border-mint-100 flex items-center justify-center text-mint-1200 hover:border-primary-500 hover:text-primary-600 transition-all shadow-sm">
              t
            </button>
            <button className="w-12 h-12 rounded-2xl bg-white border border-mint-100 flex items-center justify-center text-mint-1200 hover:border-primary-500 hover:text-primary-600 transition-all shadow-sm">
              in
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
