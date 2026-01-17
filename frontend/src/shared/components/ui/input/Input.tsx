import type { InputHTMLAttributes, ReactNode } from 'react'
import './input.css'

export type InputSize = 'sm' | 'md' | 'lg'

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: InputSize
  isInvalid?: boolean
  leftElement?: ReactNode
  rightElement?: ReactNode
}

export function Input({
  size = 'md',
  isInvalid = false,
  leftElement,
  rightElement,
  className = '',
  disabled,
  ...props
}: InputProps) {
  const wrapperClasses = [
    'input-wrapper',
    `input-wrapper--${size}`,
    isInvalid && 'input-wrapper--invalid',
    disabled && 'input-wrapper--disabled',
    leftElement && 'input-wrapper--has-left',
    rightElement && 'input-wrapper--has-right',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={wrapperClasses}>
      {leftElement && <span className="input-element input-element--left">{leftElement}</span>}
      <input className="input" disabled={disabled} {...props} />
      {rightElement && <span className="input-element input-element--right">{rightElement}</span>}
    </div>
  )
}
