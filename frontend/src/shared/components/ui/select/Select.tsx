import type { SelectHTMLAttributes, ReactNode } from 'react'
import './select.css'

export type SelectSize = 'sm' | 'md' | 'lg'

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  size?: SelectSize
  isInvalid?: boolean
  placeholder?: string
  children: ReactNode
}

export function Select({
  size = 'md',
  isInvalid = false,
  placeholder,
  disabled,
  className = '',
  children,
  ...props
}: SelectProps) {
  const classes = [
    'select',
    `select--${size}`,
    isInvalid && 'select--invalid',
    disabled && 'select--disabled',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classes}>
      <select className="select__input" disabled={disabled} {...props}>
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {children}
      </select>
      <span className="select__arrow">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </div>
  )
}
