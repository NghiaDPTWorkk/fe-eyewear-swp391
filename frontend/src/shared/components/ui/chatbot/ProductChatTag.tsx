import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Glasses, Loader2 } from 'lucide-react'
import { productService } from '@/shared/services/products/productService'
import { VNDPrice } from '@/shared/components/ui/vnd-price/VNDPrice'
import type { ProductDetailData } from '@/shared/types/product.types'

interface ProductChatTagProps {
  productId: string
}

export const ProductChatTag = ({ productId }: ProductChatTagProps) => {
  const [product, setProduct] = useState<ProductDetailData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await productService.getProductDetail(productId)
        if (res.success) {
          setProduct(res.data)
        }
      } catch (error) {
        console.error('Failed to fetch product for chatbot:', error)
      } finally {
        setLoading(false)
      }
    }

    if (productId) {
      fetchProduct()
    }
  }, [productId])

  if (loading) {
    return (
      <div className="flex items-center gap-3 p-2 bg-white rounded-xl border border-mint-200 animate-pulse w-full max-w-[280px]">
        <div className="w-16 h-16 bg-mint-100 rounded-lg flex items-center justify-center">
          <Loader2 className="w-5 h-5 text-primary-300 animate-spin" />
        </div>
        <div className="flex-1 space-y-2">
          <div className="h-3 bg-mint-100 rounded w-3/4" />
          <div className="h-3 bg-mint-100 rounded w-1/2" />
        </div>
      </div>
    )
  }

  if (!product || !product.product) return null

  const mainImage = product.product.variants?.[0]?.imgs?.[0]
  const variant = product.product.variants?.[0]

  return (
    <Link
      to={`/products/${productId}`}
      className="flex items-center gap-3 p-2 bg-white rounded-xl border border-mint-200 hover:border-primary-300 hover:shadow-md transition-all group w-full max-w-[280px] my-2"
    >
      <div className="w-16 h-16 bg-mint-50 rounded-lg flex items-center justify-center overflow-hidden shrink-0">
        {mainImage ? (
          <img
            src={mainImage}
            alt={product.product.nameBase}
            className="w-full h-full object-contain group-hover:scale-110 transition-transform"
          />
        ) : (
          <Glasses className="w-6 h-6 text-primary-300" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-mint-1200 truncate group-hover:text-primary-600 transition-colors">
          {product.product.nameBase}
        </h4>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="text-xs font-bold text-primary-500">
            <VNDPrice amount={variant?.finalPrice || variant?.price || 0} />
          </span>
          {variant?.finalPrice && variant?.finalPrice < variant?.price && (
            <span className="text-[10px] text-gray-400 line-through">
              <VNDPrice amount={variant.price} />
            </span>
          )}
        </div>
        <div className="text-[10px] text-primary-500 font-medium mt-0.5 uppercase tracking-wider">
          {product.product.brand}
        </div>
      </div>
    </Link>
  )
}
