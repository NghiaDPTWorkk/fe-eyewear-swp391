import type { ReactNode } from 'react'
import { Container } from './container'

interface HeaderStaffProps {
  containerWidth?: string
  containerJustify?: string
  left?: ReactNode
  center?: ReactNode
  right: ReactNode
}

export function HeaderStaff({
  containerWidth = '70%',
  containerJustify,
  left,
  center,
  right
}: HeaderStaffProps) {
  return (
    <header className="w-full border-b border-gray-300">
      <Container maxWidth={containerWidth} justify={containerJustify}>
        <div className="flex items-center justify-between w-full h-[60px] gap-4">
          {left && <div className="flex justify-end">{left}</div>}

          {center && <div className="flex-1">{center}</div>}

          <div>{right}</div>
        </div>
      </Container>
    </header>
  )
}
