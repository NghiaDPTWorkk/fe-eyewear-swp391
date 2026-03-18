import { useState, useRef } from 'react'
import { IoChevronBack, IoChevronForward } from 'react-icons/io5'

interface OperationPaginationProps {
  page: number
  totalPages: number
  total: number
  limit: number
  onPageChange: (newPage: number) => void
  /** Số items đang hiển thị ở trang hiện tại — nếu = 0 thì ẩn pagination */
  itemsOnPage?: number
}

export default function OperationPagination({
  page,
  totalPages,
  total,
  onPageChange,
  itemsOnPage
}: OperationPaginationProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  // Ẩn nếu không có data, chỉ 1 trang, hoặc trang hiện tại không có items
  if (total === 0 || totalPages <= 1 || (itemsOnPage !== undefined && itemsOnPage === 0))
    return null

  const handlePageClick = () => {
    setInputValue(String(page))
    setIsEditing(true)
    setTimeout(() => inputRef.current?.select(), 0)
  }

  const commitInput = () => {
    const parsed = parseInt(inputValue, 10)
    if (!isNaN(parsed)) {
      // Clamp trong khoảng [1, totalPages]
      const clamped = Math.min(Math.max(parsed, 1), totalPages)
      onPageChange(clamped)
    }
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') commitInput()
    if (e.key === 'Escape') setIsEditing(false)
  }

  const btnBase =
    'flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg border transition-colors'
  const btnActive =
    'bg-white text-gray-700 border-neutral-200 hover:bg-neutral-50 hover:border-neutral-300'
  const btnDisabled = 'bg-white text-gray-300 border-neutral-100 cursor-not-allowed'

  return (
    <div className="flex items-center justify-between mt-6">
      {/* Chỉ số trang bên trái */}
      <p className="text-sm text-gray-500">
        Page <span className="font-semibold text-gray-700">{page}</span> of{' '}
        <span className="font-semibold text-gray-700">{totalPages}</span>
      </p>

      {/* Nút điều hướng */}
      <div className="flex items-center gap-3">
        {/* ← Prev */}
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className={`${btnBase} ${page === 1 ? btnDisabled : btnActive}`}
        >
          <IoChevronBack size={14} />
          Prev
        </button>

        {/* Ô số trang — click để nhập */}
        {isEditing ? (
          <input
            ref={inputRef}
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={commitInput}
            onKeyDown={handleKeyDown}
            className="
            w-16 h-9 text-center text-sm font-semibold
            border border-mint-400 rounded-lg outline-none
            focus:ring-2 focus:ring-mint-300
            [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
          "
          />
        ) : (
          <button
            onClick={handlePageClick}
            title="Click để nhảy tới trang bất kỳ"
            className="
            w-9 h-9 flex items-center justify-center
            text-sm font-semibold rounded-lg border
            bg-mint-900 text-white border-mint-900 shadow-sm
            hover:bg-mint-700 transition-colors cursor-text
          "
          >
            {page}
          </button>
        )}

        {/* Next → */}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className={`${btnBase} ${page === totalPages ? btnDisabled : btnActive}`}
        >
          Next
          <IoChevronForward size={14} />
        </button>
      </div>
    </div>
  )
}
