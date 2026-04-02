import { useMemo, useState, useRef, useEffect } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useFilteredProducts } from '@/shared/hooks/products/useFilteredProducts'
import { useProductSpecs } from '@/shared/hooks/products/useProductSpecs'
import { OperationPagination } from '@/shared/components/ui/pagination'
import { CategoryHero } from '@/shared/components/ui/category-hero'
import { HorizontalFilters } from '@/shared/components/ui/horizontal-filters'
import { ProductCard } from '@/shared/components/ui/product-card'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { cn } from '@/lib/utils'

// Static data for filters
const priceRanges = [
  { id: 'range1', label: 'Under 500.000đ', min: 0, max: 500000 },
  { id: 'range2', label: '500.000đ - 1.000.000đ', min: 500000, max: 1000000 },
  { id: 'range3', label: '1.000.000đ - 2.000.000đ', min: 1000000, max: 2000000 },
  { id: 'range4', label: '2.000.000đ - 5.000.000đ', min: 2000000, max: 5000000 },
  { id: 'range5', label: 'Above 5.000.000đ', min: 5000000, max: 50000000 }
]

// Banner mapping for different pages
const CATEGORY_HEROES = {
  frame: {
    name: 'Eyeglasses',
    subtitle: 'Classic Heritage',
    description:
      'A blend of timeless silhouettes and modern craftsmanship. Discover frames that define your professional and artistic identity.',
    image: '/images/banners/eyeglasses_hero.png'
  },
  sunglass: {
    name: 'Sunglasses',
    subtitle: 'Horizon Vision',
    description:
      'Precision lenses for every sun-soaked adventure. Protect your eyes with iconic designs that never compromise on clarity.',
    image: '/images/banners/sunglasses_hero.png'
  },
  lens: {
    name: 'Lenses',
    subtitle: 'Clarity Redefined',
    description:
      'Advanced optical technology for sharper focus. High-index and blue-cut treatments designed for the digital world.',
    image: '/images/banners/lenses_hero.png'
  }
}

export const CustomerProductPage = () => {
  const collectionRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()
  const [page, setPage] = useState(1)
  const limit = 12

  // Read search query from URL
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '')
  const debouncedSearch = useDebounce(searchInput, 400)

  // Sync debounced search back to searchParams
  useEffect(() => {
    const currentSearch = searchParams.get('search') || ''
    if (debouncedSearch !== currentSearch) {
      setSearchParams(debouncedSearch ? { search: debouncedSearch } : {}, {
        replace: true,
        preventScrollReset: true
      })
      setPage(1)
    }
  }, [debouncedSearch, setSearchParams, searchParams])

  // Sync searchInput when URL searchParams changes (e.g., from external navigate)
  const searchQuery = searchParams.get('search') || ''
  useEffect(() => {
    setSearchInput(searchQuery)
  }, [searchQuery])

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
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([])
  const [customPriceRange, setCustomPriceRange] = useState<{
    min: number | null
    max: number | null
  }>({ min: null, max: null })

  // Fetch product specs for dynamic filters
  const { specs } = useProductSpecs()

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
    gender: selectedGenders.length > 0 ? selectedGenders : undefined,
    categories: selectedCategories.length > 0 ? selectedCategories : undefined,
    minPrice,
    maxPrice
  })

  // Reset page when any filter changes
  const handleFilterChange = <T,>(setter: React.Dispatch<React.SetStateAction<T>>, value: T) => {
    setter(value)
    setPage(1)
  }

  const handlePriceRangeChange = (rangeIds: string[]) => {
    setSelectedPriceRanges(rangeIds)
    if (rangeIds.length > 0) {
      setCustomPriceRange({ min: null, max: null })
    }
    setPage(1)
  }

  const handleSearchChange = (query: string) => {
    setSearchInput(query)
  }

  const handleShopClick = () => {
    collectionRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-[#f1f9f7] relative overflow-x-hidden">
      {/* Dynamic Background Loang Effect - Interwoven Mint and White */}
      <div className="absolute top-[5%] left-[-5%] w-[600px] h-[600px] bg-white rounded-full blur-[120px] pointer-events-none opacity-60" />
      <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] bg-primary-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="absolute top-[30%] right-[10%] w-[700px] h-[700px] bg-white rounded-full blur-[150px] pointer-events-none opacity-40" />
      <div className="absolute top-[40%] right-[-10%] w-[600px] h-[600px] bg-primary-400/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="absolute bottom-[10%] left-[10%] w-[600px] h-[600px] bg-white rounded-full blur-[120px] pointer-events-none opacity-50" />
      <div className="absolute bottom-[5%] left-[20%] w-[400px] h-[400px] bg-primary-300/10 rounded-full blur-[100px] pointer-events-none" />

      <section className="py-12 relative z-10">
        <div className="container mx-auto px-6">
          {/* Hero Section */}
          <CategoryHero
            categoryName={CATEGORY_HEROES[productType as keyof typeof CATEGORY_HEROES].name}
            subtitle={CATEGORY_HEROES[productType as keyof typeof CATEGORY_HEROES].subtitle}
            description={CATEGORY_HEROES[productType as keyof typeof CATEGORY_HEROES].description}
            image={CATEGORY_HEROES[productType as keyof typeof CATEGORY_HEROES].image}
            onShopClick={handleShopClick}
          />

          {/* Horizontal Search & Filters Section */}
          <div ref={collectionRef}>
            <HorizontalFilters
              categories={specs?.categories || []}
              selectedCategories={selectedCategories}
              onCategoryChange={(v: string[]) => handleFilterChange(setSelectedCategories, v)}
              genders={specs?.genders || []}
              selectedGenders={selectedGenders}
              onGenderChange={(v: string[]) => handleFilterChange(setSelectedGenders, v)}
              brands={specs?.brands || []}
              selectedBrands={selectedBrands}
              onBrandChange={(v: string[]) => handleFilterChange(setSelectedBrands, v)}
              priceRanges={priceRanges}
              selectedPriceRanges={selectedPriceRanges}
              onPriceRangeChange={handlePriceRangeChange}
              searchQuery={searchInput}
              onSearchChange={handleSearchChange}
              totalResults={products.length}
              isLoading={loading}
            />
          </div>

          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-10 min-h-[600px] relative">
              {loading && products.length === 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-8 sm:gap-y-16">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="aspect-[4/5] bg-mint-50 animate-pulse rounded-[24px] sm:rounded-[32px]"
                    />
                  ))}
                </div>
              ) : error ? (
                <div className="text-center text-red-600 py-20 font-bold">
                  Failed to load products.
                </div>
              ) : products.length === 0 ? (
                <div className="text-center text-gray-eyewear py-20 italic">
                  No products found matching your filters.
                </div>
              ) : (
                <>
                  <div
                    className={cn(
                      'grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-8 sm:gap-y-16 transition-all duration-700',
                      loading && 'opacity-40 pointer-events-none'
                    )}
                  >
                    {products.map((product, index) => {
                      const originalPrice = product.defaultVariantPrice || 0
                      const finalPrice = product.defaultVariantFinalPrice || originalPrice
                      const isActualSale = originalPrice > finalPrice && finalPrice > 0
                      const salePercentValue = isActualSale
                        ? Math.round(((originalPrice - finalPrice) / originalPrice) * 100)
                        : undefined

                      return (
                        <div
                          key={product.id || product._id}
                          className="animate-fade-in-up"
                          style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
                        >
                          <ProductCard
                            id={product.id || product._id || ''}
                            name={product.nameBase}
                            brand={product.brand || undefined}
                            image={product.defaultVariantImage || undefined}
                            price={originalPrice}
                            discountPrice={finalPrice !== originalPrice ? finalPrice : undefined}
                            salePercent={salePercentValue}
                            onClick={(id) => navigate(`/products/${id}`)}
                          />
                        </div>
                      )
                    })}
                  </div>

                  {/* Pagination hide if searching to prevent jump */}
                  <div className={cn('mt-20 transition-opacity', loading && 'opacity-0')}>
                    <OperationPagination
                      page={currentPage}
                      totalPages={totalPages}
                      total={products.length > 0 ? totalPages * limit : 0}
                      limit={limit}
                      onPageChange={setPage}
                      itemsOnPage={products.length}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
