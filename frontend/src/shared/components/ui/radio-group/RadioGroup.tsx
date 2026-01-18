import type { ReactNode } from 'react'
import "../radio/radio.css"

export type RadioGroupOrientation = 'vertical' | 'horizontal'

export interface RadioGroupProps {
  children: ReactNode
  orientation?: RadioGroupOrientation
}

export function RadioGroup({ children, orientation = 'vertical' }: RadioGroupProps) {
  return (
    <div className={`radio-group radio-group--${orientation}`} role="radiogroup">
      {children}
    </div>
  )
}
