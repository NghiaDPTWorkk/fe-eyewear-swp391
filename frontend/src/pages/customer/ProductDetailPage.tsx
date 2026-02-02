import { useParams } from 'react-router-dom'
import { MessageCircle } from 'lucide-react'
import { useGetProductDetail } from '@/shared/hooks/products/useGetProductDetail'
import CustomerHeader from '@/components/layout/customer/header/CustomerHeader'
import { ImageGallery, ProductInfo } from '@/components/layout/customer/product-detail'
import { Newsletter, Footer } from '@/components/layout/customer/homepage/components'
import { Button } from '@/components'

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

  const productAny = product as any

  // Extract and deduplicate images from variants and other fields
  const defaultVariant =
    productAny.variants?.find((v: any) => v.isDefault) || productAny.variants?.[0]
  const imageSet = new Set<string>()

  if (productAny.defaultVariantImage) imageSet.add(productAny.defaultVariantImage)
  if (productAny.imageUrl) imageSet.add(productAny.imageUrl)

  if (defaultVariant?.imgs) {
    defaultVariant.imgs.forEach((img: string) => imageSet.add(img))
  }

  if (productAny.images) {
    productAny.images.forEach((img: string) => imageSet.add(img))
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
          <span className="text-mint-1200 font-semibold">
            {productAny.nameBase || productAny.name}
          </span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left Column: Image Gallery - use key to force reset state on product change */}
          <ImageGallery key={productAny._id || productAny.id || id} images={images as string[]} />

          {/* Right Column: Product Info */}
          <ProductInfo product={product} productId={id || ''} />
        </div>
      </main>

      <Newsletter />
      <Footer />

      {/* Floating Chat Button */}
      <Button
        className="fixed bottom-8 right-8 w-16 h-16 bg-primary-500 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-primary-600 hover:scale-110 transition-all duration-300 z-50 group"
        aria-label="Chat with us"
      >
        <MessageCircle className="w-8 h-8 group-hover:rotate-12 transition-transform" />
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-mint-400 border-2 border-white rounded-full animate-pulse"></span>
      </Button>
    </div>
  )
}
