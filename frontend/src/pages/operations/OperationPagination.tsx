import { IoChevronBack, IoChevronForward } from 'react-icons/io5'

interface OperationPaginationProps {
  /** Trang hiện tại (từ BE) */
  page: number
  totalPages: number
  total: number
  limit: number
  onPageChange: (newPage: number) => void
}

export default function OperationPagination({
  page,
  totalPages,
  total,
  limit,
  onPageChange
}: OperationPaginationProps) {
  if (totalPages <= 1) return null

  // Số item đang hiển thị: từ item nào đến item nào
  const rangeStart = (page - 1) * limit + 1
  const rangeEnd = Math.min(page * limit, total)

  // Tạo danh sách số trang hiển thị (hiện tối đa 5 trang, ellipsis khi cần)
  const getPageNumbers = (): (number | 'ellipsis')[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    const pages: (number | 'ellipsis')[] = [1]

    if (page > 3) pages.push('ellipsis')

    const start = Math.max(2, page - 1)
    const end = Math.min(totalPages - 1, page + 1)

    for (let i = start; i <= end; i++) pages.push(i)

    if (page < totalPages - 2) pages.push('ellipsis')

    pages.push(totalPages)
    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 px-1">
      {/* Hiển thị range và total */}
      <p className="text-sm text-gray-500">
        Showing{' '}
        <span className="font-semibold text-gray-700">
          {rangeStart}–{rangeEnd}
        </span>{' '}
        of{' '}
        <span className="font-semibold text-gray-700">{total}</span> orders
      </p>

      {/* Nút phân trang */}
      <div className="flex items-center gap-1">
        {/* Prev */}
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="
            flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg
            border border-neutral-200 bg-white text-gray-600
            hover:bg-neutral-50 hover:border-neutral-300
            disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white
            transition-colors
          "
        >
          <IoChevronBack size={14} />
          Prev
        </button>

        {/* Số trang */}
        <div className="flex items-center gap-1">
          {pageNumbers.map((p, idx) =>
            p === 'ellipsis' ? (
              <span
                key={`ellipsis-${idx}`}
                className="px-2 py-2 text-sm text-gray-400 select-none"
              >
                …
              </span>
            ) : (
              <button
                key={p}
                onClick={() => onPageChange(p as number)}
                className={`
                  w-9 h-9 flex items-center justify-center text-sm font-medium rounded-lg
                  border transition-colors
                  ${
                    p === page
                      ? 'bg-mint-900 text-white border-mint-900 shadow-sm'
                      : 'bg-white text-gray-700 border-neutral-200 hover:bg-neutral-50 hover:border-neutral-300'
                  }
                `}
              >
                {p}
              </button>
            )
          )}
        </div>

        {/* Next */}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="
            flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg
            border border-neutral-200 bg-white text-gray-600
            hover:bg-neutral-50 hover:border-neutral-300
            disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white
            transition-colors
          "
        >
          Next
          <IoChevronForward size={14} />
        </button>
      </div>
    </div>
  )
}
