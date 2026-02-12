import { useId } from 'react'
import { cn } from '@/lib/utils'

export interface RadioProps {
  name: string
  value: string
  label: string
  isChecked?: boolean
  isDisabled?: boolean
  onValueChange?: (value: string) => void
  className?: string
}

export function Radio({
  name,
  value,
  label,
  isChecked = false,
  isDisabled = false,
  onValueChange,
  className
}: RadioProps) {
  const id = useId()

  const handleChange = () => {
    if (!isDisabled && onValueChange) {
      onValueChange(value)
    }
  }

  return (
    <label
      htmlFor={id}
      className={cn(
        'inline-flex cursor-pointer items-center gap-2 select-none',
        isDisabled && 'cursor-not-allowed opacity-50',
        className
      )}
    >
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={isChecked}
        onChange={handleChange}
        disabled={isDisabled}
        className="peer sr-only"
      />

      <span
        className={cn(
          'flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all duration-200',
          'peer-focus-visible:ring-2 peer-focus-visible:ring-primary-500 peer-focus-visible:ring-offset-1',
          isChecked ? 'border-primary-600' : 'border-neutral-300'
        )}
      >
        <span
          className={cn(
            'h-2.5 w-2.5 rounded-full bg-primary-600 transition-transform duration-200',
            isChecked ? 'scale-100' : 'scale-0'
          )}
        />
      </span>

      <span>{label}</span>
    </label>
  )
}
