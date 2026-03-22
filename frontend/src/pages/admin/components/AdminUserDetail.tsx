import React from 'react'
import ReactDOM from 'react-dom'
import {
  IoPersonCircleOutline,
  IoMailOutline,
  IoCallOutline,
  IoCloseOutline,
  IoLocationOutline,
  IoCalendarOutline
} from 'react-icons/io5'
import type { Customer } from '@/shared/types/customer.types'

interface AdminUserDetailProps {
  isOpen: boolean
  onClose: () => void
  user: Customer | null
  onEdit?: (user: Customer) => void
  onBan?: (id: string) => void
}

const formatDate = (date?: Date | string | null) => {
  if (!date) return '--'
  return new Date(date).toLocaleDateString('vi-VN', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
}

export const AdminUserDetail: React.FC<AdminUserDetailProps> = ({
  isOpen,
  onClose,
  user,
  onEdit,
  onBan
}) => {
  if (!isOpen) return null

  // Fallback if user data is missing but drawer should be open
  const safeUser =
    user ||
    ({
      name: 'Loading user info...',
      email: '---',
      phone: '---',
      isVerified: false,
      address: [],
      hobbies: []
    } as any)

  return ReactDOM.createPortal(
    <>
      {/* Background Overlay - High z-index to cover sidebar */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          zIndex: 999998
        }}
        className="animate-in fade-in duration-300"
      />

      {/* Drawer Container - High z-index to cover sidebar */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          height: '100vh',
          width: '100%',
          maxWidth: '40rem',
          backgroundColor: 'white',
          boxShadow: '-10px 0 30px rgba(0,0,0,0.2)',
          zIndex: 999999,
          display: 'flex',
          flexDirection: 'column'
        }}
        className="animate-in slide-in-from-right duration-500"
      >
        <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900 font-heading">User Details</h3>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-neutral-50 flex items-center justify-center text-neutral-400 hover:text-gray-900 hover:bg-neutral-100 transition-all active:scale-95"
          >
            <IoCloseOutline size={22} />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-8 space-y-10">
          {/* Header Profile */}
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-24 h-24 rounded-full bg-mint-50 flex items-center justify-center text-mint-600 border-2 border-mint-100 shadow-sm">
              <IoPersonCircleOutline size={64} />
            </div>
            <div>
              <h4 className="text-2xl font-bold text-gray-900">{safeUser.name}</h4>
              <p className="text-sm font-medium text-neutral-400">Registered Customer</p>
            </div>
            <span
              className={`px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                safeUser.isVerified
                  ? 'bg-mint-50 text-mint-600 border-mint-100'
                  : 'bg-amber-50 text-amber-600 border-amber-100'
              }`}
            >
              {safeUser.isVerified ? 'Verified Account' : 'Pending Verification'}
            </span>
          </div>

          {/* Detailed Info */}
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-4">
              <h5 className="text-[11px] font-semibold text-neutral-400 uppercase tracking-widest border-b border-neutral-100 pb-2">
                Contact & Account
              </h5>
              <div className="space-y-4">
                <div className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-neutral-50 flex items-center justify-center text-neutral-400 group-hover:bg-mint-50 group-hover:text-mint-600 transition-colors">
                    <IoMailOutline size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-neutral-400 uppercase">
                      Email Address
                    </p>
                    <p className="text-sm font-semibold text-gray-700">{safeUser.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-neutral-50 flex items-center justify-center text-neutral-400 group-hover:bg-mint-50 group-hover:text-mint-600 transition-colors">
                    <IoCallOutline size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-neutral-400 uppercase">Phone Number</p>
                    <p className="text-sm font-semibold text-gray-700">{safeUser.phone || '--'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-neutral-50 flex items-center justify-center text-neutral-400 group-hover:bg-mint-50 group-hover:text-mint-600 transition-colors">
                    <IoCalendarOutline size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-neutral-400 uppercase">Joined Since</p>
                    <p className="text-sm font-semibold text-gray-700">
                      {formatDate(safeUser.createdAt || safeUser.created_at)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Address Section */}
            <div className="space-y-4">
              <h5 className="text-[11px] font-semibold text-neutral-400 uppercase tracking-widest border-b border-neutral-100 pb-2">
                Shipping Addresses
              </h5>
              {safeUser.address && safeUser.address.length > 0 ? (
                <div className="space-y-3">
                  {safeUser.address.map((addr: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-4 bg-neutral-50/50 rounded-2xl border border-neutral-100 space-y-1"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <IoLocationOutline className="text-mint-600" size={14} />
                        <span className="text-[10px] font-bold text-neutral-400 uppercase">
                          Address #{idx + 1}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-gray-700">{addr.street}</p>
                      <p className="text-[11px] text-neutral-500">
                        {addr.ward}, {addr.city}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs italic text-neutral-400">No addresses saved</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-6">
            <button
              onClick={() => onEdit?.(safeUser)}
              className="w-full py-4 bg-mint-900 text-white rounded-2xl text-sm font-bold shadow-xl shadow-mint-100/50 hover:bg-mint-600 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <IoPersonCircleOutline size={20} />
              Edit User Profile
            </button>
            <button
              onClick={() => onBan?.(safeUser._id || safeUser.id)}
              className="w-full py-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold border border-red-100 hover:bg-red-100 transition-all active:scale-95"
            >
              Ban Customer Account
            </button>
          </div>
        </div>
      </div>
    </>,
    document.body
  )
}
