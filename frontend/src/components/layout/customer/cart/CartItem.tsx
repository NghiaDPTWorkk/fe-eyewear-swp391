import { Minus, Plus, ChevronDown, ChevronUp } from 'lucide-react'
import { VNDPrice } from '@/shared/components/ui/vnd-price/VNDPrice'
import { useState } from 'react'
import type { CartItem as CartItemType } from '@/shared/types'
import { useCartStore } from '@/store/cart.store'
import { Checkbox, Card } from '@/shared/components/ui'

interface CartItemProps {
  item: CartItemType
}

export const CartItem = ({ item }: CartItemProps) => {
  const { updateQuantity, removeItem, toggleSelection } = useCartStore()
  const [isLensesOpen, setIsLensesOpen] = useState(false)

  // Mock data to match design
  const hasPromo = true
  const promoDiscount = '30% off frame'
  const originalPrice = item.price / 0.7 // Mocking an original price

  return (
    <Card className="p-8 border-mint-300/50 relative group bg-white hover:shadow-md transition-shadow">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Selection Checkbox and Image Container */}
        <div className="flex items-start gap-6">
          <div className="pt-16">
            <Checkbox
              isChecked={item.selected ?? true}
              onCheckedChange={() => toggleSelection(item.product_id)}
              id={`select-${item.product_id}`}
            />
          </div>
          <div className="flex flex-col items-center gap-4">
            <div className="w-48 h-48 bg-[#F8F9FA] rounded-lg overflow-hidden flex items-center justify-center border border-gray-100 p-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-contain mix-blend-multiply"
              />
            </div>
            <button
              onClick={() => removeItem(item)}
              className="text-xs font-medium text-gray-400 hover:text-red-500 transition-colors underline"
            >
              Remove
            </button>
          </div>
        </div>

        {/* Product Details */}
        <div className="flex-grow pt-2">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-2xl font-bold text-[#000000] tracking-tight">{item.name}</h3>
                {hasPromo && (
                  <span className="px-2 py-1 bg-[#FEE2E2] text-[#EF4444] rounded text-[10px] font-bold uppercase tracking-wider">
                    30% OFF
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-400 tracking-widest uppercase mb-4">
                {(item.product_id || 'N/A').toString().toUpperCase()}
              </p>
            </div>

            <div className="text-right">
              <p className="text-sm text-gray-300 line-through mb-1">
                <VNDPrice amount={originalPrice} />
              </p>
              <p className="text-xl font-bold text-[#000000]">
                <VNDPrice amount={item.price} />
              </p>
            </div>
          </div>

          {/* Collapsible Lenses Section */}
          {item.productType !== 'lens' && (
            <div className="mb-8">
              <button
                onClick={() => setIsLensesOpen(!isLensesOpen)}
                className="flex items-center gap-2 text-base font-bold text-[#4F8B8B] hover:text-[#3D6E6E] transition-colors mb-4"
              >
                {item.lens ? 'Your lenses' : 'Standard lenses'}
                {isLensesOpen ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>

              {isLensesOpen && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-3 mb-6 animate-in fade-in slide-in-from-top-2 duration-300">
                  {item.lens ? (
                    <>
                      <div className="flex justify-between gap-4 py-0.5">
                        <span className="text-sm text-gray-400 whitespace-nowrap">Vision Need</span>
                        <span className="text-sm text-[#000000] font-bold text-right uppercase">
                          {item.lens.visionNeed.replace('-', ' ')}
                        </span>
                      </div>
                      {item.lens.prescription && (
                        <>
                          <div className="md:col-span-2 border-t border-mint-50 mt-2 pt-2">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                              Prescription Details
                            </p>
                            <div className="grid grid-cols-2 gap-8 bg-mint-50/30 p-3 rounded-lg">
                              <div>
                                <p className="text-[10px] font-bold text-mint-700 uppercase mb-1">
                                  Right (OD)
                                </p>
                                <p className="text-xs font-bold text-mint-1200">
                                  SPH: {item.lens.prescription.right.SPH} | CYL:{' '}
                                  {item.lens.prescription.right.CYL} | AXIS:{' '}
                                  {item.lens.prescription.right.AXIS}
                                  {item.lens.prescription.right.ADD &&
                                    ` | ADD: ${item.lens.prescription.right.ADD}`}
                                </p>
                              </div>
                              <div>
                                <p className="text-[10px] font-bold text-mint-700 uppercase mb-1">
                                  Left (OS)
                                </p>
                                <p className="text-xs font-bold text-mint-1200">
                                  SPH: {item.lens.prescription.left.SPH} | CYL:{' '}
                                  {item.lens.prescription.left.CYL} | AXIS:{' '}
                                  {item.lens.prescription.left.AXIS}
                                  {item.lens.prescription.left.ADD &&
                                    ` | ADD: ${item.lens.prescription.left.ADD}`}
                                </p>
                              </div>
                              <div className="col-span-2 mt-1">
                                <p className="text-[10px] font-bold text-mint-700 uppercase mb-1">
                                  PD
                                </p>
                                <p className="text-xs font-bold text-mint-1200">
                                  {item.lens.prescription.PD}
                                </p>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="flex justify-between gap-4 py-0.5">
                      <span className="text-sm text-gray-400 whitespace-nowrap">Type</span>
                      <span className="text-sm text-[#000000] font-bold text-right">
                        Standard Sunglass Lenses
                      </span>
                    </div>
                  )}
                  <div className="md:col-span-2 flex justify-end mt-4">
                    <button className="text-xs font-bold text-[#4F8B8B] hover:underline uppercase tracking-widest">
                      Edit
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Promo Section */}
          <div className="space-y-2 py-6 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <span className="text-base font-bold text-[#20B2AA]">Promo applied:</span>
              <span className="text-base font-bold text-[#20B2AA]">{promoDiscount}</span>
            </div>
            {isLensesOpen && (
              <div className="flex justify-end">
                <span className="text-base font-bold text-[#20B2AA]">Lens Discount</span>
              </div>
            )}
          </div>

          {/* Item Subtotal Area */}
          <div className="flex justify-between items-center pt-8 border-t border-gray-200">
            <span className="text-base font-bold text-gray-500 uppercase tracking-widest">
              SUBTOTAL
            </span>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-300 line-through">
                <VNDPrice amount={originalPrice * item.quantity} />
              </span>
              <span className="text-xl font-bold text-[#000000]">
                <VNDPrice amount={item.price * item.quantity} />
              </span>
            </div>
          </div>

          {/* Quantity Selector (Invisible but functional) */}
          <div className="absolute top-8 right-8 flex items-center gap-3 bg-gray-50 rounded-lg p-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => updateQuantity(item, Math.max(1, item.quantity - 1))}
              className="p-1 hover:bg-white rounded transition-colors text-gray-600"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="text-xs font-bold text-gray-800 min-w-[20px] text-center">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item, item.quantity + 1)}
              className="p-1 hover:bg-white rounded transition-colors text-gray-600"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </Card>
  )
}
