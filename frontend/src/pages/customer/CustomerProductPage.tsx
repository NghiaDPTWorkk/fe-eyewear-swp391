import CustomerHeader from '@/components/layout/customer/header/CustomerHeader'
import { useGetProductWithPagination } from '@/shared/hooks/products/useGetProductWithPagination'
import { Button, Input } from '@/components'

import { ArrowLeft, ArrowRight, Glasses, Heart, Search, ShoppingCart, User, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'

export const CustomerProductPage = () => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  const [page, setPage] = useState(1)
  const limit = 12

  const { products, loading, error, totalPages, currentPage } = useGetProductWithPagination(
    page,
    limit
  )

  const canPrev = useMemo(() => currentPage > 1, [currentPage])
  const canNext = useMemo(() => currentPage < totalPages, [currentPage, totalPages])

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
                className="text-gray-eyewear hover:text-primary-500 font-medium transition-all relative group"
              >
                Home
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-500 transform scale-x-0 group-hover:scale-x-100 transition-transform"></span>
              </a>
              <a
                href="/products"
                className="text-mint-1200 hover:text-primary-500 font-semibold transition-all relative group"
              >
                Products
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-500 transform scale-x-100 transition-transform"></span>
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
                placeholder={'Search products...'}
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
                  placeholder={'Search products...'}
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

      <section className="bg-white border-b border-mint-300">
        <div className="container mx-auto px-4 py-10">
          <div className="flex items-start justify-between gap-6 flex-col lg:flex-row">
            <div>
              <h1 className="text-4xl font-heading font-bold text-mint-1200">Products</h1>
              <p className="text-gray-eyewear mt-2">Browse our collection with pagination.</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                className="px-4 py-2 rounded-xl border-2 border-mint-300 bg-mint-200 text-mint-1200 font-semibold hover:bg-mint-300 transition-all inline-flex items-center gap-2"
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 bg-mint-200">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center text-gray-eyewear py-10">Loading products...</div>
          ) : error ? (
            <div className="text-center text-red-600 py-10">Failed to load products.</div>
          ) : products.length === 0 ? (
            <div className="text-center text-gray-eyewear py-10">No products found.</div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group"
                >
                  <div className="aspect-square bg-gradient-to-br from-mint-200 to-mint-300 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
                    {p.defaultVariantImage ? (
                      <img
                        src={p.defaultVariantImage}
                        alt={p.nameBase}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Glasses className="w-24 h-24 text-primary-500 opacity-80" />
                    )}
                  </div>

                  <h3 className="font-semibold text-mint-1200 mb-1 line-clamp-2">{p.nameBase}</h3>
                  <p className="text-xs text-gray-eyewear mb-3">{p.brand ?? 'No brand'}</p>

                  <div className="flex items-center justify-between">
                    <span className="text-primary-500 font-bold text-lg">
                      {typeof p.defaultVariantFinalPrice === 'number'
                        ? p.defaultVariantFinalPrice.toLocaleString('vi-VN')
                        : typeof p.defaultVariantPrice === 'number'
                          ? p.defaultVariantPrice.toLocaleString('vi-VN')
                          : '—'}
                    </span>
                    <Button className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <ShoppingCart className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-center gap-4 mt-10">
            <button
              className="px-4 py-2 rounded-xl border-2 border-mint-300 bg-white text-mint-1200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-mint-200 transition-all"
              disabled={!canPrev || loading}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            >
              Prev
            </button>

            <div className="text-sm text-gray-eyewear">
              Page <span className="font-semibold text-mint-1200">{currentPage}</span> /{' '}
              <span className="font-semibold text-mint-1200">{totalPages || 1}</span>
            </div>

            <button
              className="px-4 py-2 rounded-xl border-2 border-mint-300 bg-white text-mint-1200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-mint-200 transition-all inline-flex items-center gap-2"
              disabled={!canNext || loading}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
