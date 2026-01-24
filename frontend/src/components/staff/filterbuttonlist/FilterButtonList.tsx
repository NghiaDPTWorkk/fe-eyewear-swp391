import { cn } from '@/lib/utils'
import { Button } from '@/components'

interface FilterButton {
  label: string
  count: number
  value: string
}

interface FilterButtonListProps {
  buttons: FilterButton[]
  selectedValue: string
  onChange: (value: string) => void
  className?: string
}

export default function FilterButtonList({
  buttons,
  selectedValue,
  onChange,
  className
}: FilterButtonListProps) {
  return (
    <div className={cn('flex items-center gap-3 mb-6', className)}>
      {buttons.map((btn) => {
        const isActive = selectedValue === btn.value
        return (
          <Button
            key={btn.value}
            onClick={() => onChange(btn.value)}
            variant={isActive ? 'solid' : 'ghost'}
            colorScheme={isActive ? 'primary' : 'neutral'}
            className={cn(
              'rounded-xl text-sm font-semibold transition-all duration-300 px-4 py-2 flex items-center gap-2 border',
              isActive
                ? 'bg-mint-50 border-mint-100 text-mint-700 shadow-sm'
                : 'bg-white border-neutral-100 text-neutral-500 hover:bg-neutral-50 hover:border-neutral-200'
            )}
            size="sm"
          >
            {btn.label}
            <span
              className={cn(
                'px-1.5 py-0.5 rounded-md text-[10px] font-bold',
                isActive ? 'bg-mint-500 text-white' : 'bg-neutral-100 text-neutral-500'
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
