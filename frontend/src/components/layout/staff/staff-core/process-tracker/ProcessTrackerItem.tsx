import type { ReactNode } from 'react'

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
        className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${circleClass}`}
      >
        {icon}
      </div>
      <span className={`text-xs text-center ${textClass}`}>{label}</span>
    </div>
  )
}
