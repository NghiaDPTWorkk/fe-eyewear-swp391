import { useParams } from 'react-router-dom'
import { useGetProductDetail } from '@/shared/hooks/products/useGetProductDetail'
import {
  ImageGallery,
  ProductInfo,
  ProductSpecifications
} from '@/components/layout/customer/product-detail'
import { useProductVariants } from '@/shared/hooks/products/useProductVariants'
import { BenefitsBar } from '@/components/layout/customer/homepage/components/BenefitsBar'

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
    <div className="min-h-screen bg-mint-200">
      <main className="container mx-auto px-4 py-8 lg:py-12">
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
      <BenefitsBar />
      <ProductSpecifications product={product} variantState={variantState} />
    </div>
  )
}
