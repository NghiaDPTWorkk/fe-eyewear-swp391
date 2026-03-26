import React, { useRef } from 'react'
import { Splide, SplideTrack, SplideSlide } from '@splidejs/react-splide'
import { AutoScroll } from '@splidejs/splide-extension-auto-scroll'
import '@splidejs/react-splide/css'
import './CarouselSpotlight.css'
import { ProductCardHome } from '../product-card-home'
import type { Product } from '@/shared/types/product.types'
import { useNavigate } from 'react-router-dom'

interface ProductCarouselProps {
  products: Product[]
  autoPlayInterval?: number // Kept for compatibility but Splide uses its own options
  itemsPerView?: number
}

export const ProductCarousel = ({ products, itemsPerView = 4 }: ProductCarouselProps) => {
  const navigate = useNavigate()
  const carouselRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!carouselRef.current) return
    const rect = carouselRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    carouselRef.current.style.setProperty('--mouse-x', `${x}px`)
    carouselRef.current.style.setProperty('--mouse-y', `${y}px`)
    carouselRef.current.style.setProperty('--spotlight-opacity', '1')
  }

  const handleMouseLeave = () => {
    if (!carouselRef.current) return
    carouselRef.current.style.setProperty('--spotlight-opacity', '0')
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-eyewear">No products available</p>
      </div>
    )
  }

  return (
    <div
      ref={carouselRef}
      className="relative group/carousel carousel-spotlight-container"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Dynamic Background Spotlight Layer */}
      <div className="carousel-spotlight" />

      <Splide
        hasTrack={false}
        className="splide-custom-glow"
        extensions={{ AutoScroll }}
        options={{
          type: 'loop',
          drag: 'free',
          focus: 'center',
          perPage: itemsPerView,
          gap: '1.5rem',
          arrows: true,
          pagination: false,
          autoScroll: {
            pauseOnHover: true,
            pauseOnFocus: false,
            rewind: false,
            speed: 0.5 // Chậm hơn 1 một chút theo yêu cầu
          },
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
            const productImage = p.defaultVariantImage || p.imageUrl || ''

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

        {/* Custom Styling for Splide Arrows */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
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
            fill: #131c32 !important;
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
        `
          }}
        />
      </Splide>
    </div>
  )
}

export default ProductCarousel
