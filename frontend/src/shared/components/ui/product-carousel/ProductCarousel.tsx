import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { ProductCardHome } from '../product-card-home'
import type { Product } from '@/shared/types/product.types'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components'

interface ProductCarouselProps {
  products: Product[]
  autoPlayInterval?: number
  itemsPerView?: number
}

export const ProductCarousel = ({ products, itemsPerView = 4 }: ProductCarouselProps) => {
  const navigate = useNavigate()
  const [currentIndex, setCurrentIndex] = useState(0)

  const maxIndex = Math.max(0, products.length - itemsPerView)

  const goToNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
  }

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1))
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-eyewear">No products available</p>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Carousel Container */}
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-out gap-6"
          style={{
            transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`
          }}
        >
          {products.map((product) => {
            // StandardProduct type matches the list view API response
            const p = product as any // Still need a quick cast if the union doesn't have id on all members

            const productId = p.id || 'unknown'
            const productName = p.nameBase || 'Unnamed Product'
            const productBrand = p.brand || ''
            const productModelCode = p.skuBase || p.id || ''
            const productImage = p.defaultVariantImage || p.imageUrl || ''

            const originalPrice = p.defaultVariantPrice ?? 0
            const finalPrice = p.defaultVariantFinalPrice ?? originalPrice

            let salePercent = p.salePercent
            if (!salePercent && originalPrice > 0 && finalPrice < originalPrice) {
              salePercent = Math.round(((originalPrice - finalPrice) / originalPrice) * 100)
            }

            return (
              <div
                key={productId}
                className="flex-shrink-0"
                style={{
                  width: `calc(${100 / itemsPerView}% - ${((itemsPerView - 1) * 24) / itemsPerView}px)`
                }}
              >
                <ProductCardHome
                  id={productId}
                  name={productName}
                  brand={productBrand}
                  modelCode={productModelCode}
                  image={productImage}
                  price={originalPrice}
                  discountPrice={finalPrice !== originalPrice ? finalPrice : undefined}
                  salePercent={salePercent}
                  onClick={(id) => navigate(`/products/${id}`)}
                />
              </div>
            )
          })}
        </div>
      </div>

      {/* Navigation Buttons */}
      {products.length > itemsPerView && (
        <>
          <Button
            onClick={goToPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-mint-300 transition-all z-10 group"
            aria-label="Previous products"
          >
            <ChevronLeft className="w-6 h-6 text-mint-1200 group-hover:text-primary-500" />
          </Button>
          <Button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-mint-300 transition-all z-10 group"
            aria-label="Next products"
          >
            <ChevronRight className="w-6 h-6 text-mint-1200 group-hover:text-primary-500" />
          </Button>
        </>
      )}
    </div>
  )
}
