import React from 'react'

export function OrderSummary({ orderId }: { orderId?: string }) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-mint-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
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
          <span className="text-gray-500">Sdt:</span>
          <span className="font-medium text-gray-900">+84 xx xxx1 567</span>
        </div>
      </div>
    </div>
  )
}
