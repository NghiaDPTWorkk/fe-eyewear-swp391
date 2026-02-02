import { useNavigate, useLocation } from 'react-router-dom'
import { ShoppingBag, MapPin, Clipboard, Heart, LogOut, Settings } from 'lucide-react'
import { STORAGE_KEYS } from '@/shared/constants/storage'
import { useAuthStore, useCartStore } from '@/store'
import { cn } from '@/lib/utils'
import { Button } from '@/components'

export function AccountSidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { logout } = useAuthStore()
  const clearCart = useCartStore((state) => state.clearCart)

  const menuItems = [
    {
      label: 'My Settings',
      description: 'Personal info & passwords',
      icon: Settings,
      path: '/account/settings'
    },
    {
      label: 'My Orders',
      icon: ShoppingBag,
      path: '/account/orders'
    },
    {
      label: 'My Addresses',
      icon: MapPin,
      path: '/account/addresses'
    },
    {
      label: 'My Prescriptions',
      icon: Clipboard,
      path: '/account/prescriptions'
    },
    {
      label: 'My favorites',
      icon: Heart,
      path: '/account/favorites'
    }
  ]

  const handleLogout = () => {
    logout()
    clearCart()
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
    navigate('/')
  }

  return (
    <div className="w-80 flex flex-col pt-8 px-6 min-h-[calc(100vh-200px)]">
      <h1 className="text-2xl font-bold text-mint-1200 mb-8">My Account</h1>

      <div className="flex flex-col gap-2 mb-12">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <Button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={cn(
                'flex items-center gap-4 p-4 rounded-xl transition-all h-16',
                isActive ? 'bg-primary-100 text-primary-600' : 'text-gray-eyewear hover:bg-mint-100'
              )}
            >
              <item.icon
                className={cn('w-5 h-5', isActive ? 'text-primary-600' : 'text-gray-eyewear')}
              />
              <div className="flex flex-col items-start">
                <span
                  className={cn(
                    'font-semibold text-sm',
                    isActive ? 'text-primary-600' : 'text-mint-1200'
                  )}
                >
                  {item.label}
                </span>
                {item.description && (
                  <span className="text-[10px] text-gray-500 font-medium">{item.description}</span>
                )}
              </div>
            </Button>
          )
        })}
      </div>

      <Button
        onClick={handleLogout}
        className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl hover:bg-danger-50 group transition-all mt-auto mb-10 border border-transparent hover:border-danger-100"
      >
        <div className="w-10 h-10 rounded-xl bg-danger-50 flex items-center justify-center border border-danger-100/20 group-hover:bg-white group-hover:border-danger-200 text-danger-500 shadow-sm transition-all">
          <LogOut size={20} />
        </div>
        <span className="text-sm font-bold text-danger-600 group-hover:text-danger-700 transition-colors uppercase tracking-wider">
          Sign Out
        </span>
      </Button>
    </div>
  )
}
