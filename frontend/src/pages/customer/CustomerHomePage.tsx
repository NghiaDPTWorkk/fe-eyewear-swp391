import { useState, useMemo, useEffect } from 'react'
import { BenefitsBar, ShaderCarousel, FixedDetail, BuyTutorial } from '@/components/layout/customer/homepage/components'
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

        {/* Khu vực sản phẩm nổi bật */}
        <section className="py-16 bg-mint-200">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-heading font-bold text-mint-1200 mb-4 transition-transform duration-700 delay-100 transform translate-y-0">
                NEW YEAR MUST-HAVES
              </h2>
              <p className="text-gray-eyewear">
                Vibrant colors are set to be a huge trend for the upcoming season.
              </p>
            </div>

            <ProductCarousel products={products} itemsPerView={4} autoPlayInterval={1000} />
          </div>
        </section>
        <section className="py-15 bg-mint-200">
          <FixedDetail />
        </section>
        <BuyTutorial />
      </div>

      {/* Loading Overlay - Chỉ hiện khi trang chưa sẵn sàng để tạo cảm giác mượt mà */}
      {!isPageReady && <Loading />}
    </div>
  )
}
