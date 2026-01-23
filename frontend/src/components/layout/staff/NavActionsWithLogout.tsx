import { IoLogOut } from 'react-icons/io5'

interface NavActionsWithLogoutProps {
  className?: string
  userInitials?: string
  onLogout?: () => void
}

export function NavActionsWithLogout({
  className,
  userInitials = 'AM',
  onLogout
}: NavActionsWithLogoutProps) {
  return (
    <div className={`flex items-center gap-3 ${className || ''}`}>
      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
        <div className="w-8 h-8 bg-mint-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
          {userInitials}
        </div>
      </button>

      <button
        onClick={onLogout}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 hover:text-red-600"
        title="Logout"
      >
        <IoLogOut className="w-5 h-5" />
      </button>
    </div>
  )
}
