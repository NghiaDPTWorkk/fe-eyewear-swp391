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
  const defaultStyle: React.CSSProperties = {
    maxWidth: maxWidth,
    margin: '0 auto',
    padding: '0',
    boxSizing: 'border-box',
    ...style
  }

  return (
    <div className={`container-main ${className}`} style={defaultStyle} {...props}>
      {children}
    </div>
  )
}
