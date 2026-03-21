import React from 'react'
import { IoPersonCircleOutline } from 'react-icons/io5'
import type { Customer } from '@/shared/types/customer.types'
import toast from 'react-hot-toast'

interface UserTableProps {
  users: Customer[]
  selectedUserId: string | null
  onSelectUser: (id: string) => void
}

const getStatus = (user: any): 'Active' | 'Inactive' | 'Banned' => {
  if (user.deletedAt || user.deleted_at) return 'Banned'
  if (user.isVerified === false) return 'Inactive'
  return 'Active'
}

const statusStyles: Record<'Active' | 'Inactive' | 'Banned', string> = {
  Active: 'bg-green-50 text-green-600 border-green-100',
  Inactive: 'bg-neutral-50 text-neutral-500 border-neutral-200',
  Banned: 'bg-red-50 text-red-600 border-red-100'
}

const getUserId = (user: any): string => {
  return String(user._id || user.id || '')
}

const getUserCreatedAt = (user: any): any => {
  return user.createdAt || user.created_at || user.createdAtDate
}

const safeFormatDate = (input?: Date | string | null) => {
  if (!input) return '--'
  const date = input instanceof Date ? input : new Date(input)
  if (Number.isNaN(date.getTime())) return '--'
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric'
  }).format(date)
}

export const UserTable: React.FC<UserTableProps> = ({ users, selectedUserId, onSelectUser }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="bg-neutral-50/50 text-[11px] text-neutral-400 font-semibold tracking-widest uppercase border-b border-neutral-50">
          <tr>
            <th className="px-6 py-5">Customer</th>
            <th className="px-6 py-5">Email</th>
            <th className="px-6 py-5">Phone</th>
            <th className="px-6 py-5">Status</th>
            <th className="px-6 py-5">Joined</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-50">
          {users.map((user) => {
            const status = getStatus(user)
            const userId = getUserId(user)
            const createdAt = getUserCreatedAt(user)
            const isSelected = selectedUserId && String(userId) === String(selectedUserId)
            
            return (
              <tr
                key={userId || Math.random().toString()}
                className={`group hover:bg-neutral-50 transition-colors cursor-pointer ${
                  isSelected ? 'bg-mint-50/60 border-l-4 border-l-mint-500' : ''
                }`}
                onClick={() => {
                  console.log('UserTable: Targeting user:', user.name, 'ID:', userId);
                  if (!userId) {
                    toast.error('Fatal: No ID found (_id or id) in user data!');
                    console.error('UserTable: Missing ID in object:', user);
                    return;
                  }
                  onSelectUser(userId);
                }}
              >
                <td className="px-6 py-6 font-primary">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-mint-50 flex items-center justify-center text-mint-600 border border-mint-100 shrink-0">
                      <IoPersonCircleOutline size={24} />
                    </div>
                    <span className={`text-sm font-semibold transition-all border-b border-transparent ${isSelected ? 'text-mint-700 border-mint-700' : 'text-gray-900 group-hover:text-mint-600 group-hover:border-mint-600 underline-offset-4 cursor-pointer font-bold'}`}>
                      {user.name}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-6 text-sm font-medium text-neutral-600">{user.email}</td>
                <td className="px-6 py-6 text-sm font-medium text-neutral-600">
                  {user.phone || 'N/A'}
                </td>
                <td className="px-6 py-6">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${statusStyles[status]}`}
                  >
                    {status}
                  </span>
                </td>
                <td className="px-6 py-6 text-sm font-medium text-neutral-600">
                  {safeFormatDate(createdAt)}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
