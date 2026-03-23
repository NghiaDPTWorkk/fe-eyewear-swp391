import { useId } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

const checkboxVariants = cva(
  'inline-flex cursor-pointer items-center min-w-[1.25rem] select-none group',
  {
    variants: {
      size: {
        sm: 'gap-2 text-xs',
        md: 'gap-3 text-sm font-bold',
        lg: 'gap-4 text-base'
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
  }
)

const checkboxBoxVariants = cva(
  [
    'flex items-center justify-center rounded-lg border-2 transition-all duration-200 shrink-0 relative',
    'peer-focus-visible:ring-2 peer-focus-visible:ring-primary-500 peer-focus-visible:ring-offset-1 shadow-sm'
  ],
  {
    variants: {
      size: {
        sm: 'h-4 w-4',
        md: 'h-5 w-5',
        lg: 'h-6 w-6'
      }
    },
    defaultVariants: {
      size: 'md'
    }
  }
)

export type CheckboxSize = 'sm' | 'md' | 'lg'
export type CheckboxVariant = 'primary' | 'yellow'

export interface CheckboxProps extends Omit<VariantProps<typeof checkboxVariants>, 'isDisabled'> {
  isChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  label?: string
  isDisabled?: boolean
  id?: string
  className?: string
  variant?: CheckboxVariant
  labelClassName?: string
}

export function Checkbox({
  isChecked = false,
  onCheckedChange,
  label,
  isDisabled = false,
  size = 'md',
  variant = 'primary',
  id,
  className,
  labelClassName
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

      <span
        className={cn(
          checkboxBoxVariants({ size }),
          variant === 'primary' &&
            (isChecked
              ? 'border-primary-500 bg-primary-500 text-white'
              : 'border-gray-200 bg-white group-hover:border-primary-400'),
          variant === 'yellow' &&
            (isChecked
              ? 'border-yellow-500 bg-yellow-500 text-white'
              : 'border-yellow-300 bg-white group-hover:border-yellow-400')
        )}
      >
        {isChecked && (
          <Check
            className={cn('h-3.5 w-3.5', size === 'sm' && 'h-3 w-3', size === 'lg' && 'h-4 w-4')}
          />
        )}
      </span>

      {label && <span className={cn('select-none', labelClassName)}>{label}</span>}
    </label>
  )
}
