import React from 'react'
import { Container } from '@/components'
import { PageHeader } from '@/features/sales/components/common'
import { IoChevronBackOutline, IoSaveOutline, IoAddOutline, IoTrashOutline } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'

export default function ManagerAddAttributePage() {
  const navigate = useNavigate()

  return (
    <Container className="pt-2 pb-8 px-2 max-w-[1000px] mx-auto space-y-8">
      <div className="px-4">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-neutral-100 rounded-xl transition-colors"
          >
            <IoChevronBackOutline size={24} />
          </button>
          <PageHeader
            title="Add New Attribute"
            subtitle="Define new attributes like Color, Size, or Material for products."
            breadcrumbs={[
              { label: 'Dashboard', path: '/manager/dashboard' },
              { label: 'Products', path: '/manager/products' },
              { label: 'Add Attribute' }
            ]}
          />
        </div>

        <div className="bg-white rounded-[32px] border border-neutral-100 shadow-sm overflow-hidden p-8">
          <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Attribute Name</label>
                <input
                  type="text"
                  placeholder="e.g., Frame Color, Lens Type..."
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-2xl text-[14px] focus:outline-none focus:ring-4 focus:ring-mint-500/10 focus:border-mint-500 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Attribute Code</label>
                <input
                  type="text"
                  placeholder="e.g., frame_color"
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-2xl text-[14px] focus:outline-none focus:ring-4 focus:ring-mint-500/10 focus:border-mint-500 transition-all"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <label className="text-sm font-bold text-gray-700">Attribute Values</label>
                <button className="flex items-center gap-2 text-xs font-bold text-mint-600 hover:text-mint-700 transition-colors">
                  <IoAddOutline size={18} />
                  Add Value
                </button>
              </div>

              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="flex gap-4 items-center animate-in fade-in slide-in-from-top-2 duration-300"
                  >
                    <input
                      type="text"
                      placeholder={`Value ${i} (e.g., Red, Blue...)`}
                      className="flex-1 px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-2xl text-[14px] focus:outline-none focus:ring-4 focus:ring-mint-500/10 focus:border-mint-500 transition-all"
                    />
                    <button className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                      <IoTrashOutline size={20} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 flex gap-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 px-6 py-4 border border-neutral-200 text-gray-700 rounded-2xl text-sm font-bold hover:bg-neutral-50 transition-all active:scale-95"
              >
                Cancel
              </button>
              <button className="flex-[2] px-6 py-4 bg-mint-600 text-white rounded-2xl text-sm font-bold shadow-xl shadow-mint-100/50 hover:bg-mint-700 transition-all active:scale-95 flex items-center justify-center gap-2">
                <IoSaveOutline size={20} />
                Save Attribute
              </button>
            </div>
          </form>
        </div>
      </div>
    </Container>
  )
}
