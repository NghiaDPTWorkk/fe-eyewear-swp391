import { useState } from 'react'
import { Divider, Input, Button } from '@/components'
import { cn } from '@/lib/utils'

export interface PriceRange {
  id: string
  label: string
  min: number
  max: number
}

export interface PriceRangeFilterProps {
  ranges: PriceRange[]
  SelectedRanges: string[]
  onRangeChange: (rangeIds: string[]) => void
  onCustomRangeApply?: (min: number | null, max: number | null) => void
  className?: string
}

export function PriceRangeFilter({ onCustomRangeApply, className }: PriceRangeFilterProps) {
  const [minPrice, setMinPrice] = useState<string>('')
  const [maxPrice, setMaxPrice] = useState<string>('')

  const handleApply = () => {
    const min = minPrice ? parseFloat(minPrice) : null
    const max = maxPrice ? parseFloat(maxPrice) : null

    if (onCustomRangeApply) {
      onCustomRangeApply(min, max)
    }
  }

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <h3 className="text-primary-1200 font-semibold text-lg">Price Range</h3>

      <div className="flex gap-2">
        <Input
          type="number"
          placeholder="Min"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          size="sm"
          className="flex-1 w-[40%]"
        />
        <Divider text="to" className="w-[20%]"></Divider>
        <Input
          type="number"
          placeholder="Max"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          size="sm"
          className="flex-1 w-[40%]"
        />
      </div>

      <Button
        onClick={handleApply}
        className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
      >
        Apply
      </Button>
    </div>
  )
}
