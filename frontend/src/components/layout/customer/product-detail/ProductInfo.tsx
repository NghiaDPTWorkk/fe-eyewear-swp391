import {
  Heart,
  ShoppingCart,
  Video,
  MessageCircle,
  Truck,
  ShieldCheck,
  RotateCcw,
  PenTool
} from 'lucide-react'
import { useState } from 'react'
import type { Product } from '@/shared/types/product.types'

interface ProductInfoProps {
  product: Product
}

export const ProductInfo = ({ product }: ProductInfoProps) => {
  const [selectedColor, setSelectedColor] = useState('Sage Mist')
  const [selectedSize, setSelectedSize] = useState('Medium')

  // Mock data for colors and sizes since they might not be in the base product type yet
  const colors = [
    { name: 'Sage Mist', value: '#5EEAD4' },
    { name: 'Midnight', value: '#1E293B' },
    { name: 'Sand', value: '#D1D5DB' },
    { name: 'Steel', value: '#475569' }
  ]

  const sizes = ['Small', 'Medium', 'Wide']

  const productAny = product as any
  const defaultVariant =
    productAny.variants?.find((v: any) => v.isDefault) || productAny.variants?.[0]

  const originalPrice = productAny.defaultVariantPrice || defaultVariant?.price || 0
  const finalPrice =
    productAny.defaultVariantFinalPrice || defaultVariant?.finalPrice || originalPrice

  const description =
    productAny.description ||
    productAny.shortDescription ||
    'A modern interpretation of the classic square silhouette. Crafted from premium Italian acetate with a subtle translucent finish that catches the light from every angle.'

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <span className="px-3 py-1 bg-primary-100 text-primary-600 rounded-full text-xs font-bold uppercase tracking-wider">
          New Arrival
        </span>
        <button className="flex items-center gap-2 text-gray-eyewear hover:text-primary-500 transition-colors group">
          <Heart className="w-5 h-5 group-hover:fill-primary-500" />
          <span className="text-sm font-medium">Wishlist</span>
        </button>
      </div>

      <h1 className="text-4xl lg:text-5xl font-heading font-bold text-mint-1200 mb-4">
        {product.nameBase}
      </h1>

      <div className="flex items-baseline gap-4 mb-8">
        <span className="text-3xl font-bold text-mint-1200">
          ${finalPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </span>
        {finalPrice < originalPrice && (
          <span className="text-xl text-gray-eyewear line-through">
            ${originalPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        )}
      </div>

      <p className="text-gray-eyewear leading-relaxed mb-8 max-w-xl">{description}</p>

      {/* Color Selection */}
      <div className="mb-8">
        <h3 className="text-sm font-bold text-mint-1200 uppercase tracking-wider mb-4">
          Color:{' '}
          <span className="text-gray-eyewear font-medium ml-1 uppercase">{selectedColor}</span>
        </h3>
        <div className="flex gap-4">
          {colors.map((color) => (
            <button
              key={color.name}
              title={color.name}
              className={`w-10 h-10 rounded-full border-2 transition-all p-0.5 ${
                selectedColor === color.name
                  ? 'border-primary-500 scale-110'
                  : 'border-transparent hover:border-primary-300'
              }`}
              onClick={() => setSelectedColor(color.name)}
            >
              <div
                className="w-full h-full rounded-full"
                style={{ backgroundColor: color.value }}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Size Selection */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-bold text-mint-1200 uppercase tracking-wider">
            Size Selection
          </h3>
          <button className="text-xs font-bold text-primary-500 uppercase flex items-center gap-1 hover:underline">
            Size Guide
          </button>
        </div>
        <div className="flex gap-4">
          {sizes.map((size) => (
            <button
              key={size}
              className={`flex-1 py-4 rounded-xl font-semibold transition-all border-2 ${
                selectedSize === size
                  ? 'bg-primary-50 text-primary-600 border-primary-500'
                  : 'bg-white text-gray-eyewear border-mint-300 hover:border-primary-300'
              }`}
              onClick={() => setSelectedSize(size)}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-4 mb-8">
        <button className="w-full py-5 bg-primary-500 text-white font-bold rounded-2xl hover:bg-primary-600 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3">
          <ShoppingCart className="w-6 h-6" />
          Add to Cart
        </button>
        <button className="w-full py-5 bg-white text-mint-1200 font-bold rounded-2xl border-2 border-mint-300 hover:bg-mint-300 transition-all flex items-center justify-center gap-3 group">
          <Video className="w-6 h-6 text-primary-500 group-hover:scale-110 transition-transform" />
          Virtual Try-On
        </button>
      </div>

      <button className="flex items-center justify-center gap-2 text-primary-500 font-bold mb-12 hover:underline">
        <MessageCircle className="w-5 h-5" />
        Chat with an Expert about this frame
      </button>

      {/* Feature Grid */}
      <div className="grid grid-cols-2 gap-y-6 gap-x-8 pt-8 border-t border-mint-300">
        <div className="flex items-center gap-3">
          <Truck className="w-5 h-5 text-primary-500" />
          <span className="text-sm text-gray-eyewear font-medium">Free Express Delivery</span>
        </div>
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-primary-500" />
          <span className="text-sm text-gray-eyewear font-medium">Lifetime Warranty</span>
        </div>
        <div className="flex items-center gap-3">
          <RotateCcw className="w-5 h-5 text-primary-500" />
          <span className="text-sm text-gray-eyewear font-medium">Easy 30-Day Returns</span>
        </div>
        <div className="flex items-center gap-3">
          <PenTool className="w-5 h-5 text-primary-500" />
          <span className="text-sm text-gray-eyewear font-medium">Prescription Ready</span>
        </div>
      </div>
    </div>
  )
}
