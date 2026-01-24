import { FiSearch, FiMail } from 'react-icons/fi'
import { MdOutlineNotifications } from 'react-icons/md'
import { cn } from '@/lib/utils'
import { Input } from '@/components'

interface NavSearchProps {
  className?: string
  placeholder?: string
}

export function NavSearch({ className, placeholder }: NavSearchProps) {
  return (
    <div className={cn('max-w-125 w-full pl-4 hidden md:block', className)}>
      <Input
        placeholder={placeholder || 'Search orders, customers, or frames...'}
        size="md"
        leftElement={
          <span className="pointer-events-none flex items-center justify-center ml-2">
            <FiSearch className="text-xl text-neutral-400" />
          </span>
        }
        className="w-full bg-neutral-50 border-neutral-100 rounded-xl"
      />
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
  userName = 'Sarah L.',
  userRole = 'Sale Staff',
  userInitials = 'SL'
}: NavActionsProps) {
  return (
    <div className={cn('flex justify-end items-center gap-6 pr-4', className)}>
      <div className="flex items-center gap-4 text-neutral-500">
        <button
          className="relative p-1 hover:text-mint-500 transition-colors"
          title="View Messages"
        >
          <FiMail className="text-2xl" />
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-danger-500 ring-2 ring-white"></span>
        </button>
        <button
          className="relative p-1 hover:text-mint-500 transition-colors"
          title="View Notifications"
        >
          <MdOutlineNotifications className="text-2xl" />
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-mint-500 ring-2 ring-white"></span>
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
