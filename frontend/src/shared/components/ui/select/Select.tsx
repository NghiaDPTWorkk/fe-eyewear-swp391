import { forwardRef, type SelectHTMLAttributes, type ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const selectVariants = cva(
  [
    'relative flex w-full rounded-lg border bg-white transition-all duration-200',
    'focus-within:ring-2 focus-within:ring-offset-1',
    'has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50'
  ],
  {
    variants: {
      size: {
        sm: 'h-8 text-sm',
        md: 'h-10 text-base',
        lg: 'h-12 text-lg'
      },
      isInvalid: {
        true: 'border-danger-500 focus-within:ring-danger-500',
        false: 'border-neutral-300 focus-within:border-primary-500 focus-within:ring-primary-500'
      }
    },
    defaultVariants: {
      size: 'md',
      isInvalid: false
    }
  }
)

export type SelectSize = 'sm' | 'md' | 'lg'

export interface SelectProps
  extends
    Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'>,
    Omit<VariantProps<typeof selectVariants>, 'isInvalid'> {
  isInvalid?: boolean
  isDisabled?: boolean
  placeholder?: string
  children: ReactNode
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      size = 'md',
      isInvalid = false,
      isDisabled = false,
      placeholder,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div className={cn(selectVariants({ size, isInvalid }), className)}>
        <select
          ref={ref}
          disabled={isDisabled}
          className={cn(
            'flex-1 cursor-pointer appearance-none bg-transparent px-3 pr-8 outline-none',
            'disabled:cursor-not-allowed'
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {children}
        </select>

        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M2.5 4.5L6 8L9.5 4.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
    )
  }
)

Select.displayName = 'Select'

export { selectVariants }
