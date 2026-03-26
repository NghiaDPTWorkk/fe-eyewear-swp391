import { useParams } from 'react-router-dom'
import { useGetProductDetail } from '@/shared/hooks/products/useGetProductDetail'
import {
  ImageGallery,
  ProductInfo,
  ProductSpecifications,
  RelatedProducts
} from '@/components/layout/customer/product-detail'
import { useProductVariants } from '@/shared/hooks/products/useProductVariants'
import { BenefitsBar } from '@/components/layout/customer/homepage/components/BenefitsBar'
import { BuySteps } from '@/shared/components/ui/buy-steps'

export const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const { product, loading, error } = useGetProductDetail(id || '')

  if (loading) {
    return (
      <div className="min-h-screen bg-mint-200">
        <div className="container mx-auto px-4 py-20 flex justify-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-mint-200">
        <div className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-bold text-mint-1200">Product not found</h2>
          <p className="text-gray-eyewear mt-2">
            The product you are looking for does not exist or has been removed.
          </p>
        </div>
      </div>
    )
  }

  return <ProductDetailContent product={product} productId={product.id || id || ''} />
}

// Separate component so useProductVariants hook can be called after product is loaded
import type { Product } from '@/shared/types/product.types'

interface ProductDetailContentProps {
  product: Product
  productId: string
}

const ProductDetailContent = ({ product, productId }: ProductDetailContentProps) => {
  const variantState = useProductVariants(product)

  return (
    <div className="min-h-screen bg-[#f1f9f7] relative overflow-hidden">
      {/* Dynamic Background Loang Effect - Interwoven Mint and White */}
      <div className="absolute top-[5%] left-[-5%] w-[700px] h-[700px] bg-white rounded-full blur-[140px] pointer-events-none opacity-60" />
      <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] bg-primary-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="absolute top-[30%] right-[5%] w-[800px] h-[800px] bg-white rounded-full blur-[160px] pointer-events-none opacity-40" />
      <div className="absolute top-[40%] right-[-10%] w-[600px] h-[600px] bg-primary-400/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="absolute bottom-[20%] left-[5%] w-[600px] h-[600px] bg-white rounded-full blur-[130px] pointer-events-none opacity-50" />
      <div className="absolute bottom-[10%] left-[15%] w-[500px] h-[500px] bg-primary-300/10 rounded-full blur-[110px] pointer-events-none" />

      <main className="container mx-auto px-4 py-8 lg:py-12 relative z-10">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-gray-eyewear mb-8">
          <a href="/" className="hover:text-primary-500 font-medium transition-colors">
            Home
          </a>
          <span>/</span>
          <a href="/products" className="hover:text-primary-500 font-medium transition-colors">
            Products
          </a>
          <span>/</span>
          <span className="text-mint-1200 font-semibold">{product.nameBase}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left Column: Image Gallery - images from current variant */}
          <ImageGallery images={variantState.images} />

          {/* Right Column: Product Info - pass shared variant state */}
          <ProductInfo product={product} productId={productId} variantState={variantState} />
        </div>
      </main>

      <div className="relative z-10">
        <BenefitsBar />
        <ProductSpecifications product={product} variantState={variantState} />
        <RelatedProducts currentProduct={product} />
        <BuySteps />
      </div>
    </div>
  )
}
