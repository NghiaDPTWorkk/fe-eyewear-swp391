import { Heart, ShoppingCart, Video, MessageCircle, Zap } from 'lucide-react'
import { VNDPrice } from '@/shared/components/ui/vnd-price/VNDPrice'
import { useState } from 'react'
import type { Product, StandardProduct } from '@/shared/types/product.types'
import type { CartItem } from '@/shared/types/cart.types'
import { PATHS } from '@/routes/paths'
import { useCartStore, useAuthStore, useWishlistStore, useChatStore } from '@/store'
import { toast } from 'react-hot-toast'
import { useNavigate, useLocation } from 'react-router-dom'
import { Button } from '@/shared/components/ui'
import LensSelectionModal from './lenses/LensSelectionModal'
import type { LensSelectionState } from './lenses/types'
import VirtualTryOnModal from './virtual-try-on/VirtualTryOnModal'
import { cn } from '@/lib/utils'
import type {
  UseProductVariantsReturn,
  AttributeValue
} from '@/shared/hooks/products/useProductVariants'
import type { Variant } from '@/shared/types'

interface ProductInfoProps {
  product: Product
  productId: string
  variantState: UseProductVariantsReturn
}

export const ProductInfo = ({ product, productId, variantState }: ProductInfoProps) => {
  // Use shared variant selection state from prop
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
    isPreOrder,
    isPreOrderExpired,
    preOrderPlan,
    isValidCombination,
    availableOptionsForAttribute
  } = variantState

  const addItemAsync = useCartStore((state) => state.addItemAsync)
  const isAddingToCart = useCartStore((state) => state.isAddingToCart)
  const { toggleWishlist, isInWishlist } = useWishlistStore()
  const { isAuthenticated } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [isLensModalOpen, setIsLensModalOpen] = useState(false)
  const [isTryOnOpen, setIsTryOnOpen] = useState(false)
  const [purchaseMode, setPurchaseMode] = useState<'cart' | 'buy_now'>('cart')
  const sendMessage = useChatStore((state) => state.sendMessage)

  const isFavorite = isInWishlist(productId)

  const handleAddToCart = (variantToUse?: Variant) => {
    setPurchaseMode('cart')
    // Check for token in both possible localStorage keys
    const token = localStorage.getItem('accessToken') || localStorage.getItem('access_token')
    const isAuth = isAuthenticated && token

    if (!isAuth) {
      toast.error('Please login to add items to cart')
      navigate('/login', { state: { from: location } })
      return
    }

    const type = product.type || 'frame'

    if (type === 'frame') {
      // If we are coming from Try-On modal with a specific variant,
      // we might want to skip or handle lens selection differently.
      // For now, let's keep it simple: if it's a frame, open lens modal.
      setIsLensModalOpen(true)
      return
    }

    // Sunglass or default frame path
    performAction(undefined, 'cart', variantToUse)
  }

  const handleBuyNow = () => {
    // Check for token in both possible localStorage keys
    const token = localStorage.getItem('accessToken') || localStorage.getItem('access_token')
    const isAuth = isAuthenticated && token

    if (!isAuth) {
      toast.error('Please login to purchase')
      navigate('/login', { state: { from: location } })
      return
    }

    setPurchaseMode('buy_now')
    const type = product.type || 'frame'

    if (type === 'frame') {
      setIsLensModalOpen(true)
      return
    }

    performAction(undefined, 'buy_now')
  }

  const handleLensConfirm = (selection: LensSelectionState) => {
    performAction({
      ...selection,
      sku: selection.sku
    })
  }

  const performAction = async (
    lensSelection?: LensSelectionState,
    explicitMode?: 'cart' | 'buy_now',
    variantToUse?: Variant
  ) => {
    // Validation: Check if variant is selected and in stock
    const v = variantToUse || currentVariant
    if (!v) {
      toast.error('Please select a valid product variant')
      return
    }

    if (!isInStock) {
      toast.error(
        isPreOrderExpired
          ? 'The pre-order period for this item has ended.'
          : 'This variant is currently out of stock'
      )
      return
    }

    // Prioritize the product ID from the product object if available
    // Otherwise fallback to the ID from the URL prop
    const finalProductId = product.id || productId

    if (!finalProductId) {
      toast.error('Unable to proceed: Product ID not found')
      return
    }

    if (!v.sku) {
      toast.error('Unable to proceed: SKU not found for this variant')
      return
    }

    const normalizedLensSelection =
      lensSelection?.visionNeed === 'non-prescription' ? undefined : lensSelection

    const modeToUse = explicitMode || purchaseMode

    if (modeToUse === 'cart') {
      try {
        // Call async add to cart with API integration
        await addItemAsync(finalProductId, v.sku || '', 1, normalizedLensSelection)

        // Show success message
        const actionLabel = isPreOrder ? 'Pre-ordered' : 'added to cart'
        if (lensSelection) {
          toast.success(
            `${product.nameBase} with ${lensSelection.visionNeed} lenses ${actionLabel}!`
          )
        } else {
          toast.success(`${v.name} ${actionLabel}!`)
        }

        // Close lens modal if open
        if (isLensModalOpen) {
          setIsLensModalOpen(false)
        }
      } catch (error) {
        // Handle specific errors
        const err = error as Error
        if (err.message === 'UNAUTHORIZED') {
          toast.error('Please login to add items to cart')
          navigate('/login', { state: { from: location } })
        } else {
          toast.error(err.message || 'Failed to add item to cart')
        }
      }
    } else {
      // Direct buy flow: redirect to checkout with item data
      const itemToBuy: CartItem = {
        product_id: finalProductId,
        sku: v.sku || '',
        quantity: 1,
        name: product.nameBase,
        price: v.finalPrice ?? v.price,
        image: v.imgs?.[0] || images[0] || '',
        addAt: new Date(),
        selected: true,
        productType: product.type,
        selectedOptions: selectedOptions,
        lens:
          lensSelection && lensSelection.lensId
            ? {
                lensId: lensSelection.lensId,
                sku: lensSelection.sku || undefined,
                visionNeed: lensSelection.visionNeed || 'non-prescription',
                prescription: lensSelection.prescription,
                name: lensSelection.name,
                price: lensSelection.lensPrice || 0,
                image: lensSelection.image
              }
            : undefined
      }

      // Close lens modal if open
      if (isLensModalOpen) {
        setIsLensModalOpen(false)
      }

      navigate(PATHS.CHECKOUT, { state: { item: itemToBuy } })
    }
  }

  const handleChatWithExpert = () => {
    // Check authentication first
    const token = localStorage.getItem('accessToken') || localStorage.getItem('access_token')
    const isAuth = isAuthenticated && token

    if (!isAuth) {
      toast.error('Please login to chat with an expert')
      navigate('/login', { state: { from: location } })
      return
    }

    const productUrl = `${window.location.origin}/products/${product.id || productId}`
    const message = `I'm interested in this product: ${product.nameBase}. Can you tell me more about it? ${productUrl}`
    sendMessage(message)
  }

  const handleToggleWishlist = async () => {
    const isAuth = useAuthStore.getState().isAuthenticated || !!localStorage.getItem('access_token') // Fixed key to access_token
    if (!isAuth) {
      toast.error('Please login to add items to wishlist')
      navigate('/login', { state: { from: location } })
      return
    }

    try {
      // Ensure we have all necessary fields for StandardProduct
      const productToSave: StandardProduct = {
        ...product,
        id: product.id || productId,
        defaultVariantImage: product.defaultVariantImage || images[1],
        defaultVariantPrice: price,
        defaultVariantFinalPrice: finalPrice,
        selectedOptions: selectedOptions
      }
      await toggleWishlist(productToSave)
      toast.success(isFavorite ? 'Removed from wishlist' : 'Added to wishlist')
    } catch {
      toast.error('Failed to update wishlist')
    }
  }

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
          onClick={handleToggleWishlist}
          className={cn(
            'flex items-center gap-2 transition-colors group px-4 py-2 rounded-full',
            isFavorite
              ? 'text-primary-500 bg-primary-50'
              : 'text-gray-eyewear hover:text-primary-500 hover:bg-mint-50'
          )}
        >
          <Heart
            className={cn(
              'w-5 h-5 transition-all group-hover:scale-110',
              isFavorite && 'fill-primary-500'
            )}
          />
          <span className="text-sm font-bold uppercase tracking-wider">Wishlist</span>
        </button>
      </div>

      <h1 className="text-4xl lg:text-5xl font-heading font-bold text-mint-1200 mb-4">
        {product.nameBase}
      </h1>

      <div className="flex items-baseline gap-4 mb-8">
        <span className="text-3xl font-bold text-mint-1200">
          <VNDPrice amount={finalPrice} />
        </span>
        {hasDiscount && (
          <>
            <span className="text-xl text-gray-eyewear line-through">
              <VNDPrice className="line-through" amount={price} />
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
          {isPreOrder ? (
            isPreOrderExpired ? (
              <div className="flex flex-col gap-1">
                <p className="text-sm text-red-600 font-semibold flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                  Pre-order Period Ended
                </p>
                <p className="text-xs text-gray-400 italic">
                  This pre-order event has finished. Please wait for the next stock arrival.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                <p className="text-sm text-blue-600 font-semibold flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
                  Pre-order Item
                </p>
                <p className="text-xs text-gray-500 italic">
                  Available until:{' '}
                  {preOrderPlan?.endedDate
                    ? new Date(preOrderPlan.endedDate).toLocaleDateString()
                    : 'soon'}
                </p>
              </div>
            )
          ) : isInStock ? (
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

      {/* Description moved to ProductSpecifications tabs per user request */}
      {/* {description && (
        <p className="text-gray-eyewear leading-relaxed mb-8 max-w-xl">{description}</p>
      )} */}

      {/* Dynamic Options Rendering */}
      {attributes.length > 0 && (
        <div className="space-y-8 mb-10">
          {attributes.map((attribute) => {
            const availableValues = availableOptionsForAttribute(attribute.name)
            const selectedValue = selectedOptions[attribute.name]

            const isColorAttribute = attribute.showType === 'color'

            // Find label for the selected value
            const selectedLabel =
              currentVariant?.options.find((opt) => opt.attributeName === attribute.name)?.label ||
              attribute.values.find((v) => v.value === selectedValue)?.label ||
              selectedValue ||
              'Select'

            return (
              <div key={attribute.name}>
                <h3 className="text-sm font-bold text-mint-1200 uppercase tracking-wider mb-4">
                  {attribute.name}:{' '}
                  <span className="text-primary-600 font-semibold ml-1">{selectedLabel}</span>
                </h3>
                <div className="flex gap-3 flex-wrap">
                  {attribute.values.map((option: AttributeValue) => {
                    const isAvailable = availableValues.includes(option.value)
                    const isSelected = selectedValue === option.value

                    // Render color swatch for color attributes
                    if (isColorAttribute) {
                      return (
                        <button
                          key={option.value}
                          disabled={!isAvailable}
                          className={`relative w-12 h-12 rounded-full transition-all border-4 group ${
                            isSelected
                              ? 'border-primary-500 shadow-lg scale-110'
                              : isAvailable
                                ? 'border-mint-300 hover:border-primary-400 hover:scale-105'
                                : 'border-gray-200 cursor-not-allowed opacity-40'
                          }`}
                          style={{
                            backgroundColor: option.value,
                            boxShadow: isSelected ? '0 4px 12px rgba(0,0,0,0.15)' : undefined
                          }}
                          onClick={() => isAvailable && selectOption(attribute.name, option.value)}
                          title={option.label}
                        >
                          {/* Tooltip on hover */}
                          <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                            {option.label}
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
                        key={option.value}
                        disabled={!isAvailable}
                        className={`px-6 py-3 rounded-xl font-semibold transition-all border-2 ${
                          isSelected
                            ? 'bg-primary-500 text-white border-primary-500 shadow-md'
                            : isAvailable
                              ? 'bg-white text-gray-eyewear border-mint-300 hover:border-primary-400 hover:bg-mint-50'
                              : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-50'
                        }`}
                        onClick={() => isAvailable && selectOption(attribute.name, option.value)}
                      >
                        {option.label}
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
          onClick={() => handleAddToCart(currentVariant ?? undefined)}
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
                ? isPreOrderExpired
                  ? 'Pre-order Ended'
                  : 'Out of Stock'
                : product.type === 'frame'
                  ? 'Select Lenses'
                  : isPreOrder
                    ? 'Pre-order Now'
                    : 'Add to Cart'}
        </Button>
        <Button
          onClick={handleBuyNow}
          size="lg"
          variant="outline"
          isFullWidth
          disabled={!isValidCombination || !isInStock}
          className="h-16 rounded-2xl border-2 border-primary-500 text-primary-600 font-bold transition-all duration-300 hover:bg-primary-500 hover:text-white hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(13,148,136,0.3)] active:translate-y-0 group relative overflow-hidden"
          leftIcon={
            <Zap className="w-6 h-6 transition-transform duration-300 group-hover:scale-125 group-hover:animate-pulse" />
          }
        >
          <span className="relative z-10">Buy It Now</span>
          {/* Shine effect */}
          <div className="absolute inset-0 -translate-x-[150%] skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out" />
        </Button>
        {product.type !== 'lens' && currentVariant?.virTryOnUrl && (
          <Button
            variant="outline"
            size="lg"
            isFullWidth
            colorScheme="neutral"
            className="h-16 rounded-2xl border-mint-300 hover:bg-mint-50 px-0"
            leftIcon={<Video className="w-6 h-6 text-primary-500" />}
            onClick={() => setIsTryOnOpen(true)}
          >
            Virtual Try-On
          </Button>
        )}
      </div>

      <button
        onClick={handleChatWithExpert}
        className="flex items-center justify-center gap-2 text-primary-500 font-bold mb-12 hover:underline group transition-all"
      >
        <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
        Chat with an Expert about this frame
      </button>

      {/* Feature Grid - Moved to ProductDetailPage per user request */}
      {/* <div className="grid grid-cols-2 gap-y-6 gap-x-8 pt-8 border-t border-mint-300">
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
          <span className="text-sm text-gray-eyewear font-medium">Easy 3-Day Returns</span>
        </div>
        <div className="flex items-center gap-3">
          <PenTool className="w-5 h-5 text-primary-500" />
          <span className="text-sm text-gray-eyewear font-medium">Prescription Ready</span>
        </div>
      </div> */}

      <LensSelectionModal
        isOpen={isLensModalOpen}
        onClose={() => setIsLensModalOpen(false)}
        onConfirm={handleLensConfirm}
        productName={product.nameBase}
        productImage={currentVariant?.imgs?.[1] || images[1] || ''}
        productType={product.type || 'frame'}
        productPrice={finalPrice}
        productId={productId}
        sku={currentVariant?.sku || ''}
      />

      <VirtualTryOnModal
        isOpen={isTryOnOpen}
        onClose={() => setIsTryOnOpen(false)}
        productName={product.nameBase}
        productImage={currentVariant?.imgs?.[0] || images[0] || ''}
        productPrice={finalPrice}
        virTryOnUrl={currentVariant?.virTryOnUrl}
        variants={product.variants?.filter((v) => !!v.virTryOnUrl)}
        initialVariantIndex={
          product.variants
            ?.filter((v) => !!v.virTryOnUrl)
            .findIndex((v) => v.sku === currentVariant?.sku) ?? 0
        }
        onVariantSelect={(index) => {
          const filtered = product.variants?.filter((v) => !!v.virTryOnUrl) || []
          const variant = filtered[index]
          if (variant) {
            variant.options.forEach((opt) => selectOption(opt.attributeName, opt.value))
          }
        }}
        onAddToCart={(variant) => {
          setIsTryOnOpen(false)
          handleAddToCart(variant)
        }}
        onAddToWishlist={handleToggleWishlist}
        isFavorite={isFavorite}
      />
    </div>
  )
}
