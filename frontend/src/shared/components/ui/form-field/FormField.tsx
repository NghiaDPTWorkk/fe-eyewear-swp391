import type { ReactNode } from 'react'
import { useId } from 'react'
import './form-field.css'

export interface FormFieldProps {
  label: string
  id?: string
  children: ReactNode
  error?: string
  helperText?: string
  required?: boolean
}

export function FormField({
  label,
  id,
  children,
  error,
  helperText,
  required = false,
}: FormFieldProps) {
  const generatedId = useId()
  const fieldId = id || generatedId

  return (
    <div className="form-field">
      <label className="form-field__label" htmlFor={fieldId}>
        {label}
        {required && <span className="form-field__required">*</span>}
      </label>

      <div className="form-field__input">{children}</div>

      {error && <span className="form-field__error">{error}</span>}
      {!error && helperText && <span className="form-field__helper">{helperText}</span>}
    </div>
  )
}
