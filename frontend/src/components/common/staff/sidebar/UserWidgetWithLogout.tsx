import { IoLogOut } from 'react-icons/io5'

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
  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 bg-mint-500 rounded-full flex items-center justify-center">
          <span className="text-sm font-medium text-white">{userInitials}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-gray-900">{userName}</div>
          <div className="text-xs text-gray-600">{userRole}</div>
        </div>
        <button
          onClick={onLogout}
          className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600"
          title="Logout"
        >
          <IoLogOut className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
