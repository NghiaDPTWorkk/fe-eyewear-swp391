import type { ReactNode } from 'react'
import { useLayoutStore } from '@/store/layout.store'

interface MenuSectionProps {
  label?: string
  children: ReactNode
}

export function MenuSection({ label, children }: MenuSectionProps) {
  const { sidebarCollapsed } = useLayoutStore()

  return (
    <div className="px-3 py-2">
      {label && !sidebarCollapsed && (
        <div className="px-4 mb-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
          {label}
        </div>
      )}
      <div className="space-y-0.5">{children}</div>
    </div>
  )
}
