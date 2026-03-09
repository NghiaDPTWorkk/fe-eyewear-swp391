import { useState } from 'react'
import { FiSearch } from 'react-icons/fi'
import { MdHistory } from 'react-icons/md'
import { IoChevronDown } from 'react-icons/io5'
import ResultSearchLine from './ResultSearchLine'

const PAGE_SIZE = 8 // Hiện 8 dòng mỗi lần

interface SearchResultItem {
  id: string
  searchCode: string
}

interface ResultSearchTableProps {
  results: SearchResultItem[]
  historyItems: string[]
  isLoading: boolean
  query: string
  onSelect: (item: SearchResultItem) => void
  onSelectHistory: (searchCode: string) => void
  label?: string
}

export default function ResultSearchTable({
  results,
  historyItems,
  isLoading,
  query,
  onSelect,
  onSelectHistory,
  label = 'orders'
}: ResultSearchTableProps) {
  const hasQuery = query.trim().length >= 2

  // Số dòng đang hiển thị cho kết quả search
  const [visibleItemCount, setVisibleItemCount] = useState(PAGE_SIZE)
  // Số dòng đang hiển thị cho lịch sử
  const [visibleHistoryCount, setVisibleHistoryCount] = useState(PAGE_SIZE)

  const visibleResults = results.slice(0, visibleItemCount)
  const hasMoreResults = results.length > visibleItemCount

  const visibleHistory = historyItems.slice(0, visibleHistoryCount)
  const hasMoreHistory = historyItems.length > visibleHistoryCount

  return (
    <div className="absolute left-5 right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-neutral-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200 max-h-[460px] overflow-y-auto">
      {hasQuery && (
        <>
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-10 gap-3">
              <div className="w-12 h-12 rounded-full border-4 border-mint-100 border-t-mint-500 animate-spin" />
              <p className="text-sm text-neutral-400 font-medium">Searching......</p>
            </div>
          )}

          {!isLoading && results.length === 0 && (
            <div className="flex flex-col items-center justify-center py-10 gap-2">
              <div className="w-12 h-12 rounded-full bg-neutral-50 flex items-center justify-center text-neutral-300">
                <FiSearch size={22} />
              </div>
              <p className="text-sm text-neutral-500 font-medium">
                No matching results found for &ldquo;{query}&rdquo;
              </p>
            </div>
          )}

          {!isLoading && results.length > 0 && (
            <div>
              <div className="px-4 pt-3 pb-1 flex items-center justify-between">
                <p className="text-sm font-semibold text-neutral-400 tracking-wider">
                  Search results for &ldquo;{query}&rdquo;
                </p>
                <p className="text-xs text-neutral-400">
                  {results.length} {label} found
                </p>
              </div>

              <div className="divide-y divide-neutral-50">
                {visibleResults.map((item) => (
                  <ResultSearchLine
                    key={item.id}
                    searchCode={item.searchCode}
                    onClick={() => onSelect(item)}
                  />
                ))}
              </div>

              {/* Show more button */}
              {hasMoreResults && (
                <button
                  type="button"
                  onClick={() => setVisibleItemCount((prev) => prev + PAGE_SIZE)}
                  className="w-full flex items-center justify-center gap-1.5 py-3 text-sm font-semibold text-mint-600 hover:bg-mint-50 transition-colors border-t border-neutral-50"
                >
                  <IoChevronDown size={16} />
                  View more ({results.length - visibleItemCount} more {label} )
                </button>
              )}
            </div>
          )}
        </>
      )}

      {/* ===== Khi KHÔNG CÓ QUERY —  chỉ hiện lịch sử - dùng khi mới nhấp vô thanh search á ===== */}
      {!hasQuery && (
        <>
          {historyItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2">
              <div className="w-12 h-12 rounded-full bg-neutral-50 flex items-center justify-center text-neutral-300">
                <FiSearch size={22} />
              </div>
              <p className="text-sm text-neutral-400 font-medium">Enter a keyword to search</p>
            </div>
          ) : (
            <div>
              <div className="px-4 pt-3 pb-1 flex items-center gap-2">
                <MdHistory className="text-neutral-400" size={14} />
                <p className="text-sm font-semibold text-neutral-400 tracking-wider">
                  Current search history
                </p>
              </div>
              <div className="divide-y divide-neutral-50">
                {visibleHistory.map((code) => (
                  <ResultSearchLine
                    key={code}
                    searchCode={code}
                    isHistory
                    onClick={() => onSelectHistory(code)}
                  />
                ))}
              </div>

              {/* Show more history */}
              {hasMoreHistory && (
                <button
                  type="button"
                  onClick={() => setVisibleHistoryCount((prev) => prev + PAGE_SIZE)}
                  className="w-full flex items-center justify-center gap-1.5 py-3 text-sm font-semibold text-neutral-500 hover:bg-neutral-50 transition-colors border-t border-neutral-50"
                >
                  <IoChevronDown size={16} />
                  View more ({historyItems.length - visibleHistoryCount} other items)
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
