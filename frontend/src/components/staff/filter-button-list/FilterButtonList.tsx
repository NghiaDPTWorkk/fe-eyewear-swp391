import { cn } from '@/lib/utils'
import { Button } from '@/components'

interface FilterButton {
  label: string
  count: number
  value: string
}

interface FilterButtonListProps {
  Buttons: FilterButton[]
  selectedValue: string
  onChange: (value: string) => void
  className?: string
}

export default function FilterButtonList({
  Buttons,
  selectedValue,
  onChange,
  className
}: FilterButtonListProps) {
  return (
    <div className={cn('flex items-center gap-3 mb-6', className)}>
      {Buttons.map((btn) => {
        const isActive = selectedValue === btn.value
        return (
          <Button
            key={btn.value}
            onClick={() => onChange(btn.value)}
            variant={isActive ? 'solid' : 'ghost'}
            colorScheme={isActive ? 'primary' : 'neutral'}
            className={cn(
              'rounded-lg text-sm font-medium transition-colors',
              isActive ? 'shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            )}
            size="sm"
          >
            {btn.label}
            <span
              className={cn(
                'ml-2 px-1.5 py-0.5 rounded-md text-xs',
                isActive ? 'bg-white/20 text-white' : 'bg-white text-gray-500'
              )}
            >
              {btn.count}
            </span>
          </Button>
        )
      })}
    </div>
  )
}
