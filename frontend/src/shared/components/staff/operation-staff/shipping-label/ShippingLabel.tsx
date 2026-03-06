import { IoCarOutline, IoPrintOutline } from 'react-icons/io5'

export default function ShippingLabel() {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-mint-200 border-t-4 border-t-mint-400">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <IoCarOutline /> Shipping Information
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Method</label>
          <div className="p-3 bg-gray-100 rounded-lg font-mono font-medium text-gray-800 tracking-wide text-center border border-gray-200">
            Viettel Post
          </div>
          <div className="mt-1 text-xs text-gray-500 text-right">Auto generated</div>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <div className="text-sm font-medium text-gray-700 mb-2">Shipping Address</div>
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
          <IoPrintOutline size={18} /> Print Shipping Label
        </button>
      </div>
    </div>
  )
}
