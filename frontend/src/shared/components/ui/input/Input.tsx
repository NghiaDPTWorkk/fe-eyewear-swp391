import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const inputVariants = cva(
  [
    'flex w-full rounded-lg border bg-white transition-all duration-200',
    'focus-within:ring-2 focus-within:ring-offset-1',
    'has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50',
  ],
  {
    variants: {
      size: {
        sm: 'h-8 text-sm',
        md: 'h-10 text-base',
        lg: 'h-12 text-lg',
      },
      isInvalid: {
        true: 'border-danger-500 focus-within:ring-danger-500',
        false: 'border-neutral-300 focus-within:border-primary-500 focus-within:ring-primary-500',
      },
    },
    defaultVariants: {
      size: 'md',
      isInvalid: false,
    },
  }
)

export type InputSize = 'sm' | 'md' | 'lg'

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>,
    Omit<VariantProps<typeof inputVariants>, 'isInvalid'> {
  isInvalid?: boolean
  isDisabled?: boolean
  leftElement?: ReactNode
  rightElement?: ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      size = 'md',
      isInvalid = false,
      isDisabled = false,
      leftElement,
      rightElement,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div className={cn(inputVariants({ size, isInvalid }), className)}>
        {leftElement && (
          <span className="flex items-center justify-center pl-3 text-neutral-500">
            {leftElement}
          </span>
        )}

        <input
          ref={ref}
          disabled={isDisabled}
          className={cn(
            'flex-1 bg-transparent px-3 outline-none',
            'placeholder:text-neutral-400',
            'disabled:cursor-not-allowed'
          )}
          {...props}
        />

        {rightElement && (
          <span className="flex items-center justify-center pr-3 text-neutral-500">
            {rightElement}
          </span>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export { inputVariants }
