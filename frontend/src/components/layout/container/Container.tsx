import type { HTMLAttributes, ReactNode } from 'react'

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  maxWidth?: string
}

export function Container({
  children,
  maxWidth = '1320px',
  style,
  className = '',
  ...props
}: ContainerProps) {
  return (
    <div
      className={`mx-auto p-0 box-border ${className}`}
      style={{ maxWidth, ...style }}
      {...props}
    >
      {children}
    </div>
  )
}
