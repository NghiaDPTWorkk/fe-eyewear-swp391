import type { ElementType, ReactNode, ComponentPropsWithoutRef } from 'react'
import './button.css'

export type ButtonVariant = 'solid' | 'outline' | 'ghost' | 'link'
export type ButtonColorScheme = 'primary' | 'secondary' | 'danger' | 'neutral'
export type ButtonSize = 'sm' | 'md' | 'lg'

type ButtonOwnProps<E extends ElementType = 'button'> = {
  as?: E
  variant?: ButtonVariant
  colorScheme?: ButtonColorScheme
  size?: ButtonSize
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  isDisabled?: boolean
  fullWidth?: boolean
  children?: ReactNode
  className?: string
}

export type ButtonProps<E extends ElementType = 'button'> = ButtonOwnProps<E> &
  Omit<ComponentPropsWithoutRef<E>, keyof ButtonOwnProps<E>>

export function Button<E extends ElementType = 'button'>({
  as,
  variant = 'solid',
  colorScheme = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  isDisabled = false,
  fullWidth = false,
  className = '',
  children,
  ...props
}: ButtonProps<E>) {
  const Component = as || 'button'

  const classes = [
    'btn',
    `btn--${variant}`,
    `btn--${colorScheme}`,
    `btn--${size}`,
    fullWidth && 'btn--full-width',
    isDisabled && 'btn--disabled',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <Component
      className={classes}
      disabled={Component === 'button' ? isDisabled : undefined}
      aria-disabled={Component !== 'button' ? isDisabled : undefined}
      {...props}
    >
      {leftIcon && <span className="btn__icon">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="btn__icon">{rightIcon}</span>}
    </Component>
  )
}
