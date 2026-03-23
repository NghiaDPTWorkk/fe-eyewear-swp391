import { cn } from '@/lib/utils'
import { PriceRangeFilter, type PriceRange } from '../price-range-filter'
import { FilterSection } from '../filter-section'
import { Checkbox } from '../checkbox'
import { Loader2 } from 'lucide-react'
import type { SpecCategory } from '@/shared/types/productSpecs.types'

export interface ProductFiltersProps {
  categories: SpecCategory[]
  selectedCategories: string[]
  onCategoryChange: (categoryIds: string[]) => void
  genders: string[]
  selectedGenders: string[]
  onGenderChange: (genders: string[]) => void
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
  className?: string
}

const GENDER_MAP: Record<string, string> = {
  M: 'Men',
  F: 'Women',
  N: 'Non-binary',
  UNISEX: 'Unisex',
  unisex: 'Unisex'
}

export function ProductFilters({
  categories,
  selectedCategories,
  onCategoryChange,
  genders,
  selectedGenders,
  onGenderChange,
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
  priceResetKey,
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

  // Helper to group and deduplicate specs by label (case-insensitive)
  const getUniqueSpecs = (rawValues: string[], labelMap?: Record<string, string>) => {
    const groups: Record<string, { label: string; values: string[] }> = {}

    rawValues.forEach((val) => {
      const label = labelMap ? labelMap[val] || val : val
      const normalizedLabel = label.toLowerCase().trim()

      if (!groups[normalizedLabel]) {
        groups[normalizedLabel] = {
          label: label.charAt(0).toUpperCase() + label.slice(1).toLowerCase(), // Consistent casing for display
          values: []
        }
      }
      groups[normalizedLabel].values.push(val)
    })

    return Object.values(groups).sort((a, b) => a.label.localeCompare(b.label))
  }

  const toggleGroupSelection = (
    groupValues: string[],
    selected: string[],
    onChange: (values: string[]) => void
  ) => {
    const isAnySelected = groupValues.some((v) => selected.includes(v))
    if (isAnySelected) {
      // Remove all values from this group
      onChange(selected.filter((v) => !groupValues.includes(v)))
    } else {
      // Add all values from this group
      onChange([...selected, ...groupValues])
    }
  }

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {/* Filters Section */}
      <div className="bg-mint-200 rounded-2xl border-2 border-mint-500 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-mint-1200 font-semibold text-lg">Filters</h2>
        </div>

        <div className="space-y-0">
          {/* Categories */}
          <FilterSection title="Categories" defaultExpanded>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {categories.length > 0 ? (
                categories.map((category) => (
                  <label
                    key={category._id}
                    className="flex items-center gap-2 cursor-pointer group"
                  >
                    <Checkbox
                      isChecked={selectedCategories.includes(category._id)}
                      onCheckedChange={() =>
                        toggleSelection(category._id, selectedCategories, onCategoryChange)
                      }
                    />
                    <span className="text-sm text-mint-1200 group-hover:text-primary-500 transition-colors">
                      {category.name}
                    </span>
                  </label>
                ))
              ) : (
                <div className="text-xs text-mint-800 italic">No categories</div>
              )}
            </div>
          </FilterSection>

          {/* Gender */}
          <FilterSection title="Gender" defaultExpanded>
            <div className="space-y-2">
              {genders.length > 0 ? (
                getUniqueSpecs(genders, GENDER_MAP).map((group) => (
                  <label key={group.label} className="flex items-center gap-2 cursor-pointer group">
                    <Checkbox
                      isChecked={group.values.some((v) => selectedGenders.includes(v))}
                      onCheckedChange={() =>
                        toggleGroupSelection(group.values, selectedGenders, onGenderChange)
                      }
                    />
                    <span className="text-sm text-mint-1200 group-hover:text-primary-500 transition-colors">
                      {group.label}
                    </span>
                  </label>
                ))
              ) : (
                <Loader2 className="w-5 h-5 animate-spin text-primary-500" />
              )}
            </div>
          </FilterSection>

          {/* Brand */}
          <FilterSection title="Brand" defaultExpanded>
            <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
              {brands.length > 0 ? (
                getUniqueSpecs(brands).map((group) => (
                  <label key={group.label} className="flex items-center gap-2 cursor-pointer group">
                    <Checkbox
                      isChecked={group.values.some((v) => selectedBrands.includes(v))}
                      onCheckedChange={() =>
                        toggleGroupSelection(group.values, selectedBrands, onBrandChange)
                      }
                    />
                    <span className="text-sm text-mint-1200 group-hover:text-primary-500 transition-colors">
                      {group.label}
                    </span>
                  </label>
                ))
              ) : (
                <Loader2 className="w-5 h-5 animate-spin text-primary-500" />
              )}
            </div>
          </FilterSection>

          {/* Material */}
          <FilterSection title="Material">
            <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
              {materials.length > 0 ? (
                getUniqueSpecs(materials).map((group) => (
                  <label key={group.label} className="flex items-center gap-2 cursor-pointer group">
                    <Checkbox
                      isChecked={group.values.some((v) => selectedMaterials.includes(v))}
                      onCheckedChange={() =>
                        toggleGroupSelection(group.values, selectedMaterials, onMaterialChange)
                      }
                    />
                    <span className="text-sm text-mint-1200 group-hover:text-primary-500 transition-colors">
                      {group.label}
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
            <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
              {shapes.length > 0 ? (
                getUniqueSpecs(shapes).map((group) => (
                  <label key={group.label} className="flex items-center gap-2 cursor-pointer group">
                    <Checkbox
                      isChecked={group.values.some((v) => selectedShapes.includes(v))}
                      onCheckedChange={() =>
                        toggleGroupSelection(group.values, selectedShapes, onShapeChange)
                      }
                    />
                    <span className="text-sm text-mint-1200 group-hover:text-primary-500 transition-colors">
                      {group.label}
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
                getUniqueSpecs(styles).map((group) => (
                  <label key={group.label} className="flex items-center gap-2 cursor-pointer group">
                    <Checkbox
                      isChecked={group.values.some((v) => selectedStyles.includes(v))}
                      onCheckedChange={() =>
                        toggleGroupSelection(group.values, selectedStyles, onStyleChange)
                      }
                    />
                    <span className="text-sm text-mint-1200 group-hover:text-primary-500 transition-colors">
                      {group.label}
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
        />
      </div>
    </div>
  )
}
