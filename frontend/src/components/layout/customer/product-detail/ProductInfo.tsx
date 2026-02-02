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
import { useNavigate, useLocation } from 'react-router-dom'
import { Button } from '@/shared/components/ui'
import LensSelectionModal from './lenses/LensSelectionModal'
import type { LensSelectionState } from './lenses/types'
import { useProductVariants } from '@/shared/hooks/products/useProductVariants'

interface ProductInfoProps {
  product: Product
  productId: string
}

export const ProductInfo = ({ product, productId }: ProductInfoProps) => {
  // Use variant selection hook
  const {
    currentVariant,
    selectedOptions,
    attributes,
    selectOption,
    price,
    finalPrice,
    stock,
    images,
    isInStock,
    isValidCombination,
    availableOptionsForAttribute
  } = useProductVariants(product)

  const addItemAsync = useCartStore((state) => state.addItemAsync)
  const isAddingToCart = useCartStore((state) => state.isAddingToCart)
  const { isAuthenticated } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [isLensModalOpen, setIsLensModalOpen] = useState(false)

  const handleAddToCart = () => {
    console.log('🛒 Add to Cart clicked!')
    console.log('Product data:', product)

    const isAuth = isAuthenticated || !!localStorage.getItem('accessToken')
    console.log('Is authenticated:', isAuth)

    if (!isAuth) {
      toast.error('Please login to add items to cart')
      navigate('/login', { state: { from: location } })
      return
    }

    const type = (product as any).type || 'frame'
    console.log('Product type:', type)

    if (type === 'frame' || type === 'lens') {
      console.log('Opening lens modal for frame/lens product')
      setIsLensModalOpen(true)
      return
    }

    // Sunglass or default frame path
    console.log('Proceeding to add sunglass to cart')
    performAddToCart()
  }

  const handleLensConfirm = (selection: LensSelectionState) => {
    performAddToCart(selection)
  }

  const performAddToCart = async (lensSelection?: LensSelectionState) => {
    console.log('📦 performAddToCart called')
    console.log('Current variant:', currentVariant)
    console.log('Is in stock:', isInStock)
    console.log('Lens selection:', lensSelection)

    // Validation: Check if variant is selected and in stock
    if (!currentVariant) {
      console.error('❌ No variant selected')
      toast.error('Please select a valid product variant')
      return
    }

    if (!isInStock) {
      console.error('❌ Product out of stock')
      toast.error('This variant is currently out of stock')
      return
    }

    // Use productId from URL params (passed as prop) instead of extracting from product
    // This is more reliable since backend may not return _id or id in the response
    const productAny = product as any
    const extractedId = productAny.id || productAny._id || productAny.skuBase

    console.log('🔍 Product ID extraction:')
    console.log('  productId (from URL prop):', productId)
    console.log('  id (from product):', productAny.id)
    console.log('  _id (from product):', productAny._id)
    console.log('  skuBase (from product):', productAny.skuBase)
    console.log('  extractedId:', extractedId)
    console.log('  Final productId (using prop):', productId)
    console.log('  SKU:', currentVariant.sku)

    if (!productId) {
      console.error('❌ Product ID is missing from URL! Using fallback:', extractedId)
      if (!extractedId) {
        toast.error('Unable to add to cart: Product ID not found')
        return
      }
    }

    // Use productId from prop (URL) as the primary source
    const finalProductId = productId || extractedId

    try {
      console.log('🚀 Calling addItemAsync with:', {
        productId: finalProductId,
        sku: currentVariant.sku,
        quantity: 1,
        lensSelection
      })

      // Call async add to cart with API integration
      await addItemAsync(finalProductId, currentVariant.sku, 1, lensSelection)

      console.log('✅ Successfully added to cart')

      // Show success message
      if (lensSelection) {
        toast.success(`${product.nameBase} with ${lensSelection.visionNeed} lenses added to cart!`)
      } else {
        toast.success(`${currentVariant.name} added to cart!`)
      }

      // Close lens modal if open
      if (isLensModalOpen) {
        setIsLensModalOpen(false)
      }
    } catch (error: any) {
      console.error('❌ Error adding to cart:', error)

      // Handle specific errors
      if (error.message === 'UNAUTHORIZED') {
        toast.error('Please login to add items to cart')
        navigate('/login', { state: { from: location } })
      } else {
        toast.error(error.message || 'Failed to add item to cart')
      }
    }
  }

  // Get product description
  const productAny = product as any
  const description =
    productAny.description ||
    productAny.shortDescription ||
    'A modern interpretation of the classic square silhouette. Crafted from premium Italian acetate with a subtle translucent finish that catches the light from every angle.'

  // Calculate discount percentage if applicable
  const hasDiscount = finalPrice < price
  const discountPercentage = hasDiscount ? Math.round(((price - finalPrice) / price) * 100) : 0

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
              navigate('/login', { state: { from: location } })
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
        {hasDiscount && (
          <>
            <span className="text-xl text-gray-eyewear line-through">
              ${price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
            <span className="px-2 py-1 bg-red-100 text-red-600 rounded-full text-xs font-bold">
              -{discountPercentage}%
            </span>
          </>
        )}
      </div>

      {/* Stock Status */}
      {currentVariant && (
        <div className="mb-6">
          {isInStock ? (
            <p className="text-sm text-green-600 font-semibold flex items-center gap-2">
              <span className="w-2 h-2 bg-green-600 rounded-full"></span>
              In Stock ({stock} available)
            </p>
          ) : (
            <p className="text-sm text-red-600 font-semibold flex items-center gap-2">
              <span className="w-2 h-2 bg-red-600 rounded-full"></span>
              Out of Stock
            </p>
          )}
        </div>
      )}

      <p className="text-gray-eyewear leading-relaxed mb-8 max-w-xl">{description}</p>

      {/* Dynamic Options Rendering */}
      {attributes.length > 0 && (
        <div className="space-y-8 mb-10">
          {attributes.map((attribute) => {
            const availableValues = availableOptionsForAttribute(attribute.name)
            const selectedValue = selectedOptions[attribute.name]

            // Check if this attribute is a color (value starts with # or is a hex color)
            const isColorAttribute = attribute.values.some(
              (val) => /^#[0-9A-Fa-f]{6}$/.test(val) || /^#[0-9A-Fa-f]{3}$/.test(val)
            )

            return (
              <div key={attribute.name}>
                <h3 className="text-sm font-bold text-mint-1200 uppercase tracking-wider mb-4">
                  {attribute.name}:{' '}
                  <span className="text-primary-600 font-semibold ml-1">
                    {selectedValue || 'Select'}
                  </span>
                </h3>
                <div className="flex gap-3 flex-wrap">
                  {attribute.values.map((value) => {
                    const isAvailable = availableValues.includes(value)
                    const isSelected = selectedValue === value

                    // Render color swatch for color attributes
                    if (isColorAttribute) {
                      return (
                        <button
                          key={value}
                          disabled={!isAvailable}
                          className={`relative w-12 h-12 rounded-full transition-all border-4 group ${
                            isSelected
                              ? 'border-primary-500 shadow-lg scale-110'
                              : isAvailable
                                ? 'border-mint-300 hover:border-primary-400 hover:scale-105'
                                : 'border-gray-200 cursor-not-allowed opacity-40'
                          }`}
                          style={{
                            backgroundColor: value,
                            boxShadow: isSelected ? '0 4px 12px rgba(0,0,0,0.15)' : undefined
                          }}
                          onClick={() => isAvailable && selectOption(attribute.name, value)}
                          title={value}
                        >
                          {/* Tooltip on hover */}
                          <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                            {value}
                          </span>
                          {/* Checkmark for selected color */}
                          {isSelected && (
                            <svg
                              className="absolute inset-0 m-auto w-5 h-5 text-white drop-shadow-md"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              style={{
                                filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))'
                              }}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                        </button>
                      )
                    }

                    // Render regular button for non-color attributes
                    return (
                      <button
                        key={value}
                        disabled={!isAvailable}
                        className={`px-6 py-3 rounded-xl font-semibold transition-all border-2 ${
                          isSelected
                            ? 'bg-primary-500 text-white border-primary-500 shadow-md'
                            : isAvailable
                              ? 'bg-white text-gray-eyewear border-mint-300 hover:border-primary-400 hover:bg-mint-50'
                              : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-50'
                        }`}
                        onClick={() => isAvailable && selectOption(attribute.name, value)}
                      >
                        {value}
                        {!isAvailable && <span className="ml-2 text-xs">(Unavailable)</span>}
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col gap-4 mb-8">
        <Button
          onClick={handleAddToCart}
          size="lg"
          isFullWidth
          disabled={!isValidCombination || !isInStock || isAddingToCart}
          className="h-16 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
          leftIcon={<ShoppingCart className="w-6 h-6" />}
        >
          {isAddingToCart
            ? 'Adding...'
            : !isValidCombination
              ? 'Select Options'
              : !isInStock
                ? 'Out of Stock'
                : (product as any).type === 'frame'
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
        productImage={currentVariant?.imgs?.[0] || images[0] || ''}
        productType={(product as any).type || 'frame'}
      />
    </div>
  )
}
