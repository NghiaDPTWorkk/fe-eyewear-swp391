import { forwardRef, useId, type ReactNode, type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface FormFieldProps extends HTMLAttributes<HTMLDivElement> {
  label: string
  fieldId?: string
  children: ReactNode
  error?: string
  helperText?: string
  isRequired?: boolean
}

export const FormField = forwardRef<HTMLDivElement, FormFieldProps>(
  (
    {
      label,
      fieldId,
      children, //
      error,
      helperText,
      isRequired = false,
      className,
      ...props
    },
    ref
  ) => {
    const generatedId = useId()
    const id = fieldId || generatedId

    return (
      <div ref={ref} className={cn('flex flex-col gap-1.5', className)} {...props}>
        <label htmlFor={id} className="text-sm font-medium text-neutral-700">
          {label}
          {isRequired && <span className="ml-0.5 text-danger-500">*</span>}
        </label>

        <div>{children}</div>

        {error && <span className="text-sm text-danger-500">{error}</span>}

        {!error && helperText && <span className="text-sm text-neutral-500">{helperText}</span>}
      </div>
    )
  }
)

FormField.displayName = 'FormField'
