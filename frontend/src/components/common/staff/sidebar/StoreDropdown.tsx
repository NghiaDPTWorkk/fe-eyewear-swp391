import type { ReactNode } from 'react'
import { FiChevronDown } from 'react-icons/fi'

interface StoreDropdownProps {
  storeName: string
  icon?: ReactNode
}

export function StoreDropdown({ storeName, icon }: StoreDropdownProps) {
  return (
    <div className="px-4 py-3 border-b border-gray-200">
      <button className="flex items-center gap-2 w-full px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-100">
        <div className="w-8 h-8 flex items-center justify-center bg-white rounded-md border border-gray-200 text-gray-500">
          {icon}
        </div>
        <div className="flex-1 text-left">
          <div className="text-xs text-gray-500 font-medium">Store Location</div>
          <div className="text-sm font-semibold text-gray-900 truncate">{storeName}</div>
        </div>
        <FiChevronDown className="text-gray-400" />
      </button>
    </div>
  )
}
