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

export function NavSearch({
  className,
  inputContainerClassName,
  placeholder,
  styleVariant = 'default'
}: NavSearchProps) {
  const { toggleSidebar } = useLayoutStore()

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
        className="lg:hidden p-2 rounded-lg text-neutral-500 hover:bg-neutral-50 transition-colors"
      >
        <HiMenuAlt2 className="text-2xl" />
      </Button>

      <div className={cn('max-w-lg flex-1', inputContainerClassName)}>
        <Input
          placeholder={placeholder || 'Search orders, customers, or frames...'}
          size="md"
          autoComplete="off"
          leftElement={
            <span className="pointer-events-none flex items-center justify-center ml-2">
              <FiSearch className={cn('text-xl', iconColor)} />
            </span>
          }
          className={cn('w-full', inputStyles)}
        />
      </div>
    </div>
  )
}
