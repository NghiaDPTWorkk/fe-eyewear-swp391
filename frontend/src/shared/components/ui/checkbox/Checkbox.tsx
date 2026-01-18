import { useId } from 'react'
import './checkbox.css'

export type CheckboxSize = 'sm' | 'md' | 'lg'

export interface CheckboxProps {
  checked?: boolean
  onChange?: (checked: boolean) => void
  label?: string
  disabled?: boolean
  size?: CheckboxSize
  id?: string
}

export function Checkbox({
  checked = false,
  onChange,
  label,
  disabled = false,
  size = 'md',
  id,
}: CheckboxProps) {
  const generatedId = useId()
  const checkboxId = id || generatedId

  const handleChange = () => {
    if (!disabled && onChange) {
      onChange(!checked)
    }
  }

  const classes = [
    'checkbox',
    `checkbox--${size}`,
    checked && 'checkbox--checked',
    disabled && 'checkbox--disabled',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <label className={classes} htmlFor={checkboxId}>
      <input
        type="checkbox"
        id={checkboxId}
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        className="checkbox__input"
      />
      <span className="checkbox__box">
        <svg className="checkbox__icon" viewBox="0 0 12 12" fill="none">
          <path
            d="M2 6L5 9L10 3"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      {label && <span className="checkbox__label">{label}</span>}
    </label>
  )
}
