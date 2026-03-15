import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { FiSearch, FiX } from 'react-icons/fi'
import { cn } from '@/lib/utils'
import { useSearchInvoices } from '@/features/operations/hooks/useOperationInvoices'
import ResultSearchTable from '@/components/layout/staff/staff-core/result-search-line/ResultSearchTable'
import type { OperationInvoiceListItem } from '@/shared/types'

const HISTORY_KEY = 'op_invoice_search_history'
const MAX_HISTORY = 20

function getHistory(): string[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveToHistory(invoiceCode: string) {
  const history = getHistory().filter((c) => c !== invoiceCode)
  history.unshift(invoiceCode)
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

interface OperationInvoiceSearchProps {
  onSelectInvoice: (invoice: OperationInvoiceListItem) => void
}

export default function OperationInvoiceSearch({ onSelectInvoice }: OperationInvoiceSearchProps) {
  const [inputValue, setInputValue] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [historyItems, setHistoryItems] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const debouncedQuery = useDebounce(inputValue, 300)

  const { data, isFetching } = useSearchInvoices(debouncedQuery)

  const rawResults = useMemo(() => data?.data?.invoiceList || [], [data])

  const searchResults = useMemo(
    () =>
      rawResults.map((inv) => ({
        id: inv.id || (inv as any)._id,
        searchCode: inv.invoiceCode
      })),
    [rawResults]
  )

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

      const selectedInvoiceFull = rawResults.find((inv) => (inv.id || (inv as any)._id) === item.id)
      if (selectedInvoiceFull) {
        onSelectInvoice(selectedInvoiceFull)
      }
    },
    [rawResults, onSelectInvoice]
  )

  const handleSelectHistory = useCallback((invoiceCode: string) => {
    setInputValue(invoiceCode)
  }, [])

  const handleClear = () => {
    setInputValue('')
    inputRef.current?.focus()
  }

  return (
    <div className="flex items-center gap-3 w-full sm:max-w-[320px] md:max-w-md">
      <div ref={wrapperRef} className="relative w-full z-10">
        <div className="relative group">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none flex items-center">
            <FiSearch
              className={cn(
                'text-lg transition-colors duration-200',
                isOpen ? 'text-mint-600' : 'text-neutral-400 group-hover:text-mint-500'
              )}
            />
          </span>

          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={handleFocus}
            placeholder="Search by invoice code..."
            autoComplete="off"
            className={cn(
              'w-full h-11 pl-10 pr-10 text-sm font-medium transition-all duration-200 outline-none',
              'bg-white border rounded-2xl shadow-sm',
              isOpen
                ? 'border-mint-500 ring-4 ring-mint-50'
                : 'border-neutral-200 hover:border-mint-400'
            )}
          />

          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {isFetching && debouncedQuery.length >= 2 ? (
              <div className="w-5 h-5 rounded-full border-2 border-mint-100 border-t-mint-500 animate-spin" />
            ) : (
              inputValue && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-1 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-600 transition-colors"
                >
                  <FiX size={16} />
                </button>
              )
            )}
          </div>
        </div>

        {isOpen && (
          <ResultSearchTable
            results={searchResults}
            historyItems={historyItems}
            isLoading={isFetching && debouncedQuery.trim().length >= 2}
            query={debouncedQuery}
            onSelect={handleSelect}
            onSelectHistory={handleSelectHistory}
            label="invoices"
          />
        )}
      </div>
    </div>
  )
}
