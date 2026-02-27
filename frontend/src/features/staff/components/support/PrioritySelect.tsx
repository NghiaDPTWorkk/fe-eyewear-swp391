import { useState, useRef, useEffect } from 'react'
import { IoChevronDownOutline } from 'react-icons/io5'
import { cn } from '@/lib/utils'

interface PriorityOption {
  value: 'LOW' | 'MEDIUM' | 'HIGH'
  label: string
  description: string
}

const options: PriorityOption[] = [
  { value: 'LOW', label: 'Low', description: 'Cosmetic issue' },
  { value: 'MEDIUM', label: 'Medium', description: 'Affects workflow' },
  { value: 'HIGH', label: 'High', description: 'Critical blocker' }
]

interface PrioritySelectProps {
  value: 'LOW' | 'MEDIUM' | 'HIGH'
  onChange: (value: 'LOW' | 'MEDIUM' | 'HIGH') => void
  accentColor?: string
}

export function PrioritySelect({ value, onChange, accentColor = 'mint' }: PrioritySelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectedOption = options.find((o) => o.value === value) || options[1]

  const activeRingClass =
    accentColor === 'mint'
      ? 'focus-within:ring-mint-500/10 focus-within:border-mint-500'
      : 'focus-within:ring-primary-500/10 focus-within:border-primary-500'

  const activeItemClass =
    accentColor === 'mint' ? 'bg-mint-500 text-white' : 'bg-primary-500 text-white'

  return (
    <div className="space-y-2" ref={containerRef}>
      <label className="text-[10px] font-semibold text-slate-400 tracking-widest pl-1 uppercase">
        Priority
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'w-full px-5 py-3.5 bg-neutral-50 border border-neutral-100 rounded-2xl text-sm font-semibold text-slate-700 flex items-center justify-between transition-all cursor-pointer',
            activeRingClass
          )}
        >
          <span>
            {selectedOption.label} - {selectedOption.description}
          </span>
          <IoChevronDownOutline
            className={cn('transition-transform duration-200', isOpen && 'rotate-180')}
            size={18}
          />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 w-full mt-2 bg-white border border-neutral-100 rounded-[20px] shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value)
                  setIsOpen(false)
                }}
                className={cn(
                  'w-full px-5 py-4 text-left text-sm font-semibold transition-colors cursor-pointer',
                  value === option.value
                    ? activeItemClass
                    : 'text-slate-700 hover:bg-neutral-50 hover:text-slate-900'
                )}
              >
                {option.label} - {option.description}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
