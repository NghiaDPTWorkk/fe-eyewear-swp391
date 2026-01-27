import type { ElementType, ReactNode, ComponentPropsWithoutRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2',
    'font-medium whitespace-nowrap',
    'rounded-lg transition-all duration-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
    'cursor-pointer'
  ],
  {
    variants: {
      variant: {
        solid: '',
        outline: 'bg-transparent border-2',
        ghost: 'bg-transparent',
        link: 'bg-transparent underline-offset-4 hover:underline'
      },
      colorScheme: {
        primary: '',
        secondary: '',
        danger: '',
        neutral: ''
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-base',
        lg: 'h-12 px-6 text-lg'
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
      },
      {
        variant: 'link',
        colorScheme: 'primary',
        className: 'text-primary-600 hover:text-primary-700'
      },
      {
        variant: 'link',
        colorScheme: 'secondary',
        className: 'text-secondary-600 hover:text-secondary-700'
      },
      {
        variant: 'link',
        colorScheme: 'danger',
        className: 'text-danger-600 hover:text-danger-700'
      },
      {
        variant: 'link',
        colorScheme: 'neutral',
        className: 'text-neutral-600 hover:text-neutral-700'
      }
    ],
    defaultVariants: {
      variant: 'solid',
      colorScheme: 'primary',
      size: 'md'
    }
  }
)

export type ButtonVariant = 'solid' | 'outline' | 'ghost' | 'link'
export type ButtonColorScheme = 'primary' | 'secondary' | 'danger' | 'neutral'
export type ButtonSize = 'sm' | 'md' | 'lg'

type ButtonOwnProps<E extends ElementType = 'button'> = {
  as?: E
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  isDisabled?: boolean
  isFullWidth?: boolean
  children?: ReactNode
  className?: string
} & VariantProps<typeof buttonVariants>

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
  isFullWidth = false,
  className,
  children,
  ...props
}: ButtonProps<E>) {
  const Component = as || 'button'

  return (
    <Component
      className={cn(
        buttonVariants({ variant, colorScheme, size }),
        isFullWidth && 'w-full',
        className
      )}
      disabled={Component === 'button' ? isDisabled : undefined}
      aria-disabled={Component !== 'button' ? isDisabled : undefined}
      {...props}
    >
      {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
    </Component>
  )
}

export { buttonVariants }
