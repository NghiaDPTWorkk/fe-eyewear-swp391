import React from 'react'
import { IoShieldCheckmarkOutline, IoAlertCircleOutline, IoWarningOutline } from 'react-icons/io5'

export default function PolicyImplementOrder() {
  return (
    <div className="bg-white rounded-2xl border border-amber-200 shadow-sm overflow-hidden mt-8">
      <div className="bg-amber-50 px-6 py-4 border-b border-amber-100 flex items-center gap-3">
        <IoWarningOutline className="text-amber-600 text-xl" />
        <h3 className="text-amber-900 font-bold uppercase tracking-wider text-sm">
          Operational Guidelines & Policy
        </h3>
      </div>
      
      <div className="p-6 space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-mint-50 flex items-center justify-center shrink-0">
              <IoShieldCheckmarkOutline className="text-mint-600 text-lg" />
            </div>
            <div>
              <h4 className="text-slate-900 font-bold text-sm mb-1">Quality Assurance</h4>
              <p className="text-slate-500 text-xs leading-relaxed">
                Staff must perform their tasks with high responsibility. Every item should be double-checked against the order specifications before moving to the next station.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
              <IoAlertCircleOutline className="text-red-600 text-lg" />
            </div>
            <div>
              <h4 className="text-slate-900 font-bold text-sm mb-1">Correct Item Fulfillment</h4>
              <p className="text-slate-500 text-xs leading-relaxed">
                Ensuring the correct SKU, color, and lens parameters is mandatory. Any errors leading to wrong product delivery may result in compensation liabilities as per company policy.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <div className="bg-slate-50 rounded-xl p-4 flex items-start gap-3">
            <div className="mt-0.5">
              <div className="w-2 h-2 rounded-full bg-amber-500" />
            </div>
            <p className="text-[11px] text-slate-600 font-medium italic leading-relaxed">
              * By clicking "Start Processing", you acknowledge that you have read and understood the fulfillment requirements for this specific order. Compliance with technical standards is strictly required for all operation staff.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
