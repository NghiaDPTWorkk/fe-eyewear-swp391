import CustomerHeader from '@/components/layout/customer/header/CustomerHeader'
import { useFilteredProducts } from '@/shared/hooks/products/useFilteredProducts'
import { useProductSpecs } from '@/shared/hooks/products/useProductSpecs'

import { ProductFilters } from '@/shared/components/ui/product-filters'
import { FilterTags, type FilterTag } from '@/shared/components/ui/filter-tags'
import { ProductCard } from '@/shared/components/ui/product-card'

import { X, Loader2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { OperationPagination } from '@/shared/components/ui/pagination'

// Static data for filters
const priceRanges = [
  { id: 'range1', label: 'Under 500.000đ', min: 0, max: 500000 },
  { id: 'range2', label: '500.000đ - 1.000.000đ', min: 500000, max: 1000000 },
  { id: 'range3', label: '1.000.000đ - 2.000.000đ', min: 1000000, max: 2000000 },
  { id: 'range4', label: '2.000.000đ - 5.000.000đ', min: 2000000, max: 5000000 },
  { id: 'range5', label: 'Above 5.000.000đ', min: 5000000, max: 50000000 }
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
  const [selectedGenders, setSelectedGenders] = useState<string[]>([])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([])
  const [selectedShapes, setSelectedShapes] = useState<string[]>([])
  const [selectedStyles, setSelectedStyles] = useState<string[]>([])
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([])
  const [customPriceRange, setCustomPriceRange] = useState<{
    min: number | null
    max: number | null
  }>({ min: null, max: null })
  const [priceResetKey, setPriceResetKey] = useState(0)

  // Fetch product specs for dynamic filters
  const { specs } = useProductSpecs()

  // Reset page when any filter changes
  const handleFilterChange = <T,>(setter: React.Dispatch<React.SetStateAction<T>>, value: T) => {
    setter(value)
    setPage(1)
  }

  const { minPrice, maxPrice } = useMemo(() => {
    let min: number | undefined = undefined
    let max: number | undefined = undefined

    if (customPriceRange.min !== null || customPriceRange.max !== null) {
      return {
        minPrice: customPriceRange.min !== null ? customPriceRange.min : undefined,
        maxPrice: customPriceRange.max !== null ? customPriceRange.max : undefined
      }
    }

    if (selectedPriceRanges.length > 0) {
      selectedPriceRanges.forEach((rangeId) => {
        const range = priceRanges.find((r) => r.id === rangeId)
        if (range) {
          if (min === undefined || range.min < min) min = range.min
          if (max === undefined || range.max > max) max = range.max
        }
      })
    }

    return { minPrice: min, maxPrice: max }
  }, [selectedPriceRanges, customPriceRange])

  // Single unified hook for fetching products with all filters
  const { products, loading, error, totalPages, currentPage } = useFilteredProducts({
    page,
    limit,
    type: productType,
    search: searchQuery || undefined,
    brand: selectedBrands.length > 0 ? selectedBrands : undefined,
    material: selectedMaterials.length > 0 ? selectedMaterials : undefined,
    shape: selectedShapes.length > 0 ? selectedShapes : undefined,
    style: selectedStyles.length > 0 ? selectedStyles : undefined,
    gender: selectedGenders.length > 0 ? selectedGenders : undefined,
    categories: selectedCategories.length > 0 ? selectedCategories : undefined,
    minPrice,
    maxPrice
  })

  const handleClearSearch = () => {
    setSearchParams({})
    setPage(1)
  }

  // Generate filter tags
  const filterTags = useMemo<FilterTag[]>(() => {
    const tags: FilterTag[] = []

    // Add category tags
    selectedCategories.forEach((catId) => {
      const category = specs?.categories.find((c) => c._id === catId)
      if (category) {
        tags.push({ id: `cat-${catId}`, label: category.name, type: 'category' })
      }
    })

    // Add gender tags
    const seenGenders = new Set<string>()
    selectedGenders.forEach((gender) => {
      const label = GENDER_MAP[gender] || gender
      const lowerLabel = label.toLowerCase().trim()
      if (!seenGenders.has(lowerLabel)) {
        tags.push({ id: `gender-${gender}`, label, type: 'gender' })
        seenGenders.add(lowerLabel)
      }
    })

    // Add brand tags
    const seenBrands = new Set<string>()
    selectedBrands.forEach((brand) => {
      const lowerBrand = brand.toLowerCase().trim()
      if (!seenBrands.has(lowerBrand)) {
        tags.push({ id: `brand-${brand}`, label: brand, type: 'brand' })
        seenBrands.add(lowerBrand)
      }
    })

    // Add material tags
    const seenMaterials = new Set<string>()
    selectedMaterials.forEach((material) => {
      const lowerMaterial = material.toLowerCase().trim()
      if (!seenMaterials.has(lowerMaterial)) {
        tags.push({ id: `material-${material}`, label: material, type: 'material' })
        seenMaterials.add(lowerMaterial)
      }
    })

    // Add shape tags
    const seenShapes = new Set<string>()
    selectedShapes.forEach((shape) => {
      const lowerShape = shape.toLowerCase().trim()
      if (!seenShapes.has(lowerShape)) {
        tags.push({ id: `shape-${shape}`, label: shape, type: 'shape' })
        seenShapes.add(lowerShape)
      }
    })

    // Add style tags
    const seenStyles = new Set<string>()
    selectedStyles.forEach((style) => {
      const lowerStyle = style.toLowerCase().trim()
      if (!seenStyles.has(lowerStyle)) {
        tags.push({ id: `style-${style}`, label: style, type: 'style' })
        seenStyles.add(lowerStyle)
      }
    })

    // Add preset price range tags
    selectedPriceRanges.forEach((rangeId) => {
      const range = priceRanges.find((r) => r.id === rangeId)
      if (range) {
        tags.push({ id: `price-preset-${rangeId}`, label: range.label, type: 'price' })
      }
    })

    // Add custom price range tag
    if (customPriceRange.min !== null || customPriceRange.max !== null) {
      const minLabel =
        customPriceRange.min !== null ? customPriceRange.min.toLocaleString('vi-VN') + 'đ' : 'Any'
      const maxLabel =
        customPriceRange.max !== null ? customPriceRange.max.toLocaleString('vi-VN') + 'đ' : 'Any'
      tags.push({
        id: 'price-custom',
        label: `${minLabel} - ${maxLabel}`,
        type: 'price'
      })
    }

    return tags
  }, [
    selectedCategories,
    selectedGenders,
    selectedBrands,
    selectedMaterials,
    selectedShapes,
    selectedStyles,
    selectedPriceRanges,
    customPriceRange,
    specs
  ])

  const handleRemoveTag = (tagId: string) => {
    if (tagId.startsWith('cat-')) {
      const catId = tagId.replace('cat-', '')
      handleFilterChange(
        setSelectedCategories,
        selectedCategories.filter((id) => id !== catId)
      )
    } else if (tagId.startsWith('gender-')) {
      const gender = tagId.replace('gender-', '')
      const targetLabel = (GENDER_MAP[gender] || gender).toLowerCase().trim()
      handleFilterChange(
        setSelectedGenders,
        selectedGenders.filter((g) => (GENDER_MAP[g] || g).toLowerCase().trim() !== targetLabel)
      )
    } else if (tagId.startsWith('brand-')) {
      const brand = tagId.replace('brand-', '').toLowerCase().trim()
      handleFilterChange(
        setSelectedBrands,
        selectedBrands.filter((b) => b.toLowerCase().trim() !== brand)
      )
    } else if (tagId.startsWith('material-')) {
      const material = tagId.replace('material-', '').toLowerCase().trim()
      handleFilterChange(
        setSelectedMaterials,
        selectedMaterials.filter((m) => m.toLowerCase().trim() !== material)
      )
    } else if (tagId.startsWith('shape-')) {
      const shape = tagId.replace('shape-', '').toLowerCase().trim()
      handleFilterChange(
        setSelectedShapes,
        selectedShapes.filter((s) => s.toLowerCase().trim() !== shape)
      )
    } else if (tagId.startsWith('style-')) {
      const style = tagId.replace('style-', '').toLowerCase().trim()
      handleFilterChange(
        setSelectedStyles,
        selectedStyles.filter((s) => s.toLowerCase().trim() !== style)
      )
    } else if (tagId.startsWith('price-preset-')) {
      const rangeId = tagId.replace('price-preset-', '')
      handlePriceRangeChange(selectedPriceRanges.filter((id) => id !== rangeId))
    } else if (tagId === 'price-custom') {
      handleCustomPriceApply(null, null)
      setPriceResetKey((prev) => prev + 1)
    }
  }

  const handleReset = () => {
    setSelectedCategories([])
    setSelectedGenders([])
    setSelectedBrands([])
    setSelectedMaterials([])
    setSelectedShapes([])
    setSelectedStyles([])
    setSelectedPriceRanges([])
    setCustomPriceRange({ min: null, max: null })
    setPriceResetKey((prev) => prev + 1)
    setPage(1)
  }

  const handleCustomPriceApply = (min: number | null, max: number | null) => {
    setCustomPriceRange({ min, max })
    setSelectedPriceRanges([]) // Clear presets when custom range is applied
    setPage(1)
  }

  const handlePriceRangeChange = (rangeIds: string[]) => {
    setSelectedPriceRanges(rangeIds)
    if (rangeIds.length > 0) {
      setCustomPriceRange({ min: null, max: null }) // Clear custom range when preset is selected
    }
    setPage(1)
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
                categories={specs?.categories || []}
                selectedCategories={selectedCategories}
                onCategoryChange={(v: string[]) => handleFilterChange(setSelectedCategories, v)}
                genders={specs?.genders || []}
                selectedGenders={selectedGenders}
                onGenderChange={(v: string[]) => handleFilterChange(setSelectedGenders, v)}
                brands={specs?.brands || []}
                selectedBrands={selectedBrands}
                onBrandChange={(v: string[]) => handleFilterChange(setSelectedBrands, v)}
                materials={specs?.materials || []}
                selectedMaterials={selectedMaterials}
                onMaterialChange={(v: string[]) => handleFilterChange(setSelectedMaterials, v)}
                shapes={specs?.shapes || []}
                selectedShapes={selectedShapes}
                onShapeChange={(v: string[]) => handleFilterChange(setSelectedShapes, v)}
                styles={specs?.styles || []}
                selectedStyles={selectedStyles}
                onStyleChange={(v: string[]) => handleFilterChange(setSelectedStyles, v)}
                priceRanges={priceRanges}
                selectedPriceRanges={selectedPriceRanges}
                onPriceRangeChange={handlePriceRangeChange}
                onCustomPriceApply={handleCustomPriceApply}
                priceResetKey={priceResetKey}
              />
            </aside>

            {/* Product Grid */}
            <div className="flex-1">
              {/* Search Results Header */}
              {searchQuery && (
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
                  {products.map((product) => {
                    const originalPrice = product.defaultVariantPrice || 0
                    const finalPrice = product.defaultVariantFinalPrice || originalPrice

                    // Determine if there is a sale based on price difference
                    const hasActualSale = originalPrice > finalPrice && finalPrice > 0
                    const salePercentValue = hasActualSale
                      ? Math.round(((originalPrice - finalPrice) / originalPrice) * 100)
                      : undefined

                    return (
                      <ProductCard
                        key={product.id || product._id}
                        id={product.id || product._id || ''}
                        name={product.nameBase}
                        brand={product.brand || undefined}
                        image={product.defaultVariantImage || undefined}
                        price={originalPrice}
                        discountPrice={hasActualSale ? finalPrice : undefined}
                        salePercent={salePercentValue}
                        onClick={(id) => navigate(`/products/${id}`)}
                      />
                    )
                  })}
                </div>
              )}

              {/* Pagination */}
              <div className="mt-10">
                <OperationPagination
                  page={currentPage}
                  totalPages={totalPages}
                  total={products.length > 0 ? totalPages * limit : 0} // Approximate total or use actual total if available
                  limit={limit}
                  onPageChange={setPage}
                  itemsOnPage={products.length}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
