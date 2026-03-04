import React from 'react'
import { IoPersonCircleOutline } from 'react-icons/io5'

export interface StaffData {
  id: string
  name: string
  email: string
  role: string
  status: 'Active' | 'Inactive'
  lastActive: string
  phone: string
  citizenId?: string
  avatar?: string | null
}

interface StaffTableProps {
  staffList: StaffData[]
  selectedStaffId: string | null
  onSelectStaff: (id: string) => void
  onToggleStatus: (id: string) => void
}

const getRoleStyles = (role: string): string => {
  const normalized = role.toLowerCase()
  if (normalized.includes('sale')) return 'bg-blue-50 text-blue-600 border-blue-100'
  if (normalized.includes('operation')) return 'bg-amber-50 text-amber-600 border-amber-100'
  if (normalized.includes('manager')) return 'bg-purple-50 text-purple-600 border-purple-100'
  return 'bg-indigo-50 text-indigo-600 border-indigo-100'
}

export const StaffTable: React.FC<StaffTableProps> = ({
  staffList,
  selectedStaffId,
  onSelectStaff,
  onToggleStatus
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="bg-neutral-50/50 text-[11px] text-neutral-400 font-semibold tracking-widest uppercase border-b border-neutral-50">
          <tr>
            <th className="px-6 py-5">Staff Member</th>
            <th className="px-6 py-5">Email</th>
            <th className="px-6 py-5">Role</th>
            <th className="px-6 py-5">Last Active</th>
            <th className="px-6 py-5 text-center">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-50">
          {staffList.map((staff) => (
            <tr
              key={staff.id}
              className={`group hover:bg-neutral-50 transition-colors cursor-pointer ${
                selectedStaffId === staff.id ? 'bg-indigo-50/40' : ''
              }`}
              onClick={() => onSelectStaff(staff.id)}
            >
              <td className="px-6 py-6 font-primary">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100 shrink-0 overflow-hidden">
                    {staff.avatar ? (
                      <img src={staff.avatar} alt={staff.name} className="w-full h-full object-cover" />
                    ) : (
                      <IoPersonCircleOutline size={24} />
                    )}
                  </div>
                  <span className="text-sm font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                    {staff.name}
                  </span>
                </div>
              </td>
              <td className="px-6 py-6 text-sm font-medium text-neutral-600">{staff.email}</td>
              <td className="px-6 py-6">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${getRoleStyles(staff.role)}`}
                >
                  {staff.role}
                </span>
              </td>
              <td className="px-6 py-6 text-sm font-medium text-neutral-600">{staff.lastActive}</td>
              <td className="px-6 py-6 text-center" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => onToggleStatus(staff.id)}
                  className={`w-10 h-5 rounded-full transition-all duration-300 relative ${
                    staff.status === 'Active' ? 'bg-indigo-500' : 'bg-neutral-200'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all duration-300 ${
                      staff.status === 'Active' ? 'left-6' : 'left-1'
                    }`}
                  />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
