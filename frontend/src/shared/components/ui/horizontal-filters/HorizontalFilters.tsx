import { cn } from '@/lib/utils'
import { X, ChevronDown, Search } from 'lucide-react'
import type { SpecCategory } from '@/shared/types/productSpecs.types'
import { useState, useRef, useEffect, useMemo } from 'react'
import { Checkbox } from '@/shared/components/ui/checkbox'

export interface HorizontalFiltersProps {
  categories: SpecCategory[]
  selectedCategories: string[]
  onCategoryChange: (categoryIds: string[]) => void
  genders: string[]
  selectedGenders: string[]
  onGenderChange: (genders: string[]) => void
  brands: string[]
  selectedBrands: string[]
  onBrandChange: (brands: string[]) => void
  priceRanges: { id: string; label: string; min: number; max: number }[]
  selectedPriceRanges: string[]
  onPriceRangeChange: (rangeIds: string[]) => void
  searchQuery: string
  onSearchChange: (query: string) => void
  className?: string
  totalResults?: number
  isLoading?: boolean
}

const GENDER_MAP: Record<string, string> = {
  M: 'Men',
  F: 'Women',
  UNISEX: 'Unisex',
  unisex: 'Unisex',
  N: 'None'
}

const FilterDropdown = ({
  label,
  id,
  count,
  activeDropdown,
  setActiveDropdown,
  children
}: {
  label: string
  id: string
  count?: number
  activeDropdown: string | null
  setActiveDropdown: (id: string | null) => void
  children: React.ReactNode
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        activeDropdown === id &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setActiveDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [activeDropdown, id, setActiveDropdown])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setActiveDropdown(activeDropdown === id ? null : id)}
        className={cn(
          'flex items-center gap-2 text-[11px] font-black uppercase tracking-widest transition-all cursor-pointer',
          activeDropdown === id || count
            ? 'text-primary-600'
            : 'text-gray-eyewear hover:text-mint-1200'
        )}
      >
        {label}
        {count ? (
          <span className="ml-1 text-[10px] bg-primary-100 px-1.5 py-0.5 rounded-full">
            {count}
          </span>
        ) : null}
        <ChevronDown
          className={cn(
            'w-3 h-3 transition-transform duration-300',
            activeDropdown === id && 'rotate-180'
          )}
        />
      </button>

      {activeDropdown === id && (
        <div className="absolute top-full left-0 mt-4 w-64 bg-white border border-mint-100 shadow-2xl rounded-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">{children}</div>
        </div>
      )}
    </div>
  )
}

export function HorizontalFilters({
  categories,
  selectedCategories,
  onCategoryChange,
  genders,
  selectedGenders,
  onGenderChange,
  brands,
  selectedBrands,
  onBrandChange,
  priceRanges,
  selectedPriceRanges,
  onPriceRangeChange,
  searchQuery,
  onSearchChange,
  className,
  totalResults,
  isLoading = false
}: HorizontalFiltersProps) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [isSearchFocused, setIsSearchFocused] = useState(false)

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

  // Deduplicate genders for display but keep original keys mapping to them
  const displayGenders = useMemo(() => {
    const list = genders.length > 0 ? genders : ['M', 'F', 'UNISEX']
    const unique = new Map<string, string>()

    list.forEach((gender) => {
      const label = GENDER_MAP[gender] || gender
      // If we already have this label, don't add another one
      if (!unique.has(label)) {
        unique.set(label, gender)
      }
    })

    return Array.from(unique.values())
  }, [genders])

  return (
    <div className={cn('space-y-6 mb-12', className)}>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 sm:gap-8 border-y border-mint-200/60 py-6 sm:py-8">
        {/* Horizontal Filters Container */}
        <div className="flex flex-wrap items-center gap-6 sm:gap-12">
          <span className="text-[10px] font-black tracking-[0.2em] sm:tracking-[0.3em] text-mint-900 uppercase">
            Filters:
          </span>

          {/* Categories Dropdown */}
          <FilterDropdown
            label="Categories"
            id="categories"
            count={selectedCategories.length}
            activeDropdown={activeDropdown}
            setActiveDropdown={setActiveDropdown}
          >
            {categories.map((category) => (
              <label
                key={category._id}
                className="flex items-center gap-3 p-2 hover:bg-mint-50 rounded-lg cursor-pointer group transition-colors"
              >
                <Checkbox
                  isChecked={selectedCategories.includes(category._id)}
                  onCheckedChange={() =>
                    toggleSelection(category._id, selectedCategories, onCategoryChange)
                  }
                  size="sm"
                />
                <span className="text-sm font-medium text-mint-1200 group-hover:text-primary-700">
                  {category.name
                    .split(' ')
                    .map((word) => {
                      if (word.toUpperCase() === 'UV') return 'UV'
                      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                    })
                    .join(' ')}
                </span>
              </label>
            ))}
          </FilterDropdown>

          {/* Gender Dropdown */}
          <FilterDropdown
            label="Gender"
            id="gender"
            count={selectedGenders.length}
            activeDropdown={activeDropdown}
            setActiveDropdown={setActiveDropdown}
          >
            {displayGenders.map((gender) => (
              <label
                key={gender}
                className="flex items-center gap-3 p-2 hover:bg-mint-50 rounded-lg cursor-pointer group transition-colors"
              >
                <Checkbox
                  isChecked={selectedGenders.includes(gender)}
                  onCheckedChange={() => toggleSelection(gender, selectedGenders, onGenderChange)}
                  size="sm"
                />
                <span className="text-sm font-medium text-mint-1200 group-hover:text-primary-700">
                  {GENDER_MAP[gender] || gender}
                </span>
              </label>
            ))}
          </FilterDropdown>

          {/* Price Dropdown */}
          <FilterDropdown
            label="Price Range"
            id="price"
            count={selectedPriceRanges.length}
            activeDropdown={activeDropdown}
            setActiveDropdown={setActiveDropdown}
          >
            {priceRanges.map((range) => (
              <label
                key={range.id}
                className="flex items-center gap-3 p-2 hover:bg-mint-50 rounded-lg cursor-pointer group transition-colors"
              >
                <Checkbox
                  isChecked={selectedPriceRanges.includes(range.id)}
                  onCheckedChange={() =>
                    toggleSelection(range.id, selectedPriceRanges, onPriceRangeChange)
                  }
                  size="sm"
                />
                <span className="text-sm font-medium text-mint-1200 group-hover:text-primary-700">
                  {range.label}
                </span>
              </label>
            ))}
          </FilterDropdown>

          {/* Brand Dropdown */}
          <FilterDropdown
            label="Brand"
            id="brand"
            count={selectedBrands.length}
            activeDropdown={activeDropdown}
            setActiveDropdown={setActiveDropdown}
          >
            {brands.slice(0, 20).map((brand) => (
              <label
                key={brand}
                className="flex items-center gap-3 p-2 hover:bg-mint-50 rounded-lg cursor-pointer group transition-colors"
              >
                <Checkbox
                  isChecked={selectedBrands.includes(brand)}
                  onCheckedChange={() => toggleSelection(brand, selectedBrands, onBrandChange)}
                  size="sm"
                />
                <span className="text-sm font-medium text-mint-1200 group-hover:text-primary-700">
                  {brand}
                </span>
              </label>
            ))}
          </FilterDropdown>
        </div>

        {/* Search Bar Integration */}
        <div className="relative group lg:w-[400px]">
          <div
            className={cn(
              'flex items-center gap-3 sm:gap-4 px-5 py-3 sm:px-8 sm:py-4 bg-white border rounded-full transition-all duration-500',
              isSearchFocused
                ? 'border-primary-500 ring-8 ring-primary-500/5 shadow-2xl'
                : 'border-mint-200'
            )}
          >
            <Search
              className={cn(
                'w-5 h-5 transition-colors duration-500',
                isSearchFocused ? 'text-primary-500' : 'text-mint-800',
                isLoading && 'animate-pulse text-primary-400'
              )}
            />
            <input
              type="text"
              placeholder="Search by name, brand or style..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="bg-transparent border-none outline-none text-sm font-bold placeholder:text-mint-800/60 text-mint-1200 w-full"
            />
            {totalResults !== undefined && <div className="h-6 w-px bg-mint-100 mx-2" />}
            {totalResults !== undefined && (
              <span className="text-[10px] font-black text-primary-700 bg-primary-100 flex items-center justify-center min-w-[24px] h-6 px-1.5 rounded-full">
                {totalResults}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Active Tags Display with Smooth Transition - Sticky Wrapper */}
      <div className="sticky top-0 md:top-4 z-30">
        <div
          className={cn(
            'overflow-hidden transition-all duration-500 ease-in-out',
            selectedCategories.length > 0 ||
              selectedGenders.length > 0 ||
              selectedBrands.length > 0 ||
              selectedPriceRanges.length > 0
              ? 'max-h-[200px] opacity-100 mt-6'
              : 'max-h-0 opacity-0 mt-0'
          )}
        >
          <div className="bg-white/90 backdrop-blur-md border border-mint-100/50 p-4 rounded-2xl shadow-xl shadow-mint-900/10 px-6">
            <div className="flex flex-wrap items-center gap-3">
              <div className="text-[10px] font-black text-mint-900 uppercase tracking-[0.2em] mr-2">
                Active Filters:
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {selectedCategories.map((id) => {
                  const cat = categories.find((c) => c._id === id)
                  return (
                    cat && (
                      <button
                        key={id}
                        onClick={() => toggleSelection(id, selectedCategories, onCategoryChange)}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-mint-100 border border-mint-300 text-mint-900 rounded-lg text-xs font-bold hover:bg-primary-600 hover:text-white hover:border-primary-600 transition-all group cursor-pointer"
                      >
                        {cat.name}
                        <X className="w-3.5 h-3.5 text-mint-600 group-hover:text-white" />
                      </button>
                    )
                  )
                })}

                {selectedGenders.map((gender) => (
                  <button
                    key={gender}
                    onClick={() => toggleSelection(gender, selectedGenders, onGenderChange)}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-mint-100 border border-mint-300 text-mint-900 rounded-lg text-xs font-bold hover:bg-primary-600 hover:text-white hover:border-primary-600 transition-all group cursor-pointer"
                  >
                    {GENDER_MAP[gender] || gender}
                    <X className="w-3.5 h-3.5 text-mint-600 group-hover:text-white" />
                  </button>
                ))}

                {selectedBrands.map((brand) => (
                  <button
                    key={brand}
                    onClick={() => toggleSelection(brand, selectedBrands, onBrandChange)}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-mint-100 border border-mint-300 text-mint-900 rounded-lg text-xs font-bold hover:bg-primary-600 hover:text-white hover:border-primary-600 transition-all group cursor-pointer"
                  >
                    {brand}
                    <X className="w-3.5 h-3.5 text-mint-600 group-hover:text-white" />
                  </button>
                ))}

                {selectedPriceRanges.map((id) => {
                  const range = priceRanges.find((r) => r.id === id)
                  return (
                    range && (
                      <button
                        key={id}
                        onClick={() => toggleSelection(id, selectedPriceRanges, onPriceRangeChange)}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-mint-100 border border-mint-300 text-mint-900 rounded-lg text-xs font-bold hover:bg-primary-600 hover:text-white hover:border-primary-600 transition-all group cursor-pointer"
                      >
                        {range.label}
                        <X className="w-3.5 h-3.5 text-mint-600 group-hover:text-white" />
                      </button>
                    )
                  )
                })}

                <button
                  onClick={() => {
                    onCategoryChange([])
                    onGenderChange([])
                    onBrandChange([])
                    onPriceRangeChange([])
                  }}
                  className="text-xs font-black text-red-600 hover:text-red-700 transition-colors px-4 py-2 hover:bg-red-50 rounded-lg cursor-pointer"
                >
                  Clear All Results
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
