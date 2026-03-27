import { useState, useEffect } from 'react'
import { Ticket, X, Check, ChevronRight, Tag, Sparkles } from 'lucide-react'
import { voucherService } from '@/features/customer/services/voucher.service'
import type { Voucher } from '@/shared/types/voucher.types'
import { VNDPrice } from '@/shared/components/ui/vnd-price/VNDPrice'

interface PremiumVoucherSectionProps {
  selectedVoucherId: string | null
  onVoucherSelect: (voucher: Voucher | null) => void
  subtotal: number
}

export const PremiumVoucherSection = ({
  selectedVoucherId,
  onVoucherSelect,
  subtotal
}: PremiumVoucherSectionProps) => {
  const [vouchers, setVouchers] = useState<Voucher[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const fetchVouchers = async () => {
      setIsLoading(true)
      try {
        const response = await voucherService.getMyVouchers()
        if (response.success) {
          setVouchers(response.data.vouchers)
        }
      } catch (error) {
        console.error('Error fetching vouchers:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchVouchers()
  }, [])

  const selectedVoucher = vouchers.find((v) => v._id === selectedVoucherId)
  const isVoucherEligible = (voucher: Voucher) => subtotal >= voucher.minOrderValue

  const handleSelect = (voucher: Voucher) => {
    onVoucherSelect(voucher)
    setIsOpen(false)
  }

  return (
    <div className="mb-8 border-t border-mint-100 pt-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl font-black text-mint-1200 flex items-center gap-3 font-heading">
          <div className="relative">
            <Tag className="w-6 h-6 text-primary-500 transform -rotate-12 group-hover:rotate-0 transition-transform duration-500" />
            <Sparkles className="w-3 h-3 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
          </div>
          Vouchers
        </h2>
        {vouchers.length > 0 && (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-xs font-black text-primary-600 hover:text-primary-700 transition-all uppercase tracking-widest bg-primary-50 px-3 py-1.5 rounded-full border border-primary-100/50 hover:bg-primary-100"
          >
            {isOpen ? 'Close' : selectedVoucher ? 'Switch' : 'View all'}
          </button>
        )}
      </div>

      {/* Selected Voucher UI */}
      {selectedVoucher && !isOpen && (
        <div className="relative group overflow-hidden bg-gradient-to-br from-primary-500 to-primary-600 border border-primary-400 rounded-3xl p-5 flex items-center justify-between shadow-xl shadow-primary-500/20 transform hover:scale-[1.02] transition-all duration-500">
          {/* Decorative notches */}
          <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full border border-primary-500 z-10" />
          <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full border border-primary-500 z-10" />
          <div className="absolute left-[3.5rem] top-0 h-full w-[1px] border-l-2 border-dashed border-white/20 z-0" />

          <div className="flex items-center gap-6 pl-4 z-10">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shrink-0 border border-white/30 shadow-inner group-hover:rotate-6 transition-transform">
              <Ticket className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-xl text-white tracking-widest uppercase">
                  {selectedVoucher.code}
                </span>
                <span className="px-2 py-0.5 bg-white text-primary-600 text-[9px] font-black rounded-full uppercase shadow-sm">
                  Applied
                </span>
              </div>
              <p className="text-xs text-white/80 font-bold mt-0.5">{selectedVoucher.name}</p>
            </div>
          </div>

          <button
            onClick={() => onVoucherSelect(null)}
            className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white/10 hover:bg-red-500/20 text-white transition-all mr-2 hover:rotate-90"
          >
            <X className="w-5 h-5" strokeWidth={3} />
          </button>
        </div>
      )}

      {/* Prompt UI */}
      {!selectedVoucher && !isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full flex items-center justify-between p-5 bg-gradient-to-br from-white to-mint-50/50 border-2 border-dashed border-mint-200 rounded-3xl hover:border-primary-400 hover:shadow-lg transition-all group overflow-hidden relative"
        >
          <div className="absolute top-0 left-0 w-full h-full bg-primary-500/0 group-hover:bg-primary-500/[0.02] transition-colors" />
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-mint-100 flex items-center justify-center group-hover:bg-primary-100 group-hover:scale-110 transition-all duration-500 shadow-sm border border-mint-200/50">
              <Ticket className="w-6 h-6 text-mint-500 group-hover:text-primary-500 transform group-hover:-rotate-12 transition-all" />
            </div>
            <div className="text-left">
              <span className="block font-black text-sm text-mint-1200 uppercase tracking-widest">
                Select Promotion
              </span>
              <span className="text-xs text-mint-600 font-bold">
                Have a code? Check eligibility here
              </span>
            </div>
          </div>
          <ChevronRight
            className="w-6 h-6 text-mint-300 group-hover:text-primary-500 group-hover:translate-x-1 transition-all"
            strokeWidth={3}
          />
        </button>
      )}

      {/* Expanded List UI */}
      {isOpen && (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
          {isLoading ? (
            <div className="flex flex-col items-center py-10 bg-mint-50/30 rounded-3xl border border-mint-100 italic text-mint-600">
              <div className="relative mb-3">
                <div className="w-8 h-8 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin" />
                <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-primary-400 animate-pulse" />
              </div>
              Seeking best deals for you...
            </div>
          ) : vouchers.length === 0 ? (
            <div className="text-center py-10 bg-mint-50/30 rounded-3xl border border-mint-100 border-dashed">
              <p className="text-mint-800 font-black text-sm uppercase tracking-widest">
                No Vouchers Found
              </p>
              <p className="text-xs text-mint-500 mt-1 font-bold">
                Try checking back later for more deals!
              </p>
            </div>
          ) : (
            <div className="max-h-[400px] overflow-y-auto pr-2 space-y-4 scroller-hide">
              {vouchers.map((voucher) => {
                const eligible = isVoucherEligible(voucher)
                const isSelected = selectedVoucherId === voucher._id

                return (
                  <div
                    key={voucher._id}
                    onClick={() => eligible && handleSelect(voucher)}
                    className={`relative group rounded-[2rem] border-2 transition-all duration-500 overflow-hidden ${
                      isSelected
                        ? 'border-primary-500 bg-primary-50 shadow-lg shadow-primary-500/10'
                        : eligible
                          ? 'border-mint-100 bg-white hover:border-primary-400 hover:shadow-xl hover:-translate-y-0.5 cursor-pointer'
                          : 'border-mint-50 bg-mint-50/50 grayscale opacity-60 cursor-not-allowed'
                    }`}
                  >
                    {/* Ticket notches with dash divider */}
                    <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-neutral-50 rounded-full border border-inherit z-10 p-4" />
                    <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-neutral-50 rounded-full border border-inherit z-10" />
                    <div className="absolute right-[4.5rem] top-0 h-full w-[1px] border-l border-dashed border-mint-200 z-0" />

                    <div className="p-6 pr-[5.5rem] relative z-10">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`text-lg font-black tracking-[0.15em] uppercase font-heading ${
                              isSelected ? 'text-primary-600' : 'text-mint-1200'
                            }`}
                          >
                            {voucher.code}
                          </span>
                          {isSelected && (
                            <div className="bg-primary-500 p-1 rounded-full shadow-lg shadow-primary-500/30">
                              <Check className="w-3 h-3 text-white" strokeWidth={4} />
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <p className="text-xs font-black text-mint-1000 uppercase tracking-wide">
                          {voucher.name}
                        </p>
                        <p className="text-[10px] text-mint-500 font-bold flex items-center gap-1.5 uppercase tracking-widest">
                          {eligible ? (
                            <>
                              <span className="w-1 h-1 rounded-full bg-primary-500" />
                              Exp:{' '}
                              {new Date(voucher.endedDate).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </>
                          ) : (
                            <>
                              <span className="w-1 h-1 rounded-full bg-red-400" />
                              Min Order: <VNDPrice amount={voucher.minOrderValue} />
                            </>
                          )}
                        </p>
                      </div>

                      {/* Right-side Discount Area */}
                      <div
                        className={`absolute right-0 top-0 h-full w-[4.5rem] flex items-center justify-center p-2 font-black text-center ${
                          isSelected ? 'bg-primary-500 text-white' : 'bg-mint-50 text-mint-1200'
                        }`}
                      >
                        <div className="transform -rotate-90 whitespace-nowrap text-xs tracking-widest font-black flex items-center gap-1 uppercase">
                          {voucher.typeDiscount === 'PERCENTAGE' ? (
                            <>
                              SAVE {voucher.value}% <Sparkles size={10} />
                            </>
                          ) : (
                            <VNDPrice amount={voucher.value} className="text-[10px]" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Hover Glow */}
                    <div className="absolute inset-0 bg-primary-500/0 group-hover:bg-primary-500/[0.03] transition-colors pointer-events-none" />
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
