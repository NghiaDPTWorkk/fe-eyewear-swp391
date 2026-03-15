import { useNavigate, useLocation } from 'react-router-dom'
import CustomerHeader from '@/components/layout/customer/header/CustomerHeader'
import { Newsletter, Footer } from '@/components/layout/customer/homepage/components'
import { Container, Button } from '@/shared/components/ui'
import { CartSummary, CartItem as CartItemComponent } from '@/components/layout/customer/cart'
import { ArrowLeft } from 'lucide-react'
import type { CartItem } from '@/shared/types/cart.types'
import { useEffect } from 'react'
import { useAuthStore } from '@/store'

export const CheckoutPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated } = useAuthStore()

  const directItem = location.state?.item as CartItem | undefined
  const directItems = location.state?.items as CartItem[] | undefined

  const itemsToBuy = directItems || (directItem ? [directItem] : [])

  useEffect(() => {
    const token = localStorage.getItem('accessToken') || localStorage.getItem('access_token')
    if (!isAuthenticated && !token) {
      navigate('/login', { state: { from: location } })
      return
    }

    if (itemsToBuy.length === 0) {
      navigate('/')
    }
  }, [itemsToBuy, isAuthenticated, navigate, location])

  if (itemsToBuy.length === 0) return null

  const subtotal = itemsToBuy.reduce(
    (sum, item) => sum + (item.price + (item.lens?.price || 0)) * item.quantity,
    0
  )

  return (
    <div className="min-h-screen bg-mint-200">
      <CustomerHeader />

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
            {}
            <div className="lg:w-2/3">
              <div className="bg-white rounded-3xl p-8 border border-mint-300/50 shadow-sm mb-8">
                <h2 className="text-2xl font-bold text-mint-1200 mb-6">Review your order</h2>
                <div className="space-y-6">
                  {itemsToBuy.map((item, index) => (
                    <div
                      key={index}
                      className="border-b border-mint-100 last:border-0 pb-6 last:pb-0"
                    >
                      <CartItemComponent item={item} isReadOnly={true} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {}
            <div className="lg:w-1/3">
              <CartSummary subtotal={subtotal} items={itemsToBuy} />
            </div>
          </div>
        </Container>
      </main>

      <Newsletter />
      <Footer />
    </div>
  )
}
