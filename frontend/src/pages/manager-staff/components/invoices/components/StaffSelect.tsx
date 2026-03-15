import { useState } from 'react'
import type { AdminAccount } from '@/shared/types/admin-account.types'

interface StaffSelectProps {
  staffList: AdminAccount[]
  value: string
  onChange: (v: string) => void
  disabled?: boolean
  className?: string
}

export function StaffSelect({ staffList, value, onChange, disabled, className }: StaffSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const selectedStaff = staffList.find((s) => s._id === value)

  return (
    <div className={`relative ${className}`} onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-white text-sm font-medium flex items-center justify-between hover:border-mint-400 focus:ring-4 focus:ring-mint-500/10 transition-all disabled:opacity-50"
      >
        <span
          className={selectedStaff ? 'text-gray-900' : 'text-neutral-400 truncate pr-2 text-left'}
        >
          {selectedStaff
            ? `${selectedStaff.name} (${selectedStaff.email})`
            : 'Select an operation worker'}
        </span>
        <svg
          className={`shrink-0 w-4 h-4 text-neutral-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && !disabled && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-neutral-100 rounded-2xl shadow-xl z-20 py-2 max-h-60 overflow-y-auto">
            {staffList.length === 0 ? (
              <div className="px-4 py-3 text-sm text-neutral-400 italic">No operators found</div>
            ) : (
              staffList.map((s) => (
                <button
                  key={s._id}
                  type="button"
                  onClick={() => {
                    onChange(s._id)
                    setIsOpen(false)
                  }}
                  className={`w-full px-4 py-2.5 text-left text-sm transition-colors flex flex-col gap-0.5 ${value === s._id ? 'bg-mint-50 text-mint-700 font-semibold' : 'text-gray-600 hover:bg-neutral-50'}`}
                >
                  <span className="truncate">{s.name}</span>
                  <span
                    className={`text-[10px] truncate ${value === s._id ? 'text-mint-500' : 'text-neutral-400'}`}
                  >
                    {s.email}
                  </span>
                </button>
              ))
            )}
          </div>
        </>
      )}
    </div>
  )
}
