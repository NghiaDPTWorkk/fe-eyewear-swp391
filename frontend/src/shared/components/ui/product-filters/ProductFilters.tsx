import { cn } from '@/lib/utils'
import { PriceRangeFilter, type PriceRange } from '../price-range-filter'
import { ColorFilter, type ColorOption } from '../color-filter'
import { FilterSection } from '../filter-section'
import { Checkbox } from '../checkbox'
import { Loader2 } from 'lucide-react'

export interface Category {
  id: string
  name: string
}

export interface ProductFiltersProps {
  categories: Category[]
  selectedCategories: string[]
  onCategoryChange: (categoryIds: string[]) => void
  brands: string[]
  selectedBrands: string[]
  onBrandChange: (brands: string[]) => void
  materials: string[]
  selectedMaterials: string[]
  onMaterialChange: (materials: string[]) => void
  shapes: string[]
  selectedShapes: string[]
  onShapeChange: (shapes: string[]) => void
  styles: string[]
  selectedStyles: string[]
  onStyleChange: (styles: string[]) => void
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
  brands,
  selectedBrands,
  onBrandChange,
  materials,
  selectedMaterials,
  onMaterialChange,
  shapes,
  selectedShapes,
  onShapeChange,
  styles,
  selectedStyles,
  onStyleChange,
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
  const toggleSelection = (
    value: string,
    selected: string[],
    onChange: (values: string[]) => void
  ) => {
    const newSelected = selected.includes(value)
      ? selected.filter((v) => v !== value)
      : [...selected, value]
    onChange(newSelected)
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
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {brands.length > 0 ? (
                brands.map((brand) => (
                  <label key={brand} className="flex items-center gap-2 cursor-pointer group">
                    <Checkbox
                      isChecked={selectedBrands.includes(brand)}
                      onCheckedChange={() => toggleSelection(brand, selectedBrands, onBrandChange)}
                    />
                    <span className="text-sm text-mint-1200 group-hover:text-primary-500 transition-colors">
                      {brand}
                    </span>
                  </label>
                ))
              ) : (
                <Loader2 className="w-5 h-5 animate-spin text-primary-500" />
              )}
            </div>
          </FilterSection>

          {/* Gender */}
          <FilterSection title="Gender" defaultExpanded>
            <div className="space-y-2">
              {categories.map((category) => (
                <label key={category.id} className="flex items-center gap-2 cursor-pointer group">
                  <Checkbox
                    isChecked={selectedCategories.includes(category.id)}
                    onCheckedChange={() =>
                      toggleSelection(category.id, selectedCategories, onCategoryChange)
                    }
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
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {materials.length > 0 ? (
                materials.map((material) => (
                  <label key={material} className="flex items-center gap-2 cursor-pointer group">
                    <Checkbox
                      isChecked={selectedMaterials.includes(material)}
                      onCheckedChange={() =>
                        toggleSelection(material, selectedMaterials, onMaterialChange)
                      }
                    />
                    <span className="text-sm text-mint-1200 group-hover:text-primary-500 transition-colors">
                      {material}
                    </span>
                  </label>
                ))
              ) : (
                <Loader2 className="w-5 h-5 animate-spin text-primary-500" />
              )}
            </div>
          </FilterSection>

          {/* Shape */}
          <FilterSection title="Shape">
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {shapes.length > 0 ? (
                shapes.map((shape) => (
                  <label key={shape} className="flex items-center gap-2 cursor-pointer group">
                    <Checkbox
                      isChecked={selectedShapes.includes(shape)}
                      onCheckedChange={() => toggleSelection(shape, selectedShapes, onShapeChange)}
                    />
                    <span className="text-sm text-mint-1200 group-hover:text-primary-500 transition-colors">
                      {shape}
                    </span>
                  </label>
                ))
              ) : (
                <Loader2 className="w-5 h-5 animate-spin text-primary-500" />
              )}
            </div>
          </FilterSection>

          {/* Style */}
          <FilterSection title="Style">
            <div className="space-y-2">
              {styles.length > 0 ? (
                styles.map((style) => (
                  <label key={style} className="flex items-center gap-2 cursor-pointer group">
                    <Checkbox
                      isChecked={selectedStyles.includes(style)}
                      onCheckedChange={() => toggleSelection(style, selectedStyles, onStyleChange)}
                    />
                    <span className="text-sm text-mint-1200 group-hover:text-primary-500 transition-colors">
                      {style}
                    </span>
                  </label>
                ))
              ) : (
                <Loader2 className="w-5 h-5 animate-spin text-primary-500" />
              )}
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
