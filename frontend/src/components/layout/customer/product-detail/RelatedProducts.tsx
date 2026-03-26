import { useFilteredProducts } from '@/shared/hooks/products/useFilteredProducts'
import { Splide, SplideTrack, SplideSlide } from '@splidejs/react-splide'
import '@splidejs/react-splide/css'
import type { Product } from '@/shared/types/product.types'
import { cn } from '@/lib/utils'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { VNDPrice } from '@/shared/components/ui/vnd-price/VNDPrice'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface RelatedProductsProps {
  currentProduct: Product
  className?: string
}

const MinimalProductCard = ({
  product,
  onClick
}: {
  product: Product
  onClick: (id: string) => void
}) => {
  const p = product as any
  const idValue = p.id || p._id || 'unknown'
  const modelValue = p.skuBase || p.id || ''
  const brandValue = p.brand || ''
  const priceValue = p.defaultVariantFinalPrice || p.defaultVariantPrice || p.price || 0
  const imageValue =
    p.defaultVariantImage ||
    p.imageUrl ||
    (p.variants && p.variants.length > 0 && p.variants[0].imgs && p.variants[0].imgs[0]) ||
    ''

  return (
    <div
      className="flex flex-col items-center justify-center cursor-pointer group"
      onClick={() => onClick(idValue)}
    >
      <div className="relative mb-6">
        {/* Reflection/Shadow beneath the glasses */}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-black/5 blur-xl rounded-full scale-y-50 group-hover:scale-110 transition-transform duration-700" />

        <div className="w-full aspect-[2/1] flex items-center justify-center overflow-visible">
          <img
            src={imageValue}
            alt={brandValue}
            className="w-full h-full object-contain transform transition-transform duration-700 group-hover:scale-105"
          />
        </div>
      </div>

      <div className="text-center space-y-1">
        <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold leading-none">
          {modelValue}
        </p>
        <h3 className="text-[13px] uppercase tracking-wide text-gray-700 font-medium group-hover:text-primary-500 transition-colors">
          {brandValue}
        </h3>
        <p className="text-[14px] font-bold text-gray-900">
          <VNDPrice amount={priceValue} />
        </p>
      </div>
    </div>
  )
}

export const RelatedProducts = ({ currentProduct, className }: RelatedProductsProps) => {
  const navigate = useNavigate()
  const categoryId = currentProduct.categories?.[0]

  const filters = useMemo(
    () => ({
      page: 1,
      limit: 10,
      categories: categoryId ? [categoryId] : undefined
    }),
    [categoryId]
  )

  const { products, loading } = useFilteredProducts(filters)

  const relatedProducts = products.filter(
    (p) => (p.id || p._id) !== (currentProduct.id || currentProduct._id)
  )

  if (!categoryId) return null

  return (
    <section
      className={cn(
        'bg-white py-12 pb-8 relative overflow-hidden transition-all duration-700 select-none',
        className
      )}
      style={{ minHeight: '250px' }}
    >
      {/* 
         EXACT MATCH FOR SCREENSHOT: 
         Large background decorative text - centered, light blue/gray 
      */}
      <div className="absolute top-[35%] left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 flex justify-center items-center w-full overflow-hidden opacity-[0.05]">
        <h2 className="text-[60px] md:text-[90px] lg:text-[120px] font-bold text-[#4c6ef5] leading-none whitespace-nowrap tracking-tight">
          You may also like
        </h2>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-mint-1200 mb-2 tracking-tight">
            You may also like
          </h2>
          <div className="h-1 w-16 bg-primary-500 mx-auto rounded-full" />
        </div>

        <div className="min-h-[250px]">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 w-full">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-4">
                  <div className="aspect-[2/1] bg-gray-50 animate-pulse rounded-full" />
                  <div className="h-2 w-1/2 mx-auto bg-gray-50 animate-pulse" />
                  <div className="h-3 w-3/4 mx-auto bg-gray-50 animate-pulse" />
                </div>
              ))}
            </div>
          ) : relatedProducts.length > 0 ? (
            <div key={categoryId} className="relative group/related-carousel">
              <Splide
                hasTrack={false}
                options={{
                  type: 'loop',
                  perPage: 4,
                  gap: '2.5rem',
                  arrows: true,
                  pagination: false,
                  breakpoints: {
                    1280: { perPage: 3, gap: '1.5rem' },
                    768: { perPage: 2, gap: '1rem' },
                    640: { perPage: 1, gap: '0rem' }
                  }
                }}
              >
                <SplideTrack>
                  {relatedProducts.map((p) => (
                    <SplideSlide key={p.id || p._id}>
                      <MinimalProductCard
                        product={p}
                        onClick={(id) => navigate(`/products/${id}`)}
                      />
                    </SplideSlide>
                  ))}
                </SplideTrack>

                {/* Left/Right Arrows style matches screenshot */}
                <div className="splide__arrows absolute inset-y-0 -left-10 -right-10 pointer-events-none flex items-center justify-between z-20">
                  <button className="splide__arrow splide__arrow--prev w-10 h-10 bg-[#f1f3f9] rounded-full pointer-events-auto shadow-sm flex items-center justify-center hover:bg-primary-500 hover:text-white transition-all duration-300 group/arrow">
                    <ChevronLeft className="w-5 h-5 transition-transform group-hover/arrow:scale-110" />
                  </button>
                  <button className="splide__arrow splide__arrow--next w-10 h-10 bg-[#f1f3f9] rounded-full pointer-events-auto shadow-sm flex items-center justify-center hover:bg-primary-500 hover:text-white transition-all duration-300 group/arrow">
                    <ChevronRight className="w-5 h-5 transition-transform group-hover/arrow:scale-110" />
                  </button>
                </div>
              </Splide>
            </div>
          ) : (
            <div className="flex items-center justify-center py-20 text-gray-300 italic">
              Looking for similar styles...
            </div>
          )}
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .group\\/related-carousel .splide__arrow {
          position: static !important;
          transform: none !important;
          opacity: 1 !important;
          border: none !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          color: #1f2937 !important;
          transition: all 0.3s !important;
        }
        .group\\/related-carousel .splide__arrow:hover {
          color: white !important;
          background: #4ad7b0 !important; /* primary-500 mint color */
        }
        .group\\/related-carousel .splide__arrow svg {
          display: block !important;
          transform: none !important;
          width: 20px !important;
          height: 20px !important;
          fill: none !important; /* Lucide icons use stroke */
        }
      `
        }}
      />
    </section>
  )
}
