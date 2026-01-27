import { useParams, useNavigate } from 'react-router-dom'
import { Container } from '@/components'
import { PATHS } from '@/routes/paths'
import {
  IoArrowBack,
  IoTimeOutline,
  IoConstructOutline,
  IoCubeOutline,
  IoCarOutline
} from 'react-icons/io5'

export default function OperationOrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()

  return (
    <Container>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button className="p-2 hover:bg-mint-100 rounded-lg transition-colors">
          <IoArrowBack size={20} className="text-gray-600" />
        </button>
        <div>
          {/* <div className="text-sm text-mint-900">Chi tiết đơn hàng</div> */}
          <h1 className="text-2xl font-semibold text-mint-900">Đơn hàng #{orderId || 'REG-001'}</h1>
        </div>
        <div className="ml-auto">
          <span className="px-4 py-2 bg-mint-100 text-mint-700 rounded-lg text-sm font-medium">
            Chờ xử lý
          </span>
        </div>
      </div>

      {/* Progress Tracker */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-mint-200">
        <h2 className="text-lg font-semibold text-mint-900 mb-6">Tiến độ đơn hàng</h2>
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-center flex-1">
            <div className="w-12 h-12 rounded-full bg-mint-500 flex items-center justify-center mb-2">
              <IoTimeOutline size={24} className="text-white" />
            </div>
            <span className="text-xs text-gray-600 text-center font-medium">Chờ xử lý</span>
          </div>
          <div className="flex-1 h-0.5 bg-gray-200 -mx-2"></div>
          <div className="flex flex-col items-center flex-1">
            <div className="w-12 h-12 rounded-full bg-mint-500 flex items-center justify-center mb-2">
              <IoConstructOutline size={24} className="text-white" />
            </div>
            <span className="text-xs text-gray-600 text-center font-medium">Đang xử lý</span>
          </div>
          <div className="flex-1 h-0.5 bg-gray-200 -mx-2"></div>
          <div className="flex flex-col items-center flex-1">
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mb-2">
              <IoCubeOutline size={24} className="text-gray-400" />
            </div>
            <span className="text-xs text-gray-400 text-center">Đóng gói</span>
          </div>
          <div className="flex-1 h-0.5 bg-gray-200 -mx-2"></div>
          <div className="flex flex-col items-center flex-1">
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mb-2">
              <IoCubeOutline size={24} className="text-gray-400" />
            </div>
            <span className="text-xs text-gray-400 text-center">Chờ lấy</span>
          </div>
          <div className="flex-1 h-0.5 bg-gray-200 -mx-2"></div>
          <div className="flex flex-col items-center flex-1">
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mb-2">
              <IoCarOutline size={24} className="text-gray-400" />
            </div>
            <span className="text-xs text-gray-400 text-center">Vận chuyển</span>
          </div>
        </div>
      </div>

      {/* Prescription - Lens Specifications */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border-2 border-mint-300">
        <h2 className="text-lg font-semibold text-mint-900 mb-4 pb-2 border-b-2 border-mint-200">
          Thông Số Tròng Kính
        </h2>

        {/* Prescription Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-mint-50">
                <th className="border border-mint-200 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Mắt
                </th>
                <th className="border border-mint-200 px-4 py-3 text-center text-sm font-semibold text-gray-700">
                  Độ Cầu (SPH)
                </th>
                <th className="border border-mint-200 px-4 py-3 text-center text-sm font-semibold text-gray-700">
                  Độ Trụ (CYL)
                </th>
                <th className="border border-mint-200 px-4 py-3 text-center text-sm font-semibold text-gray-700">
                  Trục (AXIS)
                </th>
                <th className="border border-mint-200 px-4 py-3 text-center text-sm font-semibold text-gray-700">
                  Lăng Kính
                </th>
                <th className="border border-mint-200 px-4 py-3 text-center text-sm font-semibold text-gray-700">
                  Độ Add
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Right Eye */}
              <tr className="hover:bg-mint-25">
                <td className="border border-mint-200 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">Mắt Phải (OD)</span>
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
              {/* Left Eye */}
              <tr className="hover:bg-mint-25">
                <td className="border border-mint-200 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">Mắt Trái (OS)</span>
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

        {/* Additional Lens Info */}
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="bg-mint-50 rounded-lg p-3 border border-mint-200">
            <div className="text-xs text-gray-500 mb-1">Loại Tròng</div>
            <div className="font-semibold text-gray-900">Single Vision</div>
          </div>
          <div className="bg-mint-50 rounded-lg p-3 border border-mint-200">
            <div className="text-xs text-gray-500 mb-1">Chất Liệu</div>
            <div className="font-semibold text-gray-900">CR-39 Plastic</div>
          </div>
        </div>
      </div>

      {/* Frame Specifications */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border-2 border-mint-300">
        <h2 className="text-lg font-semibold text-mint-900 mb-4 pb-2 border-b-2 border-mint-200">
          Thông Tin Gọng Kính
        </h2>

        <div className="flex gap-6">
          {/* Frame Image */}
          <div className="flex-shrink-0">
            <div className="w-60 h-60 bg-mint-50 rounded-lg border-2 border-mint-200 flex items-center justify-center overflow-hidden p-2">
              <img
                src="https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=800"
                alt="Rayban Aviator"
                className="w-full h-full object-contain mix-blend-multiply"
              />
            </div>
          </div>

          {/* Frame Details */}
          <div className="flex-1 grid grid-cols-2 gap-3">
            <div className="bg-mint-50 rounded-lg p-3 border border-mint-200">
              <div className="text-xs text-gray-500 mb-0.5">Mã Gọng</div>
              <div className="font-semibold text-gray-900">RB-AV-001</div>
            </div>
            <div className="bg-mint-50 rounded-lg p-3 border border-mint-200">
              <div className="text-xs text-gray-500 mb-0.5">Tên Gọng</div>
              <div className="font-semibold text-gray-900">Aviator Classic</div>
            </div>
            <div className="bg-mint-50 rounded-lg p-3 border border-mint-200">
              <div className="text-xs text-gray-500 mb-0.5">Thương Hiệu</div>
              <div className="font-semibold text-gray-900">Ray-Ban</div>
            </div>
            <div className="bg-mint-50 rounded-lg p-3 border border-mint-200">
              <div className="text-xs text-gray-500 mb-0.5">Chất Liệu</div>
              <div className="font-semibold text-gray-900">Metal Titanium</div>
            </div>
            <div className="bg-mint-50 rounded-lg p-3 border border-mint-200">
              <div className="text-xs text-gray-500 mb-0.5">Màu Sắc</div>
              <div className="font-semibold text-gray-900 flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-yellow-600 border border-gray-300"></span>
                Gold
              </div>
            </div>
            <div className="bg-mint-50 rounded-lg p-3 border border-mint-200">
              <div className="text-xs text-gray-500 mb-0.5">Lớp Phủ</div>
              <div className="font-semibold text-gray-900">Anti-Reflective</div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex justify-end gap-3">
        <button
          className="px-6 py-3 bg-mint-900 hover:bg-mint-700 text-white rounded-lg font-medium transition-colors shadow-sm"
          onClick={() => navigate(PATHS.OPERATIONSTAFF.PACKING_PROCESS(orderId || ''))}
        >
          Bắt đầu xử lý
        </button>
      </div>
    </Container>
  )
}
