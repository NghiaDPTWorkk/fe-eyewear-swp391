import { FiSearch, FiMail } from 'react-icons/fi'
import { MdOutlineNotifications } from 'react-icons/md'
import { cn } from '@/lib/utils'
import { Input } from '@/shared/components/ui'
import { HiMenuAlt2 } from 'react-icons/hi'
import { useLayoutStore } from '@/store/layout.store'

interface NavSearchProps {
  className?: string
  placeholder?: string
  styleVariant?: 'default' | 'operation'
}

export function NavSearch({ className, placeholder, styleVariant = 'default' }: NavSearchProps) {
  const { toggleSidebar } = useLayoutStore()

  const inputStyles =
    styleVariant === 'operation'
      ? 'bg-mint-200 border-mint-500 rounded-xl'
      : 'bg-neutral-50 border-neutral-100 rounded-xl'

  const iconColor = styleVariant === 'operation' ? 'text-mint-700' : 'text-neutral-400'

  return (
    <div className={cn('flex items-center gap-3 w-full pr-2', className)}>
      <button
        onClick={toggleSidebar}
        className="lg:hidden p-2 rounded-lg text-neutral-500 hover:bg-neutral-50 transition-colors"
      >
        <HiMenuAlt2 className="text-2xl" />
      </button>

      <div className="max-w-lg flex-1 lg:pl-6">
        <Input
          placeholder={placeholder || 'Search orders, customers, or frames...'}
          size="md"
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

interface NavActionsProps {
  className?: string
  userName?: string
  userRole?: string
  userInitials?: string
}

export function NavActions({
  className,
  userName = 'Staff Member',
  userRole = 'Staff',
  userInitials = 'SM'
}: NavActionsProps) {
  return (
    <div className={cn('flex justify-end items-center gap-6 pr-4', className)}>
      <div className="flex items-center gap-4 text-neutral-500">
        <button
          className="relative p-1 hover:text-primary-500 transition-colors"
          title="View Messages"
        >
          <FiMail className="text-2xl" />
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-danger-500 ring-2 ring-white"></span>
        </button>
        <button
          className="relative p-1 hover:text-primary-500 transition-colors"
          title="View Notifications"
        >
          <MdOutlineNotifications className="text-2xl" />
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-primary-500 ring-2 ring-white"></span>
        </button>
      </div>

      <div className="h-8 w-px bg-neutral-100" />

      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <div className="text-sm font-bold text-neutral-900 leading-tight">{userName}</div>
          <div className="text-xs text-neutral-400 font-medium">{userRole}</div>
        </div>
        <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 font-bold border border-neutral-100">
          {userInitials}
        </div>
      </div>
    </div>
  )
}
