import type { ReactNode } from 'react'

interface HeaderStaffProps {
  left?: ReactNode
  center?: ReactNode
  right?: ReactNode
}

export function HeaderStaff({ left, center, right }: HeaderStaffProps) {
  return (
    <header className="w-full h-14 bg-white border-b border-gray-200 px-6 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center flex-1">
        {left}
        {center}
      </div>
      {right && <div className="flex items-center gap-4">{right}</div>}
    </header>
  )
}
