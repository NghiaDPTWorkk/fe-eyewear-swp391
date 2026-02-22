import React from 'react'

export const SalesTarget: React.FC = () => {
  return (
    <div className="p-8 bg-white rounded-3xl border border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      <div className="flex justify-between items-center mb-10">
        <h3 className="text-base font-semibold text-gray-900 font-heading tracking-tight">
          Sales Target
        </h3>
      </div>

      <div className="flex flex-col gap-8">
        <div className="flex justify-between items-end">
          <div className="space-y-2">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.15em]">
              In Progress
            </p>
            <p className="text-2xl font-semibold text-gray-900 font-heading">$231,032,444</p>
          </div>
          <div className="text-right space-y-2">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.15em] text-right">
              Sales Target
            </p>
            <p className="text-2xl font-semibold text-gray-900 font-heading">$500,000,000</p>
          </div>
        </div>

        <div className="relative h-6 bg-gray-50 rounded-full">
          <div
            className="absolute left-0 top-0 h-full bg-mint-400 rounded-full flex items-center justify-end shadow-sm"
            style={{ width: '46%' }}
          >
            <div className="w-8 h-8 bg-white border-[6px] border-white shadow-[0_0_15px_rgba(0,0,0,0.1)] rounded-full absolute -right-4 z-10" />
          </div>
        </div>
      </div>
    </div>
  )
}
