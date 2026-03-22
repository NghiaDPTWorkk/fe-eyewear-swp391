import type { ReactNode } from 'react'

interface StoreDropdownProps {
  storeName: string
  icon?: ReactNode
  onSelect?: (store: string) => void
}

export function StoreDropdown({ storeName, icon, onSelect: _onSelect }: StoreDropdownProps) {
  return (
    <button className="w-full px-6 py-3 border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon && <div className="text-mint-500">{icon}</div>}
          <div className="text-left">
            <div className="text-xs text-gray-500">Store Location</div>
            <div className="text-sm font-medium text-gray-900">{storeName}</div>
          </div>
        </div>
      </div>
    </button>
  )
}
