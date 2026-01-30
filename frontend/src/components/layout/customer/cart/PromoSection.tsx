import { Plus } from 'lucide-react'

export const PromoSection = () => {
  return (
    <div className="grid md:grid-cols-2 gap-4 mt-8">
      <button className="flex items-center justify-between p-6 bg-white rounded-2xl border border-mint-300/50 text-mint-1200 font-bold hover:border-primary-300 transition-all text-left">
        Add promo code
        <Plus className="w-5 h-5 text-primary-500" />
      </button>
      <button className="flex items-center justify-between p-6 bg-white rounded-2xl border border-mint-300/50 text-mint-1200 font-bold hover:border-primary-300 transition-all text-left">
        <span className="max-w-[200px]">
          Military, First Responders, Teachers and Government Discount
        </span>
        <Plus className="w-5 h-5 text-primary-500" />
      </button>
    </div>
  )
}
