import { cn } from '@/lib/utils'
import { PriceRangeFilter, type PriceRange } from '../price-range-filter'
import { ColorFilter, type ColorOption } from '../color-filter'
import { FilterSection } from '../filter-section'

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
  onCustomPriceApply?: (min: number | null, max: number | null) => void
  priceResetKey?: number
  colors: ColorOption[]
  selectedColors: string[]
  onColorChange: (colorIds: string[]) => void
  className?: string
}

export function ProductFilters({
  categories,
  selectedCategories,
  onCategoryChange,
  priceRanges,
  selectedPriceRanges,
  onPriceRangeChange,
  onCustomPriceApply,
  priceResetKey,
  colors,
  selectedColors,
  onColorChange,
  className
}: ProductFiltersProps) {
  const handleCategoryClick = (categoryId: string) => {
    const newSelected = selectedCategories.includes(categoryId)
      ? selectedCategories.filter((id) => id !== categoryId)
      : [...selectedCategories, categoryId]
    onCategoryChange(newSelected)
  }

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {/* Filters Section */}
      <div className="bg-mint-200 rounded-2xl border-2 border-mint-500 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-mint-1200 font-semibold text-lg">Filters</h2>
        </div>

        <div className="space-y-0">
          {/* Brand */}
          <FilterSection title="Brand" defaultExpanded>
            <div className="space-y-2">
              <p className="text-gray-eyewear text-sm">Coming soon</p>
            </div>
          </FilterSection>

          {/* Gender */}
          <FilterSection title="Gender" defaultExpanded>
            <div className="space-y-2">
              {categories.map((category) => (
                <label key={category.id} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category.id)}
                    onChange={() => handleCategoryClick(category.id)}
                    className="w-4 h-4 rounded border-mint-500 text-primary-500 focus:ring-primary-500 cursor-pointer"
                  />
                  <span className="text-sm text-mint-1200 group-hover:text-primary-500 transition-colors">
                    {category.name}
                  </span>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Material */}
          <FilterSection title="Material">
            <div className="space-y-2">
              <p className="text-gray-eyewear text-sm">Coming soon</p>
            </div>
          </FilterSection>

          {/* Shape */}
          <FilterSection title="Shape">
            <div className="space-y-2">
              <p className="text-gray-eyewear text-sm">Coming soon</p>
            </div>
          </FilterSection>

          {/* Occasion */}
          <FilterSection title="Occasion">
            <div className="space-y-2">
              <p className="text-gray-eyewear text-sm">Coming soon</p>
            </div>
          </FilterSection>

          {/* Best Seller */}
          <FilterSection title="Best Seller">
            <div className="space-y-2">
              <p className="text-gray-eyewear text-sm">Coming soon</p>
            </div>
          </FilterSection>
        </div>
      </div>

      {/* Price Range Section */}
      <div className="bg-mint-200 rounded-2xl border-2 border-mint-500 p-4">
        <PriceRangeFilter
          key={priceResetKey}
          ranges={priceRanges}
          selectedRanges={selectedPriceRanges}
          onRangeChange={onPriceRangeChange}
          onCustomRangeApply={onCustomPriceApply}
        />
      </div>

      {/* Color Section */}
      <div className="bg-mint-200 rounded-2xl border-2 border-mint-500 p-4">
        <ColorFilter
          colors={colors}
          selectedColors={selectedColors}
          onColorChange={onColorChange}
        />
      </div>
    </div>
  )
}
