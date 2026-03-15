import React, { useState } from 'react'
import { IoCloseOutline, IoCubeOutline, IoSaveOutline } from 'react-icons/io5'
import type { PreOrderImport } from '@/shared/types'
import { useImportProduct } from '@/features/manager-staff/hooks/usePreOrderImports'

interface ImportProductModalProps {
  isOpen: boolean
  onClose: () => void
  plan: PreOrderImport | null
}

export const ImportProductModal: React.FC<ImportProductModalProps> = ({
  isOpen,
  onClose,
  plan
}) => {
  const [quantity, setQuantity] = useState<number>(0)
  const importMutation = useImportProduct()

  if (!isOpen || !plan) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (quantity <= 0) return

    importMutation.mutate(
      {
        sku: plan.sku,
        quantity,
        preOrderImportId: plan._id
      },
      {
        onSuccess: () => {
          onClose()
          setQuantity(0)
        }
      }
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-100">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-mint-500/10 flex items-center justify-center text-mint-600">
              <IoCubeOutline size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 leading-tight">Import Products</h3>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">
                New Stock Arrival
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-2xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all active:scale-95"
          >
            <IoCloseOutline size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="space-y-5">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100/50 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-400 uppercase tracking-widest">Plan SKU</span>
                <span className="font-mono font-bold text-mint-600 bg-mint-50 px-2 py-1 rounded-lg">
                  {plan.sku}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-400 uppercase tracking-widest">Progress</span>
                <span className="font-bold text-slate-700">
                  {plan.preOrderedQuantity} / {plan.targetQuantity} units
                </span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-mint-500 h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, (plan.preOrderedQuantity / plan.targetQuantity) * 100)}%`
                  }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wider flex justify-between">
                <span>Import Quantity</span>
                {quantity > 0 && (
                  <span className="text-mint-600 animate-in fade-in slide-in-from-right-2">
                    +{quantity} units
                  </span>
                )}
              </label>
              <div className="relative group">
                <input
                  type="number"
                  required
                  min="1"
                  value={quantity || ''}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  placeholder="Enter arrived quantity..."
                  className="w-full pl-5 pr-5 py-4 bg-white border-2 border-slate-100 rounded-[22px] text-sm font-bold text-slate-800 placeholder:text-slate-300 placeholder:font-medium focus:outline-none focus:border-mint-500 focus:ring-4 focus:ring-mint-500/5 transition-all outline-none"
                />
              </div>
              <p className="text-[10px] text-slate-400 ml-1 font-medium">
                Enter the exact number of physical units received in this batch.
              </p>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-4 rounded-[22px] text-sm font-bold text-slate-500 bg-slate-50 hover:bg-slate-100 transition-all active:scale-95 border border-transparent hover:border-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={importMutation.isPending || quantity <= 0}
              className="flex-[1.5] px-6 py-4 bg-mint-600 text-white rounded-[22px] text-sm font-bold shadow-xl shadow-mint-100/50 hover:bg-mint-700 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:active:scale-100 disabled:shadow-none"
            >
              {importMutation.isPending ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <IoSaveOutline size={18} />
                  <span>Confirm Import</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
