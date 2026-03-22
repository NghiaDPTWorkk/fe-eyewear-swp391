import type { ReactNode } from 'react'

interface StoreDropdownProps {
  storeName: string
  icon?: ReactNode
  onSelect?: (store: string) => void
}

export function StoreDropdown({ storeName, icon, onSelect: _onSelect }: StoreDropdownProps) {
  return (
    <div className="w-full px-6 py-5 border-b border-neutral-50/50 bg-white">
      <div className="flex items-center gap-3">
        {icon && <div className="text-mint-500 bg-mint-50 p-2.5 rounded-2xl">{icon}</div>}
        <div className="text-left">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
            Store Location
          </div>
          <div className="text-sm font-bold text-slate-900 leading-tight">{storeName}</div>
        </div>
      </div>
    </div>
  )
}
