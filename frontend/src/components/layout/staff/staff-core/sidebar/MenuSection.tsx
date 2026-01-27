import type { ReactNode } from 'react'
import { useLayoutStore } from '@/store/layout.store'
import { cn } from '@/lib/utils'

interface MenuSectionProps {
  label: string
  children: ReactNode
}

export function MenuSection({ label, children }: MenuSectionProps) {
  const { sidebarCollapsed } = useLayoutStore()

  return (
    <div className={cn('mb-6', sidebarCollapsed ? 'px-2' : 'px-3')}>
      {!sidebarCollapsed ? (
        <div className="px-3 mb-2 text-xs font-semibold text-neutral-400 uppercase tracking-wider transition-opacity duration-300">
          {label}
        </div>
      ) : (
        <div className="h-px bg-neutral-100 mb-4 mx-auto w-8" />
      )}
      <div className="space-y-0.5">{children}</div>
    </div>
  )
}
