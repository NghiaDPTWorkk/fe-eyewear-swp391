import { useLayoutStore } from '@/store/layout.store'
import { cn } from '@/lib/utils'
import { HiMenuAlt2 } from 'react-icons/hi'
import { Button, Input } from '@/shared/components/ui-core'
import { FiSearch } from 'react-icons/fi'

export interface NavSearchProps {
  className?: string
  inputContainerClassName?: string
  placeholder?: string
  styleVariant?: 'default' | 'operation' | 'manager'
}

import { useEffect, useRef } from 'react'

export function NavSearch({
  className,
  inputContainerClassName,
  placeholder,
  styleVariant = 'operation'
}: NavSearchProps) {
  const { toggleSidebar } = useLayoutStore()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Explicitly clear value on mount to defeat browser autofill
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }, [])

  const inputStyles =
    styleVariant === 'operation'
      ? 'bg-mint-200 border-mint-500 rounded-xl'
      : styleVariant === 'manager'
        ? 'bg-mint-50 border-mint-200 rounded-xl shadow-sm'
        : 'bg-neutral-50 border-neutral-100 rounded-xl'

  const iconColor =
    styleVariant === 'operation'
      ? 'text-mint-700'
      : styleVariant === 'manager'
        ? 'text-mint-600'
        : 'text-neutral-400'

  return (
    <div className={cn('flex items-center gap-3 w-full pr-2', className)}>
      <Button
        onClick={toggleSidebar}
        className="lg:hidden p-2 rounded-lg text-neutral-500 hover:bg-neutral-50 transition-colors cursor-pointer"
      >
        <HiMenuAlt2 className="text-2xl" />
      </Button>

      <div className={cn('max-w-lg flex-1 relative', inputContainerClassName)}>
        {/* Hidden inputs to trick browsers that try to autofill the search bar on settings pages */}
        <input type="text" style={{ display: 'none' }} aria-hidden="true" />
        <input type="password" style={{ display: 'none' }} aria-hidden="true" />
        <Input
          ref={inputRef}
          id="opticview-navbar-search-field-v2"
          name="opticview-navbar-search-field-v2"
          type="search"
          placeholder={placeholder || 'Search orders, customers, or frames...'}
          size="md"
          autoComplete="one-time-code"
          defaultValue=""
          data-lpignore="true"
          leftElement={
            <span className="flex items-center justify-center ml-2 cursor-pointer">
              <FiSearch className={cn('text-xl', iconColor)} />
            </span>
          }
          className={cn('w-full cursor-pointer', inputStyles)}
        />
      </div>
    </div>
  )
}
