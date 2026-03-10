import { useState, useEffect, useRef, useCallback } from 'react'
import { FiSearch } from 'react-icons/fi'
import { cn } from '@/lib/utils'
import { useSearchInvoices } from '@/features/operations/hooks/useOperationInvoices'
import ResultSearchTable from '@/components/layout/staff/staff-core/resultsearchline/ResultSearchTable'
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

  // Use the new useSearchInvoices hook
  const { data, isFetching } = useSearchInvoices(debouncedQuery)
  
  const rawResults = data?.data?.invoiceList || []
  
  // Transform results into the shape ResultSearchTable expects ({id, orderCode})
  // Here orderCode maps to invoiceCode
  const searchResults = rawResults.map((inv) => ({
    id: inv.id || (inv as any)._id,
    searchCode: inv.invoiceCode
  }))

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false)
        setInputValue('') // Reset
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
      
      // Find the full invoice object to pass back up
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

  return (
    <div className="flex items-center gap-3 w-full sm:max-w-[320px] md:max-w-md">
      <div ref={wrapperRef} className="relative w-full z-10">
        <div className="relative">
          <input type="email" style={{ display: 'none' }} aria-hidden="true" />
          <input type="password" style={{ display: 'none' }} aria-hidden="true" />

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
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={handleFocus}
            placeholder="Search by invoice code..."
            autoComplete="one-time-code"
            data-lpignore="true"
            className={cn(
              'w-full h-10 pl-10 pr-4 text-sm font-medium transition-all duration-200 outline-none',
              'bg-mint-50/50 border rounded-xl',
              isOpen
                ? 'border-mint-500 ring-2 ring-mint-200 bg-white'
                : 'border-mint-400 hover:border-mint-500 bg-white'
            )}
          />

          {isFetching && debouncedQuery.length >= 2 && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="w-4 h-4 rounded-full border-2 border-mint-200 border-t-mint-500 animate-spin" />
            </span>
          )}
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
