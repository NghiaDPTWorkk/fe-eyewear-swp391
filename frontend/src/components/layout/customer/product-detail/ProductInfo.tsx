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
import { useCartStore, useAuthStore } from '@/store'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/shared/components/ui'
import LensSelectionModal from './lenses/LensSelectionModal'
import type { LensSelectionState } from './lenses/types'

interface ProductInfoProps {
  product: Product
}

export const ProductInfo = ({ product }: ProductInfoProps) => {
  const [selectedColor, setSelectedColor] = useState('Sage Mist')
  const [selectedSize, setSelectedSize] = useState('Medium')
  const addItem = useCartStore((state) => state.addItem)
  const { isAuthenticated } = useAuthStore()
  const navigate = useNavigate()
  const [isLensModalOpen, setIsLensModalOpen] = useState(false)

  const handleAddToCart = () => {
    const isAuth = isAuthenticated || !!localStorage.getItem('accessToken')
    if (!isAuth) {
      toast.error('Please login to add items to cart')
      navigate('/login')
      return
    }

    const type = (product as any).type || 'frame'

    if (type === 'frame' || type === 'lens') {
      setIsLensModalOpen(true)
      return
    }

    // Sunglass or default frame path
    performAddToCart()
  }

  const handleLensConfirm = (selection: LensSelectionState) => {
    performAddToCart(selection)
    toast.success(`${product.nameBase} with ${selection.visionNeed} lenses added to cart!`)
  }

  const performAddToCart = (lensSelection?: LensSelectionState) => {
    const productAny = product as any
    const defaultVariant =
      productAny.variants?.find((v: any) => v.isDefault) || productAny.variants?.[0]

    const price =
      productAny.defaultVariantFinalPrice ||
      defaultVariant?.finalPrice ||
      productAny.defaultVariantPrice ||
      defaultVariant?.price ||
      0
    const id = productAny._id || productAny.id || productAny.skuBase || 'unknown'

    addItem({
      product_id: id,
      name: product.nameBase,
      price: price,
      quantity: 1,
      image: productAny.defaultVariantImage || productAny.imageUrl || productAny.images?.[0] || '',
      addAt: new Date(),
      // Add lens selection info to cart item if needed (will need to update cart types)
      lens: lensSelection
        ? {
            visionNeed: lensSelection.visionNeed,
            prescription: lensSelection.prescription
          }
        : undefined
    } as any)

    if (!lensSelection) {
      toast.success(`${product.nameBase} added to cart!`)
    }
  }

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
        <button
          onClick={() => {
            const isAuth =
              useAuthStore.getState().isAuthenticated || !!localStorage.getItem('accessToken')
            if (!isAuth) {
              toast.error('Please login to add items to wishlist')
              navigate('/login')
              return
            }
            toast.success('Added to wishlist!')
          }}
          className="flex items-center gap-2 text-gray-eyewear hover:text-primary-500 transition-colors group px-4 py-2 rounded-full hover:bg-mint-50"
        >
          <Heart className="w-5 h-5 group-hover:fill-primary-500" />
          <span className="text-sm font-bold uppercase tracking-wider">Wishlist</span>
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
        <Button
          onClick={handleAddToCart}
          size="lg"
          isFullWidth
          className="h-16 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          leftIcon={<ShoppingCart className="w-6 h-6" />}
        >
          {(product as any).type === 'frame'
            ? 'Select Lenses'
            : (product as any).type === 'lens'
              ? 'Enter Prescription & Add'
              : 'Add to Cart'}
        </Button>
        <Button
          variant="outline"
          size="lg"
          isFullWidth
          colorScheme="neutral"
          className="h-16 rounded-2xl border-mint-300 hover:bg-mint-50 px-0"
          leftIcon={<Video className="w-6 h-6 text-primary-500" />}
        >
          Virtual Try-On
        </Button>
      </div>

      <button className="flex items-center justify-center gap-2 text-primary-500 font-bold mb-12 hover:underline group transition-all">
        <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
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

      <LensSelectionModal
        isOpen={isLensModalOpen}
        onClose={() => setIsLensModalOpen(false)}
        onConfirm={handleLensConfirm}
        productName={product.nameBase}
        productImage={
          productAny.defaultVariantImage ||
          productAny.imageUrl ||
          defaultVariant?.imgs?.[0] ||
          productAny.images?.[0] ||
          ''
        }
        productType={(product as any).type || 'frame'}
      />
    </div>
  )
}
