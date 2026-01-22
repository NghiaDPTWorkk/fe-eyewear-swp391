import { forwardRef, type TextareaHTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const textareaVariants = cva(
  [
    'flex w-full rounded-lg border bg-white px-3 py-2 transition-all duration-200',
    'placeholder:text-neutral-400',
    'focus:outline-none focus:ring-2 focus:ring-offset-1',
    'disabled:cursor-not-allowed disabled:opacity-50'
  ],
  {
    variants: {
      size: {
        sm: 'min-h-[80px] text-sm',
        md: 'min-h-[100px] text-base',
        lg: 'min-h-[140px] text-lg'
      },
      isInvalid: {
        true: 'border-danger-500 focus:ring-danger-500',
        false: 'border-neutral-300 focus:border-primary-500 focus:ring-primary-500'
      }
    },
    defaultVariants: {
      size: 'md',
      isInvalid: false
    }
  }
)

export type TextareaSize = 'sm' | 'md' | 'lg'
export type TextareaResize = 'none' | 'vertical' | 'horizontal' | 'both'

export interface TextareaProps
  extends
    Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'>,
    Omit<VariantProps<typeof textareaVariants>, 'isInvalid'> {
  isInvalid?: boolean
  isDisabled?: boolean
  resize?: TextareaResize
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      size = 'md',
      isInvalid = false,
      isDisabled = false,
      resize = 'vertical',
      className,
      ...props
    },
    ref
  ) => {
    return (
      <textarea
        ref={ref}
        disabled={isDisabled}
        className={cn(textareaVariants({ size, isInvalid }), className)}
        style={{ resize }}
        {...props}
      />
    )
  }
)

Textarea.displayName = 'Textarea'

export { textareaVariants }
