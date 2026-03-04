import { useState, useRef } from 'react'
import { User, LogOut, ChevronRight, ShoppingBag, MapPin, Clipboard, Heart } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { STORAGE_KEYS } from '@/shared/constants/storage'
import { useAuthStore, useCartStore } from '@/store'
import { authApi } from '@/features/auth/services/auth.api.legacy'

export function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const { user, logout } = useAuthStore()
  const clearCart = useCartStore((state) => state.clearCart)
  const navigate = useNavigate()

  const menuItems = [
    { icon: User, label: 'My Profile', to: '/account/settings' },
    { icon: ShoppingBag, label: 'My Orders', to: '/account/orders' },
    { icon: MapPin, label: 'My Addresses', to: '/account/addresses' },
    { icon: Clipboard, label: 'My Prescriptions', to: '/account/prescriptions' },
    { icon: Heart, label: 'My favorites', to: '/account/favorites' }
  ]

  const handleLogout = async () => {
    try {
      await authApi.logout()
    } catch (e) {
      console.error(e)
    }

    logout()
    clearCart()
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
    navigate('/')
  }

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        className="p-2 hover:bg-mint-200 rounded-full transition-all group flex items-center gap-2"
        aria-label="User Profile"
        onClick={() => navigate('/account/settings')}
      >
        <User className="w-5 h-5 text-gray-eyewear group-hover:text-primary-500 transition-colors" />
        <span className="text-sm font-medium text-gray-eyewear hidden md:block">
          {user?.name || ''}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-0 w-72 bg-white rounded-2xl shadow-xl border border-neutral-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="p-6 bg-white border-b border-neutral-50 font-sans">
            <div className="mb-3">
              <h3 className="text-xl font-semibold text-neutral-900 leading-tight">
                {user?.name || ''}
              </h3>
              <p className="text-sm font-medium text-neutral-500 truncate mt-1">
                {user?.email || ''}
              </p>
            </div>
            <span className="px-3 py-1 bg-primary-100 text-primary-600 text-[11px] font-semibold uppercase tracking-wider rounded-lg border border-primary-200/30">
              Customer
            </span>
          </div>

          <div className="p-3 font-sans">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-neutral-50 group transition-all"
              >
                <div className="w-9 h-9 rounded-lg bg-neutral-50 flex items-center justify-center group-hover:bg-white group-hover:shadow-sm border border-transparent group-hover:border-neutral-100 transition-all text-neutral-500 group-hover:text-primary-500">
                  <item.icon className="w-5 h-5" />
                </div>
                <span className="text-sm font-semibold text-neutral-700 group-hover:text-neutral-900">
                  {item.label}
                </span>
                <ChevronRight
                  className="ml-auto text-neutral-300 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all font-medium"
                  size={14}
                />
              </Link>
            ))}
          </div>

          <div className="p-3 bg-neutral-50/50 border-t border-neutral-50 font-sans">
            <button
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-danger-50 group transition-all border border-transparent hover:border-danger-100"
              onClick={handleLogout}
            >
              <div className="w-9 h-9 rounded-lg bg-danger-50 flex items-center justify-center border border-danger-100/20 group-hover:bg-white group-hover:border-danger-200 text-danger-500 shadow-sm transition-all">
                <LogOut className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold text-danger-600 group-hover:text-danger-700 transition-colors uppercase tracking-wider">
                Sign Out
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
