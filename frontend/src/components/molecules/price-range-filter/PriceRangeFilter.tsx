import { useState } from 'react'
import { Checkbox, Input } from '@/components/atoms'
import { cn } from '@/lib/utils'
import { Divider } from '@/components/atoms/divider'

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
  const [localSelected, setLocalSelected] = useState<string[]>(selectedRanges)
  const [minPrice, setMinPrice] = useState<string>('')
  const [maxPrice, setMaxPrice] = useState<string>('')

  const handleCheckboxChange = (rangeId: string, checked: boolean) => {
    const newSelected = checked
      ? [...localSelected, rangeId]
      : localSelected.filter((id) => id !== rangeId)

    setLocalSelected(newSelected)
    onRangeChange(newSelected)
  }

  // const handleClear = () => {
  //   setLocalSelected([])
  //   setMinPrice('')
  //   setMaxPrice('')
  //   onRangeChange([])
  //   if (onClear) {
  //     onClear()
  //   }
  // }

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <h3 className="text-primary-500 font-semibold text-lg">Price Range</h3>

      <div className="flex flex-col gap-2">
        {ranges.map((range) => (
          <Checkbox
            key={range.id}
            id={`price-range-${range.id}`}
            label={range.label}
            isChecked={localSelected.includes(range.id)}
            onCheckedChange={(checked) => handleCheckboxChange(range.id, checked)}
            size="sm"
          />
        ))}
      </div>

      <div className="flex gap-2 mt-2">
        <Input
          type="number"
          placeholder="min"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          size="sm"
          className="flex-1 w-[40%]"
        />
        <Divider text="to"></Divider>
        <Input
          type="number"
          placeholder="max"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          size="sm"
          className="flex-1 w-[40%]"
        />
      </div>
    </div>
  )
}
