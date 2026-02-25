import CustomerHeader from '@/components/layout/customer/header/CustomerHeader'
import { useGetProductWithType } from '@/shared/hooks/products/useGetProductWithType'
import { useSearchProducts } from '@/shared/hooks/products/useSearchProducts'
import { useProductSpecs } from '@/shared/hooks/products/useProductSpecs'
import { ProductFilters } from '@/shared/components/ui/product-filters'
import { FilterTags, type FilterTag } from '@/shared/components/ui/filter-tags'
import { ProductCard } from '@/shared/components/ui/product-card'

import { ArrowRight, X, Loader2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'

// Static data for filters
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

// Gender mapping from API codes to labels
const GENDER_MAP: Record<string, string> = {
  M: 'Men',
  F: 'Women',
  N: 'Non-binary',
  unisex: 'Unisex'
}

export const CustomerProductPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()
  const [page, setPage] = useState(1)
  const limit = 12

  // Read search query from URL
  const searchQuery = searchParams.get('search') || ''

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

  // Reset page when search query changes
  const [prevSearch, setPrevSearch] = useState(searchQuery)
  if (searchQuery !== prevSearch) {
    setPrevSearch(searchQuery)
    setPage(1)
  }

  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([])
  const [selectedShapes, setSelectedShapes] = useState<string[]>([])
  const [selectedStyles, setSelectedStyles] = useState<string[]>([])
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [customPriceRange, setCustomPriceRange] = useState<{
    min: number | null
    max: number | null
  }>({ min: null, max: null })
  const [priceResetKey, setPriceResetKey] = useState(0)

  // Fetch product specs for dynamic filters
  const { specs } = useProductSpecs()

  // Build gender categories from specs
  const categories = useMemo(() => {
    if (!specs?.genders) return []
    return specs.genders.map((g) => ({
      id: g,
      name: GENDER_MAP[g] || g
    }))
  }, [specs])

  // search hook when search is active, otherwise use type-based hook
  const typedProductsData = useGetProductWithType(page, limit, productType || '')
  const searchProductsData = useSearchProducts(page, limit, searchQuery)

  const isSearching = searchQuery.trim().length > 0

  // Select the appropriate data source
  const { products, loading, error, totalPages, currentPage } = isSearching
    ? searchProductsData
    : typedProductsData

  const handleClearSearch = () => {
    setSearchParams({})
    setPage(1)
  }

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

    // Add brand tags
    selectedBrands.forEach((brand) => {
      tags.push({ id: `brand-${brand}`, label: brand, type: 'brand' })
    })

    // Add material tags
    selectedMaterials.forEach((material) => {
      tags.push({ id: `material-${material}`, label: material, type: 'material' })
    })

    // Add shape tags
    selectedShapes.forEach((shape) => {
      tags.push({ id: `shape-${shape}`, label: shape, type: 'shape' })
    })

    // Add style tags
    selectedStyles.forEach((style) => {
      tags.push({ id: `style-${style}`, label: style, type: 'style' })
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
  }, [
    selectedCategories,
    selectedBrands,
    selectedMaterials,
    selectedShapes,
    selectedStyles,
    selectedColors,
    customPriceRange,
    categories
  ])

  const handleRemoveTag = (tagId: string) => {
    if (tagId.startsWith('cat-')) {
      const catId = tagId.replace('cat-', '')
      setSelectedCategories((prev) => prev.filter((id) => id !== catId))
    } else if (tagId.startsWith('brand-')) {
      const brand = tagId.replace('brand-', '')
      setSelectedBrands((prev) => prev.filter((b) => b !== brand))
    } else if (tagId.startsWith('material-')) {
      const material = tagId.replace('material-', '')
      setSelectedMaterials((prev) => prev.filter((m) => m !== material))
    } else if (tagId.startsWith('shape-')) {
      const shape = tagId.replace('shape-', '')
      setSelectedShapes((prev) => prev.filter((s) => s !== shape))
    } else if (tagId.startsWith('style-')) {
      const style = tagId.replace('style-', '')
      setSelectedStyles((prev) => prev.filter((s) => s !== style))
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
    setSelectedBrands([])
    setSelectedMaterials([])
    setSelectedShapes([])
    setSelectedStyles([])
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
                brands={specs?.brands || []}
                selectedBrands={selectedBrands}
                onBrandChange={setSelectedBrands}
                materials={specs?.materials || []}
                selectedMaterials={selectedMaterials}
                onMaterialChange={setSelectedMaterials}
                shapes={specs?.shapes || []}
                selectedShapes={selectedShapes}
                onShapeChange={setSelectedShapes}
                styles={specs?.styles || []}
                selectedStyles={selectedStyles}
                onStyleChange={setSelectedStyles}
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
              {/* Search Results Header */}
              {isSearching && (
                <div className="mb-6 flex items-center gap-3">
                  <h2 className="text-lg font-semibold text-mint-1200">
                    Results for &ldquo;{searchQuery}&rdquo;
                  </h2>
                  <button
                    onClick={handleClearSearch}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-mint-300 text-sm text-mint-1200 hover:bg-mint-400 transition-colors"
                  >
                    <X className="w-3 h-3" />
                    Clear
                  </button>
                </div>
              )}

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
                <div className="flex flex-col items-center justify-center py-20">
                  <Loader2 className="w-10 h-10 animate-spin text-primary-500 mb-4" />
                  <p className="text-gray-eyewear">Loading products...</p>
                </div>
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
