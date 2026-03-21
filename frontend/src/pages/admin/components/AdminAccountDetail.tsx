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

  return ReactDOM.createPortal(
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.4)',
          backdropFilter: 'blur(2px)',
          zIndex: 99998
        }}
      />
      <div
        style={{
          position: 'fixed',
          right: 0,
          top: 0,
          height: '100vh',
          width: '100%',
          maxWidth: '40rem',
          zIndex: 99999
        }}
        className="bg-white shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col"
      >
        <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900 font-heading">Staff Details</h3>
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
              {staff.avatar ? (
                <img
                  src={staff.avatar}
                  alt={staff.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <IoPersonCircleOutline size={40} />
              )}
            </div>
            <div>
              <h4 className="text-lg font-bold text-gray-900">{staff.name}</h4>
              <span
                className={`inline-flex items-center px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getRoleStyles(staff.role)}`}
              >
                {staff.role}
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
                <span className="font-medium">{staff.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-neutral-600">
                <IoCallOutline className="text-neutral-400 shrink-0" />
                <span className="font-medium">{staff.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-neutral-600">
                <IoShieldCheckmarkOutline className="text-neutral-400 shrink-0" />
                <span className="font-medium">Last active: {staff.lastLogin}</span>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-semibold text-neutral-400 uppercase mb-1">
                  Account Active
                </p>
                <p className="text-lg font-bold text-gray-900 font-primary">{staff.citizenId}</p>
              </div>
              <div
                className={`w-3 h-3 rounded-full ${
                  staff.createdAt ? 'bg-green-500 animate-pulse' : 'bg-neutral-300'
                }`}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-4">
            <button
              onClick={() => onEditStaff?.(staff)}
              className="w-full py-3 bg-mint-900 text-white rounded-2xl text-sm font-bold shadow-lg shadow-indigo-100 hover:bg-mint-600 transition-all active:scale-95"
            >
              Edit Staff
            </button>
            <button
              onClick={() => onChangeRole?.(staff)}
              className="w-full py-3 bg-neutral-50 text-neutral-600 rounded-2xl text-sm font-semibold border border-neutral-100 hover:bg-neutral-100 transition-all"
            >
              Change Role
            </button>
            <button
              onClick={() => onDeactivate?.(staff.id)}
              className="w-full py-3 bg-red-50 text-red-600 rounded-2xl text-sm font-semibold border border-red-100 hover:bg-red-100 transition-all"
            >
              Deactivate Account
            </button>
          </div>
        </div>
      </div>
    </>,
    document.body
  )
}
