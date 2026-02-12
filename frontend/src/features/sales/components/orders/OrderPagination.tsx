import React from 'react'
import { IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5'

interface OrderPaginationProps {
  page: number
  totalPages: number
  isLoading: boolean
  onPageChange: (page: number) => void
}

export const OrderPagination: React.FC<OrderPaginationProps> = ({
  page,
  totalPages,
  isLoading,
  onPageChange
}) => {
  return (
    <div className="px-8 py-5 border-t border-neutral-50 flex items-center justify-between bg-white">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
        Page {page} of {totalPages}
      </p>

      <div className="flex items-center gap-2">
        <button
          disabled={page === 1 || isLoading}
          onClick={() => onPageChange(page - 1)}
          className="p-2 rounded-full text-slate-300 hover:text-slate-600 hover:bg-slate-50 disabled:opacity-30 transition-colors"
        >
          <IoChevronBackOutline size={18} />
        </button>
        <button
          disabled={page === totalPages || isLoading}
          onClick={() => onPageChange(page + 1)}
          className="p-2 rounded-full text-slate-300 hover:text-slate-600 hover:bg-slate-50 disabled:opacity-30 transition-colors"
        >
          <IoChevronForwardOutline size={18} />
        </button>
      </div>
    </div>
  )
}
