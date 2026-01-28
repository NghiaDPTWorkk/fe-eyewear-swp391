import { useParams, useNavigate, Link } from 'react-router-dom'
import { Container } from '@/components'
import { PATHS } from '@/routes/paths'
import { IoTimeOutline, IoConstructOutline, IoCubeOutline, IoCarOutline } from 'react-icons/io5'
import { ArrowLeft } from 'lucide-react'

export default function OperationOrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()

  return (
    <Container>
      <div className="flex items-center gap-2 text-sm pt-8 mb-6 font-medium">
        <Link
          to="/operationstaff/dashboard"
          className="text-neutral-400 hover:text-primary-500 transition-colors"
        >
          Dashboard
        </Link>
        <span className="text-neutral-300">/</span>
        <Link
          to="/operationstaff/all"
          className="text-neutral-400 hover:text-primary-500 transition-colors"
        >
          Orders
        </Link>
        <span className="text-neutral-300">/</span>
        <span className="text-primary-500 font-bold">Details</span>
      </div>

      <div className="flex items-center gap-5 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center bg-white hover:bg-mint-50 rounded-xl shadow-sm transition-all duration-300 border border-neutral-100 hover:border-mint-200 hover:shadow-md hover:-translate-x-0.5 active:scale-90 group"
        >
          <ArrowLeft
            size={20}
            className="text-neutral-500 group-hover:text-mint-600 transition-colors stroke-[2.5px]"
          />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Order #{orderId || 'REG-001'}
          </h1>
          <p className="text-sm text-neutral-500 mt-1 font-medium tracking-wide italic opacity-80 uppercase tracking-widest text-[10px]">
            DETAILED ORDER INFORMATION
          </p>
        </div>
        <div className="ml-auto">
          <span className="px-6 py-2 bg-mint-100 text-mint-700 border border-mint-200 rounded-full text-xs font-bold uppercase tracking-widest">
            Pending
          </span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-mint-200">
        <h2 className="text-lg font-semibold text-mint-900 mb-6">Order Progress</h2>
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-center flex-1">
            <div className="w-12 h-12 rounded-full bg-mint-500 flex items-center justify-center mb-2">
              <IoTimeOutline size={24} className="text-white" />
            </div>
            <span className="text-xs text-gray-600 text-center font-medium">Pending</span>
          </div>
          <div className="flex-1 h-0.5 bg-gray-200 -mx-2"></div>
          <div className="flex flex-col items-center flex-1">
            <div className="w-12 h-12 rounded-full bg-mint-500 flex items-center justify-center mb-2">
              <IoConstructOutline size={24} className="text-white" />
            </div>
            <span className="text-xs text-gray-600 text-center font-medium">Processing</span>
          </div>
          <div className="flex-1 h-0.5 bg-gray-200 -mx-2"></div>
          <div className="flex flex-col items-center flex-1">
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mb-2">
              <IoCubeOutline size={24} className="text-gray-400" />
            </div>
            <span className="text-xs text-gray-400 text-center">Packing</span>
          </div>
          <div className="flex-1 h-0.5 bg-gray-200 -mx-2"></div>
          <div className="flex flex-col items-center flex-1">
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mb-2">
              <IoCubeOutline size={24} className="text-gray-400" />
            </div>
            <span className="text-xs text-gray-400 text-center">Ready for Pickup</span>
          </div>
          <div className="flex-1 h-0.5 bg-gray-200 -mx-2"></div>
          <div className="flex flex-col items-center flex-1">
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mb-2">
              <IoCarOutline size={24} className="text-gray-400" />
            </div>
            <span className="text-xs text-gray-400 text-center">Shipping</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border-2 border-mint-300">
        <h2 className="text-lg font-semibold text-mint-900 mb-4 pb-2 border-b-2 border-mint-200">
          Lens Specifications
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-mint-50">
                <th className="border border-mint-200 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Eye
                </th>
                <th className="border border-mint-200 px-4 py-3 text-center text-sm font-semibold text-gray-700">
                  Sphere (SPH)
                </th>
                <th className="border border-mint-200 px-4 py-3 text-center text-sm font-semibold text-gray-700">
                  Cylinder (CYL)
                </th>
                <th className="border border-mint-200 px-4 py-3 text-center text-sm font-semibold text-gray-700">
                  Axis
                </th>
                <th className="border border-mint-200 px-4 py-3 text-center text-sm font-semibold text-gray-700">
                  Prism
                </th>
                <th className="border border-mint-200 px-4 py-3 text-center text-sm font-semibold text-gray-700">
                  Add
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-mint-50/50 transition-colors">
                <td className="border border-mint-200 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">Right Eye (OD)</span>
                  </div>
                </td>
                <td className="border border-mint-200 px-4 py-3 text-center font-mono font-semibold text-gray-900">
                  -6.50
                </td>
                <td className="border border-mint-200 px-4 py-3 text-center font-mono font-semibold text-gray-900">
                  -1.50
                </td>
                <td className="border border-mint-200 px-4 py-3 text-center font-mono font-semibold text-gray-900">
                  0°
                </td>
                <td className="border border-mint-200 px-4 py-3 text-center font-mono text-gray-500">
                  -
                </td>
                <td className="border border-mint-200 px-4 py-3 text-center font-mono text-gray-500">
                  -
                </td>
              </tr>
              <tr className="hover:bg-mint-50/50 transition-colors">
                <td className="border border-mint-200 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">Left Eye (OS)</span>
                  </div>
                </td>
                <td className="border border-mint-200 px-4 py-3 text-center font-mono font-semibold text-gray-900">
                  -6.50
                </td>
                <td className="border border-mint-200 px-4 py-3 text-center font-mono font-semibold text-gray-900">
                  -1.50
                </td>
                <td className="border border-mint-200 px-4 py-3 text-center font-mono font-semibold text-gray-900">
                  0°
                </td>
                <td className="border border-mint-200 px-4 py-3 text-center font-mono text-gray-500">
                  -
                </td>
                <td className="border border-mint-200 px-4 py-3 text-center font-mono text-gray-500">
                  -
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="bg-mint-50 rounded-lg p-4 border border-mint-200">
            <div className="text-xs text-mint-600 font-bold uppercase tracking-wider mb-1">
              Lens Type
            </div>
            <div className="font-semibold text-gray-900">Single Vision</div>
          </div>
          <div className="bg-mint-50 rounded-lg p-4 border border-mint-200">
            <div className="text-xs text-mint-600 font-bold uppercase tracking-wider mb-1">
              Material
            </div>
            <div className="font-semibold text-gray-900">CR-39 Plastic</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border-2 border-mint-300">
        <h2 className="text-lg font-semibold text-mint-900 mb-4 pb-2 border-b-2 border-mint-200">
          Frame Specifications
        </h2>

        <div className="flex gap-6">
          <div className="flex-shrink-0">
            <div className="w-60 h-60 bg-mint-50 rounded-xl border-2 border-mint-200 flex items-center justify-center overflow-hidden p-4 group transition-all hover:border-mint-400">
              <img
                src="https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=800"
                alt="Rayban Aviator"
                className="w-full h-full object-contain mix-blend-multiply transition-transform group-hover:scale-110"
              />
            </div>
          </div>

          <div className="flex-1 grid grid-cols-2 gap-4">
            {[
              { label: 'Frame Code', value: 'RB-AV-001' },
              { label: 'Frame Name', value: 'Aviator Classic' },
              { label: 'Brand', value: 'Ray-Ban' },
              { label: 'Material', value: 'Metal Titanium' },
              { label: 'Color', value: 'Gold', isColor: true },
              { label: 'Coating', value: 'Anti-Reflective' }
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-mint-50 rounded-lg p-4 border border-mint-200 hover:border-mint-400 transition-colors group"
              >
                <div className="text-xs text-mint-600 font-bold uppercase tracking-wider mb-1 group-hover:text-mint-700">
                  {item.label}
                </div>
                <div className="font-semibold text-gray-900 flex items-center gap-2">
                  {item.isColor && (
                    <span className="w-4 h-4 rounded-full bg-yellow-600 border border-gray-300"></span>
                  )}
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pb-8">
        <button
          className="px-8 py-3 bg-mint-600 text-white rounded-xl font-bold transition-all shadow-lg hover:bg-mint-700 hover:shadow-mint-200 transform hover:-translate-y-1 active:scale-95"
          onClick={() => navigate(PATHS.OPERATIONSTAFF.PACKING_PROCESS(orderId || ''))}
        >
          Start Processing
        </button>
      </div>
    </Container>
  )
}
