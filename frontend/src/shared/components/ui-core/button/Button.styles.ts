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
        outline: 'bg-transparent border',
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
        className: 'bg-primary-500 text-white hover:bg-primary-600 focus-visible:ring-primary-500'
      },
      {
        variant: 'solid',
        colorScheme: 'secondary',
        className:
          'bg-secondary-500 text-white hover:bg-secondary-600 focus-visible:ring-secondary-500'
      },
      {
        variant: 'solid',
        colorScheme: 'danger',
        className: 'bg-danger-500 text-white hover:bg-danger-600 focus-visible:ring-danger-500'
      },
      {
        variant: 'solid',
        colorScheme: 'neutral',
        className: 'bg-neutral-500 text-white hover:bg-neutral-600 focus-visible:ring-neutral-500'
      },
      {
        variant: 'outline',
        colorScheme: 'primary',
        className:
          'border-primary-500 text-primary-500 hover:bg-primary-50 focus-visible:ring-primary-500'
      },
      {
        variant: 'outline',
        colorScheme: 'secondary',
        className:
          'border-secondary-500 text-secondary-500 hover:bg-secondary-50 focus-visible:ring-secondary-500'
      },
      {
        variant: 'outline',
        colorScheme: 'danger',
        className:
          'border-danger-500 text-danger-500 hover:bg-danger-50 focus-visible:ring-danger-500'
      },
      {
        variant: 'outline',
        colorScheme: 'neutral',
        className:
          'border-neutral-200 text-neutral-600 hover:bg-neutral-50 focus-visible:ring-neutral-200'
      },
      {
        variant: 'ghost',
        colorScheme: 'primary',
        className: 'text-primary-500 hover:bg-primary-100 focus-visible:ring-primary-500'
      },
      {
        variant: 'ghost',
        colorScheme: 'secondary',
        className: 'text-secondary-500 hover:bg-secondary-100 focus-visible:ring-secondary-500'
      },
      {
        variant: 'ghost',
        colorScheme: 'danger',
        className: 'text-danger-500 hover:bg-danger-100 focus-visible:ring-danger-500'
      },
      {
        variant: 'ghost',
        colorScheme: 'neutral',
        className: 'text-neutral-500 hover:bg-neutral-100 focus-visible:ring-neutral-500'
      },
      {
        variant: 'link',
        colorScheme: 'primary',
        className: 'text-primary-500 hover:text-primary-600'
      },
      {
        variant: 'link',
        colorScheme: 'secondary',
        className: 'text-secondary-500 hover:text-secondary-600'
      },
      {
        variant: 'link',
        colorScheme: 'danger',
        className: 'text-danger-500 hover:text-danger-600'
      },
      {
        variant: 'link',
        colorScheme: 'neutral',
        className: 'text-neutral-500 hover:text-neutral-600'
      }
    ],
    defaultVariants: {
      variant: 'solid',
      colorScheme: 'primary',
      size: 'md'
    }
  }
)
