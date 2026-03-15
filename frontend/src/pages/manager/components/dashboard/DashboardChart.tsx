import React from 'react'

export const DashboardChart: React.FC = () => {
  return (
    <div className="p-8 bg-white rounded-3xl border border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      <div className="flex justify-between items-center mb-8">
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-gray-900 font-heading tracking-tight">
            Your Sales this year
          </h3>
          <div className="flex gap-4 mt-2">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-mint-400 rounded-sm" />
              <span className="text-[12px] text-gray-400 font-medium">Average Sale Value</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-secondary-400 rounded-sm" />
              <span className="text-[12px] text-gray-400 font-medium">Average item per sale</span>
            </div>
          </div>
        </div>
        <button className="text-[12px] font-bold text-gray-400 hover:text-mint-600 transition-colors flex items-center gap-1 uppercase tracking-widest">
          Show All <span className="text-xs">↗</span>
        </button>
      </div>

      <div className="relative h-64 w-full mt-10">
        <svg viewBox="0 0 800 200" className="w-full h-full preserve-3d">
          {/* Secondary dashed line */}
          <path
            d="M 0 150 Q 50 140 100 160 T 200 130 T 300 150 T 400 120 T 500 110 T 600 140 T 700 100 T 800 80"
            fill="none"
            stroke="#60a5fa"
            strokeWidth="2.5"
            strokeDasharray="6 4"
            className="opacity-60"
          />
          {/* Mint solid line */}
          <path
            d="M 0 160 Q 50 170 100 140 T 200 120 T 300 140 T 400 90 T 500 100 T 600 80 T 700 70 T 800 50"
            fill="none"
            stroke="#4ad7b0"
            strokeWidth="3.5"
          />

          <line
            x1="367"
            y1="20"
            x2="367"
            y2="180"
            stroke="#f1f5f9"
            strokeWidth="2"
            strokeDasharray="4 4"
          />

          <g transform="translate(300, 80)">
            <rect
              x="0"
              y="0"
              width="100"
              height="36"
              rx="12"
              fill="white"
              filter="drop-shadow(0 4px 6px rgb(0,0,0,0.05))"
              stroke="#f1f5f9"
              strokeWidth="1"
            />
            <text
              x="50"
              y="14"
              textAnchor="middle"
              fontSize="7"
              fontWeight="600"
              fill="#94a3b8"
              className="uppercase"
            >
              Avg item per sale
            </text>
            <text x="50" y="27" textAnchor="middle" fontSize="9" fontWeight="600" fill="#1e293b">
              $ 211,411.22
            </text>
          </g>

          <g transform="translate(375, 80)">
            <rect x="0" y="0" width="100" height="36" rx="12" fill="#4ad7b0" />
            <text
              x="50"
              y="14"
              textAnchor="middle"
              fontSize="7"
              fontWeight="600"
              fill="white"
              className="uppercase"
              opacity="0.8"
            >
              Avg year value
            </text>
            <text x="50" y="27" textAnchor="middle" fontSize="9" fontWeight="600" fill="white">
              $ 339,091.88
            </text>
          </g>
        </svg>

        <div className="flex justify-between mt-8 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] px-2 opacity-50">
          <span>Jan</span>
          <span>Feb</span>
          <span>Mar</span>
          <span>Apr</span>
          <span>May</span>
          <span>Jun</span>
          <span>Jul</span>
          <span>Aug</span>
          <span>Sep</span>
          <span>Oct</span>
          <span>Nov</span>
          <span>Dec</span>
        </div>
      </div>
    </div>
  )
}
