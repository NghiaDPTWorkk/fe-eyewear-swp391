import { ProductCard } from '@/components/molecules/product-card'
import { cn } from '@/lib/utils'

export interface Product {
  id: string
  name: string
  image: string
  price: number
  discountPrice?: number
  rating?: number
}

export interface ProductGridProps {
  products: Product[]
  isLoading?: boolean
  onAddToCart?: (productId: string) => void
  emptyMessage?: string
  className?: string
}

export function ProductGrid({
  products,
  isLoading = false,
  onAddToCart,
  emptyMessage = 'No products found',
  className
}: ProductGridProps) {
  if (isLoading) {
    return (
      <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6', className)}>
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="bg-neutral-100 rounded-2xl animate-pulse"
            style={{ aspectRatio: '3/4' }}
          />
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className={cn('flex items-center justify-center py-16', className)}>
        <div className="text-center">
          <svg
            className="w-16 h-16 mx-auto text-neutral-300 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <p className="text-neutral-500 text-lg">{emptyMessage}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6', className)}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          name={product.name}
          image={product.image}
          price={product.price}
          discountPrice={product.discountPrice}
          rating={product.rating}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  )
}
