import type { ElementType, ReactNode, ComponentPropsWithoutRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const iconButtonVariants = cva(
  [
    'inline-flex items-center justify-center',
    'transition-all duration-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
    'cursor-pointer'
  ],
  {
    variants: {
      variant: {
        solid: '',
        outline: 'bg-transparent border-2',
        ghost: 'bg-transparent'
      },
      colorScheme: {
        primary: '',
        secondary: '',
        danger: '',
        neutral: ''
      },
      size: {
        sm: 'h-8 w-8 text-sm',
        md: 'h-10 w-10 text-base',
        lg: 'h-12 w-12 text-lg'
      },
      isRound: {
        true: 'rounded-full',
        false: 'rounded-lg'
      }
    },
    compoundVariants: [
      {
        variant: 'solid',
        colorScheme: 'primary',
        className: 'bg-primary-600 text-white hover:bg-primary-700 focus-visible:ring-primary-500'
      },
      {
        variant: 'solid',
        colorScheme: 'secondary',
        className:
          'bg-secondary-600 text-white hover:bg-secondary-700 focus-visible:ring-secondary-500'
      },
      {
        variant: 'solid',
        colorScheme: 'danger',
        className: 'bg-danger-600 text-white hover:bg-danger-700 focus-visible:ring-danger-500'
      },
      {
        variant: 'solid',
        colorScheme: 'neutral',
        className: 'bg-neutral-600 text-white hover:bg-neutral-700 focus-visible:ring-neutral-500'
      },
      {
        variant: 'outline',
        colorScheme: 'primary',
        className:
          'border-primary-600 text-primary-600 hover:bg-primary-50 focus-visible:ring-primary-500'
      },
      {
        variant: 'outline',
        colorScheme: 'secondary',
        className:
          'border-secondary-600 text-secondary-600 hover:bg-secondary-50 focus-visible:ring-secondary-500'
      },
      {
        variant: 'outline',
        colorScheme: 'danger',
        className:
          'border-danger-600 text-danger-600 hover:bg-danger-50 focus-visible:ring-danger-500'
      },
      {
        variant: 'outline',
        colorScheme: 'neutral',
        className:
          'border-neutral-600 text-neutral-600 hover:bg-neutral-50 focus-visible:ring-neutral-500'
      },
      {
        variant: 'ghost',
        colorScheme: 'primary',
        className: 'text-primary-600 hover:bg-primary-100 focus-visible:ring-primary-500'
      },
      {
        variant: 'ghost',
        colorScheme: 'secondary',
        className: 'text-secondary-600 hover:bg-secondary-100 focus-visible:ring-secondary-500'
      },
      {
        variant: 'ghost',
        colorScheme: 'danger',
        className: 'text-danger-600 hover:bg-danger-100 focus-visible:ring-danger-500'
      },
      {
        variant: 'ghost',
        colorScheme: 'neutral',
        className: 'text-neutral-600 hover:bg-neutral-100 focus-visible:ring-neutral-500'
      }
    ],
    defaultVariants: {
      variant: 'ghost',
      colorScheme: 'neutral',
      size: 'md',
      isRound: false
    }
  }
)

export type IconButtonVariant = 'solid' | 'outline' | 'ghost'
export type IconButtonColorScheme = 'primary' | 'secondary' | 'danger' | 'neutral'
export type IconButtonSize = 'sm' | 'md' | 'lg'

type IconButtonOwnProps<E extends ElementType = 'button'> = {
  as?: E
  icon: ReactNode
  'aria-label': string
  isRound?: boolean
  isDisabled?: boolean
  className?: string
} & Omit<VariantProps<typeof iconButtonVariants>, 'isRound'>

export type IconButtonProps<E extends ElementType = 'button'> = IconButtonOwnProps<E> &
  Omit<ComponentPropsWithoutRef<E>, keyof IconButtonOwnProps<E>>

export function IconButton<E extends ElementType = 'button'>({
  as,
  icon,
  variant = 'ghost',
  colorScheme = 'neutral',
  size = 'md',
  isRound = false,
  isDisabled = false,
  className,
  ...props
}: IconButtonProps<E>) {
  const Component = as || 'button'

  return (
    <Component
      className={cn(iconButtonVariants({ variant, colorScheme, size, isRound }), className)}
      disabled={Component === 'button' ? isDisabled : undefined}
      aria-disabled={Component !== 'button' ? isDisabled : undefined}
      {...props}
    >
      {icon}
    </Component>
  )
}

export { iconButtonVariants }
