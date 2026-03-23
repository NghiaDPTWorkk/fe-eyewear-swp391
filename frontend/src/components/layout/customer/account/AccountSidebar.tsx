import { useNavigate, useLocation } from 'react-router-dom'
import { ShoppingBag, MapPin, Clipboard, Heart, LogOut, Settings } from 'lucide-react'
import { STORAGE_KEYS } from '@/shared/constants/storage'
import { useAuthStore, useCartStore } from '@/store'
import { cn } from '@/lib/utils'
import { authApi } from '@/features/auth/services/auth.api.legacy'

export function AccountSidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { logout } = useAuthStore()
  const clearCart = useCartStore((state) => state.clearCart)

  const menuItems = [
    {
      group: 'ACCOUNT',
      items: [
        {
          label: 'My Settings',
          description: 'Personal info & passwords',
          icon: Settings,
          path: '/account/settings'
        },
        {
          label: 'My Orders',
          description: 'Track & view history',
          icon: ShoppingBag,
          path: '/account/orders'
        },
        {
          label: 'My Addresses',
          description: 'Shipping destinations',
          icon: MapPin,
          path: '/account/addresses'
        },
        {
          label: 'My Prescriptions',
          description: 'Manage vision details',
          icon: Clipboard,
          path: '/account/prescriptions'
        },
        {
          label: 'My Favorites',
          description: 'Saved frames & lenses',
          icon: Heart,
          path: '/account/favorites'
        }
      ]
    }
  ]

  const handleLogout = async () => {
    try {
      await authApi.logout()
    } catch (e) {
      // ec ec
      console.error(e)
    }
    logout()
    clearCart()
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
    navigate('/')
  }

  return (
    <div className="w-80 flex flex-col pt-8 px-6 min-h-[calc(100vh-200px)]">
      <h1 className="md:text-[36px] text-2xl font-bold text-mint-1200 mb-8">My Account</h1>

      <div className="flex flex-col gap-8 mb-12">
        {menuItems.map((group) => (
          <div key={group.group} className="flex flex-col gap-2">
            <span className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.2em] px-4 mb-2">
              {group.group}
            </span>
            {group.items.map((item) => {
              const isActive = location.pathname === item.path
              return (
                <button
                  key={item.label}
                  onClick={() => navigate(item.path)}
                  className={cn(
                    'flex items-center gap-4 p-4 rounded-xl transition-all h-[72px] border border-transparent',
                    isActive
                      ? 'bg-white text-primary-600 shadow-sm border-mint-50'
                      : 'text-gray-eyewear hover:bg-mint-50/50'
                  )}
                >
                  <div
                    className={cn(
                      'w-10 h-10 rounded-xl flex items-center justify-center transition-all',
                      isActive ? 'bg-primary-50 text-primary-600' : 'bg-mint-50/50 text-gray-400'
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col items-start">
                    <span
                      className={cn(
                        'font-bold text-sm leading-none mb-1',
                        isActive ? 'text-primary-600' : 'text-mint-1200'
                      )}
                    >
                      {item.label}
                    </span>
                    <span className="text-[10px] text-gray-400 tracking-wider">
                      {item.description}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        ))}
      </div>

      <button
        onClick={handleLogout}
        className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl hover:bg-danger-50 group transition-all mt-auto mb-10 border border-transparent hover:border-danger-100"
      >
        <div className="w-10 h-10 rounded-xl bg-danger-50 flex items-center justify-center border border-danger-100/20 group-hover:bg-white group-hover:border-danger-200 text-danger-500 shadow-sm transition-all">
          <LogOut size={20} />
        </div>
        <span className="text-sm font-bold text-danger-600 group-hover:text-danger-700 transition-colors uppercase tracking-wider">
          Sign Out
        </span>
      </button>
    </div>
  )
}
