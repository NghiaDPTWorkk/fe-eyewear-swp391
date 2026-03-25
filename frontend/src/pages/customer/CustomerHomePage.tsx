import CustomerHeader from '@/components/layout/customer/header/CustomerHeader'
import { Hero, BenefitsBar, Footer, ShaderCarousel } from '@/components/layout/customer/homepage/components'
import { ProductCarousel } from '@/shared/components/ui/product-carousel'
import { useGetProductWithPagination } from '@/shared/hooks/products/useGetProductWithPagination'

export const CustomerHomePage = () => {
  // Lấy dữ liệu sản phẩm cho carousel phía dưới
  const typedProductsData = useGetProductWithPagination(1, 10)
  const { products, loading } = typedProductsData

  return (
    <div className="min-h-screen bg-mint-200">
      <CustomerHeader />

      {/* Hero Section */}
      <Hero />

      {/* Shader Carousel - Full Viewport */}
      <section className="relative w-screen left-1/2 -translate-x-1/2">
        <ShaderCarousel />
      </section>

      {/* Benefits Bar */}
      <BenefitsBar />

      {/* Khu vực sản phẩm nổi bật */}
      <section className="py-16 bg-mint-200">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-heading font-bold text-mint-1200 mb-4">
              NEW YEAR MUST-HAVES
            </h2>
            <p className="text-gray-eyewear">Xu hướng thời trang cho mùa mới</p>
          </div>
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <ProductCarousel products={products} itemsPerView={4} autoPlayInterval={1000} />
          )}
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
