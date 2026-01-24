import type { ReactNode } from 'react'

interface MenuSectionProps {
  label: string
  children: ReactNode
}

export function MenuSection({ label, children }: MenuSectionProps) {
  return (
    <div className="mb-6 px-3">
      <div className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
        {label}
      </div>
      <div className="space-y-0.5">{children}</div>
    </div>
  )
}
