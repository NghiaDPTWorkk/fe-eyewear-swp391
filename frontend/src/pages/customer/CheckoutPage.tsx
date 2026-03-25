import { useNavigate, useLocation } from 'react-router-dom'
import { Container, Button } from '@/shared/components/ui'
import { CartSummary, CartItem as CartItemComponent } from '@/components/layout/customer/cart'
import { ArrowLeft } from 'lucide-react'
import type { CartItem } from '@/shared/types/cart.types'
import { useEffect, useMemo, useState } from 'react'
import { useAuthStore } from '@/store'

export const CheckoutPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated } = useAuthStore()

  // Expecting a single item or array of items in location state
  const directItem = location.state?.item as CartItem | undefined
  const directItems = location.state?.items as CartItem[] | undefined
  const isDirectCheckout = !!directItem || !!directItems

  const initialItemsToBuy = useMemo(
    () => directItems || (directItem ? [directItem] : []),
    [directItems, directItem]
  )
  const [itemsToBuy, setItemsToBuy] = useState<CartItem[]>(initialItemsToBuy)

  useEffect(() => {
    setItemsToBuy(initialItemsToBuy)
  }, [initialItemsToBuy])

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('accessToken') || localStorage.getItem('access_token')
    if (!isAuthenticated && !token) {
      navigate('/login', { state: { from: location } })
      return
    }

    // If no items to buy, redirect to home or cart
    if (itemsToBuy.length === 0) {
      navigate('/')
    }
  }, [itemsToBuy, isAuthenticated, navigate, location])

  if (itemsToBuy.length === 0) return null

  const handleDirectItemQuantityChange = (targetItem: CartItem, quantity: number) => {
    setItemsToBuy((prev) =>
      prev.map((item) => {
        const sameById =
          (item._id && targetItem._id && item._id === targetItem._id) ||
          (item.product_id === targetItem.product_id && item.sku === targetItem.sku)

        return sameById ? { ...item, quantity } : item
      })
    )
  }

  const subtotal = itemsToBuy.reduce(
    (sum, item) => sum + (item.price + (item.lens?.price || 0)) * item.quantity,
    0
  )

  return (
    <div className="min-h-screen bg-mint-200">
      <main className="py-8 lg:py-12">
        <Container>
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="text-mint-800 hover:text-primary-600 transition-colors"
              leftIcon={<ArrowLeft className="w-5 h-5" />}
            >
              Back
            </Button>
            <h1 className="text-4xl font-heading font-bold text-mint-1200">Checkout</h1>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <div className="lg:w-2/3">
              <div className="bg-white rounded-3xl p-8 border border-mint-300/50 shadow-sm mb-8">
                <h2 className="text-2xl font-bold text-mint-1200 mb-6">Review your order</h2>
                <div className="space-y-6">
                  {itemsToBuy.map((item, index) => (
                    <div
                      key={index}
                      className="border-b border-mint-100 last:border-0 pb-6 last:pb-0"
                    >
                      <CartItemComponent
                        item={item}
                        isReadOnly={true}
                        allowQuantityEditInReadOnly={isDirectCheckout}
                        onReadOnlyQuantityChange={handleDirectItemQuantityChange}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar Summary */}
            <div className="lg:w-1/3">
              <CartSummary subtotal={subtotal} items={itemsToBuy} />
            </div>
          </div>
        </Container>
      </main>
    </div>
  )
}
