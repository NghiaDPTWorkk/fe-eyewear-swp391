import type { ReactNode } from 'react'
import { Container } from '../container'

interface HeaderStaffProps {
  containerWidth?: string
  containerJustify?: string
  left?: ReactNode
  center?: ReactNode
  right: ReactNode
}

export function HeaderStaff({
  containerWidth = '100%',
  containerJustify,
  left,
  center,
  right
}: HeaderStaffProps) {
  return (
    <header className="w-full bg-white border-b border-neutral-200">
      <Container maxWidth={containerWidth} justify={containerJustify}>
        <div className="flex items-center justify-between w-full h-[63.5px] gap-2 md:gap-4">
          {left && <div className="hidden sm:flex items-center">{left}</div>}
          {center && <div className="flex-1 flex justify-center px-2 md:px-0">{center}</div>}
          <div className="flex items-center shrink-0">{right}</div>
        </div>
      </Container>
    </header>
  )
}
