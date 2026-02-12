import React from 'react'
import { IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5'

interface OrderPaginationProps {
  filteredCount: number
  total: number
  page: number
  totalPages: number
  isLoading: boolean
  onPageChange: (page: number) => void
}

export const OrderPagination: React.FC<OrderPaginationProps> = ({
  filteredCount,
  total,
  page,
  totalPages,
  isLoading,
  onPageChange
}) => {
  return (
    <div className="px-8 py-5 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-5 bg-gradient-to-r from-white to-neutral-50/50">
      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
        Showing <span className="text-slate-700">{filteredCount}</span> of{' '}
        <span className="text-slate-700">{total}</span> results
      </p>
      <div className="flex items-center gap-1.5">
        <button
          disabled={page === 1 || isLoading}
          onClick={() => onPageChange(page - 1)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[11px] font-semibold text-slate-400 hover:text-mint-600 hover:bg-mint-50/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all uppercase tracking-wider"
        >
          <IoChevronBackOutline size={14} />
          Prev
        </button>
        <div className="flex gap-1">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => onPageChange(i + 1)}
              className={`w-9 h-9 rounded-xl text-xs font-bold transition-all duration-200 ${
                page === i + 1
                  ? 'bg-gradient-to-r from-mint-500 to-emerald-500 text-white shadow-md shadow-mint-500/25 scale-105'
                  : 'text-slate-400 hover:bg-white hover:text-slate-700 hover:shadow-sm'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
        <button
          disabled={page === totalPages || isLoading}
          onClick={() => onPageChange(page + 1)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[11px] font-semibold text-slate-400 hover:text-mint-600 hover:bg-mint-50/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all uppercase tracking-wider"
        >
          Next
          <IoChevronForwardOutline size={14} />
        </button>
      </div>
    </div>
  )
}
