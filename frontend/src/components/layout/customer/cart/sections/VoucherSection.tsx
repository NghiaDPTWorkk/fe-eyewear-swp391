import { useState, useEffect } from 'react'
import { Ticket, X, Check, ChevronRight, Tag } from 'lucide-react'
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

  const isVoucherEligible = (voucher: Voucher) => {
    return subtotal >= voucher.minOrderValue
  }

  const handleSelect = (voucher: Voucher) => {
    onVoucherSelect(voucher)
    setIsOpen(false)
  }

  return (
    <div className="mb-6 border-t border-mint-100 pt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-mint-1200 flex items-center gap-2">
          <Tag className="w-5 h-5 text-primary-500" />
          Vouchers
        </h2>
        {vouchers.length > 0 && (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-sm font-bold text-primary-600 hover:text-primary-700 transition-colors"
          >
            {isOpen ? 'Close' : selectedVoucher ? 'Change' : 'View all'}
          </button>
        )}
      </div>

      {}
      {selectedVoucher && !isOpen && (
        <div className="relative overflow-hidden bg-white border-2 border-primary-500 rounded-2xl p-4 flex items-center justify-between group">
          {}
          <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-mint-50 rounded-full border-r-2 border-primary-500 z-10" />
          <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-mint-50 rounded-full border-l-2 border-primary-500 z-10" />

          <div className="flex items-center gap-4 pl-2">
            <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center shrink-0">
              <Ticket className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-mint-1200 tracking-tight">
                  {selectedVoucher.code}
                </span>
                <span className="px-2 py-0.5 bg-primary-100 text-primary-700 text-[10px] font-black rounded uppercase">
                  Applied
                </span>
              </div>
              <p className="text-xs text-mint-800 line-clamp-1">{selectedVoucher.name}</p>
            </div>
          </div>

          <button
            onClick={() => onVoucherSelect(null)}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-50 text-gray-eyewear hover:text-red-500 transition-all mr-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {}
      {!selectedVoucher && !isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full flex items-center justify-between p-4 bg-white border-2 border-dashed border-mint-300 rounded-2xl hover:border-primary-400 hover:bg-primary-50/30 transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-mint-50 flex items-center justify-center group-hover:bg-primary-100 transition-colors">
              <Ticket className="w-5 h-5 text-mint-400 group-hover:text-primary-500" />
            </div>
            <span className="font-bold text-sm text-mint-800">Choose a promo code</span>
          </div>
          <ChevronRight className="w-5 h-5 text-mint-300 group-hover:text-primary-500" />
        </button>
      )}

      {}
      {isOpen && (
        <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
          {isLoading ? (
            <div className="flex flex-col items-center py-8 bg-mint-50/50 rounded-2xl border-2 border-mint-100 italic text-mint-600">
              <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mb-2" />
              Searching for deals...
            </div>
          ) : vouchers.length === 0 ? (
            <div className="text-center py-8 bg-mint-50/50 rounded-2xl border-2 border-mint-100 text-mint-800 font-medium">
              You don't have any vouchers available.
            </div>
          ) : (
            <div className="max-h-[320px] overflow-y-auto pr-2 space-y-3 scrollbar-thin scrollbar-thumb-mint-200">
              {vouchers.map((voucher) => {
                const eligible = isVoucherEligible(voucher)
                const isSelected = selectedVoucherId === voucher._id

                return (
                  <div
                    key={voucher._id}
                    onClick={() => eligible && handleSelect(voucher)}
                    className={`relative overflow-hidden rounded-2xl border-2 transition-all group ${
                      isSelected
                        ? 'border-primary-500 bg-primary-50/50'
                        : eligible
                          ? 'border-mint-200 bg-white hover:border-primary-400 cursor-pointer lg:hover:shadow-md'
                          : 'border-mint-100 bg-mint-50/30 opacity-70 cursor-not-allowed'
                    }`}
                  >
                    {}
                    <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-mint-50 rounded-full border-r-2 border-inherit" />
                    <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-mint-50 rounded-full border-l-2 border-inherit" />

                    <div className="p-4 pl-5 pr-5">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-black tracking-tight text-lg ${
                              isSelected ? 'text-primary-600' : 'text-mint-1200'
                            }`}
                          >
                            {voucher.code}
                          </span>
                          {isSelected && <Check className="w-5 h-5 text-primary-500" />}
                        </div>
                        <div
                          className={`text-sm font-black p-1 px-2 rounded-lg ${
                            isSelected ? 'bg-primary-500 text-white' : 'bg-mint-100 text-mint-800'
                          }`}
                        >
                          {voucher.typeDiscount === 'PERCENTAGE' ? (
                            `-${voucher.value}%`
                          ) : (
                            <VNDPrice amount={voucher.value} />
                          )}
                        </div>
                      </div>

                      <div className="mt-1">
                        <p className="text-xs font-bold text-mint-900 line-clamp-1">
                          {voucher.name}
                        </p>
                        <p className="text-[10px] text-mint-600 mt-1">
                          {eligible ? (
                            `Valid until ${new Date(voucher.endedDate).toLocaleDateString('vi-VN')}`
                          ) : (
                            <>
                              Order at least <VNDPrice amount={voucher.minOrderValue} /> to use
                            </>
                          )}
                        </p>
                      </div>

                      {isSelected && (
                        <div className="absolute bottom-0 right-0 p-1 bg-primary-500 rounded-tl-xl">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
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
