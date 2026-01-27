import CustomerHeader from '@/components/layout/customer/header/CustomerHeader'
import { Input } from '@/shared/components/ui'

import {
  Search,
  ShoppingCart,
  User,
  X,
  Truck,
  RotateCcw,
  Glasses,
  Headphones,
  ArrowRight,
  Star,
  Heart
} from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

export const CustomerHomePage = () => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  // Handle click outside to close expanded search
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

  return (
    <div className="min-h-screen bg-mint-200">
      <CustomerHeader
        containerWidth="1200px"
        logo={
          <div className="flex items-center gap-3">
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
              <a
                href="/"
                className="text-mint-1200 hover:text-primary-500 font-semibold transition-all relative group"
              >
                Home
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-500 transform scale-x-100 transition-transform"></span>
              </a>
              <a
                href="/products"
                className="text-gray-eyewear hover:text-primary-500 font-medium transition-all relative group"
              >
                Products
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-500 transform scale-x-0 group-hover:scale-x-100 transition-transform"></span>
              </a>
              <a
                href="/about"
                className="text-gray-eyewear hover:text-primary-500 font-medium transition-all relative group"
              >
                About
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-500 transform scale-x-0 group-hover:scale-x-100 transition-transform"></span>
              </a>
              <a
                href="/contact"
                className="text-gray-eyewear hover:text-primary-500 font-medium transition-all relative group"
              >
                Contact
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-500 transform scale-x-0 group-hover:scale-x-100 transition-transform"></span>
              </a>
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

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-mint-300 via-mint-200 to-primary-100 overflow-hidden">
        <div className="container mx-auto px-4 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 z-10">
              <div className="inline-block px-4 py-2 bg-primary-500 text-white rounded-full text-sm font-medium">
                NEW YEAR SALE - SAVE 30%
              </div>
              <h1 className="text-5xl lg:text-6xl font-heading font-bold text-mint-1200 leading-tight">
                Discover Our New Collection
              </h1>
              <p className="text-lg text-gray-eyewear leading-relaxed">
                Premium eyewear designed for style and comfort. Find your perfect frame from our
                curated collection of modern designs.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="px-8 py-4 bg-primary-500 text-white font-semibold rounded-xl hover:bg-primary-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                  Shop Now
                </button>
                <button className="px-8 py-4 bg-white text-mint-1200 font-semibold rounded-xl hover:bg-mint-300 transition-all duration-300 border-2 border-mint-300">
                  Try Virtual Try-On
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-primary-700 rounded-3xl transform rotate-6 opacity-20"></div>
              <div className="relative bg-white rounded-3xl p-8 shadow-2xl">
                <div className="aspect-square bg-gradient-to-br from-mint-200 to-mint-300 rounded-2xl flex items-center justify-center">
                  <Glasses className="w-48 h-48 text-primary-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Bar */}
      <section className="bg-white border-y border-mint-300">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Truck className="w-6 h-6 text-primary-500" />
              </div>
              <div>
                <h3 className="font-semibold text-mint-1200 text-sm">Free Delivery</h3>
                <p className="text-xs text-gray-eyewear">On orders over $50</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                <RotateCcw className="w-6 h-6 text-primary-500" />
              </div>
              <div>
                <h3 className="font-semibold text-mint-1200 text-sm">30-Day Returns</h3>
                <p className="text-xs text-gray-eyewear">Hassle-free returns</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Glasses className="w-6 h-6 text-primary-500" />
              </div>
              <div>
                <h3 className="font-semibold text-mint-1200 text-sm">Virtual Try-On</h3>
                <p className="text-xs text-gray-eyewear">Try before you buy</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Headphones className="w-6 h-6 text-primary-500" />
              </div>
              <div>
                <h3 className="font-semibold text-mint-1200 text-sm">24/7 Support</h3>
                <p className="text-xs text-gray-eyewear">Expert assistance</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NEW YEAR MUST-HAVES Section */}
      <section className="py-16 bg-mint-200">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-heading font-bold text-mint-1200 mb-4">
              NEW YEAR MUST-HAVES
            </h2>
            <p className="text-gray-eyewear">Trending styles for the new season</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Classic Tortoise', price: '$89.00', color: 'from-amber-200 to-amber-400' },
              { name: 'Modern Black', price: '$95.00', color: 'from-gray-800 to-gray-900' },
              { name: 'Clear Frame', price: '$79.00', color: 'from-gray-100 to-gray-200' },
              { name: 'Retro Sunglasses', price: '$110.00', color: 'from-gray-700 to-gray-900' }
            ].map((product, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group"
              >
                <div
                  className={`aspect-square bg-gradient-to-br ${product.color} rounded-xl mb-4 flex items-center justify-center`}
                >
                  <Glasses className="w-24 h-24 text-white opacity-80" />
                </div>
                <h3 className="font-semibold text-mint-1200 mb-2">{product.name}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-primary-500 font-bold text-lg">{product.price}</span>
                  <button className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ShoppingCart className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Beautify Your Space Banner */}
      <section className="py-16 bg-gradient-to-r from-mint-300 to-primary-200">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-heading font-bold text-mint-1200">
                Beautify Your Space
              </h2>
              <p className="text-gray-eyewear leading-relaxed">
                Discover eyewear that complements your lifestyle. Our collection features premium
                materials, expert craftsmanship, and timeless designs that elevate your everyday
                look.
              </p>
              <button className="px-8 py-4 bg-primary-500 text-white font-semibold rounded-xl hover:bg-primary-600 transition-all duration-300 inline-flex items-center gap-2">
                Learn More
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="aspect-square bg-gradient-to-br from-rose-200 to-rose-300 rounded-xl flex items-center justify-center">
                  <Glasses className="w-20 h-20 text-rose-600" />
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg mt-8">
                <div className="aspect-square bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl flex items-center justify-center">
                  <Glasses className="w-20 h-20 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-heading font-bold text-mint-1200 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-gray-eyewear">Trusted by thousands of happy customers</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah Johnson',
                rating: 5,
                review:
                  'Amazing quality and fast shipping! The frames fit perfectly and look exactly like the photos.'
              },
              {
                name: 'Michael Chen',
                rating: 5,
                review:
                  'Best online eyewear shopping experience. The virtual try-on feature is incredibly helpful.'
              },
              {
                name: 'Emma Davis',
                rating: 5,
                review:
                  'Love my new glasses! Great customer service and the return policy gave me peace of mind.'
              }
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-mint-200 rounded-2xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-primary-500 text-primary-500" />
                  ))}
                </div>
                <p className="text-gray-eyewear mb-4 italic">"{testimonial.review}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">{testimonial.name[0]}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-mint-1200">{testimonial.name}</h4>
                    <p className="text-sm text-gray-eyewear">Verified Customer</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-br from-primary-500 to-primary-700">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h2 className="text-4xl font-heading font-bold text-white">Join Our Mailing List</h2>
            <p className="text-primary-100 text-lg">
              Subscribe to get special offers, free giveaways, and exclusive deals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 rounded-xl border-2 border-white bg-white/10 text-white placeholder-white/70 focus:outline-none focus:bg-white/20 transition-all"
              />
              <button className="px-8 py-4 bg-white text-primary-500 font-semibold rounded-xl hover:bg-mint-200 transition-all duration-300 whitespace-nowrap">
                Subscribe
              </button>
            </div>
            <p className="text-primary-100 text-sm">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-mint-1200 text-mint-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-heading font-bold text-white text-lg mb-4">PRODUCTS</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-primary-500 transition-colors">
                    Eyeglasses
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary-500 transition-colors">
                    Sunglasses
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary-500 transition-colors">
                    Blue Light
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary-500 transition-colors">
                    Kids Glasses
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-heading font-bold text-white text-lg mb-4">SERVICES</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-primary-500 transition-colors">
                    Virtual Try-On
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary-500 transition-colors">
                    Prescription Lenses
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary-500 transition-colors">
                    Frame Finder
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary-500 transition-colors">
                    Insurance
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-heading font-bold text-white text-lg mb-4">SUPPORT</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-primary-500 transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary-500 transition-colors">
                    FAQs
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary-500 transition-colors">
                    Shipping Info
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary-500 transition-colors">
                    Returns
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-heading font-bold text-white text-lg mb-4">COMPANY</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-primary-500 transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary-500 transition-colors">
                    Our Story
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary-500 transition-colors">
                    Sustainability
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary-500 transition-colors">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-mint-900 pt-8 text-center">
            <p className="text-sm">© 2026 Eyewear. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
