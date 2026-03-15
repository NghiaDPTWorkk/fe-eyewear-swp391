import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface LogoProps {
  className?: string
  iconClassName?: string
}

export default function LogoEyewearIcon({ className, iconClassName }: LogoProps) {
  return (
    <div
      className={cn(
        'flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary-400 to-primary-600',
        className
      )}
    >
      <svg
        className={cn('h-6 w-6 text-white', iconClassName)}
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 2L2 7L12 12L22 7L12 2Z" />
        <path d="M2 17L12 22L22 17" opacity="0.7" />
      </svg>
    </div>
  )
}
