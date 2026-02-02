import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components'

export interface FilterSectionProps {
  title: string
  children: React.ReactNode
  defaultExpanded?: boolean
  className?: string
}

export function FilterSection({
  title,
  children,
  defaultExpanded = false,
  className
}: FilterSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  return (
    <div className={cn('border-b border-mint-300 last:border-b-0', className)}>
      <Button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between py-3 text-left hover:bg-mint-200/50 transition-colors rounded-lg px-2"
      >
        <span className="text-gray-eyewear font-medium text-sm">{title}</span>
        <ChevronDown
          className={cn(
            'w-4 h-4 text-gray-eyewear transition-transform duration-200',
            isExpanded && 'rotate-180'
          )}
        />
      </Button>

      {isExpanded && (
        <div className="pb-3 px-2 animate-in slide-in-from-top-2 duration-200">{children}</div>
      )}
    </div>
  )
}
