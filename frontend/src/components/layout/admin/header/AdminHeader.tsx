import type { ReactNode } from 'react'
import { Container } from '@/shared/components/ui'
import { cn } from '@/lib/utils'

interface AdminHeaderProps {
  containerWidth?: string
  containerJustify?: string
  left?: ReactNode
  center?: ReactNode
  right: ReactNode
  className?: string
  containerClassName?: string
}

export function AdminHeader({
  containerWidth = '100%',
  containerJustify,
  left,
  center,
  right,
  className,
  containerClassName
}: AdminHeaderProps) {
  return (
    <header
      className={cn(
        'w-full bg-white border-b border-neutral-100/80 sticky top-0 z-30 transition-all duration-300 px-4 md:px-6',
        className
      )}
    >
      <Container
        maxWidth={containerWidth}
        justify={containerJustify}
        className={containerClassName}
      >
        <div className="flex items-center justify-between w-full h-16 gap-6">
          <div className="flex items-center flex-1 min-w-0">
            {left && <div className="w-full max-w-xl">{left}</div>}
          </div>
          {center && <div className="flex justify-center flex-none">{center}</div>}
          <div className="flex items-center gap-3 flex-1 justify-end">{right}</div>
        </div>
      </Container>
    </header>
  )
}
