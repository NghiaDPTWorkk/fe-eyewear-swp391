import type { ReactNode } from 'react'

import { Container } from '@/shared/components/ui-core'
import { cn } from '@/lib/utils'

interface StaffHeaderProps {
  containerWidth?: string
  containerJustify?: string
  left?: ReactNode
  center?: ReactNode
  right: ReactNode
  className?: string
  containerClassName?: string
}

export function StaffHeader({
  containerWidth = '100%',
  containerJustify,
  left,
  center,
  right,
  className,
  containerClassName
}: StaffHeaderProps) {
  return (
    <header
      className={cn(
        'w-full bg-white border-b border-neutral-200 sticky top-0 z-30 transition-all duration-300',
        className
      )}
    >
      <Container
        maxWidth={containerWidth}
        justify={containerJustify}
        className={containerClassName}
      >
        <div className="flex items-center justify-between w-full h-[63px] gap-8">
          <div className="flex items-center flex-1 min-w-0">
            {left && <div className="w-full max-w-xl">{left}</div>}
          </div>
          {center && <div className="flex justify-center flex-none">{center}</div>}
          <div className="flex items-center gap-4 shrink-0 transition-all">{right}</div>
        </div>
      </Container>
    </header>
  )
}
