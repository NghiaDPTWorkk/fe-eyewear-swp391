import { useCart } from '@/features/customer/cart/hooks/useCart'
import { Container, Checkbox } from '@/shared/components/ui'
import { EmptyCart, PromoSection } from '@/components/layout/customer/cart'
import { PremiumCartItem } from './PremiumCartItem'
import { PremiumCartSummary } from './PremiumCartSummary'
import { Sparkles, ShoppingBag, ArrowRight } from 'lucide-react'

export const PremiumCartPage = () => {
  const { items, isLoading, fetchError, toggleAllSelection, isUpdating } = useCart()

  const selectedItems = items.filter((item) => item.selected)
  const allSelected = items.length > 0 && items.every((item) => item.selected)
  const selectedCount = selectedItems.length

  const subtotal = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div className="min-h-screen bg-[#F8FFFD] relative overflow-hidden selection:bg-primary-500 selection:text-white pb-20 lg:pb-0">
      {/* Aurora Background Effect */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#E6F9F4] rounded-full blur-[120px] opacity-40 animate-pulse-soft" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#D4EDE5] rounded-full blur-[150px] opacity-30 animate-pulse-soft delay-1000" />
        <div className="absolute top-[30%] right-[10%] w-[30%] h-[40%] bg-primary-400/10 rounded-full blur-[100px] animate-bounce-subtle" />
      </div>

      <main className="py-12 lg:py-20 relative z-10">
        <Container maxWidth="1440px">
          {isLoading ? (
            <div className="flex flex-col justify-center items-center min-h-[60vh] gap-6">
              <div className="relative">
                <div className="w-24 h-24 border-b-4 border-primary-500 rounded-full animate-spin shadow-primary-500/20 shadow-lg" />
                <ShoppingBag className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary-500 w-8 h-8 opacity-50" />
              </div>
              <p className="text-xl font-black text-mint-1200 uppercase tracking-widest animate-pulse italic">
                Preparing your shopping experience...
              </p>
            </div>
          ) : fetchError ? (
            <div className="flex flex-col justify-center items-center min-h-[60vh] text-center p-8 bg-white/50 backdrop-blur-xl rounded-[3rem] border border-white shadow-2xl">
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-6 border border-red-100 animate-bounce">
                <Sparkles size={40} />
              </div>
              <h2 className="text-3xl font-black text-mint-1200 mb-4 font-heading italic uppercase">
                Something went wrong
              </h2>
              <p className="text-mint-800 mb-8 max-w-md font-bold text-center opacity-70">
                {fetchError}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="group px-10 py-5 bg-mint-1200 text-white rounded-[2rem] hover:scale-105 active:scale-95 transition-all duration-300 font-black tracking-[0.2em] shadow-xl hover:shadow-mint-1200/20"
              >
                RE-SYNC CART
              </button>
            </div>
          ) : items.length === 0 && !isUpdating ? (
            <div className="animate-in fade-in zoom-in duration-700">
              <EmptyCart />
            </div>
          ) : (
            <div className="animate-in fade-in duration-1000">
              {/* Header with floating effect */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 relative group/header">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-1bg-primary-500 hidden md:block" />
                    <span className="text-xs font-black text-primary-500 uppercase tracking-[0.4em] italic drop-shadow-sm">
                      Your Exclusive Selection
                    </span>
                  </div>
                  <h1 className="text-6xl md:text-8xl font-black font-heading text-mint-1200 tracking-tighter transition-all duration-700 group-hover/header:tracking-tight group-hover/header:scale-[1.01]">
                    SHOPPING{' '}
                    <span className="bg-gradient-to-r from-primary-500 via-primary-400 to-mint-400 bg-clip-text text-transparent group-hover/header:hue-rotate-30 transition-all duration-1000">
                      BAG
                    </span>
                  </h1>
                </div>

                <div className="flex items-center gap-6 bg-white/80 backdrop-blur-md px-8 py-5 rounded-full border border-white/50 shadow-xl shadow-primary-500/5 hover:border-primary-500/30 transition-all duration-500">
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-black text-mint-400 uppercase tracking-widest text-center">
                      Items Count
                    </span>
                    <span className="text-3xl font-black text-mint-1200 leading-none mt-1">
                      {items.length}
                    </span>
                  </div>
                  <div className="w-[1px] h-10 bg-mint-100" />
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-black text-mint-400 uppercase tracking-widest text-center">
                      Active Value
                    </span>
                    <span className="text-3xl font-black text-primary-500 leading-none mt-1">
                      {selectedCount}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-12 xl:gap-20 items-start relative">
                {/* Main Cart Content */}
                <div className="flex-1 w-full space-y-12">
                  <div className="flex items-center justify-between p-6 bg-white/40 backdrop-blur-sm rounded-[2rem] border border-white transition-all hover:bg-white/80">
                    <div className="flex items-center gap-4">
                      <div className="scale-125">
                        <Checkbox
                          isChecked={allSelected}
                          onCheckedChange={() => toggleAllSelection()}
                          id="select-all"
                        />
                      </div>
                      <label
                        htmlFor="select-all"
                        className="font-black text-sm text-mint-1200 cursor-pointer uppercase tracking-widest flex items-center gap-3"
                      >
                        Selection Master <ArrowRight size={14} className="text-mint-400" />
                        <span className="text-primary-500">All Items ({selectedCount})</span>
                      </label>
                    </div>
                    {selectedCount > 0 && (
                      <button
                        onClick={() => toggleAllSelection()}
                        className="text-[10px] font-black text-red-400 hover:text-red-500 transition-colors uppercase tracking-widest hover:underline decoration-2"
                      >
                        De-select All
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-8">
                    {items.map((item, idx) => (
                      <div
                        key={item._id || idx}
                        className="animate-in fade-in slide-in-from-bottom-8 fill-mode-both"
                        style={{ animationDelay: `${idx * 150}ms` }}
                      >
                        <PremiumCartItem item={item} />
                      </div>
                    ))}
                  </div>

                  <div className="bg-gradient-to-r from-mint-50/50 to-white/50 rounded-[3rem] p-10 border border-white/50 shadow-inner group transition-all duration-500 hover:border-primary-100">
                    <div className="flex items-center gap-3 mb-6">
                      <Sparkles className="text-primary-500 animate-bounce" size={24} />
                      <h3 className="text-2xl font-black text-mint-1200 font-heading tracking-tight italic">
                        Recommended Add-ons
                      </h3>
                    </div>
                    <PromoSection />
                  </div>
                </div>

                {/* Sidebar Summary */}
                <div className="w-full lg:w-[420px] xl:w-[480px] flex-shrink-0 animate-in fade-in slide-in-from-right-12 duration-1000 delay-300">
                  <PremiumCartSummary subtotal={subtotal} />
                </div>
              </div>
            </div>
          )}
        </Container>
      </main>

      {/* Mobile Floating Footer (Only when scrolled) */}
      <div className="fixed bottom-0 left-0 w-full p-4 lg:hidden z-50 animate-in fade-in slide-in-from-bottom-full duration-700">
        <div className="bg-white/90 backdrop-blur-2xl rounded-[2.5rem] p-6 shadow-2xl border border-white/50 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-mint-400 tracking-widest">SUBTOTAL</p>
            <p className="text-2xl font-black text-mint-1200 tracking-tighter">
              {subtotal.toLocaleString('vi-VN')} ₫
            </p>
          </div>
          <button className="bg-primary-500 text-white px-8 py-4 rounded-[1.5rem] font-black tracking-widest text-sm shadow-xl shadow-primary-500/20 active:scale-95 transition-all">
            CHECKOUT
          </button>
        </div>
      </div>
    </div>
  )
}
