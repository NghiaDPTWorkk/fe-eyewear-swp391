import React from 'react'
import { IoPersonOutline, IoGlassesOutline, IoCalendarOutline } from 'react-icons/io5'
import { Button, Card } from '@/shared/components/ui-core'

interface OrderDetailsSidebarProps {
  order: any
}

export const OrderDetailsSidebar: React.FC<OrderDetailsSidebarProps> = ({ order }) => {
  return (
    <Card className="p-5 border border-gray-200 shadow-sm rounded-xl bg-white">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium text-slate-800 text-sm">Order Details</h3>
        <Button
          variant="ghost"
          colorScheme="neutral"
          className="text-slate-400 text-[10px] font-medium hover:text-mint-600 hover:bg-mint-50/50 transition-all uppercase tracking-widest px-2 h-7"
        >
          Modify
        </Button>
      </div>
      <div className="space-y-4">
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
            <IoPersonOutline className="text-gray-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Customer</p>
            <p className="text-sm font-medium text-gray-900">
              {order.customerName || order.invoice?.fullName || 'N/A'}
            </p>
            <p className="text-[10px] text-gray-400">
              {order.customerPhone || order.invoice?.phone || 'N/A'}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
            <IoGlassesOutline className="text-gray-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Product</p>
            <p className="text-sm font-medium text-gray-900">
              {order.products?.[0]?.product?.product_name || 'N/A'}
            </p>
            <p className="text-[10px] text-gray-400">
              SKU: {order.products?.[0]?.product?.sku || 'N/A'}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
            <IoCalendarOutline className="text-gray-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Timeline</p>
            <p className="text-sm font-medium text-gray-900">
              {order.createdAt ? new Date(order.createdAt).toLocaleString() : 'N/A'}
            </p>
          </div>
        </div>
      </div>
    </Card>
  )
}
