import { useId } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const checkboxVariants = cva('inline-flex cursor-pointer items-center gap-2 select-none', {
  variants: {
    size: {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg'
    },
    isDisabled: {
      true: 'cursor-not-allowed opacity-50',
      false: ''
    }
  },
  defaultVariants: {
    size: 'md',
    isDisabled: false
  }
})

const checkboxBoxVariants = cva(
  [
    'flex items-center justify-center rounded border-2 transition-all duration-200',
    'peer-focus-visible:ring-2 peer-focus-visible:ring-primary-500 peer-focus-visible:ring-offset-1'
  ],
  {
    variants: {
      size: {
        sm: 'h-4 w-4',
        md: 'h-5 w-5',
        lg: 'h-6 w-6'
      },
      isChecked: {
        true: 'border-primary-600 bg-primary-600 text-white',
        false: 'border-neutral-300 bg-white'
      }
    },
    defaultVariants: {
      size: 'md',
      isChecked: false
    }
  }
)

export type CheckboxSize = 'sm' | 'md' | 'lg'

export interface CheckboxProps extends Omit<VariantProps<typeof checkboxVariants>, 'isDisabled'> {
  isChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  label?: string
  isDisabled?: boolean
  id?: string
  className?: string
}

export function Checkbox({
  isChecked = false,
  onCheckedChange,
  label,
  isDisabled = false,
  size = 'md',
  id,
  className
}: CheckboxProps) {
  const generatedId = useId()
  const checkboxId = id || generatedId

  const handleChange = () => {
    if (!isDisabled && onCheckedChange) {
      onCheckedChange(!isChecked)
    }
  }

  return (
    <label htmlFor={checkboxId} className={cn(checkboxVariants({ size, isDisabled }), className)}>
      <input
        type="checkbox"
        id={checkboxId}
        checked={isChecked}
        onChange={handleChange}
        disabled={isDisabled}
        className="peer sr-only"
      />

      <span className={checkboxBoxVariants({ size, isChecked })}>
        <svg
          className={cn('h-3 w-3', size === 'sm' && 'h-2.5 w-2.5', size === 'lg' && 'h-4 w-4')}
          viewBox="0 0 12 12"
          fill="none"
        >
          <path
            d="M2 6L5 9L10 3"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>

      {label && <span>{label}</span>}
    </label>
  )
}

export { checkboxVariants, checkboxBoxVariants }
