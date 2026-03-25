import type { ReactNode } from 'react'
import { ProductCarousel } from '@/shared/components/ui/product-carousel'
import { useGetProductWithPagination } from '@/shared/hooks/products/useGetProductWithPagination'
import { BenefitsBar, Footer } from './components'

interface HomePageProps {
  header: ReactNode
}

export default function HomePage({ header }: HomePageProps) {
  // Fetch products for carousel
  const typedProductsData = useGetProductWithPagination(1, 10)

  // Select the appropriate data source
  const { products, loading } = typedProductsData

  return (
    <div className="min-h-screen bg-mint-200">
      {header}


      {/* Benefits Bar */}
      <BenefitsBar />

      {/* Featured Products Carousel */}
      <section className="py-16 bg-mint-200">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-heading font-bold text-mint-1200 mb-4">
              NEW YEAR MUST-HAVES
            </h2>
            <p className="text-gray-eyewear">Trending styles for the new season</p>
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
