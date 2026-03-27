import { Minus, Plus, ChevronDown, ChevronUp, Trash2, Info } from 'lucide-react'
import { VNDPrice } from '@/shared/components/ui/vnd-price/VNDPrice'
import { useState, useEffect } from 'react'
import type { CartItem as CartItemType } from '@/shared/types'
import { useCartStore } from '@/store/cart.store'
import { Checkbox } from '@/shared/components/ui'

interface PremiumCartItemProps {
  item: CartItemType
  isReadOnly?: boolean
}

export const PremiumCartItem = ({ item, isReadOnly = false }: PremiumCartItemProps) => {
  const { updateQuantity, removeItem, toggleSelection } = useCartStore()
  const [isLensesOpen, setIsLensesOpen] = useState(false)
  const [localQty, setLocalQty] = useState(item.quantity.toString())

  useEffect(() => {
    setLocalQty(item.quantity.toString())
  }, [item.quantity])

  const handleQtyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '')
    setLocalQty(val)
  }

  const handleQtyBlur = () => {
    let newQty = parseInt(localQty)
    if (isNaN(newQty) || newQty < 1) newQty = 1
    else if (newQty > 99) newQty = 99

    if (newQty !== item.quantity) {
      updateQuantity(item, newQty)
    } else {
      setLocalQty(item.quantity.toString())
    }
  }

  const frameUnitPrice = item.price
  const lensUnitPrice = item.lens?.price || 0
  const itemTotalUnitPrice = frameUnitPrice + lensUnitPrice
  const itemTotalSubtotal = itemTotalUnitPrice * item.quantity

  const displayDiscount = item.discount
    ? item.discount.type === 'percentage'
      ? `-${item.discount.value}%`
      : `-${item.discount.value} VND`
    : item.originalPrice && item.originalPrice > item.price
      ? `-${Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}%`
      : null

  return (
    <div className="group relative bg-white/80 backdrop-blur-sm border border-white/40 rounded-[2.5rem] p-6 lg:p-8 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(74,215,176,0.15)] hover:-translate-y-1 overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-primary-500/10 transition-colors duration-500" />

      <div className="relative flex flex-col md:flex-row gap-8">
        {/* Left: Checkbox & Image */}
        <div className="flex items-center gap-6">
          {!isReadOnly && (
            <div className="flex-shrink-0 scale-110">
              <Checkbox
                isChecked={item.selected ?? true}
                onCheckedChange={() => toggleSelection(item)}
                id={`select-${item._id || item.product_id}`}
              />
            </div>
          )}

          <div className="relative w-40 h-40 lg:w-48 lg:h-48 rounded-[2rem] bg-gradient-to-br from-mint-50 to-white border border-mint-100/50 p-6 flex items-center justify-center group-hover:scale-105 transition-transform duration-700 ease-out shadow-inner">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-contain mix-blend-multiply drop-shadow-2xl"
            />

            {displayDiscount && (
              <div className="absolute -top-2 -left-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-[11px] font-black px-3 py-1.5 rounded-2xl shadow-lg ring-4 ring-white">
                {displayDiscount}
              </div>
            )}
          </div>
        </div>

        {/* Right: Info Area */}
        <div className="flex-grow flex flex-col pt-2">
          {/* Title & SKU */}
          <div className="flex justify-between items-start mb-4">
            <div className="space-y-1">
              <h3 className="text-2xl font-black text-mint-1200 tracking-tight leading-tight font-heading">
                {item.name}
              </h3>
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-[10px] bg-mint-100 text-mint-800 px-2.5 py-1 rounded-full font-black tracking-widest uppercase border border-mint-200/50">
                  REF: {(item.sku || item.product_id || 'N/A').toString().toUpperCase()}
                </span>
                {item.selectedOptions &&
                  Object.entries(item.selectedOptions).map(([key, value]) => (
                    <span
                      key={key}
                      className="text-[10px] font-black text-primary-600 bg-primary-50/50 px-2.5 py-1 rounded-full uppercase border border-primary-100/30"
                    >
                      {key}: {value}
                    </span>
                  ))}
              </div>
            </div>

            <div className="text-right">
              {item.originalPrice && item.originalPrice > item.price && (
                <p className="text-sm text-neutral-400 line-through font-medium opacity-60 decoration-primary-500/30">
                  <VNDPrice amount={item.originalPrice} />
                </p>
              )}
              <div className="text-xl font-black text-primary-600 drop-shadow-sm">
                <VNDPrice amount={frameUnitPrice} />
              </div>
            </div>
          </div>

          {/* Lenses Display */}
          {item.lens && (
            <div className="mt-4 mb-6">
              <div className="relative p-5 bg-gradient-to-r from-mint-50/80 to-white/80 rounded-3xl border border-mint-200/50 group/lens transition-all duration-300 hover:border-primary-200 hover:from-primary-50/30">
                <div className="flex gap-4 items-center">
                  <div className="w-14 h-14 bg-white rounded-2xl border border-mint-200 flex items-center justify-center shrink-0 shadow-sm ring-4 ring-mint-50/50">
                    {item.lens.image ? (
                      <img src={item.lens.image} alt="lens" className="w-10 h-10 object-contain" />
                    ) : (
                      <Info className="w-6 h-6 text-primary-400" />
                    )}
                  </div>
                  <div className="flex-grow">
                    <h4 className="text-sm font-black text-mint-1200">
                      {item.lens.name || 'Standard Lenses'}
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse" />
                      <p className="text-[10px] font-bold text-primary-600 uppercase tracking-wider">
                        {item.lens.visionNeed === 'prescription'
                          ? 'Prescription'
                          : 'Standard Protection'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right font-black text-mint-1200">
                    {lensUnitPrice === 0 ? (
                      <span className="text-primary-500 text-xs">FREE</span>
                    ) : (
                      <VNDPrice amount={lensUnitPrice} />
                    )}
                  </div>
                </div>

                <div className="absolute top-2 right-2 flex gap-1">
                  <button
                    onClick={() => setIsLensesOpen(!isLensesOpen)}
                    className="p-2 text-mint-400 hover:text-primary-500 transition-colors"
                    title="View details"
                  >
                    {isLensesOpen ? (
                      <ChevronUp size={16} strokeWidth={3} />
                    ) : (
                      <ChevronDown size={16} strokeWidth={3} />
                    )}
                  </button>
                </div>

                {isLensesOpen && item.lens.prescription && (
                  <div className="mt-4 pt-4 border-t border-mint-200/50 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="bg-white/60 p-3 rounded-2xl border border-white/40">
                      <p className="text-[9px] font-black text-mint-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-mint-400" /> Right Eye (OD)
                      </p>
                      <div className="flex justify-between text-xs font-black text-mint-1200">
                        <div className="flex flex-col">
                          <span className="text-[8px] text-mint-300">SPH</span>
                          {item.lens.prescription.right.SPH}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[8px] text-mint-300">CYL</span>
                          {item.lens.prescription.right.CYL}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[8px] text-mint-300">AXIS</span>
                          {item.lens.prescription.right.AXIS}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[8px] text-mint-300">ADD</span>
                          {item.lens.prescription.right.ADD || '0'}
                        </div>
                      </div>
                    </div>
                    <div className="bg-white/60 p-3 rounded-2xl border border-white/40">
                      <p className="text-[9px] font-black text-mint-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-mint-400" /> Left Eye (OS)
                      </p>
                      <div className="flex justify-between text-xs font-black text-mint-1200">
                        <div className="flex flex-col">
                          <span className="text-[8px] text-mint-300">SPH</span>
                          {item.lens.prescription.left.SPH}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[8px] text-mint-300">CYL</span>
                          {item.lens.prescription.left.CYL}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[8px] text-mint-300">AXIS</span>
                          {item.lens.prescription.left.AXIS}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[8px] text-mint-300">ADD</span>
                          {item.lens.prescription.left.ADD || '0'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Bottom Area: Qty & Subtotal */}
          <div className="mt-auto flex justify-between items-end border-t border-mint-50 pt-6">
            <div className="flex items-center gap-4">
              {!isReadOnly ? (
                <div className="flex items-center bg-mint-100/50 p-1.5 rounded-2xl border border-mint-200/50 shadow-inner group-hover:bg-white transition-colors duration-300">
                  <button
                    onClick={() => updateQuantity(item, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm text-mint-600 hover:text-primary-500 hover:bg-primary-50 transition-all disabled:opacity-30 disabled:hover:bg-white"
                  >
                    <Minus size={14} strokeWidth={3} />
                  </button>
                  <input
                    type="text"
                    value={localQty}
                    onChange={handleQtyChange}
                    onBlur={handleQtyBlur}
                    className="w-12 text-center text-sm font-black text-mint-1200 bg-transparent focus:outline-none"
                  />
                  <button
                    onClick={() => updateQuantity(item, item.quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm text-mint-600 hover:text-primary-500 hover:bg-primary-50 transition-all"
                  >
                    <Plus size={14} strokeWidth={3} />
                  </button>
                </div>
              ) : (
                <div className="text-sm font-black text-mint-1200 bg-mint-50 px-4 py-2 rounded-2xl border border-mint-100">
                  QTY: {item.quantity}
                </div>
              )}

              {!isReadOnly && (
                <button
                  onClick={() => removeItem(item)}
                  className="w-10 h-10 flex items-center justify-center text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>

            <div className="text-right">
              <p className="text-[10px] font-black text-mint-400 uppercase tracking-[0.2em] mb-1">
                Total Amount
              </p>
              <div className="text-3xl font-black text-mint-1200 tracking-tighter leading-none font-heading bg-gradient-to-r from-mint-1200 to-mint-800 bg-clip-text text-transparent">
                <VNDPrice amount={itemTotalSubtotal} />
              </div>
              {item.originalPrice && item.originalPrice > item.price && (
                <p className="text-[10px] text-primary-600 font-extrabold mt-1.5 bg-primary-100/50 inline-block px-2 py-0.5 rounded-full">
                  You saved <VNDPrice amount={(item.originalPrice - item.price) * item.quantity} />
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
