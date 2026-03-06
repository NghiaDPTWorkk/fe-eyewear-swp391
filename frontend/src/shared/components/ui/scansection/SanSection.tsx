import { IoBarcodeOutline } from 'react-icons/io5'

export default function SanSection({ orderId }: { orderId?: string }) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-mint-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Scan Order ID</h3>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Order ID:</label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <IoBarcodeOutline className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-120 md:w-80 lg:w-96 pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-mint-500 focus:border-mint-500 bg-gray-50"
              placeholder="Scan barcode..."
              defaultValue={orderId}
            />
          </div>
          {/* <button className="px-4 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors">
            Auto generated
          </button> */}
        </div>
        <div className="mt-2 text-xs text-gray-500">OrderID: {'ex: REG-001'}</div>
      </div>
    </div>
  )
}
