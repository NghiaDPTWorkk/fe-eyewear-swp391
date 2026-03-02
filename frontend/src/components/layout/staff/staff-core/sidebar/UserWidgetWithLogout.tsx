import { IoLogOut } from 'react-icons/io5'
import { useLayoutStore } from '@/store/layout.store'
import { useLogout } from '@/shared/hooks/useLogout'
import { cn } from '@/lib/utils'

interface UserWidgetWithLogoutProps {
  userInitials?: string
  userName?: string
  userRole?: string
  onLogout?: () => void
}

export function UserWidgetWithLogout({
  userInitials = '...',
  userName = 'Loading...',
  userRole = 'Loading...',
  onLogout
}: UserWidgetWithLogoutProps) {
  const { sidebarCollapsed } = useLayoutStore()
  const { handleLogout } = useLogout()

  const logoutAction = onLogout || handleLogout

  return (
    <div>
      <div
        className={cn(
          'flex items-center mb-0 transition-all duration-300',
          sidebarCollapsed ? 'justify-center' : 'gap-3 mb-3'
        )}
      >
        <div className="w-10 h-10 bg-mint-500 rounded-full flex items-center justify-center shrink-0 shadow-sm shadow-mint-100">
          <span className="text-sm font-bold text-white uppercase">{userInitials}</span>
        </div>
        {!sidebarCollapsed && (
          <>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-gray-900 truncate">{userName}</div>
              <div className="text-xs text-gray-500 truncate">{userRole}</div>
            </div>
            <button
              onClick={logoutAction}
              className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-500 cursor-pointer"
              title="Logout"
            >
              <IoLogOut className="w-5 h-5" />
            </button>
          </>
        )}
      </div>
    </div>
  )
}
