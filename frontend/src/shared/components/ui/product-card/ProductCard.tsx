import { Card, Button, PriceTag } from '@/components'
import { cn } from '@/lib/utils'

export interface ProductCardProps {
  id: string
  name: string
  image: string
  price: number
  discountPrice?: number
  rating?: number
  onAddToCart?: (productId: string) => void
  className?: string
}

export function ProductCard({
  id,
  name,
  image,
  price,
  discountPrice,
  onAddToCart,
  className
}: ProductCardProps) {
  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(id)
    }
  }

  return (
    <Card
      className={cn(
        'group overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1',
        'relative',
        className
      )}
    >
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-mint-200">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        {discountPrice && discountPrice < price && (
          <div className="absolute top-3 left-3 bg-primary-500 text-white px-2.5 py-1 rounded-md text-xs font-bold">
            -{Math.round(((price - discountPrice) / price) * 100)}%
          </div>
        )}

        {/* Product Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-white p-3">
          <h3 className="text-mint-1200 font-semibold text-sm mb-1 line-clamp-1">{name}</h3>
          <div className="flex items-center justify-between">
            <PriceTag price={price} discountPrice={discountPrice} size="sm" />
            <Button
              variant="solid"
              colorScheme="primary"
              size="sm"
              onClick={handleAddToCart}
              className="shrink-0"
            >
              Add
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
