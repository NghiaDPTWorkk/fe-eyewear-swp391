import React from 'react'
import { Link } from 'react-router-dom'

export const OrderBreadcrumb: React.FC = () => {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 text-sm mb-2 font-medium">
        <Link
          to="/salestaff/dashboard"
          className="text-neutral-400 hover:text-primary-500 transition-colors"
        >
          Dashboard
        </Link>
        <span className="text-neutral-300">/</span>
        <span className="text-primary-500 font-semibold tracking-wide">Order Management</span>
      </div>
      <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">Order List</h1>
    </div>
  )
}
