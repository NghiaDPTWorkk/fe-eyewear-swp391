import { Container } from '@/components'
import type { ReactNode } from 'react'

interface StaffHeaderProps {
  containerWidth?: string
  containerJustify?: string
  left?: ReactNode
  center?: ReactNode
  right: ReactNode
  className?: string
}

export function StaffHeader({
  containerWidth = '100%',
  containerJustify,
  left,
  center,
  right,
  className
}: StaffHeaderProps) {
  return (
    <header className="w-full bg-white border-b border-neutral-200">
      <Container maxWidth={containerWidth} justify={containerJustify} className={className}>
        <div className="flex items-center justify-between w-full h-[63.5px] gap-4 mx-auto w-full max-w-[1320px]">
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
