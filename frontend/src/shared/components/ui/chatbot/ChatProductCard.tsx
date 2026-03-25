import { Glasses } from 'lucide-react'
import { Link } from 'react-router-dom'
import { VNDPrice } from '@/shared/components/ui/vnd-price/VNDPrice'

interface ChatProductCardProps {
  product: {
    _id: string
    nameBase: string
    brand: string
    variants: Array<{
      price: number
      finalPrice: number
      imgs: string[]
      isDefault: boolean
    }>
  }
}

export const ChatProductCard = ({ product }: ChatProductCardProps) => {
  const defaultVariant = product.variants.find((v) => v.isDefault) || product.variants[0]
  const mainImage = defaultVariant?.imgs?.[0]

  return (
    <Link
      to={`/products/${product._id}`}
      className="flex items-center gap-3 p-2 bg-white rounded-xl border border-mint-200 hover:border-primary-300 hover:shadow-md transition-all group w-full max-w-[280px] my-2"
    >
      <div className="w-16 h-16 bg-mint-50 rounded-lg flex items-center justify-center overflow-hidden shrink-0">
        {mainImage ? (
          <img
            src={mainImage}
            alt={product.nameBase}
            className="w-full h-full object-contain group-hover:scale-110 transition-transform"
          />
        ) : (
          <Glasses className="w-6 h-6 text-primary-300" />
        )}
      </div>
      <div className="flex-1 min-w-0 text-left">
        <h4 className="text-sm font-semibold text-mint-1200 truncate group-hover:text-primary-600 transition-colors">
          {product.nameBase}
        </h4>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="text-xs font-bold text-primary-500">
            <VNDPrice amount={defaultVariant?.finalPrice || defaultVariant?.price || 0} />
          </span>
          {defaultVariant?.finalPrice && defaultVariant?.finalPrice < defaultVariant?.price && (
            <span className="text-[10px] text-gray-400 line-through">
              <VNDPrice amount={defaultVariant.price} />
            </span>
          )}
        </div>
        <div className="text-[10px] text-primary-500 font-medium mt-0.5 uppercase tracking-wider">
          {product.brand}
        </div>
      </div>
    </Link>
  )
}
