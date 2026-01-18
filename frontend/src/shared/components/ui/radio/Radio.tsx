import { useId } from 'react'
import './radio.css'

export interface RadioProps {
  name: string
  value: string
  label: string
  checked?: boolean
  disabled?: boolean
  onChange?: (value: string) => void
}

export function Radio({
  name,
  value,
  label,
  checked = false,
  disabled = false,
  onChange,
}: RadioProps) {
  const id = useId()

  const handleChange = () => {
    if (!disabled && onChange) {
      onChange(value)
    }
  }

  const classes = ['radio', checked && 'radio--checked', disabled && 'radio--disabled']
    .filter(Boolean)
    .join(' ')

  return (
    <label className={classes} htmlFor={id}>
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        className="radio__input"
      />
      <span className="radio__circle">
        <span className="radio__dot" />
      </span>
      <span className="radio__label">{label}</span>
    </label>
  )
}
