import { FiSearch } from 'react-icons/fi'
import { MdHistory } from 'react-icons/md'
import ResultSearchLine from './ResultSearchLine'

interface SearchResultItem {
  id: string
  orderCode: string
}

interface ResultSearchTableProps {
  results: SearchResultItem[]
  historyItems: string[] // orderCode strings từ localStorage
  isLoading: boolean
  query: string
  onSelect: (item: SearchResultItem) => void
  onSelectHistory: (orderCode: string) => void
}

export default function ResultSearchTable({
  results,
  historyItems,
  isLoading,
  query,
  onSelect,
  onSelectHistory
}: ResultSearchTableProps) {
  const hasQuery = query.trim().length >= 2

  return (
    <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-neutral-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200 max-h-[420px] overflow-y-auto">

      {/* ===== ĐANG SEARCH (có query) ===== */}
      {hasQuery && (
        <>
          {isLoading && (
            // Loading state: spinner lớn giữa panel
            <div className="flex flex-col items-center justify-center py-10 gap-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-full border-4 border-mint-100 border-t-mint-500 animate-spin" />
              </div>
              <p className="text-sm text-neutral-400 font-medium">Đang tìm kiếm...</p>
            </div>
          )}

          {!isLoading && results.length === 0 && (
            // Không có kết quả — kiểu Facebook
            <div className="flex flex-col items-center justify-center py-10 gap-2">
              <div className="w-12 h-12 rounded-full bg-neutral-50 flex items-center justify-center text-neutral-300">
                <FiSearch size={22} />
              </div>
              <p className="text-sm text-neutral-500 font-medium">
                Không tìm thấy kết quả cho &ldquo;{query}&rdquo;
              </p>
            </div>
          )}

          {!isLoading && results.length > 0 && (
            <div>
              <div className="px-4 pt-3 pb-1">
                <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                  Kết quả tìm kiếm
                </p>
              </div>
              <div className="divide-y divide-neutral-50">
                {results.slice(0, 10).map((item) => (
                  <ResultSearchLine
                    key={item.id}
                    orderCode={item.orderCode}
                    onClick={() => onSelect(item)}
                  />
                ))}
              </div>
              {results.length > 10 && (
                <div className="px-4 py-2 border-t border-neutral-50">
                  <p className="text-xs text-neutral-400">Hiển thị 10 / {results.length} kết quả</p>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* ===== KHÔNG CÓ QUERY — Hiện lịch sử ===== */}
      {!hasQuery && (
        <>
          {historyItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2">
              <div className="w-12 h-12 rounded-full bg-neutral-50 flex items-center justify-center text-neutral-300">
                <FiSearch size={22} />
              </div>
              <p className="text-sm text-neutral-400 font-medium">Nhập mã đơn để tìm kiếm</p>
            </div>
          ) : (
            <div>
              <div className="px-4 pt-3 pb-1 flex items-center gap-2">
                <MdHistory className="text-neutral-400" size={14} />
                <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                  Tìm kiếm gần đây
                </p>
              </div>
              <div className="divide-y divide-neutral-50">
                {historyItems.map((code) => (
                  <ResultSearchLine
                    key={code}
                    orderCode={code}
                    isHistory
                    onClick={() => onSelectHistory(code)}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
