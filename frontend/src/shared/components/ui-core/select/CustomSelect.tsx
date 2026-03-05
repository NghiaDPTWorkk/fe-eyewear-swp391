import { useState, useRef, useEffect, type ReactNode } from 'react'
import { IoChevronDownOutline } from 'react-icons/io5'
import { cn } from '@/lib/utils'

interface CustomSelectOption {
  value: string
  label: string
  icon?: ReactNode
}

interface CustomSelectProps {
  options: CustomSelectOption[]
  value: string
  onChange: (value: string) => void
  label?: string
  icon?: ReactNode
  placeholder?: string
  className?: string
}

export function CustomSelect({
  options,
  value,
  onChange,
  label,
  icon,
  placeholder = 'Select an option',
  className
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find((opt) => opt.value === value)

  const handleToggle = () => setIsOpen(!isOpen)
  const handleSelect = (val: string) => {
    onChange(val)
    setIsOpen(false)
  }

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
        <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em] pl-1">
          {label}
        </label>
      )}
      <div className="relative group/select">
        {/* Trigger */}
        <button
          type="button"
          onClick={handleToggle}
          className={cn(
            'w-full pl-14 pr-10 py-3.5 bg-white border rounded-2xl text-sm font-semibold text-slate-700 transition-all cursor-pointer shadow-sm text-left flex items-center',
            isOpen
              ? 'border-mint-500 ring-4 ring-mint-500/10'
              : 'border-slate-100 hover:border-slate-200'
          )}
        >
          {/* Default icon */}
          <div
            className={cn(
              'absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center transition-all border',
              isOpen
                ? 'bg-mint-50 text-mint-600 border-mint-50'
                : 'bg-slate-50 text-slate-400 border-slate-50'
            )}
          >
            {icon}
          </div>

          <span className={cn('block truncate', !selectedOption && 'text-slate-400')}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>

          <div
            className={cn(
              'absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none transition-transform duration-200',
              isOpen && 'rotate-180 text-mint-500'
            )}
          >
            <IoChevronDownOutline size={16} />
          </div>
        </button>

        {/* Dropdown List */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-3 bg-white/80 backdrop-blur-xl border border-slate-200/50 rounded-[2.5rem] shadow-[0_24px_64px_-12px_rgba(0,0,0,0.14)] p-3 max-h-72 overflow-y-auto animate-in fade-in zoom-in-95 duration-200 origin-top">
            <div className="space-y-1.5">
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={cn(
                    'w-full flex items-center gap-4 px-5 py-3.5 rounded-[1.75rem] text-sm font-semibold transition-all group/opt relative overflow-hidden',
                    value === option.value
                      ? 'bg-mint-500 text-white shadow-lg shadow-mint-500/20'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  )}
                >
                  {option.icon && (
                    <div
                      className={cn(
                        'w-8 h-8 rounded-xl flex items-center justify-center transition-all border shrink-0',
                        value === option.value
                          ? 'bg-white/20 border-white/20 text-white'
                          : 'bg-slate-50 text-slate-400 border-slate-100 group-hover/opt:bg-white group-hover/opt:border-slate-200 group-hover/opt:text-mint-600'
                      )}
                    >
                      {option.icon}
                    </div>
                  )}
                  <span className="relative z-10">{option.label}</span>
                  {value === option.value && (
                    <div className="ml-auto w-2 h-2 rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.8)] animate-pulse" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
