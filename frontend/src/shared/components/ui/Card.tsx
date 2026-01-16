import type { ReactNode } from 'react'

export interface CardProps {
  children: ReactNode
  header?: ReactNode
  footer?: ReactNode
}

export function Card({ header, children, footer }: CardProps) {
  return (
    <div className="card">
      {header && <div className="card-header">{header}</div>}
      <div className="card-body">{children}</div>
      {footer && <div className="card-footer">{footer}</div>}
    </div>
  )
}
