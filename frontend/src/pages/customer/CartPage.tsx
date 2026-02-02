import { Info, Plus } from 'lucide-react'
import CustomerHeader from '@/components/layout/customer/header/CustomerHeader'
import { Newsletter, Footer } from '@/components/layout/customer/homepage/components'
import { useCartStore } from '@/store/cart.store'
import { Container, Checkbox } from '@/shared/components/ui'
import { EmptyCart, CartItem, CartSummary, PromoSection } from '@/components/layout/customer/cart'

export const CartPage = () => {
  const { items, toggleAllSelection } = useCartStore()

  const SelectedItems = items.filter((item) => item.Selected)
  const allSelected = items.length > 0 && items.every((item) => item.Selected)
  const SelectedCount = SelectedItems.length

  const subtotal = SelectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div className="min-h-screen bg-mint-200">
      <CustomerHeader />

      <main className="py-8 lg:py-12">
        <Container>
          {items.length === 0 ? (
            <EmptyCart />
          ) : (
            <>
              <h1 className="text-4xl font-heading font-bold text-mint-1200 mb-8">Your bag</h1>

              <div className="flex flex-col lg:flex-row gap-8">
                {/* Main Cart Content */}
                <div className="lg:w-2/3">
                  <div className="flex items-center gap-3 mb-6">
                    <Checkbox
                      isChecked={allSelected}
                      onCheckedChange={() => toggleAllSelection(!allSelected)}
                      id="Select-all"
                    />
                    <label
                      htmlFor="Select-all"
                      className="font-medium text-mint-1200 cursor-pointer"
                    >
                      Select All ({SelectedCount}/{items.length})
                    </label>
                  </div>

                  <div className="bg-mint-300/30 border border-mint-400/50 rounded-lg p-4 mb-6 text-sm text-mint-800 flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    <span>Winter savings: up to 50% off frames & lenses with frame purchase</span>
                  </div>

                  <div className="space-y-6">
                    {items.map((item) => (
                      <CartItem key={item.product_id} item={item} />
                    ))}
                  </div>

                  <PromoSection />
                </div>

                {/* Sidebar Summary */}
                <div className="lg:w-1/3">
                  <CartSummary subtotal={subtotal} />
                </div>
              </div>
            </>
          )}

          {/* FAQs Placeholder */}
          <section className="mt-20">
            <h2 className="text-3xl font-heading font-bold text-mint-1200 mb-8">FAQs</h2>
            <div className="space-y-4 max-w-3xl">
              {[
                {
                  q: 'What is your return policy?',
                  a: 'We offer a 30-day easy return policy for all our frames.'
                },
                {
                  q: 'Do you offer international shipping?',
                  a: 'Yes, we ship to over 50 countries worldwide.'
                },
                {
                  q: 'How can I track my order?',
                  a: 'Once your order ships, you will receive a tracking link via email.'
                }
              ].map((faq, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-6 border border-mint-300/50 group hover:border-primary-300 transition-all cursor-pointer"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-mint-1200">{faq.q}</span>
                    <Plus className="w-5 h-5 text-gray-eyewear group-hover:text-primary-500 transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </Container>
      </main>

      <Newsletter />
      <Footer />
    </div>
  )
}
