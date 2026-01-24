import { cva } from 'class-variance-authority'

export const buttonVariants = cva(
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
        className:
          'bg-mint-500 text-white hover:bg-mint-600 focus-visible:ring-mint-500 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all'
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
        className: 'border-mint-500 text-mint-600 hover:bg-mint-50 focus-visible:ring-mint-500'
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
