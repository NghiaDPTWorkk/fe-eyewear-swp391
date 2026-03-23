import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { FiSearch } from 'react-icons/fi'
import { HiMenuAlt2 } from 'react-icons/hi'
import { cn } from '@/lib/utils'
import { useLayoutStore } from '@/store/layout.store'
import { useSearchOrders } from '@/features/staff/hooks/orders/useOrders'
import { useAdminProducts } from '@/features/manager/hooks/useAdminProducts'
import { PATHS } from '@/routes/paths'
import ResultSearchTable from '@/components/layout/staff/staff-core/result-search-line/ResultSearchTable'
import { Button } from '@/shared/components/ui-core'
import { BsBoxSeam, BsReceipt } from 'react-icons/bs'

// MAX_HISTORY constants
const MAX_HISTORY = 20

// ===== Helpers =====
function getHistory(key: string): string[] {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveToHistory(key: string, orderCode: string) {
  const history = getHistory(key).filter((c) => c !== orderCode)
  history.unshift(orderCode)
  localStorage.setItem(key, JSON.stringify(history.slice(0, MAX_HISTORY)))
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

export interface NavSearchProps {
  className?: string
  inputContainerClassName?: string
  placeholder?: string
  styleVariant?: 'default' | 'operation' | 'manager'
}

export function NavSearch({
  className,
  inputContainerClassName,
  placeholder,
  styleVariant = 'operation'
}: NavSearchProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { toggleSidebar } = useLayoutStore()

  const [inputValue, setInputValue] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [historyItems, setHistoryItems] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Determine history key based on path
  const historyKey = location.pathname.startsWith('/manager')
    ? 'manager_search_history'
    : location.pathname.startsWith('/sale-staff')
      ? 'sale_search_history'
      : 'op_search_history'

  // Debounce input 300ms trước khi truyền vào hook
  const debouncedQuery = useDebounce(inputValue, 300)

  // Gọi API search orders
  const { data: orderData, isFetching: isFetchingOrders } = useSearchOrders(debouncedQuery)

  // Gọi API search products (chỉ khi là manager)
  const isManager = styleVariant === 'manager'
  const { data: productData, isFetching: isFetchingProducts } = useAdminProducts(
    1,
    10,
    undefined,
    undefined,
    isManager && debouncedQuery.trim().length >= 2 ? debouncedQuery : undefined
  )

  const isFetching = isFetchingOrders || isFetchingProducts

  // Explicitly clear value on mount to defeat browser autofill
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }, [])

  // Combine results
  const searchResults = [
    ...(orderData?.data?.orders?.data || []).map((o: any) => ({
      id: o._id,
      searchCode: o.orderCode,
      type: 'order' as const,
      icon: <BsReceipt className="text-blue-500" />
    })),
    ...(productData?.data?.adminProducts || []).map((p: any) => ({
      id: p._id,
      searchCode: p.name,
      type: 'product' as const,
      icon: <BsBoxSeam className="text-orange-500" />
    }))
  ]

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
    setHistoryItems(getHistory(historyKey))
    setIsOpen(true)
  }, [historyKey])

  // Xử lý khi chọn 1 kết quả search
  const handleSelect = useCallback(
    (item: { id: string; searchCode: string; type?: 'order' | 'product' }) => {
      saveToHistory(historyKey, item.searchCode)
      setIsOpen(false)
      setInputValue('')

      const path = location.pathname
      if (path.startsWith('/operation-staff')) {
        navigate(PATHS.OPERATIONSTAFF.ORDER_DETAIL(item.id))
      } else if (path.startsWith('/manager')) {
        if (item.type === 'product') {
          navigate(`/manager/products/${item.id}`)
        } else {
          navigate(`/manager/orders?search=${item.searchCode}`)
        }
      } else if (path.startsWith('/sale-staff')) {
        navigate(`/sale-staff/orders?search=${item.searchCode}`)
      }
    },
    [navigate, location.pathname, historyKey]
  )

  // Xử lý khi chọn từ lịch sử — chỉ điền vào input và search lại
  const handleSelectHistory = useCallback((searchCode: string) => {
    setInputValue(searchCode)
  }, [])

  const inputStyles =
    styleVariant === 'operation'
      ? isOpen
        ? 'border-mint-500 ring-2 ring-mint-200 bg-white'
        : 'bg-mint-200 border-mint-400 hover:border-mint-500 rounded-xl'
      : styleVariant === 'manager'
        ? isOpen
          ? 'border-mint-500 ring-2 ring-mint-200 bg-white'
          : 'bg-mint-50 border-mint-200 rounded-xl shadow-sm hover:border-mint-400'
        : 'bg-neutral-50 border-neutral-100 rounded-xl'

  const iconColor =
    styleVariant === 'operation'
      ? isOpen
        ? 'text-mint-600'
        : 'text-mint-700'
      : styleVariant === 'manager'
        ? isOpen
          ? 'text-mint-600'
          : 'text-mint-600'
        : 'text-neutral-400'

  return (
    <div className={cn('flex items-center gap-3 w-full pr-2', className)}>
      <Button
        onClick={toggleSidebar}
        className="lg:hidden p-2 rounded-lg text-neutral-500 hover:bg-neutral-50 transition-colors cursor-pointer"
      >
        <HiMenuAlt2 className="text-2xl" />
      </Button>

      <div ref={wrapperRef} className={cn('max-w-lg flex-1 relative', inputContainerClassName)}>
        {/* Hidden inputs to trick browsers that try to autofill the search bar */}
        <input type="email" style={{ display: 'none' }} aria-hidden="true" />
        <input type="password" style={{ display: 'none' }} aria-hidden="true" />

        <div className="relative">
          {/* Icon kính lúp */}
          <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none flex items-center">
            <FiSearch className={cn('text-xl transition-colors duration-200', iconColor)} />
          </span>

          <input
            ref={inputRef}
            type="text"
            id="staff-nav-search-v3"
            name="staff-nav-search-v3"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={handleFocus}
            placeholder={
              placeholder || (isManager ? 'Search products, orders...' : 'Search orders...')
            }
            autoComplete="one-time-code"
            data-lpignore="true"
            className={cn(
              'w-full h-10 pl-10 pr-4 text-sm font-medium transition-all duration-200 outline-none rounded-xl border',
              inputStyles
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
