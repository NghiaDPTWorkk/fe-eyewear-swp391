import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export type RadioGroupOrientation = 'vertical' | 'horizontal'

export interface RadioGroupProps {
  children: ReactNode
  orientation?: RadioGroupOrientation
  className?: string
}

export function RadioGroup({ children, orientation = 'vertical', className }: RadioGroupProps) {
  return (
    <div
      role="radiogroup"
      className={cn(
        'flex',
        orientation === 'vertical' ? 'flex-col gap-2' : 'flex-row gap-4',
        className
      )}
    >
      {children}
    </div>
  )
}
