import type { ElementType, ReactNode, ComponentPropsWithoutRef } from 'react'
import type { VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { ButtonVariants } from './Button.styles'

export type ButtonVariant = 'solid' | 'outline' | 'ghost' | 'link'
export type ButtonColorScheme = 'primary' | 'secondary' | 'danger' | 'neutral'
export type ButtonSize = 'sm' | 'md' | 'lg'

type ButtonOwnProps<E extends ElementType = 'Button'> = {
  as?: E
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  isDisabled?: boolean
  isFullWidth?: boolean
  children?: ReactNode
  className?: string
} & VariantProps<typeof ButtonVariants>

export type ButtonProps<E extends ElementType = 'Button'> = ButtonOwnProps<E> &
  Omit<ComponentPropsWithoutRef<E>, keyof ButtonOwnProps<E>>

export function Button<E extends ElementType = 'Button'>({
  as,
  variant = 'solid',
  colorScheme = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  isDisabled = false,
  isFullWidth = false,
  className,
  children,
  ...props
}: ButtonProps<E>) {
  const Component = as || 'Button'

  return (
    <Component
      className={cn(
        ButtonVariants({ variant, colorScheme, size }),
        isFullWidth && 'w-full',
        className
      )}
      disabled={Component === 'Button' ? isDisabled : undefined}
      aria-disabled={Component !== 'Button' ? isDisabled : undefined}
      {...props}
    >
      {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
    </Component>
  )
}
