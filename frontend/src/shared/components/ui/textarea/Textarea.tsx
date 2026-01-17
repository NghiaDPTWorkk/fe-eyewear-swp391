import type { TextareaHTMLAttributes } from 'react'
import './textarea.css'

export type TextareaSize = 'sm' | 'md' | 'lg'
export type TextareaResize = 'none' | 'vertical' | 'horizontal' | 'both'

export interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  size?: TextareaSize
  isInvalid?: boolean
  resize?: TextareaResize
}

export function Textarea({
  size = 'md',
  isInvalid = false,
  resize = 'vertical',
  className = '',
  disabled,
  ...props
}: TextareaProps) {
  const classes = [
    'textarea',
    `textarea--${size}`,
    isInvalid && 'textarea--invalid',
    disabled && 'textarea--disabled',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <textarea
      className={classes}
      style={{ resize }}
      disabled={disabled}
      {...props}
    />
  )
}
