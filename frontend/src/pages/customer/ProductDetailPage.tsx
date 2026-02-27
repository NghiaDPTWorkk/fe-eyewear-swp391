import { useParams } from 'react-router-dom'
import { useGetProductDetail } from '@/shared/hooks/products/useGetProductDetail'
import CustomerHeader from '@/components/layout/customer/header/CustomerHeader'
import { ImageGallery, ProductInfo } from '@/components/layout/customer/product-detail'
import { Newsletter, Footer } from '@/components/layout/customer/homepage/components'

export const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const { product, loading, error } = useGetProductDetail(id || '')

  if (loading) {
    return (
      <div className="min-h-screen bg-mint-200">
        <CustomerHeader />
        <div className="container mx-auto px-4 py-20 flex justify-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-mint-200">
        <CustomerHeader />
        <div className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-bold text-mint-1200">Product not found</h2>
          <p className="text-gray-eyewear mt-2">
            The product you are looking for does not exist or has been removed.
          </p>
        </div>
      </div>
    )
  }

  // Extract and deduplicate images from variants and other fields
  const defaultVariant = product.variants?.find((v) => v.isDefault) || product.variants?.[0]
  const imageSet = new Set<string>()

  if (product.defaultVariantImage) imageSet.add(product.defaultVariantImage)
  if (product.imageUrl) imageSet.add(product.imageUrl)

  if (defaultVariant?.imgs) {
    defaultVariant.imgs.forEach((img: string) => imageSet.add(img))
  }

  const images = Array.from(imageSet).filter(Boolean)

  return (
    <div className="min-h-screen bg-mint-200">
      <CustomerHeader />

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
          {/* Left Column: Image Gallery - use key to force reset state on product change */}
          <ImageGallery key={product.id || id} images={images as string[]} />

          {/* Right Column: Product Info */}
          <ProductInfo product={product} productId={product.id || id || ''} />
        </div>
      </main>

      <Newsletter />
      <Footer />
    </div>
  )
}
