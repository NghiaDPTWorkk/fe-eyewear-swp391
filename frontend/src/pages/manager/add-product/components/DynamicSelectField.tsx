import { useState } from 'react'
import { Select } from '@/shared/components/ui-core'
import { FiChevronLeft } from 'react-icons/fi'
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
}

export function DynamicSelectField({
  label,
  value,
  options,
  onChange,
  placeholder,
  className,
  helperText
}: DynamicSelectFieldProps) {
  const [isCustom, setIsCustom] = useState(false)
  const [customValue, setCustomValue] = useState('')

  // Determine if the current value is one of the options
  const isValueInOptions = options.some((opt) => opt.id === value || opt.name === value)
  const displayValue = isValueInOptions ? value : ''

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === 'ADD_NEW') {
      setIsCustom(true)
    } else {
      setIsCustom(false)
      onChange(e.target.value)
    }
  }

  const handleCustomConfirm = () => {
    if (customValue.trim()) {
      onChange(customValue.trim())
    }
    setIsCustom(false)
    setCustomValue('')
  }

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex justify-between items-center ml-1">
        <label className="text-sm font-bold text-gray-700">{label}</label>
        {helperText && (
          <span className="text-[10px] text-neutral-400 font-medium">{helperText}</span>
        )}
      </div>

      {!isCustom ? (
        <Select
          value={displayValue}
          onChange={handleSelectChange}
          placeholder={placeholder || `Select ${label}...`}
          className="bg-neutral-50/50 border-neutral-100 rounded-2xl shadow-sm focus-within:border-mint-500 focus-within:ring-4 focus-within:ring-mint-500/5 transition-all"
        >
          {options.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.name}
            </option>
          ))}
          {!isValueInOptions && value && <option value={value}>{value}</option>}
          <option value="ADD_NEW" className="text-mint-600 font-bold">
            + Use Custom Value...
          </option>
        </Select>
      ) : (
        <div className="flex gap-2 animate-in fade-in slide-in-from-right-2 duration-300">
          <div className="relative flex-1">
            <input
              autoFocus
              value={customValue}
              onChange={(e) => setCustomValue(e.target.value)}
              placeholder={`Enter new ${label}...`}
              className="w-full px-4 py-2.5 bg-white border border-mint-200 rounded-2xl text-[14px] focus:outline-none focus:ring-4 focus:ring-mint-500/10 focus:border-mint-500 shadow-sm transition-all"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleCustomConfirm()
                }
                if (e.key === 'Escape') {
                  setIsCustom(false)
                }
              }}
            />
          </div>
          <button
            type="button"
            onClick={handleCustomConfirm}
            className="px-5 bg-mint-600 text-white rounded-2xl text-xs font-bold hover:bg-mint-700 transition-all active:scale-95 shadow-lg shadow-mint-100/50"
          >
            Add
          </button>
          <button
            type="button"
            onClick={() => setIsCustom(false)}
            className="p-2.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 rounded-2xl transition-all"
            title="Back to list"
          >
            <FiChevronLeft size={20} />
          </button>
        </div>
      )}
    </div>
  )
}
