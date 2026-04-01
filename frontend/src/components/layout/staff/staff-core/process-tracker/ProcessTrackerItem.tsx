import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ProgressTrackerItemProps {
  icon: ReactNode
  label: string
  isActive?: boolean
  isCompleted?: boolean
}

export default function ProgressTrackerItem({
  icon,
  label,
  isActive = false,
  isCompleted = false
}: ProgressTrackerItemProps) {
  const circleClass =
    isActive || isCompleted ? 'bg-mint-500 text-white' : 'bg-gray-200 text-gray-400'
  const textClass = isActive || isCompleted ? 'text-gray-600 font-medium' : 'text-gray-400'

  return (
    <div className="flex flex-col items-center flex-1">
      <div
        className={cn(
          'w-8 h-8 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mb-1 sm:mb-2 transition-all duration-300',
          circleClass
        )}
      >
        {icon}
      </div>
      <span className={cn('text-[10px] sm:text-xs text-center hidden sm:block', textClass)}>
        {label}
      </span>
    </div>
  )
}
