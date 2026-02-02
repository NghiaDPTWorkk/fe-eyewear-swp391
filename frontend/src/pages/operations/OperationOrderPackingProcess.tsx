import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Container } from '@/components'
import { PATHS } from '@/routes/paths'
import {
  IoArrowBack,
  IoBarcodeOutline,
  IoPrintOutline,
  IoCubeOutline,
  IoCarOutline
} from 'react-icons/io5'
import { ProcessTracker } from '@/components/layout/staff/staff-core/processtracker'
import { BreadcrumbPath } from '@/components/layout/staff/operationstaff/breadcrumbpath'

const PACKING_ITEMS = [
  'Lenses (pair)',
  'Frames',
  'Glasses Case',
  'Cleaning Cloth',
  'Documents & Invoices'
]

export default function OperationOrderPackingProcess() {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()
  const [checkedItems, setCheckedItems] = useState<boolean[]>(
    new Array(PACKING_ITEMS.length).fill(false)
  )

  const allChecked = checkedItems.every(Boolean)

  const handleCheck = (index: number) => {
    const newCheckedItems = [...checkedItems]
    newCheckedItems[index] = !newCheckedItems[index]
    setCheckedItems(newCheckedItems)
  }

  const handleFinish = () => {
    if (allChecked) {
      navigate(PATHS.OPERATIONSTAFF.ORDER_DETAIL(orderId || ''), { replace: true })
    }
  }

  return (
    <Container>
      {/* Breadcrumb Path */}
      <BreadcrumbPath paths={['Dashboard', 'Packing Station']} />
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-5">
          <button
            onClick={() => navigate(-1)}
            className="p-3 bg-white hover:bg-neutral-50 rounded-xl shadow-sm transition-all border border-neutral-100"
          >
            <IoArrowBack size={20} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
              <IoCubeOutline className="text-primary-500" /> Packing Station
            </h1>
            <p className="text-sm text-neutral-500 mt-1 font-medium italic opacity-80 uppercase tracking-widest text-[10px]">
              CHECKLIST & PACKAGING WORKFLOW
            </p>
          </div>
        </div>
        <span className="px-6 py-2 bg-amber-100 text-amber-700 border border-amber-200 rounded-full text-xs font-bold uppercase tracking-widest">
          In Progress
        </span>
      </div>

      {/* Progress Tracker */}
      <ProcessTracker />

      <div className="grid grid-cols-12 gap-6">
        {/* Left Column */}
        <div className="col-span-12 lg:col-span-7 space-y-6">
          {/* Scan Section */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-mint-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quét mã đơn hàng</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Mã đơn hàng</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <IoBarcodeOutline className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-mint-500 focus:border-mint-500 bg-gray-50"
                    placeholder="Quét barcode..."
                    defaultValue={orderId}
                  />
                </div>
                <button className="px-4 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors">
                  Xác nhận
                </button>
              </div>
              <div className="mt-2 text-xs text-gray-500">Mã đơn: {orderId || 'REG-001'}</div>
            </div>
          </div>

          {/* Checklist Section */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-mint-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Danh sách đóng gói</h3>
            <div className="space-y-3">
              {PACKING_ITEMS.map((item, index) => (
                <div
                  key={index}
                  className={`flex items-center p-3 border rounded-lg cursor-pointer group transition-colors ${
                    checkedItems[index]
                      ? 'bg-mint-50 border-mint-200'
                      : 'border-gray-100 hover:bg-gray-50'
                  }`}
                  onClick={() => handleCheck(index)}
                >
                  <div className="flex items-center h-5">
                    <input
                      type="checkbox"
                      checked={checkedItems[index]}
                      onChange={() => handleCheck(index)}
                      className="w-5 h-5 text-mint-600 border-gray-300 rounded focus:ring-mint-500 cursor-pointer"
                    />
                  </div>
                  <div className="ml-3 text-sm select-none">
                    <label
                      className={`font-medium cursor-pointer ${checkedItems[index] ? 'text-gray-900' : 'text-gray-700'}`}
                    >
                      {item} <span className="text-red-500">*</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Shipping Info (Conditional Appearance) */}
        <div
          className={`col-span-12 lg:col-span-5 space-y-6 transition-all duration-500 ease-in-out ${allChecked ? 'opacity-100 translate-y-0' : 'opacity-30 translate-y-4 pointer-events-none grayscale'}`}
        >
          {/* Shipping Info */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-mint-200 border-t-4 border-t-mint-400">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <IoCarOutline /> Thông tin vận chuyển
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Đơn vị vận chuyển
                </label>
                <select className="block w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-mint-500 focus:border-mint-500 bg-gray-50">
                  <option>Viettel Post</option>
                  <option>Giao Hàng Nhanh</option>
                  <option>J&T Express</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mã vận đơn</label>
                <div className="p-3 bg-gray-100 rounded-lg font-mono font-medium text-gray-800 tracking-wide text-center border border-gray-200">
                  VTP-1234567890
                </div>
                <div className="mt-1 text-xs text-gray-500 text-right">Tự động tạo</div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <div className="text-sm font-medium text-gray-700 mb-2">Địa chỉ giao hàng</div>
                <div className="text-sm text-gray-900 font-semibold">Van A Nguyen</div>
                <div className="text-sm text-gray-600">+84 90 123 4567</div>
                <div className="text-sm text-gray-600 mt-1">
                  123 Nguyen Hue Street
                  <br />
                  Ho Chi Minh City, 700000
                  <br />
                  Vietnam
                </div>
              </div>

              <button className="w-full py-2.5 bg-blue-100 text-blue-700 rounded-lg font-medium hover:bg-blue-200 transition-colors flex items-center justify-center gap-2">
                <IoPrintOutline size={18} /> In nhãn vận chuyển
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-mint-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin đơn hàng</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Mã đơn:</span>
                <span className="font-medium text-gray-900">{orderId || 'REG-001'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Khách hàng:</span>
                <span className="font-medium text-gray-900">Van A Nguyen</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Loại đơn:</span>
                <span className="font-medium text-gray-900">Thường</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-500">Gọng:</span>
                <span className="font-medium text-gray-900">RayBan Aviator Classic</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex justify-end items-center mt-8 pt-4 border-t border-gray-200">
        <button
          onClick={handleFinish}
          disabled={!allChecked}
          className={`px-6 py-2 rounded-lg font-medium transition-all shadow-lg shadow-mint-200 ${
            allChecked
              ? 'bg-mint-900 text-white hover:bg-mint-600 transform hover:-translate-y-1'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Hoàn thành đóng gói
        </button>
      </div>
    </Container>
  )
}
