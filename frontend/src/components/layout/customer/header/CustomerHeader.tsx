import Header from '@/shared/components/ui/header/Header'
import { Input } from '@/components'
import { Search, ShoppingCart, User, X, Heart } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useCartStore, useAuthStore, useWishlistStore } from '@/store'

import { ProfileDropdown as ProjectProfileDropdown } from './ProfileDropdown'
import LogoEyewearIcon from '@/shared/components/ui-core/logoeyewear/LogoEyewearIcon'

export default function CustomerHeader({ isTranslucent = false }: { isTranslucent?: boolean }) {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const searchRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const location = useLocation()
  const items = useCartStore((state) => state.items)
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const fetchCart = useCartStore((state) => state.fetchCart)
  const fetchWishlist = useWishlistStore((state) => state.fetchWishlist)
  const [isBagAnimating, setIsBagAnimating] = useState(false)

  // đợi Component mount xong
  const [hasHydrated, setHasHydrated] = useState(false)

  useEffect(() => {
    // đã mount, chúng ta coi như đã nạp xong (vì localStorage là đồng bộ)
    setHasHydrated(true)

    // Fetch cart and wishlist on mount if authenticated to persist badge and status across pages
    if (isAuthenticated) {
      fetchCart()
      fetchWishlist()
    }
  }, [isAuthenticated, fetchCart, fetchWishlist])

  // Animation effect for cart badge
  useEffect(() => {
    if (totalItems === 0) return

    setIsBagAnimating(true)
    const timer = setTimeout(() => setIsBagAnimating(false), 400)
    return () => clearTimeout(timer)
  }, [totalItems])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchExpanded(false)
      }
    }

    if (isSearchExpanded) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isSearchExpanded])

  const handleSearchSubmit = () => {
    const trimmed = searchValue.trim()
    if (trimmed) {
      navigate(`/eyeglasses?search=${encodeURIComponent(trimmed)}`)
      setIsSearchExpanded(false)
      setSearchValue('')
    }
  }

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearchSubmit()
    }
  }

  // Helper function to check if link is active
  const isActive = (path: string) => {
    return location.pathname === path
  }

  return (
    <Header
      containerWidth="1200px"
      logo={
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <LogoEyewearIcon
            className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl shadow-md"
            iconClassName="w-6 h-6 sm:w-7 sm:h-7 text-white"
          />
          <span className="text-xl sm:text-2xl font-heading font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent hidden sm:block">
            Eyewear
          </span>
        </div>
      }
      navListContent={
        !isSearchExpanded ? (
          <nav className="flex items-center gap-4 sm:gap-8 transition-all duration-300">
            <button
              onClick={() => navigate('/')}
              className={`${
                isActive('/') ? 'text-mint-1200 font-semibold' : 'text-gray-eyewear font-medium'
              } hover:text-primary-500 transition-all relative group cursor-pointer text-[13px] sm:text-base`}
            >
              Home
              <span
                className={`absolute bottom-0 left-0 w-full h-0.5 bg-primary-500 transform ${
                  isActive('/') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                } transition-transform`}
              ></span>
            </button>

            <button
              onClick={() => navigate('/eyeglasses')}
              className={`${
                isActive('/eyeglasses') || isActive('/products')
                  ? 'text-mint-1200 font-semibold'
                  : 'text-gray-eyewear font-medium'
              } hover:text-primary-500 transition-all relative group cursor-pointer text-[13px] sm:text-base`}
            >
              <span className="hidden sm:inline">Eyeglasses</span>
              <span className="sm:hidden">Frames</span>
              <span
                className={`absolute bottom-0 left-0 w-full h-0.5 bg-primary-500 transform ${
                  isActive('/eyeglasses') || isActive('/products')
                    ? 'scale-x-100'
                    : 'scale-x-0 group-hover:scale-x-100'
                } transition-transform`}
              ></span>
            </button>
            <button
              onClick={() => navigate('/sunglasses')}
              className={`${
                isActive('/sunglasses')
                  ? 'text-mint-1200 font-semibold'
                  : 'text-gray-eyewear font-medium'
              } hover:text-primary-500 transition-all relative group cursor-pointer text-[13px] sm:text-base`}
            >
              Sunglasses
              <span
                className={`absolute bottom-0 left-0 w-full h-0.5 bg-primary-500 transform ${
                  isActive('/sunglasses') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                } transition-transform`}
              ></span>
            </button>
            <button
              onClick={() => navigate('/lenses')}
              className={`${
                isActive('/lenses')
                  ? 'text-mint-1200 font-semibold'
                  : 'text-gray-eyewear font-medium'
              } hover:text-primary-500 transition-all relative group cursor-pointer text-[13px] sm:text-base hidden xs:block`}
            >
              Lenses
              <span
                className={`absolute bottom-0 left-0 w-full h-0.5 bg-primary-500 transform ${
                  isActive('/lenses') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                } transition-transform`}
              ></span>
            </button>
          </nav>
        ) : (
          <div ref={searchRef} className="w-full transition-all duration-300">
            <Input
              placeholder={'Search glasses, frames...'}
              size="sm"
              autoFocus
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              leftElement={
                <span className="pointer-events-none flex items-center justify-center">
                  <Search className="text-gray-eyewear" />
                </span>
              }
              rightElement={
                <button
                  onClick={() => setIsSearchExpanded(false)}
                  className="flex items-center justify-center hover:bg-mint-500 rounded-full p-1 transition-colors"
                  aria-label="Close search"
                >
                  <X className="w-4 h-4 text-gray-eyewear" />
                </button>
              }
              className="w-full bg-mint-300 border-mint-300 rounded-xl"
              onBlur={(e) => {
                if (!searchRef.current?.contains(e.relatedTarget as Node)) {
                  setIsSearchExpanded(false)
                }
              }}
            />
          </div>
        )
      }
      navListIcon={
        !isSearchExpanded ? (
          <div className="flex items-center gap-2 sm:gap-4 transition-all duration-300">
            <button
              className="p-1.5 sm:p-2 hover:bg-mint-200 rounded-full transition-all relative group cursor-pointer shrink-0"
              aria-label="Wishlist"
              onClick={() => navigate('/account/favorites')}
            >
              <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-gray-eyewear group-hover:text-primary-500 transition-colors" />
            </button>
            <button
              className="p-1.5 sm:p-2 hover:bg-mint-200 rounded-full transition-all relative group cursor-pointer shrink-0"
              aria-label="Shopping Cart"
              onClick={() => navigate('/cart')}
            >
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-gray-eyewear group-hover:text-primary-500 transition-colors" />
              {totalItems > 0 && (
                <span
                  className={`absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-primary-500 text-white text-[10px] sm:text-xs rounded-full flex items-center justify-center font-semibold shadow-md ${
                    isBagAnimating ? 'animate-bump' : ''
                  }`}
                >
                  {totalItems}
                </span>
              )}
            </button>
            {!hasHydrated ? (
              <div className="w-8 h-8 sm:w-9 sm:h-9" />
            ) : isAuthenticated ? (
              <div className="shrink-0 scale-90 sm:scale-100 origin-right">
                <ProjectProfileDropdown />
              </div>
            ) : (
              <button
                className="p-1.5 sm:p-2 hover:bg-mint-200 rounded-full transition-all group flex items-center gap-2 cursor-pointer shrink-0"
                aria-label="Login"
                onClick={() => navigate('/login', { state: { from: location } })}
              >
                <User className="w-4 h-4 sm:w-5 sm:h-5 text-gray-eyewear group-hover:text-primary-500 transition-colors" />
                <span className="text-sm font-medium text-gray-eyewear hidden md:block">Login</span>
              </button>
            )}
          </div>
        ) : null
      }
      isTranslucent={isTranslucent}
    />
  )
}
