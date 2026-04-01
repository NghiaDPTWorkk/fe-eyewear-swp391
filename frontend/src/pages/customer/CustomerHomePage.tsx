import { useState, useMemo, useEffect } from 'react'
import {
  BenefitsBar,
  ShaderCarousel,
  FixedDetail,
  BuyTutorial
} from '@/components/layout/customer/homepage/components'
import { ProductCarousel } from '@/shared/components/ui/product-carousel'
import { useGetProductWithPagination } from '@/shared/hooks/products/useGetProductWithPagination'
import { useTexture } from '@react-three/drei'
import { Loading } from '@/shared/components/ui/loading'

// ─── Carousel Assets ───────────────────────────────────────────────────────────
const IMAGE_PATHS = [
  '/images/carousel/splide1.webp',
  '/images/carousel/splide2.webp',
  '/images/carousel/splide3.webp'
]

const MASK_PATH = '/images/carousel/mask.png'

// Preload resources as early as possible
useTexture.preload(IMAGE_PATHS)
useTexture.preload(MASK_PATH)

export const CustomerHomePage = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const [isCarouselReady, setIsCarouselReady] = useState(false)

  // Lấy dữ liệu sản phẩm cho carousel phía dưới
  const typedProductsData = useGetProductWithPagination(1, 10)
  const { products, loading: productsLoading } = typedProductsData

  const isPageReady = useMemo(() => {
    return isCarouselReady && !productsLoading
  }, [isCarouselReady, productsLoading])

  return (
    <div className="min-h-screen bg-mint-200 overflow-x-hidden">
      <div
        className={`transition-opacity duration-700 ease-in-out ${isPageReady ? 'opacity-100' : 'opacity-0'}`}
      >
        {/* Shader Carousel - Full Viewport */}
        <section className="relative w-screen left-1/2 -translate-x-1/2 mb-10">
          <ShaderCarousel
            imagePaths={IMAGE_PATHS}
            maskPath={MASK_PATH}
            onLoaded={() => setIsCarouselReady(true)}
          />
        </section>

        {/* Benefits Bar */}
        <BenefitsBar />

        <section className="py-20 md:py-32 bg-mint-200">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16 md:mb-24">
              <h2 className="text-3xl md:text-5xl font-heading font-bold text-mint-1200 mb-6 transition-transform duration-700 delay-100 transform translate-y-0 tracking-tight">
                NEW YEAR MUST-HAVES
              </h2>
              <p className="text-sm md:text-base text-gray-eyewear max-w-xl mx-auto opacity-80">
                Vibrant colors are set to be a huge trend for the upcoming season.
              </p>
            </div>

            <ProductCarousel products={products} itemsPerView={4} autoPlayInterval={1000} />
          </div>
        </section>
        <section className="py-10 md:py-24 bg-mint-200">
          <FixedDetail />
        </section>
        <BuyTutorial />
      </div>

      {/* Loading Overlay - Chỉ hiện khi trang chưa sẵn sàng để tạo cảm giác mượt mà */}
      {!isPageReady && <Loading />}
    </div>
  )
}
