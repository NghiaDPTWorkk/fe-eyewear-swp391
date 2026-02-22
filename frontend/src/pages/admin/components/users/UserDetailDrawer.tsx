import React from 'react'
import {
  IoPersonCircleOutline,
  IoMailOutline,
  IoCallOutline,
  IoCalendarOutline,
  IoCloseOutline
} from 'react-icons/io5'

interface UserData {
  id: string
  name: string
  email: string
  phone: string
  status: 'Active' | 'Inactive' | 'Banned'
  joinDate: string
  totalOrders: number
  totalSpent: number
}

interface UserDetailDrawerProps {
  isOpen: boolean
  onClose: () => void
  user: UserData | null
}

export const UserDetailDrawer: React.FC<UserDetailDrawerProps> = ({ isOpen, onClose, user }) => {
  if (!isOpen || !user) return null

  const statusStyles = {
    Active: 'bg-green-50 text-green-600 border-green-100',
    Inactive: 'bg-neutral-50 text-neutral-500 border-neutral-200',
    Banned: 'bg-red-50 text-red-600 border-red-100'
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
        <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900 font-heading">User Details</h3>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-neutral-50 flex items-center justify-center text-neutral-400 hover:text-gray-900 hover:bg-neutral-100 transition-all"
          >
            <IoCloseOutline size={22} />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-6 space-y-8">
          {/* Avatar & Name */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100 shrink-0">
              <IoPersonCircleOutline size={40} />
            </div>
            <div>
              <h4 className="text-lg font-bold text-gray-900">{user.name}</h4>
              <span
                className={`inline-flex items-center px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusStyles[user.status]}`}
              >
                {user.status}
              </span>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h5 className="text-[11px] font-semibold text-neutral-400 uppercase tracking-widest">
              Contact Information
            </h5>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-neutral-600">
                <IoMailOutline className="text-neutral-400 shrink-0" />
                <span className="font-medium">{user.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-neutral-600">
                <IoCallOutline className="text-neutral-400 shrink-0" />
                <span className="font-medium">{user.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-neutral-600">
                <IoCalendarOutline className="text-neutral-400 shrink-0" />
                <span className="font-medium">Joined {user.joinDate}</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
              <p className="text-[10px] font-semibold text-neutral-400 uppercase mb-1">
                Total Orders
              </p>
              <p className="text-lg font-bold text-gray-900 font-primary">{user.totalOrders}</p>
            </div>
            <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
              <p className="text-[10px] font-semibold text-neutral-400 uppercase mb-1">
                Total Spent
              </p>
              <p className="text-lg font-bold text-gray-900 font-primary">
                ${user.totalSpent.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-4">
            <button className="w-full py-3 bg-indigo-600 text-white rounded-2xl text-sm font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95">
              Edit User
            </button>
            <button className="w-full py-3 bg-neutral-50 text-neutral-600 rounded-2xl text-sm font-semibold border border-neutral-100 hover:bg-neutral-100 transition-all">
              Reset Password
            </button>
            {user.status !== 'Banned' ? (
              <button className="w-full py-3 bg-red-50 text-red-600 rounded-2xl text-sm font-semibold border border-red-100 hover:bg-red-100 transition-all">
                Ban User
              </button>
            ) : (
              <button className="w-full py-3 bg-green-50 text-green-600 rounded-2xl text-sm font-semibold border border-green-100 hover:bg-green-100 transition-all">
                Unban User
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
