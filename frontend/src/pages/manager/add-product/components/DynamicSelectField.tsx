import { useState, useRef, useEffect } from 'react'
import { FiChevronDown, FiPlus, FiCheck } from 'react-icons/fi'
import { cn } from '@/lib/utils'

interface Option {
  id: string
  name: string
}

interface DynamicSelectFieldProps {
  label: string
  value: string
  options: Option[]
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  helperText?: string
  allowCustom?: boolean
}

export function DynamicSelectField({
  label,
  value,
  options,
  onChange,
  placeholder,
  className,
  helperText,
  allowCustom = true
}: DynamicSelectFieldProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [customValue, setCustomValue] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  // Determine display name for the current value
  const selectedOption = options.find((opt) => opt.id === value || opt.name === value)
  const displayName = selectedOption ? selectedOption.name : value

  const filteredOptions = options.filter((opt) =>
    opt.name.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (val: string) => {
    onChange(val)
    setIsOpen(false)
    setSearch('')
  }

  const handleAddCustom = () => {
    if (customValue.trim()) {
      onChange(customValue.trim())
      setCustomValue('')
      setIsOpen(false)
    }
  }

  return (
    <div className={cn('space-y-2', className)} ref={containerRef}>
      <div className="flex justify-between items-center ml-1">
        <label className="text-sm font-bold text-gray-700">{label}</label>
        {helperText && (
          <span className="text-[10px] text-neutral-400 font-medium uppercase tracking-wider">
            {helperText}
          </span>
        )}
      </div>

      <div className="relative">
        <div
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'min-h-[52px] px-4 py-3 bg-neutral-50/50 border rounded-2xl flex items-center justify-between cursor-pointer transition-all shadow-sm',
            isOpen
              ? 'border-mint-500 ring-4 ring-mint-500/5 bg-white'
              : 'border-neutral-100 hover:border-neutral-200'
          )}
        >
          <span className={cn('text-[14px] truncate', !displayName && 'text-neutral-400')}>
            {displayName || placeholder || `Select ${label}...`}
          </span>
          <FiChevronDown
            className={cn(
              'text-neutral-400 transition-transform duration-300 ml-2 shrink-0',
              isOpen && 'rotate-180'
            )}
            size={18}
          />
        </div>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-neutral-100/50 rounded-[24px] shadow-2xl z-50 py-3 flex flex-col animate-in fade-in slide-in-from-top-2 duration-300 backdrop-blur-xl bg-white/95">
            <div className="px-3 mb-2">
              <input
                autoFocus
                type="text"
                placeholder="Search options..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2.5 bg-neutral-50/50 border border-neutral-100 rounded-xl text-sm focus:outline-none focus:border-mint-500 transition-all"
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            <div className="max-h-60 overflow-y-auto custom-scrollbar">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt) => (
                  <div
                    key={opt.id}
                    onClick={() => handleSelect(opt.id)}
                    className="flex items-center justify-between px-4 py-3 hover:bg-neutral-50 cursor-pointer transition-colors group mx-2 rounded-xl"
                  >
                    <span
                      className={cn(
                        'text-[13px] font-semibold transition-colors',
                        value === opt.id || value === opt.name
                          ? 'text-mint-600'
                          : 'text-neutral-600 group-hover:text-neutral-900'
                      )}
                    >
                      {opt.name}
                    </span>
                    {(value === opt.id || value === opt.name) && (
                      <FiCheck className="text-mint-600" size={16} />
                    )}
                  </div>
                ))
              ) : (
                <div className="px-4 py-6 text-center">
                  <p className="text-xs text-neutral-400 italic">No matching results</p>
                </div>
              )}
            </div>

            {allowCustom && (
              <div className="px-3 mt-2 pt-3 border-t border-neutral-100/50">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add custom value..."
                    value={customValue}
                    onChange={(e) => setCustomValue(e.target.value)}
                    className="flex-1 px-4 py-2 bg-neutral-50/50 border border-neutral-100 rounded-xl text-sm focus:outline-none focus:border-mint-500"
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        e.stopPropagation()
                        handleAddCustom()
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleAddCustom()
                    }}
                    className="p-2 bg-mint-50 text-mint-600 rounded-xl hover:bg-mint-100 transition-colors border border-mint-100"
                  >
                    <FiPlus size={20} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
