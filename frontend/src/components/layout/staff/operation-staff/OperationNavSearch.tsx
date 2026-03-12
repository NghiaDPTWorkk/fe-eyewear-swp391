import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiSearch } from 'react-icons/fi'
import { HiMenuAlt2 } from 'react-icons/hi'
import { cn } from '@/lib/utils'
import { useLayoutStore } from '@/store/layout.store'
import { useSearchOrders } from '@/features/staff/hooks/orders/useOrders'
import { PATHS } from '@/routes/paths'
import ResultSearchTable from '@/components/layout/staff/staff-core/result-search-line/ResultSearchTable'

// Key lưu lịch sử search vào localStorage
const HISTORY_KEY = 'op_search_history'
const MAX_HISTORY = 20

// ===== Helpers =====
function getHistory(): string[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveToHistory(orderCode: string) {
  const history = getHistory().filter((c) => c !== orderCode)
  history.unshift(orderCode)
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, MAX_HISTORY)))
}

// ===== useDebounce hook nhỏ =====
function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debouncedValue
}

// ===== Component =====
export default function OperationNavSearch() {
  const navigate = useNavigate()
  const { toggleSidebar } = useLayoutStore()

  const [inputValue, setInputValue] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [historyItems, setHistoryItems] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  // Explicitly clear value on mount to defeat browser autofill
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }, [])

  const wrapperRef = useRef<HTMLDivElement>(null)

  // Debounce input 300ms trước khi truyền vào hook
  const debouncedQuery = useDebounce(inputValue, 300)

  // Gọi API search
  const { data, isFetching } = useSearchOrders(debouncedQuery)

  // Lấy danh sách orders từ response — map sang { id, orderCode }
  const searchResults = (data?.data?.orders?.data || []).map((o: any) => ({
    id: o._id,
    searchCode: o.orderCode
  }))

  // Đóng dropdown và reset input khi click bên ngoài
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false)
        setInputValue('') // Reset về rỗng để thanh search trở về trạng thái ban đầu
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Khi mở dropdown, load lịch sử mới nhất từ localStorage
  const handleFocus = useCallback(() => {
    setHistoryItems(getHistory())
    setIsOpen(true)
  }, [])

  // Xử lý khi chọn 1 kết quả search
  const handleSelect = useCallback(
    (item: { id: string; searchCode: string }) => {
      saveToHistory(item.searchCode)
      setIsOpen(false)
      setInputValue('')
      navigate(PATHS.OPERATIONSTAFF.ORDER_DETAIL(item.id))
    },
    [navigate]
  )

  // Xử lý khi chọn từ lịch sử — chỉ điền vào input và search lại
  const handleSelectHistory = useCallback((searchCode: string) => {
    setInputValue(searchCode)
  }, [])

  return (
    <div className="flex items-center gap-3 w-full pr-2">
      {/* Toggle sidebar button (mobile) */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden p-2 rounded-lg text-neutral-500 hover:bg-neutral-50 transition-colors"
      >
        <HiMenuAlt2 className="text-2xl" />
      </button>

      {/* Search input + dropdown wrapper */}
      <div ref={wrapperRef} className="relative max-w-lg flex-1">
        {/* Input */}
        {/* Input area with anti-autofill dummy fields */}
        <div className="relative">
          {/* Hidden inputs to trick browsers that try to autofill the search bar */}
          <input type="email" style={{ display: 'none' }} aria-hidden="true" />
          <input type="password" style={{ display: 'none' }} aria-hidden="true" />

          {/* Icon kính lúp */}
          <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none flex items-center">
            <FiSearch
              className={cn(
                'text-xl transition-colors duration-200',
                isOpen ? 'text-mint-600' : 'text-mint-700'
              )}
            />
          </span>

          <input
            ref={inputRef}
            type="text"
            id="opticview-op-nav-search-v3"
            name="opticview-op-nav-search-v3"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={handleFocus}
            placeholder="Search orders..."
            autoComplete="one-time-code"
            data-lpignore="true"
            className={cn(
              'w-full h-10 pl-10 pr-4 text-sm font-medium transition-all duration-200 outline-none',
              'bg-mint-200 border rounded-xl',
              isOpen
                ? 'border-mint-500 ring-2 ring-mint-200 bg-white'
                : 'border-mint-400 hover:border-mint-500'
            )}
          />

          {/* Loading indicator nhỏ trong input */}
          {isFetching && debouncedQuery.length >= 2 && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="w-4 h-4 rounded-full border-2 border-mint-200 border-t-mint-500 animate-spin" />
            </span>
          )}
        </div>

        {/* Dropdown */}
        {isOpen && (
          <ResultSearchTable
            results={searchResults}
            historyItems={historyItems}
            isLoading={isFetching && debouncedQuery.trim().length >= 2}
            query={debouncedQuery}
            onSelect={handleSelect}
            onSelectHistory={handleSelectHistory}
          />
        )}
      </div>
    </div>
  )
}
