import React from 'react'
import ReactDOM from 'react-dom'
import {
  IoPersonCircleOutline,
  IoMailOutline,
  IoCallOutline,
  IoShieldCheckmarkOutline,
  IoCloseOutline
} from 'react-icons/io5'
import type { StaffData } from './staff/StaffTable'

interface AdminAccountDetailProps {
  isOpen: boolean
  onClose: () => void
  staff: StaffData | null
  onEditStaff?: (staff: StaffData) => void
  onChangeRole?: (staff: StaffData) => void
  onDeactivate?: (id: string) => void
}

const getRoleStyles = (role: string): string => {
  const normalized = role.toLowerCase()
  if (normalized.includes('sale')) return 'bg-blue-50 text-blue-600 border-blue-100'
  if (normalized.includes('operation')) return 'bg-amber-50 text-amber-600 border-amber-100'
  if (normalized.includes('manager')) return 'bg-purple-50 text-purple-600 border-purple-100'
  if (normalized.includes('customer')) return 'bg-mint-50 text-mint-600 border-mint-100'
  return 'bg-indigo-50 text-indigo-600 border-indigo-100'
}

export const AdminAccountDetail: React.FC<AdminAccountDetailProps> = ({
  isOpen,
  onClose,
  staff,
  onEditStaff,
  onChangeRole,
  onDeactivate
}) => {
  if (!isOpen || !staff) return null

  const isCustomer = staff.role.toLowerCase() === 'customer'

  return ReactDOM.createPortal(
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          zIndex: 999998
        }}
        className="animate-in fade-in duration-300"
      />
      <div
        style={{
          position: 'fixed',
          right: 0,
          top: 0,
          height: '100vh',
          width: '100%',
          maxWidth: '35rem',
          backgroundColor: 'white',
          boxShadow: '-10px 0 30px rgba(0,0,0,0.2)',
          zIndex: 999999,
          display: 'flex',
          flexDirection: 'column'
        }}
        className="animate-in slide-in-from-right duration-500"
      >
        <div className="p-6 border-b border-neutral-100 flex items-center justify-between bg-white sticky top-0 z-20">
          <h3 className="text-xl font-bold text-gray-900 font-heading">
            {isCustomer ? 'User Details' : 'Staff Details'}
          </h3>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-neutral-50 flex items-center justify-center text-neutral-400 hover:text-gray-900 hover:bg-neutral-100 transition-all active:scale-95"
          >
            <IoCloseOutline size={22} />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-8 space-y-10">
          {/* Avatar & Name */}
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-24 h-24 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 border-2 border-indigo-100 shadow-sm overflow-hidden">
              {staff.avatar ? (
                <img
                  src={staff.avatar}
                  alt={staff.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <IoPersonCircleOutline size={64} />
              )}
            </div>
            <div>
              <h4 className="text-2xl font-bold text-gray-900">{staff.name}</h4>
              <span
                className={`inline-flex items-center px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${getRoleStyles(staff.role)}`}
              >
                {staff.role}
              </span>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h5 className="text-[11px] font-semibold text-neutral-400 uppercase tracking-widest border-b border-neutral-100 pb-2">
              Contact Information
            </h5>
            <div className="space-y-4">
              <div className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-neutral-50 flex items-center justify-center text-neutral-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                  <IoMailOutline size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-neutral-400 uppercase">Email Address</p>
                  <p className="text-sm font-semibold text-gray-700">{staff.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-neutral-50 flex items-center justify-center text-neutral-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                  <IoCallOutline size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-neutral-400 uppercase">Phone Number</p>
                  <p className="text-sm font-semibold text-gray-700">{staff.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-neutral-50 flex items-center justify-center text-neutral-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                  <IoShieldCheckmarkOutline size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-neutral-400 uppercase">Last Activity</p>
                  <p className="text-sm font-semibold text-gray-700">{staff.lastLogin}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="p-6 bg-neutral-50/50 rounded-3xl border border-neutral-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">
                  {isCustomer ? 'Member Since' : 'Citizen ID'}
                </p>
                <p className="text-2xl font-bold text-gray-900 font-primary">
                  {isCustomer ? (staff.createdAt || 'New Member') : staff.citizenId}
                </p>
              </div>
              <div
                className={`w-4 h-4 rounded-full border-2 border-white shadow-sm ${
                  staff.createdAt ? 'bg-green-500 shadow-green-100' : 'bg-neutral-300'
                }`}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-6">
            <button
              onClick={() => onEditStaff?.(staff)}
              className="w-full py-4 bg-mint-900 text-white rounded-2xl text-sm font-bold shadow-xl shadow-mint-100/50 hover:bg-mint-600 transition-all active:scale-95"
            >
              {isCustomer ? 'Edit User Profile' : 'Edit Staff Account'}
            </button>
            {!isCustomer && (
              <button
                onClick={() => onChangeRole?.(staff)}
                className="w-full py-4 bg-neutral-50 text-neutral-600 rounded-2xl text-sm font-bold border border-neutral-100 hover:bg-neutral-100 transition-all active:scale-95"
              >
                Modify Access Role
              </button>
            )}
            <button
              onClick={() => onDeactivate?.(staff.id)}
              className="w-full py-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold border border-red-100 hover:bg-red-100 transition-all active:scale-95"
            >
              {isCustomer ? 'Ban Customer Access' : 'Deactivate Staff Access'}
            </button>
          </div>
        </div>
      </div>
    </>,
    document.body
  )
}
