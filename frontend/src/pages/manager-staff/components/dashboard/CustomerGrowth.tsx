import React from 'react'

export const CustomerGrowth: React.FC = () => {
  return (
    <div className="p-8 bg-white rounded-3xl border border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h3 className="text-base font-semibold text-gray-900 font-heading tracking-tight">
            Customer Growth
          </h3>
          <p className="text-[12px] font-medium text-gray-400">3 Provinces</p>
        </div>
        <button className="text-[12px] font-semibold text-gray-400 hover:text-mint-600 transition-colors flex items-center gap-1 uppercase tracking-widest">
          Show All <span className="text-xs">↗</span>
        </button>
      </div>

      <div className="flex flex-wrap gap-6 mb-8">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-mint-400 rounded-full" />
          <span className="text-[12px] font-semibold text-gray-700">
            East Java <span className="text-gray-400 font-medium ml-1">(50%)</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-secondary-400 rounded-full" />
          <span className="text-[12px] font-semibold text-gray-700">
            Kalimantan <span className="text-gray-400 font-medium ml-1">(50%)</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-mint-600 rounded-full" />
          <span className="text-[12px] font-semibold text-gray-700">
            Bali <span className="text-gray-400 font-medium ml-1">(65%)</span>
          </span>
        </div>
      </div>

      <div className="relative rounded-2xl overflow-hidden bg-gray-50/50 h-[300px]">
        {}
        <div className="absolute inset-0 bg-[#f8fafc]/50" />
        {}
        <div className="absolute top-1/4 left-1/4 w-32 h-20 bg-neutral-200/40 rounded-full blur-xl transform rotate-45" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-24 bg-neutral-200/40 rounded-full blur-xl" />
        <div className="absolute top-1/2 left-1/2 w-40 h-16 bg-neutral-200/40 rounded-full blur-xl transform -rotate-12" />

        {}
        <div className="absolute bottom-1/4 left-1/3">
          <div className="w-4 h-4 bg-mint-400 rounded-full border-2 border-white shadow-lg animate-pulse" />
        </div>
        <div className="absolute bottom-1/5 left-1/2">
          <div className="w-4 h-4 bg-secondary-400 rounded-full border-2 border-white shadow-lg" />
        </div>
        <div className="absolute bottom-1/4 right-1/3">
          <div className="w-4 h-4 bg-mint-600 rounded-full border-2 border-white shadow-lg" />
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center">
          <span className="text-[10px] font-semibold text-gray-300 uppercase tracking-[0.3em]">
            Indonesia map
          </span>
        </div>
      </div>
    </div>
  )
}
