import { Splide, SplideTrack, SplideSlide } from '@splidejs/react-splide'
import { AutoScroll } from '@splidejs/splide-extension-auto-scroll'
import '@splidejs/react-splide/css'
import { ProductCardHome } from '../product-card-home'
import type { Product } from '@/shared/types/product.types'
import { useNavigate } from 'react-router-dom'

interface ProductCarouselProps {
  products: Product[]
  autoPlayInterval?: number // Kept for compatibility but Splide uses its own options
  itemsPerView?: number
  isAutoScroll?: boolean
}

export const ProductCarousel = ({
  products,
  itemsPerView = 4,
  isAutoScroll = true
}: ProductCarouselProps) => {
  const navigate = useNavigate()

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-eyewear">No products available</p>
      </div>
    )
  }

  return (
    <div className="relative group/carousel">
      <Splide
        hasTrack={false}
        extensions={isAutoScroll ? { AutoScroll } : {}}
        options={{
          type: products.length > itemsPerView ? 'loop' : 'slide',
          drag: 'free',
          focus: 'center',
          perPage: itemsPerView,
          gap: '1.5rem',
          arrows: true,
          pagination: false,
          ...(isAutoScroll
            ? {
                autoScroll: {
                  pauseOnHover: true,
                  pauseOnFocus: false,
                  rewind: false,
                  speed: 0.5
                }
              }
            : {
                autoScroll: false
              }),
          breakpoints: {
            1280: { perPage: 3 },
            768: { perPage: 2 },
            640: { perPage: 1 }
          }
        }}
      >
        <SplideTrack>
          {products.map((product) => {
            const p = product as any
            const productId = p.id || p._id || 'unknown'
            const productName = p.nameBase || 'Unnamed Product'
            const productBrand = p.brand || ''
            const productModelCode = p.skuBase || p.id || ''
            const productImage =
              p.defaultVariantImage ||
              p.imageUrl ||
              (p.variants &&
                p.variants.length > 0 &&
                p.variants[0].imgs &&
                p.variants[0].imgs[0]) ||
              ''

            const originalPrice = p.defaultVariantPrice ?? 0
            const finalPrice = p.defaultVariantFinalPrice ?? originalPrice

            let salePercent = p.salePercent
            if (!salePercent && originalPrice > 0 && finalPrice < originalPrice) {
              salePercent = Math.round(((originalPrice - finalPrice) / originalPrice) * 100)
            }

            return (
              <SplideSlide key={productId}>
                <div className="pt-4 pb-10 px-2 w-full max-w-[320px] mx-auto">
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
              </SplideSlide>
            )
          })}
        </SplideTrack>

        <style
          dangerouslySetInnerHTML={{
            __html: `
          /* Ẩn splide đi cho đến khi nó được khởi tạo xong để tránh FOUC */
          .splide:not(.is-initialized) {
            visibility: hidden;
            opacity: 0;
            height: 400px; /* Chiều cao cố định ban đầu để giữ chỗ */
          }

          .group\\/carousel .splide__arrow {
            background: white !important;
            width: 3.5rem !important;
            height: 3.5rem !important;
            opacity: 0;
            transition: all 0.4s ease !important;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1) !important;
            border: 1px solid #f0fdfa !important;
          }
          .group\\/carousel:hover .splide__arrow {
            opacity: 1;
          }
          .group\\/carousel .splide__arrow--prev {
            left: -1.75rem !important;
          }
          .group\\/carousel .splide__arrow--next {
            right: -1.75rem !important;
          }
          .group\\/carousel .splide__arrow svg {
            fill: #0f172a !important;
            width: 1.25rem !important;
            height: 1.25rem !important;
          }
          .group\\/carousel .splide__arrow:hover {
            background: #10b981 !important;
            border-color: #10b981 !important;
          }
          .group\\/carousel .splide__arrow:hover svg {
            fill: white !important;
          }
          
          /* Đảm bảo track không bị nhảy khi slide load */
          .splide__track {
            overflow: visible !important;
          }
        `
          }}
        />
      </Splide>
    </div>
  )
}

export default ProductCarousel
