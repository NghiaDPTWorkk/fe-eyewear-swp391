import React from 'react'
import { IoPersonCircleOutline } from 'react-icons/io5'

export interface UserData {
  id: string
  name: string
  email: string
  phone: string
  status: 'Active' | 'Inactive' | 'Banned'
  joinDate: string
  totalOrders: number
  totalSpent: number
}

interface UserTableProps {
  users: UserData[]
  selectedUserId: string | null
  onSelectUser: (id: string) => void
}

const statusStyles: Record<UserData['status'], string> = {
  Active: 'bg-green-50 text-green-600 border-green-100',
  Inactive: 'bg-neutral-50 text-neutral-500 border-neutral-200',
  Banned: 'bg-red-50 text-red-600 border-red-100'
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
            <th className="px-6 py-5 text-center">Orders</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-50">
          {users.map((user) => (
            <tr
              key={user.id}
              className={`group hover:bg-neutral-50 transition-colors cursor-pointer ${
                selectedUserId === user.id ? 'bg-indigo-50/40' : ''
              }`}
              onClick={() => onSelectUser(user.id)}
            >
              <td className="px-6 py-6 font-primary">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100 shrink-0">
                    <IoPersonCircleOutline size={24} />
                  </div>
                  <span className="text-sm font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                    {user.name}
                  </span>
                </div>
              </td>
              <td className="px-6 py-6 text-sm font-medium text-neutral-600">{user.email}</td>
              <td className="px-6 py-6 text-sm font-medium text-neutral-600">{user.phone}</td>
              <td className="px-6 py-6">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${statusStyles[user.status]}`}
                >
                  {user.status}
                </span>
              </td>
              <td className="px-6 py-6 text-sm font-medium text-neutral-600">{user.joinDate}</td>
              <td className="px-6 py-6 text-center text-sm font-bold text-gray-900">
                {user.totalOrders}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
