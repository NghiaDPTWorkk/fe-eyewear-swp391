import { Glasses, Loader2, AlertCircle } from 'lucide-react'
import { Card, Button } from '@/shared/components/ui'
import { useGetProductWithType } from '@/shared/hooks/products/useGetProductWithType'
import type { Product } from '@/shared/types/product.types'

interface StepLensChoiceProps {
  onSelect: (lensId: string) => void
}

export default function StepLensChoice({ onSelect }: StepLensChoiceProps) {
  const { products, loading, error } = useGetProductWithType(1, 10, 'lens')

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
            const defaultVariant =
              lens.variants?.find((v: any) => v.isDefault) || lens.variants?.[0]
            const price = lens.defaultVariantFinalPrice || defaultVariant?.finalPrice || 0
            const originalPrice = lens.defaultVariantPrice || defaultVariant?.price || 0
            const id = lens.id || lens._id || lens.skuBase

            return (
              <Card
                key={id}
                onClick={() => onSelect(id)}
                className="group p-6 border-2 border-mint-100 rounded-2xl hover:border-primary-500 hover:bg-primary-50 transition-all text-left flex items-center gap-6 cursor-pointer"
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
                        {price === 0 ? 'FREE' : `$${price.toFixed(2)}`}
                      </span>
                      {price < originalPrice && (
                        <span className="text-xs text-gray-400 line-through">
                          ${originalPrice.toFixed(2)}
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
