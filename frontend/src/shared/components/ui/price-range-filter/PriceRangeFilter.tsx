import { useState } from 'react'
import { Divider, Input } from '@/components'
import { cn } from '@/lib/utils'

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

export function PriceRangeFilter({ className }: PriceRangeFilterProps) {
  const [minPrice, setMinPrice] = useState<string>('')
  const [maxPrice, setMaxPrice] = useState<string>('')

  const handleApply = () => {
    // You can implement custom logic here to handle the price range
    // For now, we'll just log the values
    console.log('Applying price range:', { min: minPrice, max: maxPrice })

    // Optional: Clear the selection or trigger a filter update
    // onRangeChange([]) // This would clear any previous selections
  }

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <h3 className="text-primary-500 font-semibold text-lg">Price Range</h3>

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

      <button
        onClick={handleApply}
        className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
      >
        Apply
      </button>
    </div>
  )
}
