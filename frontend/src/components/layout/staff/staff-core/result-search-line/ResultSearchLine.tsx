import { type ReactNode } from 'react'
import { FiSearch } from 'react-icons/fi'
import { cn } from '@/lib/utils'

interface ResultSearchLineProps {
  searchCode: string
  onClick: () => void
  isHistory?: boolean
  className?: string
  icon?: ReactNode
}

export default function ResultSearchLine({
  searchCode,
  onClick,
  isHistory = false,
  className,
  icon
}: ResultSearchLineProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 px-4 py-3 hover:bg-mint-50 transition-colors duration-150 group text-left',
        className
      )}
    >
      {/* Icon bên tay trái */}
      <span
        className={cn(
          'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200',
          isHistory
            ? 'bg-neutral-50 text-neutral-400 group-hover:bg-neutral-100 group-hover:text-neutral-500'
            : icon
              ? 'bg-neutral-50 text-neutral-500 group-hover:bg-white border group-hover:border-neutral-100 group-hover:shadow-sm'
              : 'bg-mint-50 text-mint-600 group-hover:bg-mint-100'
        )}
      >
        {icon ? <span className="text-lg">{icon}</span> : <FiSearch size={14} />}
      </span>

      {/* searchCode text */}
      <div className="flex flex-col min-w-0">
        <span className="font-medium text-slate-700 group-hover:text-mint-700 transition-colors text-sm truncate">
          {searchCode}
        </span>
      </div>
    </button>
  )
}
