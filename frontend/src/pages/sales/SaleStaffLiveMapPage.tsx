import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  IoArrowBackOutline,
  IoLocation,
  IoCube,
  IoAirplane,
  IoCall,
  IoChatbubble,
  IoInformationCircle
} from 'react-icons/io5'

import { Button, Card } from '@/components'

export default function SaleStaffLiveMapPage() {
  const { trackingId } = useParams()
  const navigate = useNavigate()
  const [eta] = useState('2 hours 15 mins')

  const [progress, setProgress] = useState(65)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => (prev >= 90 ? 65 : prev + 0.5))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative w-full h-screen bg-neutral-100 overflow-hidden flex flex-col">
      {}
      <div className="absolute inset-0 z-0">
        {}
        <div className="w-full h-full bg-[#cad2d3] relative opacity-60">
          {}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(circle, #b0bec5 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }}
          ></div>

          {}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <path
              d="M 200,500 Q 400,300 800,200 T 1200,300"
              fill="none"
              stroke="#10b981"
              strokeWidth="4"
              strokeDasharray="10,5"
              className="drop-shadow-lg"
            />
            {}
            <g style={{ transform: 'translate(750px, 210px)' }}>
              <circle r="12" fill="#10b981" className="animate-ping opacity-75" />
              <circle r="6" fill="white" stroke="#10b981" strokeWidth="2" />
            </g>
          </svg>

          {}
          <div className="absolute left-[200px] top-[500px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <div className="w-4 h-4 rounded-full bg-gray-800 border-2 border-white shadow-lg"></div>
            <span className="mt-1 text-xs font-semibold text-gray-700 bg-white/80 px-2 py-0.5 rounded shadow-sm">
              Milan (IT)
            </span>
          </div>

          <div className="absolute left-[1200px] top-[300px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-emerald-600 border-4 border-white shadow-xl flex items-center justify-center text-white">
              <IoLocation />
            </div>
            <span className="mt-2 text-xs font-semibold text-emerald-800 bg-white/90 px-3 py-1 rounded-full shadow-md">
              Ho Chi Minh City
            </span>
          </div>
        </div>
      </div>

      {}
      <div className="relative z-10 px-6 py-4 pointer-events-none">
        <div className="bg-white/90 backdrop-blur-md shadow-lg rounded-2xl p-4 flex justify-between items-center max-w-5xl mx-auto pointer-events-auto border border-white/50">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-full transition"
            >
              <IoArrowBackOutline size={24} className="text-gray-700" />
            </button>
            <div>
              <h1 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <IoAirplane className="text-emerald-500" /> Live Shipment Tracking
              </h1>
              <p className="text-sm text-gray-500">
                Tracking ID:{' '}
                <span className="font-mono font-medium text-gray-900">
                  {trackingId || '#TRK-8892-IT'}
                </span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right hidden md:block">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Estimated Arrival
              </p>
              <p className="text-xl font-semibold text-emerald-600">{eta}</p>
            </div>
            <div className="h-10 w-px bg-gray-200 hidden md:block"></div>
            <Button className="bg-gray-900 text-white hover:bg-gray-800">Contact Support</Button>
          </div>
        </div>
      </div>

      {}
      <div className="mt-auto relative z-10 p-6 pointer-events-none">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 pointer-events-auto">
          {}
          <Card className="col-span-2 p-6 rounded-2xl shadow-xl border-0 bg-white/95 backdrop-blur-sm">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">In Transit - On Schedule</h2>
                <p className="text-sm text-emerald-600 font-medium">
                  Arrived at Sort Facility - Tan Son Nhat Airport
                </p>
              </div>
              <IoCube className="text-emerald-100 text-4xl" />
            </div>

            {}
            <div className="mb-8">
              <div className="flex justify-between text-xs font-semibold text-gray-500 mb-2">
                <span>Milan (Start)</span>
                <span>Ho Chi Minh City (End)</span>
              </div>
              <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full relative"
                  style={{ width: `${progress}%`, transition: 'width 1s linear' }}
                >
                  <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/50 animate-pulse"></div>
                </div>
              </div>
            </div>

            {}
            <div className="grid grid-cols-4 gap-2">
              <div className="flex flex-col gap-2">
                <div className="h-1 w-full bg-emerald-500 rounded-full"></div>
                <span className="text-xs font-semibold text-gray-900">Order Placed</span>
                <span className="text-[10px] text-gray-400">Oct 22, 09:00</span>
              </div>
              <div className="flex flex-col gap-2">
                <div className="h-1 w-full bg-emerald-500 rounded-full"></div>
                <span className="text-xs font-semibold text-gray-900">Exported</span>
                <span className="text-[10px] text-gray-400">Oct 23, 16:20</span>
              </div>
              <div className="flex flex-col gap-2">
                <div className="h-1 w-full bg-emerald-500 rounded-full relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/30 animate-shimmer"></div>
                </div>
                <span className="text-xs font-semibold text-emerald-600">Importing</span>
                <span className="text-[10px] text-emerald-500 font-medium">In Progress...</span>
              </div>
              <div className="flex flex-col gap-2">
                <div className="h-1 w-full bg-gray-200 rounded-full"></div>
                <span className="text-xs font-medium text-gray-400">Delivered</span>
                <span className="text-[10px] text-gray-300">--</span>
              </div>
            </div>
          </Card>

          {}
          <Card className="p-6 rounded-2xl shadow-xl border-0 bg-white/95 backdrop-blur-sm flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                Courier Information
              </h3>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-yellow-400 overflow-hidden border-2 border-white shadow-md">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/DHL_Logo.svg/1200px-DHL_Logo.svg.png"
                    alt="DHL"
                    className="w-full h-full object-contain bg-white p-1"
                  />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">DHL Express</h4>
                  <div className="flex gap-1 text-xs text-yellow-600 font-semibold bg-yellow-50 px-2 py-0.5 rounded-full w-fit">
                    <IoInformationCircle size={14} /> Global Priority
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Service</span>
                  <span className="font-medium text-gray-900">Express Worldwide</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Weight</span>
                  <span className="font-medium text-gray-900">0.5 kg</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Pieces</span>
                  <span className="font-medium text-gray-900">1</span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button className="flex-1 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition flex items-center justify-center">
                <IoChatbubble className="mr-2" /> Message
              </button>
              <button className="flex-1 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition flex items-center justify-center">
                <IoCall className="mr-2" /> Call
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
