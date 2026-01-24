import type { ReactNode } from 'react'
import { useLayoutStore } from '@/store/layout.store'

interface MenuSectionProps {
  label: string
  children: ReactNode
}

export function MenuSection({ label, children }: MenuSectionProps) {
  const { sidebarCollapsed } = useLayoutStore()

  return (
    <div className="mb-6 px-3">
      {!sidebarCollapsed ? (
        <div className="px-3 mb-2 text-xs font-semibold text-neutral-400 uppercase tracking-wider transition-opacity duration-300">
          {label}
        </div>
      ) : (
        <div className="h-px bg-neutral-100 mb-4 mx-2" />
      )}
      <div className="space-y-0.5">{children}</div>
    </div>
  )
}
