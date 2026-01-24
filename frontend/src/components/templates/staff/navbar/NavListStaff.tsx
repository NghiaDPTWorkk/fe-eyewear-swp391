import { FiSearch } from 'react-icons/fi'
import { MdOutlineNotifications } from 'react-icons/md'
import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'
import { Input } from '@/components/common'

interface NavSearchProps {
  className?: string
  placeholder?: string
}

export function NavSearch({ className, placeholder }: NavSearchProps) {
  return (
    <div className={cn('w-[500px] pl-4', className)}>
      <Input
        placeholder={placeholder || 'Search orders, customers, or frames...'}
        size="md"
        leftElement={
          <span className="pointer-events-none flex items-center justify-center ml-2">
            <FiSearch className="text-xl text-mint-700" />
          </span>
        }
        className="w-full bg-mint-200 border-mint-500 rounded-xl "
      />
    </div>
  )
}

interface NavActionsProps {
  className?: string
  actionIcon?: ReactNode
  userInitials?: string
}

export function NavActions({ className, actionIcon, userInitials = 'AM' }: NavActionsProps) {
  return (
    <div className={cn('flex justify-end items-center gap-4 pr-4', className)}>
      <button className="text-2xl text-mint-700 hover:text-mint-900 relative">
        {actionIcon ?? <MdOutlineNotifications />}
        <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-danger-500 ring-2 ring-white"></span>
      </button>

      <div className="w-10 h-10 rounded-full bg-mint-500 flex items-center justify-center text-white font-bold">
        {userInitials}
      </div>
    </div>
  )
}
