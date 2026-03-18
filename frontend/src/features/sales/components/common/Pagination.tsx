/**
 * Pagination Component
 * Reusable pagination controls for all SaleStaff table views.
 */
import { Button } from '@/shared/components/ui-core'
import { IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5'

interface PaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  onPageChange: (page: number) => void
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange
}: PaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  return (
    <div className="p-4 border-t border-neutral-50/50 flex justify-between items-center text-sm text-gray-500">
      <span>
        Showing {startItem}-{endItem} of {totalItems} items
      </span>
      <div className="flex gap-2">
        <Button
          variant="outline"
          colorScheme="neutral"
          size="sm"
          className="px-2 border-neutral-200"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          <IoChevronBackOutline />
        </Button>

        {/* Page numbers */}
        {Array.from({ length: Math.min(3, totalPages) }, (_, i) => i + 1).map((page) => (
          <Button
            key={page}
            variant={page === currentPage ? 'solid' : 'outline'}
            colorScheme={page === currentPage ? 'primary' : 'neutral'}
            size="sm"
            className="min-w-[32px] px-2"
            onClick={() => onPageChange(page)}
          >
            {page}
          </Button>
        ))}

        {totalPages > 3 && <span className="px-1 text-neutral-300 self-center">...</span>}

        <Button
          variant="outline"
          colorScheme="neutral"
          size="sm"
          className="px-2 border-neutral-200"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          <IoChevronForwardOutline />
        </Button>
      </div>
    </div>
  )
}
