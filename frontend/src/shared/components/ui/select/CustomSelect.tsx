import { type ReactNode, useState, useRef, useEffect } from 'react'
import { IoChevronDownOutline } from 'react-icons/io5'
import { cn } from '@/lib/utils'

export interface CustomSelectOption {
  value: string
  label: string
  icon?: ReactNode
}

export interface CustomSelectProps {
  label?: string
  icon?: ReactNode
  value: string
  options: CustomSelectOption[]
  onChange: (value: string) => void
  className?: string
  error?: string
}

export function CustomSelect({
  label,
  icon,
  value,
  options,
  onChange,
  className,
  error
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const selectedOption = options.find((opt) => opt.value === value)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className={cn('space-y-2.5', className)} ref={containerRef}>
      {label && (
        <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest px-1">
          {label}
        </label>
      )}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'w-full flex items-center justify-between px-4 h-12 bg-white rounded-2xl border transition-all duration-300',
            isOpen
              ? 'border-mint-500 ring-4 ring-mint-50/50 shadow-sm'
              : 'border-neutral-100 hover:border-neutral-200 shadow-sm shadow-neutral-100/20',
            error && 'border-red-200 bg-red-50/10'
          )}
        >
          <div className="flex items-center gap-3">
            {icon && <span className="text-neutral-400">{icon}</span>}
            {selectedOption?.icon && <span>{selectedOption.icon}</span>}
            <span className="text-sm font-semibold text-neutral-700">
              {selectedOption?.label || 'Select option'}
            </span>
          </div>
          <IoChevronDownOutline
            className={cn(
              'text-neutral-400 transition-transform duration-300',
              isOpen && 'rotate-180'
            )}
            size={18}
          />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 p-2 bg-white rounded-2xl border border-neutral-100 shadow-xl shadow-neutral-200/40 z-50 animate-in fade-in zoom-in-95 duration-200">
            <div className="max-h-60 overflow-y-auto custom-scrollbar">
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value)
                    setIsOpen(false)
                  }}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                    option.value === value
                      ? 'bg-mint-50 text-mint-600'
                      : 'text-neutral-600 hover:bg-neutral-50'
                  )}
                >
                  {option.icon && <span className="shrink-0">{option.icon}</span>}
                  <span className="flex-1 text-left">{option.label}</span>
                  {option.value === value && (
                    <div className="w-1.5 h-1.5 rounded-full bg-mint-500" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      {error && <p className="text-[10px] font-medium text-red-500 px-1">{error}</p>}
    </div>
  )
}
