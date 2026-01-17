import type { ElementType, ReactNode, ComponentPropsWithoutRef } from 'react'
import './icon-button.css'

export type IconButtonVariant = 'solid' | 'outline' | 'ghost'
export type IconButtonColorScheme = 'primary' | 'secondary' | 'danger' | 'neutral'
export type IconButtonSize = 'sm' | 'md' | 'lg'

type IconButtonOwnProps<E extends ElementType = 'button'> = {
  as?: E
  icon: ReactNode
  'aria-label': string
  variant?: IconButtonVariant
  colorScheme?: IconButtonColorScheme
  size?: IconButtonSize
  isRound?: boolean
  isDisabled?: boolean
  className?: string
}

export type IconButtonProps<E extends ElementType = 'button'> =
  IconButtonOwnProps<E> &
    Omit<ComponentPropsWithoutRef<E>, keyof IconButtonOwnProps<E>>

export function IconButton<E extends ElementType = 'button'>({
  as,
  icon,
  variant = 'ghost',
  colorScheme = 'neutral',
  size = 'md',
  isRound = false,
  isDisabled = false,
  className = '',
  ...props
}: IconButtonProps<E>) {
  const Component = as || 'button'

  const classes = [
    'icon-btn',
    `icon-btn--${variant}`,
    `icon-btn--${colorScheme}`,
    `icon-btn--${size}`,
    isRound && 'icon-btn--round',
    isDisabled && 'icon-btn--disabled',
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
      {icon}
    </Component>
  )
}
