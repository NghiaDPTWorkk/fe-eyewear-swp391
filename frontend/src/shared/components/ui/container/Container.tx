import type { HTMLAttributes, ReactNode } from 'react'

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
  maxWidth?: string
  justify?: string
}

export function Container({
  children,
  maxWidth = '1320px',
  justify,
  style,
  className = '',
  ...props
}: ContainerProps) {
  return (
    <div
      className={`mx-auto p-0 box-border ${className}`}
      style={{ maxWidth, justifyContent: justify, ...style }}
      {...props}
    >
      {children}
    </div>
  )
}
