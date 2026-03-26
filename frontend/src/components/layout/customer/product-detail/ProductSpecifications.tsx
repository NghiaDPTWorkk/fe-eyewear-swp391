import type { Product } from '@/shared/types/product.types'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { VNDPrice } from '@/shared/components/ui/vnd-price/VNDPrice'
import type { UseProductVariantsReturn } from '@/shared/hooks/products/useProductVariants'
import type { Variant } from '@/shared/types'

interface ProductSpecificationsProps {
  product: Product
  variantState?: UseProductVariantsReturn
  className?: string
}

type TabType = 'details' | 'variants'

export const ProductSpecifications = ({
  product,
  variantState,
  className
}: ProductSpecificationsProps) => {
  const { spec, type, brand, nameBase, description, variants } = product
  const [activeTab, setActiveTab] = useState<TabType>('details')

  const handleVariantClick = (v: Variant) => {
    if (variantState) {
      v.options.forEach((opt) => {
        variantState.selectOption(opt.attributeName, opt.value)
      })
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  if (!spec && !brand && !description && (!variants || variants.length === 0)) return null

  const capitalize = (text: string | number | string[]) => {
    if (typeof text === 'number') return text
    const str = Array.isArray(text) ? text.join(', ') : text
    // Only capitalize if it's purely alphabetical (with commas/spaces)
    if (!/^[a-zA-Z,\s]+$/.test(str)) return str

    return str
      .split(/[,\s]+/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(', ')
  }

  const renderSpecItem = (label: string, value: string | number | string[] | null | undefined) => {
    if (value === null || value === undefined || (Array.isArray(value) && value.length === 0))
      return null

    return (
      <div className="flex flex-col sm:flex-row sm:items-center py-4 border-b border-mint-100 last:border-0">
        <span className="sm:w-1/3 text-[11px] font-bold text-mint-1200 uppercase tracking-widest mb-1 sm:mb-0">
          {label}
        </span>
        <span className="sm:w-2/3 text-gray-eyewear text-sm font-medium">{capitalize(value)}</span>
      </div>
    )
  }

  const tabs: { id: TabType; label: string }[] = [
    { id: 'details', label: 'Details' },
    { id: 'variants', label: 'Available Variants' }
  ]

  return (
    <section className={cn('bg-mint-50/50 pb-24 pt-16', className)}>
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Tab Headers */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex p-1.5 bg-white rounded-2xl shadow-sm border border-mint-100">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'px-8 py-3 rounded-xl text-sm font-bold uppercase tracking-wider transition-all duration-300',
                    activeTab === tab.id
                      ? 'bg-primary-500 text-white shadow-md'
                      : 'text-gray-eyewear hover:text-primary-500 hover:bg-mint-50'
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white border border-mint-100 rounded-[3rem] p-8 md:p-14 shadow-xl shadow-mint-200/50 relative overflow-hidden group">
            {/* Background decorative glows */}
            <div className="absolute -top-32 -right-32 w-80 h-80 bg-primary-50/40 blur-3xl rounded-full pointer-events-none transition-colors duration-700 group-hover:bg-primary-100/40" />
            <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-mint-100/30 blur-3xl rounded-full pointer-events-none transition-colors duration-700 group-hover:bg-primary-100/30" />

            {activeTab === 'details' && (
              <div className="relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
                  {/* Left Column: Description */}
                  <div>
                    <h3 className="text-2xl font-heading font-bold text-mint-1200 mb-6 flex items-center gap-3">
                      <span className="w-8 h-1 bg-primary-500 rounded-full" />
                      Product Description
                    </h3>
                    <div className="prose prose-sm prose-mint">
                      <p className="text-gray-eyewear leading-relaxed text-base italic mb-6">
                        {description || 'No detailed description available for this product yet.'}
                      </p>
                      <p className="text-gray-eyewear/80 text-sm leading-relaxed">
                        Crafted with precision and designed for comfort, {nameBase} represents our
                        commitment to quality eyewear. Each piece is inspected to meet our high
                        standards.
                      </p>
                    </div>
                  </div>

                  {/* Right Column: Specs */}
                  <div>
                    <h3 className="text-2xl font-heading font-bold text-mint-1200 mb-6 flex items-center gap-3">
                      <span className="w-8 h-1 bg-primary-500 rounded-full" />
                      Specifications
                    </h3>
                    <div className="bg-mint-50/50 rounded-2xl p-6 border border-mint-100">
                      {brand && renderSpecItem('Brand', brand)}
                      {type && renderSpecItem('Product Type', type)}

                      {type !== 'lens' && spec && (
                        <>
                          {renderSpecItem('Material', (spec as any).material)}
                          {renderSpecItem('Shape', (spec as any).shape)}
                          {renderSpecItem('Gender', (spec as any).gender)}
                          {(spec as any).dimensions &&
                            renderSpecItem(
                              'Dimensions',
                              `${(spec as any).dimensions.width} x ${(spec as any).dimensions.height} x ${(spec as any).dimensions.depth} mm`
                            )}
                        </>
                      )}

                      {type === 'lens' && spec && (
                        <>
                          {renderSpecItem('Features', (spec as any).feature)}
                          {renderSpecItem('Origin', (spec as any).origin)}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'variants' && (
              <div className="relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-2xl font-heading font-bold text-mint-1200 mb-8 flex items-center gap-3 text-center justify-center">
                  Available Models & Styles
                </h3>

                {variants && variants.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {variants.map((v) => (
                      <div
                        key={v.sku}
                        onClick={() => handleVariantClick(v)}
                        // className="group/card bg-mint-50/50 border border-mint-100 rounded-2xl p-4 transition-all hover:bg-white hover:shadow-lg hover:shadow-mint-200/50 group-hover:scale-[1.02]"
                        className={cn(
                          'group/card bg-mint-50/50 border border-mint-100 rounded-2xl p-4 transition-all hover:bg-white hover:shadow-lg hover:shadow-mint-200/50 group-hover:scale-[1.02] cursor-pointer',
                          variantState?.currentVariant?.sku === v.sku &&
                            'border-primary-500 bg-white ring-2 ring-primary-100'
                        )}
                      >
                        <div className="aspect-[4/3] bg-white rounded-xl mb-4 overflow-hidden border border-mint-100">
                          <img
                            src={v.imgs?.[0] || v.imgs?.[1]}
                            alt={v.name || nameBase}
                            className="w-full h-full object-contain p-4 group-hover/card:scale-110 transition-transform duration-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between items-start gap-2">
                            <h4
                              className="font-bold text-mint-1200 text-sm truncate"
                              title={v.name || 'Standard Edition'}
                            >
                              {v.name || 'Standard Edition'}
                            </h4>
                            <span
                              className={cn(
                                'px-2 py-1 rounded-md text-[9px] font-bold uppercase whitespace-nowrap flex-shrink-0',
                                v.stock > 0
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-red-100 text-red-700'
                              )}
                            >
                              {v.stock > 0 ? 'In Stock' : 'Out of Stock'}
                            </span>
                          </div>
                          <p className="text-[10px] text-gray-eyewear/60 font-medium uppercase tracking-wider truncate">
                            SKU: {v.sku}
                          </p>
                          <div className="flex gap-2 flex-wrap pt-1">
                            {v.options.map((opt) => (
                              <span
                                key={opt.attributeName}
                                className="text-[10px] bg-white border border-mint-200 px-2 py-0.5 rounded-full text-gray-eyewear font-medium"
                              >
                                {opt.label}
                              </span>
                            ))}
                          </div>
                          <div className="pt-2 flex justify-between items-center border-t border-mint-100 mt-2">
                            <span className="text-primary-600 font-bold text-sm">
                              <VNDPrice amount={v.finalPrice ?? v.price} />
                            </span>
                            {v.isDefault && (
                              <span className="text-[10px] text-gray-400 italic font-medium px-2 py-0.5 bg-mint-50 rounded-full border border-mint-100">
                                Official Variant
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 bg-mint-50/50 rounded-3xl border border-dashed border-mint-200">
                    <p className="text-gray-eyewear font-medium">
                      No other variants available for this product.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
