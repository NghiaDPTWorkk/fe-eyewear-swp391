import Header from '@/shared/components/ui/header/Header'
import { Input } from '@/components'
import { Search, ShoppingCart, User, X, Glasses, Heart } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

export default function CustomerHeader() {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const location = useLocation()

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

  // Helper function to check if link is active
  const isActive = (path: string) => {
    return location.pathname === path
  }

  return (
    <Header
      containerWidth="1200px"
      logo={
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-md">
            <Glasses className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-heading font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
            Eyewear
          </span>
        </div>
      }
      navListContent={
        !isSearchExpanded ? (
          <nav className="flex items-center gap-8 transition-all duration-300">
            <button
              onClick={() => navigate('/')}
              className={`${
                isActive('/') ? 'text-mint-1200 font-semibold' : 'text-gray-eyewear font-medium'
              } hover:text-primary-500 transition-all relative group cursor-pointer`}
            >
              Home
              <span
                className={`absolute bottom-0 left-0 w-full h-0.5 bg-primary-500 transform ${
                  isActive('/') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                } transition-transform`}
              ></span>
            </button>
            <button
              onClick={() => navigate('/products')}
              className={`${
                isActive('/products')
                  ? 'text-mint-1200 font-semibold'
                  : 'text-gray-eyewear font-medium'
              } hover:text-primary-500 transition-all relative group cursor-pointer`}
            >
              Products
              <span
                className={`absolute bottom-0 left-0 w-full h-0.5 bg-primary-500 transform ${
                  isActive('/products') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                } transition-transform`}
              ></span>
            </button>
            <button
              onClick={() => navigate('/about')}
              className={`${
                isActive('/about')
                  ? 'text-mint-1200 font-semibold'
                  : 'text-gray-eyewear font-medium'
              } hover:text-primary-500 transition-all relative group cursor-pointer`}
            >
              About
              <span
                className={`absolute bottom-0 left-0 w-full h-0.5 bg-primary-500 transform ${
                  isActive('/about') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                } transition-transform`}
              ></span>
            </button>
            <button
              onClick={() => navigate('/contact')}
              className={`${
                isActive('/contact')
                  ? 'text-mint-1200 font-semibold'
                  : 'text-gray-eyewear font-medium'
              } hover:text-primary-500 transition-all relative group cursor-pointer`}
            >
              Contact
              <span
                className={`absolute bottom-0 left-0 w-full h-0.5 bg-primary-500 transform ${
                  isActive('/contact') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
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
          <div className="flex items-center gap-4 transition-all duration-300">
            <div onClick={() => setIsSearchExpanded(true)} className="cursor-pointer">
              <Input
                placeholder={'Search glasses, frames...'}
                size="sm"
                leftElement={
                  <span className="pointer-events-none flex items-center justify-center">
                    <Search className="text-gray-eyewear" />
                  </span>
                }
                className="w-full bg-mint-300 border-mint-300 rounded-xl"
                onFocus={() => setIsSearchExpanded(true)}
              />
            </div>
            <button
              className="p-2 hover:bg-mint-200 rounded-full transition-all relative group"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5 text-gray-eyewear group-hover:text-primary-500 transition-colors" />
            </button>
            <button
              className="p-2 hover:bg-mint-200 rounded-full transition-all relative group"
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5 text-gray-eyewear group-hover:text-primary-500 transition-colors" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 text-white text-xs rounded-full flex items-center justify-center font-semibold shadow-md">
                0
              </span>
            </button>
            <button
              className="p-2 hover:bg-mint-200 rounded-full transition-all group"
              aria-label="User Profile"
            >
              <User className="w-5 h-5 text-gray-eyewear group-hover:text-primary-500 transition-colors" />
            </button>
          </div>
        ) : null
      }
    />
  )
}
