import { FiSearch } from 'react-icons/fi'
import { cn } from '@/lib/utils'

interface ResultSearchLineProps {
  orderCode: string
  onClick: () => void
  isHistory?: boolean
  className?: string
}

export default function ResultSearchLine({
  orderCode,
  onClick,
  isHistory = false,
  className
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
      {/* Icon kính lúp bên tay trái */}
      <span
        className={cn(
          'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors',
          isHistory
            ? 'bg-neutral-100 text-neutral-500 group-hover:bg-mint-100 group-hover:text-mint-600'
            : 'bg-mint-100 text-mint-600 group-hover:bg-mint-200'
        )}
      >
        <FiSearch size={14} />
      </span>

      {/* OrderCode text */}
      <span className="font-medium text-neutral-800 group-hover:text-mint-700 transition-colors text-sm truncate">
        {orderCode}
      </span>
    </button>
  )
}
