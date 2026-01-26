import { Container } from '@/components'
import type { ReactNode } from 'react'

interface StaffHeaderProp {
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
}: StaffHeaderProp) {
  return (
    <header className="w-full bg-white border-b border-neutral-200">
      <Container maxWidth={containerWidth} justify={containerJustify}>
        <div className="flex items-center justify-between w-full h-[63.5px] gap-4">
          <div className="flex items-center flex-1 min-w-0">
            {left && <div className="w-full">{left}</div>}
          </div>
          {center && <div className="flex justify-center flex-none px-2">{center}</div>}
          <div className="flex items-center shrink-0">{right}</div>
        </div>
      </Container>
    </header>
  )
}
