// import { Info, Plus } from 'lucide-react'
import { useCart } from '@/features/customer/cart/hooks/useCart'
import { Container, Checkbox } from '@/shared/components/ui'
import { EmptyCart, CartItem, CartSummary, PromoSection } from '@/components/layout/customer/cart'

export const CartPage = () => {
  const { items, isLoading, fetchError, toggleAllSelection, isUpdating } = useCart()

  const selectedItems = items.filter((item) => item.selected)
  const allSelected = items.length > 0 && items.every((item) => item.selected)
  const selectedCount = selectedItems.length

  const subtotal = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div className="min-h-screen bg-mint-200">

      <main className="py-8 lg:py-12">
        <Container maxWidth="1200px">
          {isLoading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
                <p className="text-mint-800">Loading cart...</p>
              </div>
            </div>
          ) : fetchError ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="text-center">
                <p className="text-red-600 mb-4">{fetchError}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : items.length === 0 && !isUpdating ? (
            <EmptyCart />
          ) : (
            <>
              <h1 className="text-4xl font-heading font-bold text-mint-1200 mb-8">Your bag</h1>

              <div className="flex flex-col lg:flex-row gap-6 xl:gap-12 items-start">
                {/* Main Cart Content */}
                <div className="flex-1 w-full lg:max-w-none">
                  <div className="flex items-center gap-3 mb-6">
                    <Checkbox
                      isChecked={allSelected}
                      onCheckedChange={() => toggleAllSelection()}
                      id="select-all"
                    />
                    <label
                      htmlFor="select-all"
                      className="font-medium text-mint-1200 cursor-pointer"
                    >
                      Select All ({selectedCount}/{items.length})
                    </label>
                  </div>

                  <div className="space-y-6">
                    {items.map((item) => (
                      <CartItem
                        key={
                          item._id ??
                          `${item.product_id}-${item.sku ?? ''}-${item.lens?.lensId ?? ''}`
                        }
                        item={item}
                      />
                    ))}
                  </div>

                  <PromoSection />
                </div>

                {/* Sidebar Summary */}
                <div className="w-full lg:w-[380px] xl:w-[420px] flex-shrink-0">
                  <CartSummary subtotal={subtotal} />
                </div>
              </div>
            </>
          )}
        </Container>
      </main>

      </main>
    </div>
  )
}
