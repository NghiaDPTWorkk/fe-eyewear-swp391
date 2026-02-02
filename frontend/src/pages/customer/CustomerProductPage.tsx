import CustomerHeader from '@/components/layout/customer/header/CustomerHeader'
import { useGetProductWithType } from '@/shared/hooks/products/useGetProductWithType'
import { ProductFilters } from '@/shared/components/ui/product-filters'
import { FilterTags, type FilterTag } from '@/shared/components/ui/filter-tags'
import { ProductCard } from '@/shared/components/ui/product-card'

import { ArrowRight } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

// Static data for filters
const categories = [
  { id: 'men', name: 'Men' },
  { id: 'women', name: 'Women' },
  { id: 'unisex', name: 'Unisex' }
]

const priceRanges = [
  { id: 'range1', label: '$20.00 - $50.00', min: 20, max: 50 },
  { id: 'range2', label: '$50.00 - $100.00', min: 50, max: 100 },
  { id: 'range3', label: '$100.00 - $1200.00', min: 100, max: 1200 }
]

const colors = [
  { id: 'black', name: 'Black', hex: '#000000' },
  { id: 'brown', name: 'Brown', hex: '#8B4513' },
  { id: 'red', name: 'Red', hex: '#DC143C' },
  { id: 'gray', name: 'Gray', hex: '#808080' },
  { id: 'white', name: 'White', hex: '#FFFFFF' }
]

export const CustomerProductPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [page, setPage] = useState(1)
  const limit = 12

  const productType = useMemo(() => {
    const path = location.pathname
    if (path === '/eyeglasses') return 'frame'
    if (path === '/sunglasses') return 'sunglass'
    if (path === '/lenses') return 'lens'
    return 'frame'
  }, [location.pathname])

  const [prevType, setPrevType] = useState(productType)
  if (productType !== prevType) {
    setPrevType(productType)
    setPage(1)
  }

  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [customPriceRange, setCustomPriceRange] = useState<{
    min: number | null
    max: number | null
  }>({ min: null, max: null })
  const [priceResetKey, setPriceResetKey] = useState(0)

  // const allProductsData = useGetProductWithPagination(page, limit)
  const typedProductsData = useGetProductWithType(page, limit, productType || '')

  // Select the appropriate data source
  const { products, loading, error, totalPages, currentPage } = typedProductsData

  const canPrev = useMemo(() => currentPage > 1, [currentPage])
  const canNext = useMemo(() => currentPage < totalPages, [currentPage, totalPages])

  // Generate filter tags
  const filterTags = useMemo<FilterTag[]>(() => {
    const tags: FilterTag[] = []

    // Add category tags
    selectedCategories.forEach((catId) => {
      const category = categories.find((c) => c.id === catId)
      if (category) {
        tags.push({ id: `cat-${catId}`, label: category.name, type: 'category' })
      }
    })

    // Add color tags
    selectedColors.forEach((colorId) => {
      const color = colors.find((c) => c.id === colorId)
      if (color) {
        tags.push({ id: `color-${colorId}`, label: color.name, type: 'color' })
      }
    })

    // Add custom price range tag
    if (customPriceRange.min !== null || customPriceRange.max !== null) {
      const minLabel = customPriceRange.min !== null ? `$${customPriceRange.min}` : 'Any'
      const maxLabel = customPriceRange.max !== null ? `$${customPriceRange.max}` : 'Any'
      tags.push({
        id: 'price-custom',
        label: `${minLabel} - ${maxLabel}`,
        type: 'price'
      })
    }

    return tags
  }, [selectedCategories, selectedColors, customPriceRange, categories, colors])

  const handleRemoveTag = (tagId: string) => {
    if (tagId.startsWith('cat-')) {
      const catId = tagId.replace('cat-', '')
      setSelectedCategories((prev) => prev.filter((id) => id !== catId))
    } else if (tagId.startsWith('color-')) {
      const colorId = tagId.replace('color-', '')
      setSelectedColors((prev) => prev.filter((id) => id !== colorId))
    } else if (tagId === 'price-custom') {
      setCustomPriceRange({ min: null, max: null })
      setPriceResetKey((prev) => prev + 1) // Trigger component re-mount
    }
  }

  const handleReset = () => {
    setSelectedCategories([])
    setSelectedPriceRanges([])
    setSelectedColors([])
    setCustomPriceRange({ min: null, max: null })
    setPriceResetKey((prev) => prev + 1) // Trigger component re-mount
  }

  const handleCustomPriceApply = (min: number | null, max: number | null) => {
    setCustomPriceRange({ min, max })
  }

  return (
    <div className="min-h-screen bg-mint-100">
      <CustomerHeader />
      <section className="py-10 bg-mint-100">
        <div className="container mx-auto px-4">
          <div className="flex gap-6">
            {/* Filter Sidebar */}
            <aside className="w-64 flex-shrink-0 sticky top-20 self-start">
              <ProductFilters
                categories={categories}
                selectedCategories={selectedCategories}
                onCategoryChange={setSelectedCategories}
                priceRanges={priceRanges}
                selectedPriceRanges={selectedPriceRanges}
                onPriceRangeChange={setSelectedPriceRanges}
                onCustomPriceApply={handleCustomPriceApply}
                priceResetKey={priceResetKey}
                colors={colors}
                selectedColors={selectedColors}
                onColorChange={setSelectedColors}
              />
            </aside>

            {/* Product Grid */}
            <div className="flex-1">
              {/* Filter Tags */}
              {filterTags.length > 0 && (
                <div className="mb-6">
                  <FilterTags
                    tags={filterTags}
                    onRemoveTag={handleRemoveTag}
                    onClearAll={handleReset}
                  />
                </div>
              )}

              {loading ? (
                <div className="text-center text-gray-eyewear py-10">Loading products...</div>
              ) : error ? (
                <div className="text-center text-red-600 py-10">Failed to load products.</div>
              ) : products.length === 0 ? (
                <div className="text-center text-gray-eyewear py-10">No products found.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product, index) => {
                    // Mock: Add sale to every 3rd product
                    const hasSale = index % 3 === 0

                    // Extract price - handle type safety
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const productAny = product as any
                    const originalPrice = productAny.defaultVariantPrice || 100
                    const currentPrice = productAny.defaultVariantFinalPrice || originalPrice

                    // Only set discount if there's actually a sale
                    const discountPrice = hasSale ? currentPrice : undefined
                    const salePercent = hasSale ? 20 : undefined

                    return (
                      <ProductCard
                        key={productAny.id || `product-${index}`}
                        id={productAny.id || `product-${index}`}
                        name={product.nameBase}
                        brand={product.brand || undefined}
                        image={productAny.defaultVariantImage || undefined}
                        price={originalPrice}
                        discountPrice={discountPrice}
                        salePercent={salePercent}
                        onClick={(id) => navigate(`/products/${id}`)}
                      />
                    )
                  })}
                </div>
              )}

              {/* Pagination */}
              <div className="flex items-center justify-center gap-4 mt-10">
                <button
                  className="px-4 py-2 rounded-xl border-2 border-mint-300 bg-white text-mint-1200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-mint-200 transition-all"
                  disabled={!canPrev || loading}
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                >
                  Prev
                </button>

                <div className="text-sm text-gray-eyewear">
                  Page <span className="font-semibold text-mint-1200">{currentPage}</span> /{' '}
                  <span className="font-semibold text-mint-1200">{totalPages || 1}</span>
                </div>

                <button
                  className="px-4 py-2 rounded-xl border-2 border-mint-300 bg-white text-mint-1200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-mint-200 transition-all inline-flex items-center gap-2"
                  disabled={!canNext || loading}
                  onClick={() => setPage((prev) => prev + 1)}
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
