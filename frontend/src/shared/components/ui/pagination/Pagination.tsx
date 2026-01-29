import { IoArrowForward } from 'react-icons/io5'
import { cn } from '@/lib/utils'

export interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
  totalItems?: number
  itemsPerPage?: number
}

export function Pagination({ currentPage, totalPages, onPageChange, className }: PaginationProps) {
  const canPrev = currentPage > 1
  const canNext = currentPage < totalPages

  return (
    <div className={cn('flex items-center justify-center gap-4 py-4', className)}>
      <button
        className="px-4 py-2 rounded-xl border-2 border-mint-300 bg-white text-mint-1200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-mint-200 transition-all"
        disabled={!canPrev}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Prev
      </button>

      <div className="text-sm text-gray-eyewear">
        Page <span className="font-semibold text-mint-1200">{currentPage}</span> /{' '}
        <span className="font-semibold text-mint-1200">{totalPages || 1}</span>
      </div>

      <button
        className="px-4 py-2 rounded-xl border-2 border-mint-300 bg-white text-mint-1200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-mint-200 transition-all inline-flex items-center gap-2"
        disabled={!canNext}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  )
}

function ArrowRight({ className }: { className?: string }) {
  return <IoArrowForward className={className} />
}
