import { useState } from 'react'
import { Search, Glasses, ShoppingCart, User, Heart } from 'lucide-react'
import { Input } from '@/components/atoms'
import { Pagination } from '@/components/molecules'
import { FilterTags, type FilterTag } from '@/components/molecules/filter-tags'
import { ProductFilters } from '@/components/organisms/product-filters'
import { ProductGrid } from '@/components/organisms/product-grid'
import type { PriceRange } from '@/components/molecules/price-range-filter'
import type { ColorOption } from '@/components/molecules/color-filter'
import { useGetProductWithPagination } from '@/shared/hooks/products/useGetProductWithPagination'
import HeaderCustomer from '@/components/layout/header/HeaderCustomer'

const PRICE_RANGES: PriceRange[] = [
  { id: '1', label: '$20.00 - $ 50.00', min: 20, max: 50 },
  { id: '2', label: '$50.00 - $ 100.00', min: 50, max: 100 },
  { id: '3', label: '$100.00 - $ 1200.00', min: 100, max: 1200 }
]

const COLORS: ColorOption[] = [
  { id: '1', name: 'Black', hex: '#000000' },
  { id: '2', name: 'Brown', hex: '#8B4513' },
  { id: '3', name: 'Red', hex: '#DC2626' },
  { id: '4', name: 'Gray', hex: '#9CA3AF' },
  { id: '5', name: 'Beige', hex: '#F5F5DC' }
]

const CATEGORIES = [
  { id: '1', name: 'Sunglasses' },
  { id: '2', name: 'Eyeglasses' },
  { id: '3', name: 'Contact Lenses' }
]

export default function ProductsPage() {
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')

  const itemsPerPage = 9

  // Use the API hook
  const { products, loading, totalPages } = useGetProductWithPagination(currentPage, itemsPerPage)

  // Transform API products to match ProductGrid interface
  const transformedProducts = (products || []).map((product) => {
    const defaultVariant = product.variants?.[0]
    return {
      id: product._id,
      name: product.nameBase,
      image:
        defaultVariant?.imgs?.[0] || 'https://placehold.co/400x400/e0f2f1/2aa57f?text=No+Image',
      price: defaultVariant?.price || 0,
      discountPrice:
        defaultVariant?.finalPrice !== defaultVariant?.price
          ? defaultVariant?.finalPrice
          : undefined,
      rating: 4.5
    }
  })

  // Fallback mock data for development
  const MOCK_PRODUCTS = [
    {
      id: 'mock-1',
      name: 'Double Bed & Side Tables',
      image: 'https://placehold.co/400x400/e0f2f1/2aa57f?text=Eyewear+1',
      price: 230.0,
      discountPrice: 200.0,
      rating: 4.5
    },
    {
      id: 'mock-2',
      name: 'Double Bed & Side Tables',
      image: 'https://placehold.co/400x400/e0f2f1/2aa57f?text=Eyewear+2',
      price: 230.0,
      discountPrice: 200.0,
      rating: 4.0
    },
    {
      id: 'mock-3',
      name: 'Double Bed & Side Tables',
      image: 'https://placehold.co/400x400/e0f2f1/2aa57f?text=Eyewear+3',
      price: 230.0,
      discountPrice: 200.0,
      rating: 5.0
    },
    {
      id: 'mock-4',
      name: 'Classic Round Frames',
      image: 'https://placehold.co/400x400/e0f2f1/2aa57f?text=Eyewear+4',
      price: 180.0,
      rating: 4.2
    },
    {
      id: 'mock-5',
      name: 'Sport Sunglasses',
      image: 'https://placehold.co/400x400/e0f2f1/2aa57f?text=Eyewear+5',
      price: 150.0,
      discountPrice: 135.0,
      rating: 4.7
    },
    {
      id: 'mock-6',
      name: 'Designer Frames',
      image: 'https://placehold.co/400x400/e0f2f1/2aa57f?text=Eyewear+6',
      price: 320.0,
      rating: 4.9
    }
  ]

  const displayProducts = transformedProducts.length > 0 ? transformedProducts : MOCK_PRODUCTS

  const displayTotalPages = totalPages || 1

  // Build filter tags
  const filterTags: FilterTag[] = [
    ...selectedColors.map((colorId) => {
      const color = COLORS.find((c) => c.id === colorId)
      return {
        id: `color-${colorId}`,
        label: color?.name || '',
        type: 'color' as const
      }
    }),
    ...selectedPriceRanges.map((rangeId) => {
      const range = PRICE_RANGES.find((r) => r.id === rangeId)
      return {
        id: `price-${rangeId}`,
        label: range?.label || '',
        type: 'price' as const
      }
    }),
    ...selectedCategories.map((categoryId) => {
      const category = CATEGORIES.find((c) => c.id === categoryId)
      return {
        id: `category-${categoryId}`,
        label: category?.name || '',
        type: 'category' as const
      }
    })
  ]

  const handleRemoveTag = (tagId: string) => {
    if (tagId.startsWith('color-')) {
      const colorId = tagId.replace('color-', '')
      setSelectedColors(selectedColors.filter((id) => id !== colorId))
    } else if (tagId.startsWith('price-')) {
      const rangeId = tagId.replace('price-', '')
      setSelectedPriceRanges(selectedPriceRanges.filter((id) => id !== rangeId))
    } else if (tagId.startsWith('category-')) {
      const categoryId = tagId.replace('category-', '')
      setSelectedCategories(selectedCategories.filter((id) => id !== categoryId))
    }
  }

  const handleClearAll = () => {
    setSelectedColors([])
    setSelectedPriceRanges([])
    setSelectedCategories([])
  }

  const handleReset = () => {
    handleClearAll()
  }

  const handleAddToCart = (productId: string) => {
    console.log('Add to cart:', productId)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-[#f0f9f7] flex flex-col">
      {/* Header */}
      <HeaderCustomer
        containerWidth="1200px"
        logo={
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-md">
              <Glasses className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-heading font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
              Eyewear
            </span>
          </div>
        }
        navListContent={
          <nav className="flex items-center gap-8">
            <a
              href="/"
              className="text-gray-eyewear hover:text-primary-500 font-medium transition-all relative group"
            >
              Home
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-500 transform scale-x-0 group-hover:scale-x-100 transition-transform"></span>
            </a>
            <a
              href="/products"
              className="text-mint-1200 hover:text-primary-500 font-semibold transition-all relative group"
            >
              Products
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-500 transform scale-x-100 transition-transform"></span>
            </a>
            <a
              href="/about"
              className="text-gray-eyewear hover:text-primary-500 font-medium transition-all relative group"
            >
              About
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-500 transform scale-x-0 group-hover:scale-x-100 transition-transform"></span>
            </a>
            <a
              href="/contact"
              className="text-gray-eyewear hover:text-primary-500 font-medium transition-all relative group"
            >
              Contact
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-500 transform scale-x-0 group-hover:scale-x-100 transition-transform"></span>
            </a>
          </nav>
        }
        navListIcon={
          <div className="flex items-center gap-4">
            <button
              className="p-2 hover:bg-mint-200 rounded-full transition-all relative group"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5 text-gray-eyewear group-hover:text-primary-500 transition-colors" />
            </button>
            <button
              className="p-2 hover:bg-mint-200 rounded-full transition-all relative group"
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5 text-gray-eyewear group-hover:text-primary-500 transition-colors" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 text-white text-xs rounded-full flex items-center justify-center font-semibold shadow-md">
                0
              </span>
            </button>
            <button
              className="p-2 hover:bg-mint-200 rounded-full transition-all group"
              aria-label="User Profile"
            >
              <User className="w-5 h-5 text-gray-eyewear group-hover:text-primary-500 transition-colors" />
            </button>
          </div>
        }
      />

      {/* Main Content */}
      <div className="flex-1">
        <div className="max-w-[1400px] mx-auto px-6 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-5xl font-bold text-mint-1200 mb-4">All Eyewear</h1>

            {/* Description */}
            <p className="text-gray-eyewear mb-4 max-w-3xl">
              Curated minimalist frames designed for clarity and character. Crafted with premium
              acetate and sustainable materials.
            </p>
          </div>

          {/* Main Layout: Filters + Products */}
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
            {/* Filters Sidebar */}
            <aside className="lg:sticky lg:top-24 h-fit">
              <ProductFilters
                categories={CATEGORIES}
                selectedCategories={selectedCategories}
                onCategoryChange={setSelectedCategories}
                priceRanges={PRICE_RANGES}
                selectedPriceRanges={selectedPriceRanges}
                onPriceRangeChange={setSelectedPriceRanges}
                colors={COLORS}
                selectedColors={selectedColors}
                onColorChange={setSelectedColors}
                onReset={handleReset}
              />
            </aside>

            {/* Products Grid */}
            <main>
              {/* Search Bar and Filter Tags */}
              <div className="mb-6">
                <div className="mb-4">
                  <Input
                    placeholder="Find frame..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    size="lg"
                    leftElement={
                      <span className="pointer-events-none flex items-center justify-center">
                        <Search className="text-gray-eyewear w-5 h-5" />
                      </span>
                    }
                    className="bg-mint-300 border-mint-300 rounded-xl"
                  />
                </div>

                {/* Filter Tags */}
                <FilterTags
                  tags={filterTags}
                  onRemoveTag={handleRemoveTag}
                  onClearAll={handleClearAll}
                />
              </div>

              <ProductGrid
                products={displayProducts}
                isLoading={loading}
                onAddToCart={handleAddToCart}
              />

              {/* Pagination */}
              {!loading && displayProducts.length > 0 && (
                <div className="mt-12">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={displayTotalPages}
                    onPageChange={handlePageChange}
                    showLoadMore={false}
                  />
                </div>
              )}
            </main>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-mint-1200 text-mint-300 py-12 mt-auto">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-heading font-bold text-white text-lg mb-4">PRODUCTS</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-primary-500 transition-colors">
                    Eyeglasses
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary-500 transition-colors">
                    Sunglasses
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary-500 transition-colors">
                    Blue Light
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary-500 transition-colors">
                    Kids Glasses
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-heading font-bold text-white text-lg mb-4">SERVICES</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-primary-500 transition-colors">
                    Virtual Try-On
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary-500 transition-colors">
                    Prescription Lenses
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary-500 transition-colors">
                    Frame Finder
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary-500 transition-colors">
                    Insurance
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-heading font-bold text-white text-lg mb-4">SUPPORT</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-primary-500 transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary-500 transition-colors">
                    FAQs
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary-500 transition-colors">
                    Shipping Info
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary-500 transition-colors">
                    Returns
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-heading font-bold text-white text-lg mb-4">COMPANY</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-primary-500 transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary-500 transition-colors">
                    Our Story
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary-500 transition-colors">
                    Sustainability
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary-500 transition-colors">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-mint-900 pt-8 text-center">
            <p className="text-sm">© 2026 Eyewear. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
