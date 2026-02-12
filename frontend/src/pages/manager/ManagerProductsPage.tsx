import React, { useState } from 'react'
import { Container } from '@/components'
import { PageHeader } from '@/features/sales/components/common'
import { useNavigate } from 'react-router-dom'
import {
  IoSearchOutline,
  IoRefreshOutline,
  IoAddOutline,
  IoTrendingUpOutline,
  IoTrendingDownOutline,
  IoCubeOutline,
  IoShirtOutline,
  IoSparklesOutline,
  IoAlertCircleOutline,
  IoChevronBackOutline,
  IoChevronForwardOutline
} from 'react-icons/io5'

// Toggle Switch Component
const ToggleSwitch: React.FC<{ checked: boolean; onChange: () => void }> = ({
  checked,
  onChange
}) => (
  <button
    onClick={(e) => {
      e.stopPropagation()
      onChange()
    }}
    className={`w-10 h-5 rounded-full transition-all duration-300 relative ${
      checked ? 'bg-mint-500' : 'bg-neutral-200'
    }`}
  >
    <div
      className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all duration-300 ${
        checked ? 'left-6' : 'left-1'
      }`}
    />
  </button>
)

// Summary Card Component
const SummaryCard: React.FC<{
  label: string
  value: string
  percent: string
  isUp: boolean
  icon: React.ReactNode
  iconBg: string
  iconColor: string
}> = ({ label, value, percent, isUp, icon, iconBg, iconColor }) => (
  <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm hover:shadow-md transition-all">
    <div className="flex justify-between items-start mb-6">
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg} ${iconColor}`}
        >
          {React.cloneElement(icon as React.ReactElement<any>, { size: 20 })}
        </div>
        <span className="text-xs font-semibold text-neutral-400 line-clamp-1">{label}</span>
      </div>
      <div
        className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold ${
          isUp ? 'bg-mint-50 text-mint-600' : 'bg-red-50 text-red-600'
        }`}
      >
        {isUp ? <IoTrendingUpOutline /> : <IoTrendingDownOutline />}
        {percent}
      </div>
    </div>
    <div className="mt-4">
      <h3 className="text-3xl font-bold text-gray-900 font-primary leading-tight mb-4">{value}</h3>
      <p className="text-[10px] font-medium text-neutral-400 capitalize">
        From Jan 01 - Jul 30, 2024
      </p>
    </div>
  </div>
)

export default function ManagerProductsPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [products, setProducts] = useState([
    { id: '1', name: 'Rompi Berkancing', price: 119.99, stock: 25, sold: 320, active: true },
    { id: '2', name: 'Casual Blazer', price: 89.5, stock: 12, sold: 150, active: true },
    { id: '3', name: 'Silk Scarf', price: 45.0, stock: 48, sold: 89, active: false },
    { id: '4', name: 'Leather Boots', price: 199.0, stock: 8, sold: 210, active: true },
    { id: '5', name: 'Vintage Shades', price: 155.0, stock: 15, sold: 45, active: true }
  ])

  const toggleProduct = (id: string) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p)))
  }

  return (
    <Container className="pt-2 pb-8 px-2 max-w-[1600px] mx-auto space-y-8">
      <div className="px-4">
        <PageHeader
          title="Inventory"
          subtitle="Manage and track all store product inventory."
          breadcrumbs={[{ label: 'Dashboard', path: '/manager/dashboard' }, { label: 'Products' }]}
        />
      </div>

      {/* Summary Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 px-4">
        <SummaryCard
          label="Total Products"
          value="23"
          percent="24.5%"
          isUp={true}
          icon={<IoCubeOutline />}
          iconBg="bg-mint-50"
          iconColor="text-mint-600"
        />
        <SummaryCard
          label="Sunglasses"
          value="231"
          percent="4.5%"
          isUp={false}
          icon={<IoSparklesOutline />}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
        />
        <SummaryCard
          label="Eyeglasses"
          value="1200"
          percent="4.5%"
          isUp={false}
          icon={<IoShirtOutline />}
          iconBg="bg-purple-50"
          iconColor="text-purple-600"
        />
        <SummaryCard
          label="Stock Alerts"
          value="1200"
          percent="24.5%"
          isUp={true}
          icon={<IoAlertCircleOutline />}
          iconBg="bg-orange-50"
          iconColor="text-orange-600"
        />
      </div>

      <div className="bg-white rounded-[32px] border border-neutral-100 shadow-sm mx-4 overflow-hidden">
        {/* Minimalist Dashboard Header from Image */}
        <div className="p-8 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
              Product List
            </p>
            <div className="flex items-baseline gap-3">
              <h2 className="text-4xl font-bold text-gray-900 font-primary">390</h2>
              <span className="text-xs font-bold text-mint-500">+12</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <IoSearchOutline
                className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search product..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-64 pl-12 pr-4 py-3 bg-neutral-50/50 border border-neutral-100 rounded-2xl text-[13px] font-medium focus:outline-none focus:ring-4 focus:ring-mint-500/10 focus:border-mint-500 transition-all"
              />
            </div>
            <button className="w-12 h-12 flex items-center justify-center bg-neutral-50 rounded-2xl text-neutral-400 hover:text-gray-900 transition-all">
              <IoRefreshOutline size={20} />
            </button>
            <button
              onClick={() => navigate('/manager/products/add')}
              className="hidden md:flex items-center gap-2 px-6 py-3 bg-mint-600 text-white rounded-2xl text-sm font-bold shadow-xl shadow-mint-100/50 hover:bg-mint-700 transition-all active:scale-95"
            >
              <IoAddOutline size={20} />
              Add Product
            </button>
          </div>
        </div>

        {/* Minimalist Table matching the requested Image */}
        <div className="overflow-x-auto p-2">
          <table className="w-full text-left border-collapse">
            <thead className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">
              <tr>
                <th className="px-8 py-8 w-1/3">Product Info</th>
                <th className="px-6 py-8 text-center">Price</th>
                <th className="px-6 py-8 text-center">Stock</th>
                <th className="px-6 py-8 text-center">Sold</th>
                <th className="px-8 py-8 text-center w-24">Active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {products.map((p) => (
                <tr key={p.id} className="group hover:bg-neutral-50/30 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-neutral-50 border border-neutral-100 flex items-center justify-center text-neutral-400 shrink-0">
                        <IoCubeOutline size={22} />
                      </div>
                      <span className="text-[15px] font-bold text-gray-900 group-hover:text-mint-600 transition-colors">
                        {p.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-center text-sm font-semibold text-gray-700">
                    ${p.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-6 text-center text-sm font-semibold text-gray-700">
                    {p.stock}
                  </td>
                  <td className="px-6 py-6 text-center text-sm font-bold text-gray-900">
                    {p.sold}
                  </td>
                  <td className="px-8 py-6 text-center">
                    <ToggleSwitch checked={p.active} onChange={() => toggleProduct(p.id)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Minimalist Pagination/Footer */}
        <div className="p-8 border-t border-neutral-50 flex items-center justify-between">
          <p className="text-xs font-semibold text-neutral-400 uppercase tracking-widest">
            Showing 1-{products.length} of 390 Products
          </p>
          <div className="flex items-center gap-2">
            <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-neutral-100 text-neutral-400 hover:text-mint-600 transition-all">
              <IoChevronBackOutline />
            </button>
            <div className="flex gap-1">
              <button className="w-10 h-10 rounded-xl bg-mint-500 text-white text-xs font-bold shadow-lg shadow-mint-100">
                1
              </button>
              <button className="w-10 h-10 rounded-xl bg-white text-neutral-400 text-xs font-bold hover:bg-neutral-50">
                2
              </button>
              <button className="w-10 h-10 rounded-xl bg-white text-neutral-400 text-xs font-bold hover:bg-neutral-50">
                3
              </button>
            </div>
            <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-neutral-100 text-neutral-400 hover:text-mint-600 transition-all">
              <IoChevronForwardOutline />
            </button>
          </div>
        </div>
      </div>
    </Container>
  )
}
