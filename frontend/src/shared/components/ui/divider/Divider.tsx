export interface DividerProps {
  text?: string
  className?: string
  lineClassName?: string
  textClassName?: string
}

export const Divider = ({
  text = 'Or',
  className = '',
  lineClassName = '',
  textClassName = ''
}: DividerProps) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`h-px flex-1 bg-neutral-300 ${lineClassName}`} />
      {text && <span className={`text-sm text-gray-eyewear ${textClassName}`}>{text}</span>}
      <div className={`h-px flex-1 bg-neutral-300 ${lineClassName}`} />
    </div>
  )
}
