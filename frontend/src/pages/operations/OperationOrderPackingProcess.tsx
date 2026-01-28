import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Container } from '@/components'
import { PATHS } from '@/routes/paths'
import {
  IoBarcodeOutline,
  IoPrintOutline,
  IoCubeOutline,
  IoCarOutline,
  IoConstructOutline,
  IoTimeOutline
} from 'react-icons/io5'
import { ArrowLeft } from 'lucide-react'

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
      navigate(PATHS.OPERATIONSTAFF.PRESCRIPTION_ORDERS)
    }
  }

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
        <span className="text-primary-500 font-bold">Packing Station</span>
      </div>

      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-5">
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

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-7 space-y-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-mint-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Scan Order</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Order ID</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <IoBarcodeOutline className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-mint-500 focus:border-mint-500 bg-gray-50 focus:bg-white transition-all"
                    placeholder="Scan barcode..."
                    defaultValue={orderId}
                  />
                </div>
                <button className="px-4 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-all hover:shadow-md active:scale-95">
                  Confirm
                </button>
              </div>
              <div className="mt-2 text-xs text-gray-500">Order ID: {orderId || 'REG-001'}</div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-mint-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Packing List</h3>
            <div className="space-y-3">
              {PACKING_ITEMS.map((item, index) => (
                <div
                  key={index}
                  className={`flex items-center p-3 border rounded-lg cursor-pointer group transition-all duration-200 ${
                    checkedItems[index]
                      ? 'bg-mint-50 border-mint-200'
                      : 'border-gray-100 hover:bg-mint-50/30 hover:border-mint-100'
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
                      className={`font-medium cursor-pointer transition-colors ${checkedItems[index] ? 'text-mint-900' : 'text-gray-700 group-hover:text-mint-700'}`}
                    >
                      {item} <span className="text-red-500">*</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          className={`col-span-12 lg:col-span-5 space-y-6 transition-all duration-500 ease-in-out ${allChecked ? 'opacity-100 translate-y-0' : 'opacity-30 translate-y-4 pointer-events-none grayscale'}`}
        >
          <div className="bg-white rounded-lg p-6 shadow-sm border border-mint-200 border-t-4 border-t-mint-400">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <IoCarOutline /> Shipping Information
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Shipping Carrier
                </label>
                <select className="block w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-mint-500 focus:border-mint-500 bg-gray-50 transition-all focus:bg-white">
                  <option>Viettel Post</option>
                  <option>Standard Express</option>
                  <option>J&T Express</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tracking Number
                </label>
                <div className="p-3 bg-mint-50 rounded-lg font-mono font-medium text-mint-900 tracking-wide text-center border border-mint-100">
                  VTP-1234567890
                </div>
                <div className="mt-1 text-xs text-gray-400 text-right">Auto-generated</div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <div className="text-sm font-medium text-gray-700 mb-2">Delivery Address</div>
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

              <button className="w-full py-2.5 bg-mint-100 text-mint-700 rounded-lg font-medium hover:bg-mint-200 transition-all flex items-center justify-center gap-2 active:scale-95">
                <IoPrintOutline size={18} /> Print Shipping Label
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-mint-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Information</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Order ID:</span>
                <span className="font-medium text-gray-900">{orderId || 'REG-001'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Customer:</span>
                <span className="font-medium text-gray-900">Van A Nguyen</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Order Type:</span>
                <span className="font-medium text-gray-900">Regular</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-500">Frame:</span>
                <span className="font-medium text-gray-900">RayBan Aviator Classic</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end items-center mt-8 pt-4 border-t border-gray-200">
        <button
          onClick={handleFinish}
          disabled={!allChecked}
          className={`px-8 py-3 rounded-xl font-bold transition-all shadow-lg ${
            allChecked
              ? 'bg-mint-600 text-white hover:bg-mint-700 hover:shadow-mint-200 transform hover:-translate-y-1 active:scale-95'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
          }`}
        >
          Complete Packing
        </button>
      </div>
    </Container>
  )
}
