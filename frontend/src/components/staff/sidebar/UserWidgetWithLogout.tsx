import { FiLogOut } from 'react-icons/fi'
import { useLayoutStore } from '@/store/layout.store'
import { cn } from '@/lib/utils'

interface UserWidgetWithLogoutProps {
  userInitials: string
  userName: string
  userRole: string
  onLogout?: () => void
}

export function UserWidgetWithLogout({
  userInitials,
  userName,
  userRole,
  onLogout
}: UserWidgetWithLogoutProps) {
  const { sidebarCollapsed } = useLayoutStore()

  return (
    <div
      className={cn(
        'flex items-center bg-gray-50 rounded-xl border border-gray-100 transition-all duration-300',
        sidebarCollapsed ? 'justify-center p-1 border-none bg-transparent' : 'gap-3 p-3'
      )}
    >
      <div className="w-10 h-10 shrink-0 rounded-full bg-mint-500 flex items-center justify-center text-white font-bold shadow-sm shadow-mint-200">
        {userInitials}
      </div>
      {!sidebarCollapsed && (
        <>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-gray-900 text-sm truncate">{userName}</div>
            <div className="text-xs text-gray-500 truncate">{userRole}</div>
          </div>
          <button
            onClick={onLogout}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Logout"
          >
            <FiLogOut size={18} />
          </button>
        </>
      )}
    </div>
  )
}
