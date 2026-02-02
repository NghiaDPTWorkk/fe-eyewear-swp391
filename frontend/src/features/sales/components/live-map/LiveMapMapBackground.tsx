/**
 * MapBackground Component
 * Mock map background with route visualization
 */
import { IoLocation } from 'react-icons/io5'

export default function LiveMapMapBackground() {
  return (
    <div className="absolute inset-0 z-0">
      <div className="w-full h-full bg-[#cad2d3] relative opacity-60">
        {/* Mock Map Texture/Grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle, #b0bec5 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}
        ></div>

        {/* Route Path (SVG) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <path
            d="M 200,500 Q 400,300 800,200 T 1200,300"
            fill="none"
            stroke="#10b981"
            strokeWidth="4"
            strokeDasharray="10,5"
            className="drop-shadow-lg"
          />
          <g style={{ transform: 'translate(750px, 210px)' }}>
            <circle r="12" fill="#10b981" className="animate-ping opacity-75" />
            <circle r="6" fill="white" stroke="#10b981" strokeWidth="2" />
          </g>
        </svg>

        {/* Landmarks */}
        <div className="absolute left-[200px] top-[500px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
          <div className="w-4 h-4 rounded-full bg-gray-800 border-2 border-white shadow-lg"></div>
          <span className="mt-1 text-xs font-bold text-gray-700 bg-white/80 px-2 py-0.5 rounded shadow-sm">
            Milan (IT)
          </span>
        </div>

        <div className="absolute left-[1200px] top-[300px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-emerald-600 border-4 border-white shadow-xl flex items-center justify-center text-white">
            <IoLocation />
          </div>
          <span className="mt-2 text-xs font-bold text-emerald-800 bg-white/90 px-3 py-1 rounded-full shadow-md">
            Ho Chi Minh City
          </span>
        </div>
      </div>
    </div>
  )
}
