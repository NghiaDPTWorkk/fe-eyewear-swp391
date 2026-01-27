import { FilterSection } from '@/components/molecules/filter-section'
import { PriceRangeFilter, type PriceRange } from '@/components/molecules/price-range-filter'
import { ColorFilter, type ColorOption } from '@/components/molecules/color-filter'
import { cn } from '@/lib/utils'

export interface Category {
  id: string
  name: string
}

export interface ProductFiltersProps {
  categories: Category[]
  selectedCategories: string[]
  onCategoryChange: (categoryIds: string[]) => void
  priceRanges: PriceRange[]
  selectedPriceRanges: string[]
  onPriceRangeChange: (rangeIds: string[]) => void
  colors: ColorOption[]
  selectedColors: string[]
  onColorChange: (colorIds: string[]) => void
  onReset?: () => void
  className?: string
}

export function ProductFilters({
  categories,
  selectedCategories,
  onCategoryChange,
  priceRanges,
  selectedPriceRanges,
  onPriceRangeChange,
  colors,
  selectedColors,
  onColorChange,
  onReset,
  className
}: ProductFiltersProps) {
  const handleCategoryClick = (categoryId: string) => {
    const newSelected = selectedCategories.includes(categoryId)
      ? selectedCategories.filter((id) => id !== categoryId)
      : [...selectedCategories, categoryId]
    onCategoryChange(newSelected)
  }

  return (
    <div className={cn('flex flex-col gap-6', className)}>
      {/* Filters Section */}
      <div className="bg-white rounded-2xl border-2 border-mint-500 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-primary-500 font-semibold text-lg">Filters</h2>
          {onReset && (
            <button
              onClick={onReset}
              className="text-primary-500 text-sm font-medium hover:text-primary-600 transition-colors"
            >
              reset
            </button>
          )}
        </div>

        <div className="space-y-0">
          <FilterSection title="Brand">
            <div className="space-y-2">
              {/* Placeholder for brand options */}
              <p className="text-gray-eyewear text-sm">No brands available</p>
            </div>
          </FilterSection>

          <FilterSection title="Gender">
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  className={cn(
                    'w-full text-left px-2 py-1.5 rounded text-sm transition-colors',
                    selectedCategories.includes(category.id)
                      ? 'bg-primary-100 text-primary-700 font-medium'
                      : 'text-gray-eyewear hover:bg-mint-200'
                  )}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </FilterSection>

          <FilterSection title="Material">
            <div className="space-y-2">
              <p className="text-gray-eyewear text-sm">No materials available</p>
            </div>
          </FilterSection>

          <FilterSection title="Shape">
            <div className="space-y-2">
              <p className="text-gray-eyewear text-sm">No shapes available</p>
            </div>
          </FilterSection>

          <FilterSection title="Occasion">
            <div className="space-y-2">
              <p className="text-gray-eyewear text-sm">No occasions available</p>
            </div>
          </FilterSection>

          <FilterSection title="Best Seller">
            <div className="space-y-2">
              <p className="text-gray-eyewear text-sm">Coming soon</p>
            </div>
          </FilterSection>
        </div>
      </div>

      {/* Price Range Section */}
      <div className="bg-white rounded-2xl border-2 border-mint-500 p-4">
        <PriceRangeFilter
          ranges={priceRanges}
          selectedRanges={selectedPriceRanges}
          onRangeChange={onPriceRangeChange}
        />
      </div>

      {/* Color Section */}
      <div className="bg-white rounded-2xl border-2 border-mint-500 p-4">
        <ColorFilter
          colors={colors}
          selectedColors={selectedColors}
          onColorChange={onColorChange}
        />
      </div>
    </div>
  )
}
