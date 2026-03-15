import { useState, useEffect, useRef, useCallback } from 'react'
import { IoSearchOutline } from 'react-icons/io5'
import { cn } from '@/lib/utils'
import { useSearchVouchersByCode } from '@/features/manager-staff/hooks/useManagerVouchers'
import ResultSearchTable from '@/components/layout/staff/staff-core/result-search-line/ResultSearchTable'
import { useNavigate } from 'react-router-dom'
import { PATHS } from '@/routes/paths'

const HISTORY_KEY = 'manager_voucher_search_history'
const MAX_HISTORY = 10

function getHistory(): string[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveToHistory(code: string) {
  const history = getHistory().filter((c) => c !== code)
  history.unshift(code)
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, MAX_HISTORY)))
}

function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debouncedValue
}

export default function ManagerVoucherSearch() {
  const navigate = useNavigate()
  const [inputValue, setInputValue] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [historyItems, setHistoryItems] = useState<string[]>([])
  const wrapperRef = useRef<HTMLDivElement>(null)

  const debouncedQuery = useDebounce(inputValue, 300)
  const { data, isFetching } = useSearchVouchersByCode(debouncedQuery)

  const items = data?.data?.items
  const rawResults = data?.data?.voucherList ?? (Array.isArray(items) ? items : items?.data || [])
  const searchResults = rawResults.map((v) => ({
    id: v._id,
    searchCode: v.code
  }))

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleFocus = useCallback(() => {
    setHistoryItems(getHistory())
    setIsOpen(true)
  }, [])

  const handleSelect = useCallback(
    (item: { id: string; searchCode: string }) => {
      saveToHistory(item.searchCode)
      setIsOpen(false)
      setInputValue('')
      navigate(PATHS.MANAGER.VOUCHER_DETAIL(item.id))
    },
    [navigate]
  )

  const handleSelectHistory = useCallback((code: string) => {
    setInputValue(code)
  }, [])

  return (
    <div ref={wrapperRef} className="flex-1 max-w-md relative z-[60]">
      <div className="relative">
        <IoSearchOutline
          className={cn(
            'absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200',
            isOpen ? 'text-mint-600' : 'text-neutral-400'
          )}
          size={18}
        />
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={handleFocus}
          placeholder="Search by name or code..."
          className={cn(
            'w-full pl-11 pr-4 py-2.5 bg-neutral-50 border rounded-xl text-sm font-medium transition-all outline-none font-sans',
            isOpen
              ? 'border-mint-500 ring-4 ring-mint-500/10 bg-white'
              : 'border-neutral-100 hover:border-neutral-200'
          )}
        />
        {isFetching && debouncedQuery.length >= 2 && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-4 h-4 rounded-full border-2 border-mint-200 border-t-mint-500 animate-spin" />
          </span>
        )}
      </div>

      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-2">
          <ResultSearchTable
            results={searchResults}
            historyItems={historyItems}
            isLoading={isFetching && debouncedQuery.trim().length >= 2}
            query={debouncedQuery}
            onSelect={handleSelect}
            onSelectHistory={handleSelectHistory}
            label="vouchers"
          />
        </div>
      )}
    </div>
  )
}
