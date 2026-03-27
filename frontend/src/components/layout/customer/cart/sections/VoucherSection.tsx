import { useState, useEffect } from 'react'
import { Ticket, X, Check, ChevronRight, Tag, Sparkles } from 'lucide-react'
import { voucherService } from '@/features/customer/services/voucher.service'
import type { Voucher } from '@/shared/types/voucher.types'
import { VNDPrice } from '@/shared/components/ui/vnd-price/VNDPrice'

interface VoucherSectionProps {
  selectedVoucherId: string | null
  onVoucherSelect: (voucher: Voucher | null) => void
  subtotal: number
}

export const VoucherSection = ({
  selectedVoucherId,
  onVoucherSelect,
  subtotal
}: VoucherSectionProps) => {
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
        <h2 className="text-xl font-black text-mint-1200 flex items-center gap-3 font-heading">
          <div className="relative">
            <Tag className="w-5 h-5 text-primary-500 transform -rotate-12 group-hover:rotate-0 transition-transform duration-500" />
            <Sparkles className="w-2.5 h-2.5 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
          </div>
          Vouchers
        </h2>
        {vouchers.length > 0 && (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-[10px] font-black text-primary-600 hover:text-primary-700 transition-all uppercase tracking-widest bg-primary-50 px-3 py-1.5 rounded-full border border-primary-100/50 hover:bg-primary-100"
          >
            {isOpen ? 'Close' : selectedVoucher ? 'Switch' : 'View all'}
          </button>
        )}
      </div>

      {/* Selected Voucher UI */}
      {selectedVoucher && !isOpen && (
        <div className="relative group overflow-hidden bg-gradient-to-br from-primary-500 to-primary-600 border border-primary-400 rounded-2xl p-4 flex items-center justify-between shadow-lg shadow-primary-500/20 transform hover:scale-[1.02] transition-all duration-500">
          {/* Decorative notches */}
          <div className="absolute -left-2.5 top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full border border-primary-500 z-10" />
          <div className="absolute -right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full border border-primary-500 z-10" />
          <div className="absolute left-[3rem] top-0 h-full w-[1px] border-l-2 border-dashed border-white/20 z-0" />

          <div className="flex items-center gap-4 pl-3 z-10">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center shrink-0 border border-white/30 shadow-inner group-hover:rotate-6 transition-transform">
              <Ticket className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-base text-white tracking-wider uppercase">
                  {selectedVoucher.code}
                </span>
                <span className="px-1.5 py-0.5 bg-white text-primary-600 text-[8px] font-black rounded-full uppercase shadow-sm">
                  Applied
                </span>
              </div>
              <p className="text-[10px] text-white/80 font-bold mt-0.5">{selectedVoucher.name}</p>
            </div>
          </div>

          <button
            onClick={() => onVoucherSelect(null)}
            className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/10 hover:bg-red-500/20 text-white transition-all mr-2 hover:rotate-90"
          >
            <X className="w-4 h-4" strokeWidth={3} />
          </button>
        </div>
      )}

      {/* Prompt UI */}
      {!selectedVoucher && !isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full flex items-center justify-between p-4 bg-gradient-to-br from-white to-mint-50/50 border-2 border-dashed border-mint-200 rounded-2xl hover:border-primary-400 hover:shadow-md transition-all group overflow-hidden relative"
        >
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-mint-50 flex items-center justify-center group-hover:bg-primary-100 group-hover:scale-110 transition-all duration-500 shadow-sm border border-mint-200/50">
              <Ticket className="w-5 h-5 text-mint-500 group-hover:text-primary-500 transform group-hover:-rotate-12 transition-all" />
            </div>
            <div className="text-left">
              <span className="block font-black text-xs text-mint-1200 uppercase tracking-widest">
                Select Promotion
              </span>
              <span className="text-[9px] text-mint-600 font-bold">
                Have a code? Check eligibility here
              </span>
            </div>
          </div>
          <ChevronRight
            className="w-5 h-5 text-mint-300 group-hover:text-primary-500 group-hover:translate-x-1 transition-all"
            strokeWidth={3}
          />
        </button>
      )}

      {/* Expanded List UI */}
      {isOpen && (
        <div className="space-y-3 animate-in fade-in slide-in-from-top-4 duration-500">
          {isLoading ? (
            <div className="flex flex-col items-center py-8 bg-mint-50/30 rounded-2xl border border-mint-100 italic text-mint-600">
              <div className="relative mb-2">
                <div className="w-6 h-6 border-3 border-primary-500/20 border-t-primary-500 rounded-full animate-spin" />
              </div>
              Finding deals...
            </div>
          ) : vouchers.length === 0 ? (
            <div className="text-center py-8 bg-mint-50/30 rounded-2xl border border-mint-100 border-dashed">
              <p className="text-mint-800 font-black text-[10px] uppercase tracking-widest">
                No Vouchers Found
              </p>
            </div>
          ) : (
            <div className="max-h-[300px] overflow-y-auto pr-2 space-y-3 scroller-hide">
              {vouchers.map((voucher) => {
                const eligible = isVoucherEligible(voucher)
                const isSelected = selectedVoucherId === voucher._id

                return (
                  <div
                    key={voucher._id}
                    onClick={() => eligible && handleSelect(voucher)}
                    className={`relative group rounded-2xl border-2 transition-all duration-500 overflow-hidden ${
                      isSelected
                        ? 'border-primary-500 bg-primary-50'
                        : eligible
                          ? 'border-mint-100 bg-white hover:border-primary-400 hover:shadow-lg cursor-pointer'
                          : 'border-mint-50 bg-mint-50/50 grayscale opacity-60 cursor-not-allowed'
                    }`}
                  >
                    {/* Ticket notches */}
                    <div className="absolute -left-2.5 top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full border border-inherit z-10" />
                    <div className="absolute -right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full border border-inherit z-10" />
                    <div className="absolute right-[4rem] top-0 h-full w-[1px] border-l border-dashed border-mint-100 z-0" />

                    <div className="p-4 pr-[5rem] relative z-10">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span
                          className={`text-sm font-black tracking-wider uppercase font-heading ${
                            isSelected ? 'text-primary-600' : 'text-mint-1200'
                          }`}
                        >
                          {voucher.code}
                        </span>
                        {isSelected && (
                          <div className="bg-primary-500 p-0.5 rounded-full shadow-md shadow-primary-500/30">
                            <Check className="w-2.5 h-2.5 text-white" strokeWidth={4} />
                          </div>
                        )}
                      </div>

                      <div className="space-y-0.5">
                        <p className="text-[10px] font-black text-mint-1000 uppercase tracking-wide">
                          {voucher.name}
                        </p>
                        <p className="text-[9px] text-mint-500 font-bold flex items-center gap-1.5 uppercase tracking-widest">
                          {eligible ? (
                            `Exp: ${new Date(voucher.endedDate).toLocaleDateString('vi-VN')}`
                          ) : (
                            <>
                              Order at least <VNDPrice amount={voucher.minOrderValue} />
                            </>
                          )}
                        </p>
                      </div>

                      {/* Right-side Discount Area */}
                      <div
                        className={`absolute right-0 top-0 h-full w-[4rem] flex items-center justify-center p-2 font-black text-center ${
                          isSelected ? 'bg-primary-500 text-white' : 'bg-mint-50 text-mint-1200'
                        }`}
                      >
                        <div className="transform -rotate-90 whitespace-nowrap text-[10px] tracking-widest font-black uppercase">
                          {voucher.typeDiscount === 'PERCENTAGE'
                            ? `SAVE ${voucher.value}%`
                            : `-${voucher.value / 1000}K`}
                        </div>
                      </div>
                    </div>
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
