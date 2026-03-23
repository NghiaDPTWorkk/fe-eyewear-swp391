import { useState, useRef, useEffect, useMemo } from 'react'
import { cn } from '@/lib/utils'
import { ChevronDown, Search, X } from 'lucide-react'

export interface SearchableOption {
  label: string
  value: string | number
}

interface SearchableSelectProps {
  options: SearchableOption[]
  value: string | number
  onChange: (value: string | number | any) => void
  placeholder?: string
  label?: string
  isDisabled?: boolean
  isLoading?: boolean
  isInvalid?: boolean
  className?: string
}

export function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  label,
  isDisabled = false,
  isLoading = false,
  isInvalid = false,
  className
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  const selectedOption = useMemo(() => options.find((o) => o.value === value), [options, value])

  const filteredOptions = useMemo(() => {
    if (!search) return options
    const s = search.toLowerCase()
    return options.filter((o) => o.label.toLowerCase().includes(s))
  }, [options, search])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (!isOpen) setSearch('')
  }, [isOpen])

  const handleSelect = (option: SearchableOption) => {
    onChange(option.value)
    setIsOpen(false)
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange('')
    setSearch('')
  }

  return (
    <div className={cn('relative w-full group', className)} ref={containerRef}>
      {label && (
        <label className="text-sm font-bold text-mint-1200 mb-1.5 block uppercase tracking-wider">
          {label}
        </label>
      )}

      <div
        onClick={() => !isDisabled && setIsOpen(!isOpen)}
        className={cn(
          'flex h-12 w-full items-center justify-between rounded-xl border bg-white px-4 transition-all cursor-pointer select-none',
          isOpen
            ? 'border-primary-500 ring-4 ring-primary-50'
            : 'border-gray-100 hover:border-primary-300 shadow-sm',
          isInvalid && 'border-red-500 ring-red-50',
          isDisabled && 'opacity-50 cursor-not-allowed bg-gray-50'
        )}
      >
        <span className={cn('text-sm truncate', !selectedOption && 'text-gray-400 font-medium')}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <div className="flex items-center gap-2">
          {selectedOption && !isDisabled && (
            <X
              className="h-4 w-4 text-gray-400 hover:text-gray-600 cursor-pointer"
              onClick={handleClear}
            />
          )}
          <ChevronDown
            className={cn(
              'h-5 w-5 text-gray-400 transition-transform duration-200',
              isOpen && 'rotate-180'
            )}
          />
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-[100] mt-2 w-full min-w-[240px] rounded-2xl bg-white border border-gray-100 shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-3 border-b border-gray-50 bg-gray-50/30">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                autoFocus
                type="text"
                className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-primary-500 transition-colors"
                placeholder="Type to search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>

          <div className="max-h-60 overflow-y-auto custom-scrollbar p-1">
            {isLoading ? (
              <div className="p-4 text-center text-sm text-gray-400">Loading provinces...</div>
            ) : filteredOptions.length > 0 ? (
              filteredOptions.map((o) => (
                <div
                  key={o.value}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleSelect(o)
                  }}
                  className={cn(
                    'px-4 py-3 text-sm cursor-pointer rounded-xl transition-all mb-0.5',
                    o.value === value
                      ? 'bg-primary-50 text-primary-700 font-bold'
                      : 'text-gray-600 hover:bg-gray-50 hover:pl-6'
                  )}
                >
                  {o.label}
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-sm text-gray-400 italic">No matches found</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
