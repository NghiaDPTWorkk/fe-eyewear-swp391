import { Minus, Plus, ChevronDown, ChevronUp } from 'lucide-react'
import { VNDPrice } from '@/shared/components/ui/vnd-price/VNDPrice'
import { useState, useEffect } from 'react'
import type { CartItem as CartItemType } from '@/shared/types'
import { useCartStore } from '@/store/cart.store'
import { Checkbox, Card } from '@/shared/components/ui'

interface CartItemProps {
  item: CartItemType
  isReadOnly?: boolean
}

export const CartItem = ({ item, isReadOnly = false }: CartItemProps) => {
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
    if (isNaN(newQty) || newQty < 1) {
      newQty = 1
    } else if (newQty > 99) {
      newQty = 99
    }

    if (newQty !== item.quantity) {
      updateQuantity(item, newQty)
    } else {
      setLocalQty(item.quantity.toString())
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      ;(e.target as HTMLInputElement).blur()
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
    <Card className="p-8 border-mint-300/50 relative group bg-white hover:shadow-md transition-shadow">
      <div className="flex flex-col md:flex-row gap-8">
        {}
        <div className="flex items-center gap-6">
          {!isReadOnly && (
            <div className="flex-shrink-0">
              <Checkbox
                isChecked={item.selected ?? true}
                onCheckedChange={() => toggleSelection(item)}
                id={`select-${item._id || item.product_id}`}
              />
            </div>
          )}
          <div className="flex flex-col items-center gap-4">
            <div className="w-48 h-48 bg-mint-50/30 rounded-2xl overflow-hidden flex items-center justify-center border border-mint-100/50 p-4 relative group/img">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover/img:scale-105"
              />
              {displayDiscount && (
                <div className="absolute top-0 left-0 bg-primary-500 text-white text-[10px] font-black px-2 py-1 rounded-br-xl shadow-sm">
                  {displayDiscount}
                </div>
              )}
            </div>
            {!isReadOnly && (
              <button
                onClick={() => removeItem(item)}
                className="text-xs font-bold text-gray-400 hover:text-red-500 transition-colors uppercase tracking-widest hover:underline"
              >
                Remove
              </button>
            )}
          </div>
        </div>

        {}
        <div className="flex-grow pt-2">
          <div className="flex justify-between items-start mb-6">
            <div className="flex-grow">
              {}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-mint-1200 tracking-tight leading-tight">
                    {item.name}
                  </h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">
                      {(item.sku || item.product_id || 'N/A').toString().toUpperCase()}
                    </span>
                    {item.selectedOptions &&
                      Object.entries(item.selectedOptions).map(([key, value]) => (
                        <span
                          key={key}
                          className="text-[10px] font-bold text-primary-600 bg-primary-50 px-1.5 py-0.5 rounded uppercase"
                        >
                          {key}: {value}
                        </span>
                      ))}
                  </div>
                </div>
                <div className="text-right">
                  {item.originalPrice && item.originalPrice > item.price && (
                    <p className="text-xs text-gray-300 line-through font-medium">
                      <VNDPrice amount={item.originalPrice} />
                    </p>
                  )}
                  <p className="text-base font-bold text-mint-1200">
                    <VNDPrice amount={frameUnitPrice} />
                  </p>
                </div>
              </div>

              {}
              {item.lens && (
                <div className="flex gap-4 pl-6 py-3 border-l-2 border-mint-100 mb-6 bg-mint-50/20 rounded-r-xl">
                  <div className="w-12 h-12 bg-white rounded-lg border border-mint-100 flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
                    {item.lens.image ? (
                      <img
                        src={item.lens.image}
                        alt={item.lens.name}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="bg-mint-100 w-full h-full flex items-center justify-center">
                        <span className="text-[8px] font-bold text-mint-500">LENS</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-grow flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-bold text-primary-700 leading-tight">
                        Standard Lenses: {item.lens.name || 'Custom Lenses'}
                      </h4>
                      <p className="text-[10px] font-bold text-primary-400 uppercase tracking-wider mt-0.5">
                        {item.lens.visionNeed === 'prescription' ? 'Prescription' : 'Standard'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-l font-bold text-primary-600">
                        {lensUnitPrice === 0 ? 'FREE' : <VNDPrice amount={lensUnitPrice} />}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {}
          {item.lens && (
            <div className="mb-6">
              <button
                onClick={() => setIsLensesOpen(!isLensesOpen)}
                className="flex items-center gap-2 text-xs font-bold text-primary-500 hover:text-primary-600 transition-colors uppercase tracking-widest"
              >
                {isLensesOpen ? 'Hide Prescription Detail' : 'Show Prescription Detail'}
                {isLensesOpen ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>

              {isLensesOpen && item.lens.prescription && (
                <div className="mt-4 p-4 bg-white border border-mint-100 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-300 shadow-sm">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 border-b border-mint-50 pb-2">
                    Prescription Details
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold text-primary-500 uppercase">Right (OD)</p>
                      <div className="grid grid-cols-4 gap-2 text-center bg-mint-50/50 p-2 rounded-lg">
                        <div className="flex flex-col">
                          <span className="text-[8px] font-black text-gray-400 uppercase">SPH</span>
                          <span className="text-xs font-bold text-mint-1200">
                            {item.lens.prescription.right.SPH}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[8px] font-black text-gray-400 uppercase">CYL</span>
                          <span className="text-xs font-bold text-mint-1200">
                            {item.lens.prescription.right.CYL}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[8px] font-black text-gray-400 uppercase">
                            AXIS
                          </span>
                          <span className="text-xs font-bold text-mint-1200">
                            {item.lens.prescription.right.AXIS}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[8px] font-black text-gray-400 uppercase">ADD</span>
                          <span className="text-xs font-bold text-mint-1200">
                            {item.lens.prescription.right.ADD || '--'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold text-primary-500 uppercase">Left (OS)</p>
                      <div className="grid grid-cols-4 gap-2 text-center bg-mint-50/50 p-2 rounded-lg">
                        <div className="flex flex-col">
                          <span className="text-[8px] font-black text-gray-400 uppercase">SPH</span>
                          <span className="text-xs font-bold text-mint-1200">
                            {item.lens.prescription.left.SPH}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[8px] font-black text-gray-400 uppercase">CYL</span>
                          <span className="text-xs font-bold text-mint-1200">
                            {item.lens.prescription.left.CYL}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[8px] font-black text-gray-400 uppercase">
                            AXIS
                          </span>
                          <span className="text-xs font-bold text-mint-1200">
                            {item.lens.prescription.left.AXIS}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[8px] font-black text-gray-400 uppercase">ADD</span>
                          <span className="text-xs font-bold text-mint-1200">
                            {item.lens.prescription.left.ADD || '--'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="md:col-span-2 flex items-center justify-between pt-2 border-t border-mint-50">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Pupillary Distance (PD)
                      </span>
                      <span className="text-sm font-black text-mint-1200 bg-mint-100 px-3 py-1 rounded-full">
                        {item.lens.prescription.PD} mm
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {}
          {displayDiscount && (
            <div className="py-3 border-t border-mint-50 flex items-center gap-2">
              <div className="px-2 py-0.5 bg-primary-50 text-primary-600 text-[10px] font-bold rounded uppercase tracking-wider border border-primary-100">
                Discount Applied: {displayDiscount}
              </div>
            </div>
          )}

          {}
          <div className="flex justify-between items-center pt-6 border-t border-gray-100 mt-auto">
            {!isReadOnly ? (
              <div className="flex items-center gap-3 bg-mint-50/50 p-1 rounded-xl border border-mint-100/50">
                <button
                  onClick={() => updateQuantity(item, Math.max(1, item.quantity - 1))}
                  className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm hover:text-primary-500 transition-colors disabled:opacity-50"
                  disabled={item.quantity <= 1}
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <input
                  type="text"
                  value={localQty}
                  onChange={handleQtyChange}
                  onBlur={handleQtyBlur}
                  onKeyDown={handleKeyDown}
                  className="text-sm font-bold text-mint-1200 w-10 text-center bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-primary-400/30 rounded-md transition-all appearance-none"
                />
                <button
                  onClick={() => updateQuantity(item, item.quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm hover:text-primary-500 transition-colors"
                  disabled={item.quantity >= 99}
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="text-sm font-bold text-mint-1200 bg-mint-50 px-3 py-2 rounded-lg border border-mint-100">
                Quantity: {item.quantity}
              </div>
            )}

            <div className="text-right">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                Subtotal
              </p>
              <div className="text-2xl font-black text-mint-1200 leading-none">
                <VNDPrice amount={itemTotalSubtotal} />
              </div>
              {item.originalPrice && item.originalPrice > item.price && (
                <p className="text-[10px] text-primary-600 font-bold mt-1">
                  Saved <VNDPrice amount={(item.originalPrice - item.price) * item.quantity} />
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
