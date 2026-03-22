import { cn } from '@/lib/utils'
import { Checkbox } from '../checkbox'

export interface PriceRange {
  id: string
  label: string
  min: number
  max: number
}

export interface PriceRangeFilterProps {
  ranges: PriceRange[]
  selectedRanges: string[]
  onRangeChange: (rangeIds: string[]) => void
  className?: string
}

export function PriceRangeFilter({
  ranges,
  selectedRanges,
  onRangeChange,
  className
}: PriceRangeFilterProps) {
  const toggleRange = (rangeId: string) => {
    const newSelected = selectedRanges.includes(rangeId)
      ? selectedRanges.filter((id) => id !== rangeId)
      : [...selectedRanges, rangeId]
    onRangeChange(newSelected)
  }

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <h3 className="text-mint-1200 font-bold text-base uppercase tracking-wider">Price Range</h3>

      <div className="space-y-3">
        {ranges.map((range) => (
          <label key={range.id} className="flex items-center gap-3 cursor-pointer group">
            <Checkbox
              isChecked={selectedRanges.includes(range.id)}
              onCheckedChange={() => toggleRange(range.id)}
            />
            <span className="text-sm text-mint-1100 group-hover:text-primary-500 transition-colors font-medium">
              {range.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  )
}
