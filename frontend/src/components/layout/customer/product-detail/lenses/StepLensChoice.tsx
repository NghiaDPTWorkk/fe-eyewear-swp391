import { useState } from 'react'
import { Glasses, Loader2, AlertCircle, ArrowLeft, Check } from 'lucide-react'
import { VNDPrice } from '@/shared/components/ui/vnd-price/VNDPrice'
import { Card, Button } from '@/shared/components/ui-core'
import { useGetProductWithType } from '@/shared/hooks/products/useGetProductWithType'
import { productService } from '@/shared/services/products/productService'
import type { Product } from '@/shared/types/product.types'

interface StepLensChoiceProps {
  onSelect: (lensId: string, lensSku: string) => void
}

export default function StepLensChoice({ onSelect }: StepLensChoiceProps) {
  const { products, loading, error } = useGetProductWithType(1, 10, 'lens')
  const [selectingId, setSelectingId] = useState<string | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-500">
        <Loader2 className="w-12 h-12 text-primary-500 animate-spin mb-4" />
        <p className="text-gray-eyewear font-medium animate-pulse">
          Bringing you the best lenses...
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-500">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-lg font-bold text-mint-1200 mb-2">Oops! Something went wrong</h3>
        <p className="text-gray-eyewear max-w-xs mb-6">
          We couldn't load the lens options right now. Please try again.
        </p>
        <Button onClick={() => window.location.reload()} variant="outline" size="sm">
          Retry Selection
        </Button>
      </div>
    )
  }

  const handleProductSelect = async (lens: Product) => {
    const id = lens._id || lens.id
    if (!id || selectingId) return

    setSelectingId(id)
    try {
      const response = await productService.getProductDetail(id)
      const fullProduct = response.data.product
      if (fullProduct.variants && fullProduct.variants.length > 1) {
        setSelectedProduct(fullProduct)
      } else {
        // If only one variant, auto select
        const variant = fullProduct.variants?.[0]
        const finalSku = variant?.sku || fullProduct.sku || fullProduct.skuBase
        onSelect(id, finalSku)
      }
    } catch (err) {
      console.error('Error fetching product variants:', err)
      // ec ec auto-select with whatever SKU we have if detail fetch fails
      const defaultVariant = lens.variants?.find((v: any) => v.isDefault) || lens.variants?.[0]
      const fallbackSku = defaultVariant?.sku || lens.sku || lens.skuBase || ''
      onSelect(id, fallbackSku)
    } finally {
      setSelectingId(null)
    }
  }

  if (selectedProduct) {
    return (
      <div className="animate-in fade-in slide-in-from-right-4 duration-500">
        <button
          onClick={() => setSelectedProduct(null)}
          className="flex items-center gap-2 text-primary-500 font-bold mb-6 hover:text-primary-600 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to lenses
        </button>

        <div className="mb-8">
          <h2 className="text-3xl font-heading font-bold text-mint-1200 mb-2">
            Select your {selectedProduct.nameBase}
          </h2>
          <p className="text-gray-eyewear"> Choose the specific options that fit your needs.</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {selectedProduct.variants?.map((variant: any, index: number) => {
            const variantId = selectedProduct._id || selectedProduct.id
            const variantSku = variant.sku
            const price = variant.finalPrice
            const originalPrice = variant.price

            // Pick image: 2nd image if exists, otherwise 1st, otherwise null
            const variantImage =
              variant.imgs?.length >= 2
                ? variant.imgs[1]
                : variant.imgs?.length === 1
                  ? variant.imgs[0]
                  : null

            return (
              <Card
                key={variantSku || index}
                onClick={() => onSelect(variantId, variantSku)}
                className="group p-6 border-2 border-mint-100 rounded-2xl hover:border-primary-500 hover:bg-primary-50 transition-all text-left flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
                    {variantImage ? (
                      <img
                        src={variantImage}
                        alt={variant.name}
                        className="w-full h-full object-cover mix-blend-multiply"
                      />
                    ) : (
                      <Check className="w-6 h-6 text-primary-500" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-mint-1200 text-lg uppercase tracking-tight">
                      {variant.name ||
                        variant.options?.map((opt: any) => opt.label).join(' - ') ||
                        `Option ${index + 1}`}
                    </h4>
                    <p className="text-sm text-gray-eyewear mt-1">
                      {variant.stock > 0 ? 'In stock' : 'Out of stock'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-primary-600 block text-lg">
                    {price === 0 ? 'MIỄN PHÍ' : <VNDPrice amount={price} />}
                  </span>
                  {price < originalPrice && (
                    <span className="text-xs text-gray-400 line-through">
                      <VNDPrice amount={originalPrice} />
                    </span>
                  )}
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <h2 className="text-3xl font-heading font-bold text-mint-1200 mb-2">Choose your lenses</h2>
      <p className="text-gray-eyewear mb-10">Select the perfect lenses for your vision needs.</p>

      <div className="grid grid-cols-1 gap-4">
        {products.length === 0 ? (
          <div className="text-center py-12 bg-mint-50 rounded-3xl border-2 border-dashed border-mint-200">
            <p className="text-gray-eyewear font-medium">
              No lens options available at the moment.
            </p>
          </div>
        ) : (
          products.map((lens: Product) => {
            const id = lens._id || lens.id || lens.skuBase
            const defaultVariant =
              lens.variants?.find((v: any) => v.isDefault) || lens.variants?.[0]
            const price = lens.defaultVariantFinalPrice || defaultVariant?.finalPrice || 0
            const originalPrice = lens.defaultVariantPrice || defaultVariant?.price || 0

            return (
              <Card
                key={id}
                onClick={() => handleProductSelect(lens)}
                className={`group p-6 border-2 rounded-2xl transition-all text-left flex items-center gap-6 cursor-pointer ${
                  selectingId === id
                    ? 'border-primary-500 bg-primary-50 animate-pulse'
                    : 'border-mint-100 hover:border-primary-500 hover:bg-primary-50'
                }`}
              >
                <div className="w-16 h-16 bg-mint-100 rounded-xl flex items-center justify-center group-hover:bg-primary-100 transition-colors shrink-0 overflow-hidden">
                  {lens.defaultVariantImage || lens.imageUrl ? (
                    <img
                      src={lens.defaultVariantImage || lens.imageUrl}
                      alt={lens.nameBase}
                      className="w-full h-full object-cover mix-blend-multiply"
                    />
                  ) : (
                    <Glasses className="w-8 h-8 text-primary-500" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-mint-1200 text-lg uppercase tracking-tight">
                        {lens.nameBase}
                      </h4>
                      {lens.nameVariant && (
                        <p className="text-xs text-gray-400 font-bold uppercase">
                          {lens.nameVariant}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-primary-600 block text-lg">
                        {price === 0 ? 'MIỄN PHÍ' : <VNDPrice amount={price} />}
                      </span>
                      {price < originalPrice && (
                        <span className="text-xs text-gray-400 line-through">
                          <VNDPrice amount={originalPrice} />
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-eyewear mt-1 max-w-md line-clamp-2">
                    {lens.description ||
                      lens.shortDescription ||
                      'High-quality optical lenses tailored for your vision.'}
                  </p>
                </div>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
