import { useState } from 'react'
import { FiX, FiCheck, FiPlus, FiChevronDown } from 'react-icons/fi'
import { cn } from '@/lib/utils'

interface MultiSelectFieldProps {
  label: string
  values: string[]
  options: { id: string; name: string }[]
  onChange: (values: string[]) => void
  placeholder?: string
  className?: string
  allowCustom?: boolean
}

export function MultiSelectField({
  label,
  values,
  options,
  onChange,
  placeholder,
  className,
  allowCustom = true
}: MultiSelectFieldProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [customValue, setCustomValue] = useState('')

  const toggleOption = (id: string) => {
    if (values.includes(id)) {
      onChange(values.filter((v) => v !== id))
    } else {
      onChange([...values, id])
    }
  }

  const handleAddCustom = () => {
    if (customValue.trim() && !values.includes(customValue.trim())) {
      onChange([...values, customValue.trim()])
      setCustomValue('')
    }
  }

  const filteredOptions = options.filter((opt) =>
    opt.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className={cn('space-y-2', className)}>
      <label className="text-sm font-bold text-gray-700 ml-1">{label}</label>
      <div className="relative">
        <div
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'min-h-[52px] p-2 bg-neutral-50/50 border rounded-2xl flex flex-wrap gap-2 cursor-pointer transition-all shadow-sm pr-10',
            isOpen
              ? 'border-mint-500 ring-4 ring-mint-500/5 bg-white'
              : 'border-neutral-100 hover:border-neutral-200'
          )}
        >
          {values.length === 0 && !isOpen && (
            <span className="text-neutral-400 text-sm mt-2 ml-2">
              {placeholder || 'Select options...'}
            </span>
          )}
          {values.map((v) => {
            const opt = options.find((o) => o.id === v)
            return (
              <div
                key={v}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-mint-50 text-mint-700 rounded-xl text-xs font-bold border border-mint-100 group animate-in zoom-in-95 duration-200"
              >
                {opt ? opt.name : v}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleOption(v)
                  }}
                  className="hover:text-red-500 transition-colors"
                >
                  <FiX size={14} />
                </button>
              </div>
            )
          })}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
            <FiChevronDown
              className={cn('transition-transform duration-300', isOpen && 'rotate-180')}
            />
          </div>
        </div>

        {isOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-neutral-100 rounded-[32px] shadow-2xl z-20 py-4 max-h-80 overflow-hidden flex flex-col animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="px-4 mb-3">
                <input
                  autoFocus
                  type="text"
                  placeholder="Search options..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full px-4 py-2 bg-neutral-50 border border-neutral-100 rounded-xl text-sm focus:outline-none focus:border-mint-500 transition-all"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar px-1">
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((opt) => (
                    <div
                      key={opt.id}
                      onClick={() => toggleOption(opt.id)}
                      className="flex items-center justify-between px-5 py-3 hover:bg-neutral-50 cursor-pointer transition-colors group mx-2 rounded-xl"
                    >
                      <span
                        className={cn(
                          'text-[13px] font-semibold transition-colors',
                          values.includes(opt.id)
                            ? 'text-mint-600'
                            : 'text-neutral-600 group-hover:text-neutral-900'
                        )}
                      >
                        {opt.name}
                      </span>
                      {values.includes(opt.id) && (
                        <div className="w-5 h-5 rounded-full bg-mint-500 flex items-center justify-center text-white">
                          <FiCheck size={12} />
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="px-5 py-4 text-center">
                    <p className="text-xs text-neutral-400 italic">No matching options found</p>
                  </div>
                )}
              </div>

              {allowCustom && (
                <div className="px-4 mt-3 pt-3 border-t border-neutral-50">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add custom value..."
                      value={customValue}
                      onChange={(e) => setCustomValue(e.target.value)}
                      className="flex-1 px-4 py-2 bg-white border border-neutral-100 rounded-xl text-sm focus:outline-none focus:border-mint-500"
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => {
                        e.stopPropagation()
                        if (e.key === 'Enter') {
                          e.preventDefault()
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
                      className="p-2 bg-mint-100 text-mint-700 rounded-xl hover:bg-mint-200 transition-colors"
                    >
                      <FiPlus size={20} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
