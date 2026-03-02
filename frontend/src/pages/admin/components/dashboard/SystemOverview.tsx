import React from 'react'
import { IoChevronDownOutline } from 'react-icons/io5'

export const SystemOverview: React.FC = () => {
  return (
    <div className="bg-white p-6 md:p-8 rounded-3xl border border-neutral-100 shadow-sm relative overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-10">
        <div>
          <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest mb-1 leading-none">
            System Activity
          </p>
          <div className="flex items-center gap-2 mt-1">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 font-primary leading-tight">
              12,458
            </h3>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 text-indigo-600">
              ↑ 12.3%
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1">Total API requests this month</p>
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-between sm:justify-start gap-2 px-3 py-1.5 bg-neutral-50 rounded-xl text-[11px] font-semibold text-neutral-600 border border-neutral-100 h-9 transition-colors hover:bg-neutral-100">
            <span>This Month</span> <IoChevronDownOutline className="opacity-60" />
          </button>
          <button className="flex-1 sm:flex-none flex items-center justify-between sm:justify-start gap-2 px-3 py-1.5 bg-neutral-50 rounded-xl text-[11px] font-semibold text-neutral-600 border border-neutral-100 h-9 transition-colors hover:bg-neutral-100">
            <span>All Services</span> <IoChevronDownOutline className="opacity-60" />
          </button>
        </div>
      </div>

      <div className="relative h-64 w-full">
        <svg viewBox="0 0 800 200" className="w-full h-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="adminChartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>
          {/* Grid Lines */}
          <line x1="0" y1="180" x2="800" y2="180" stroke="#f1f5f9" strokeWidth="1" />
          <line x1="0" y1="130" x2="800" y2="130" stroke="#f1f5f9" strokeWidth="1" />
          <line x1="0" y1="80" x2="800" y2="80" stroke="#f1f5f9" strokeWidth="1" />
          <line x1="0" y1="30" x2="800" y2="30" stroke="#f1f5f9" strokeWidth="1" />

          {/* Dashed reference line */}
          <path
            d="M 0 150 Q 50 140 100 160 T 200 130 T 300 150 T 400 120 T 500 110 T 600 140 T 700 100 T 800 80"
            fill="none"
            stroke="#cbd5e1"
            strokeWidth="2"
            strokeDasharray="4 4"
            opacity="0.5"
          />
          {/* Area fill */}
          <path
            d="M 0 140 Q 50 130 100 110 T 200 90 T 300 100 T 400 70 T 500 50 T 600 80 T 700 60 T 800 40"
            fill="url(#adminChartGradient)"
            stroke="none"
          />
          {/* Main line */}
          <path
            d="M 0 140 Q 50 130 100 110 T 200 90 T 300 100 T 400 70 T 500 50 T 600 80 T 700 60 T 800 40"
            fill="none"
            stroke="#6366f1"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Tooltip dot */}
          <line
            x1="400"
            y1="20"
            x2="400"
            y2="180"
            stroke="#6366f1"
            strokeWidth="1"
            strokeDasharray="4 4"
            opacity="0.3"
          />
          <circle cx="400" cy="70" r="6" fill="#6366f1" stroke="white" strokeWidth="2" />
        </svg>
        <div className="flex justify-between mt-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest pl-2 font-primary opacity-60">
          <span>Feb 01, 2026</span>
          <span>Feb 22, 2026</span>
        </div>
      </div>
    </div>
  )
}
