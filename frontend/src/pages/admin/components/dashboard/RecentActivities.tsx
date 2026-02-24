import React from 'react'
import {
  IoPersonAddOutline,
  IoShieldCheckmarkOutline,
  IoTrashOutline,
  IoKeyOutline,
  IoCreateOutline
} from 'react-icons/io5'

interface Activity {
  id: string
  action: string
  user: string
  time: string
  icon: React.ReactNode
  iconBg: string
  iconColor: string
}

const mockActivities: Activity[] = [
  {
    id: '1',
    action: 'New customer registered',
    user: 'Nguyen Van A',
    time: '2 minutes ago',
    icon: <IoPersonAddOutline size={16} />,
    iconBg: 'bg-indigo-50',
    iconColor: 'text-indigo-500'
  },
  {
    id: '2',
    action: 'Staff role updated',
    user: 'Tran Thi B',
    time: '15 minutes ago',
    icon: <IoShieldCheckmarkOutline size={16} />,
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-500'
  },
  {
    id: '3',
    action: 'Account deactivated',
    user: 'Le Van C',
    time: '1 hour ago',
    icon: <IoTrashOutline size={16} />,
    iconBg: 'bg-red-50',
    iconColor: 'text-red-500'
  },
  {
    id: '4',
    action: 'Password reset requested',
    user: 'Pham Thi D',
    time: '2 hours ago',
    icon: <IoKeyOutline size={16} />,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-500'
  },
  {
    id: '5',
    action: 'Profile updated',
    user: 'Hoang Van E',
    time: '3 hours ago',
    icon: <IoCreateOutline size={16} />,
    iconBg: 'bg-green-50',
    iconColor: 'text-green-500'
  }
]

export const RecentActivities: React.FC = () => {
  return (
    <div className="bg-white p-6 md:p-8 rounded-3xl border border-neutral-100 shadow-sm">
      <div className="flex justify-between items-center mb-8">
        <div>
          <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest mb-1 leading-none">
            Recent Activities
          </p>
          <h3 className="text-lg font-bold text-gray-900 font-primary">System Events</h3>
        </div>
        <button className="px-4 py-1.5 bg-neutral-50 rounded-xl text-[11px] font-semibold text-neutral-600 border border-neutral-100 hover:bg-neutral-100 transition-colors">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {mockActivities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-center gap-4 p-3 rounded-2xl hover:bg-neutral-50 transition-all group cursor-pointer"
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${activity.iconBg} ${activity.iconColor} group-hover:scale-110 transition-transform`}
            >
              {activity.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{activity.action}</p>
              <p className="text-[11px] font-medium text-neutral-400 truncate">{activity.user}</p>
            </div>
            <span className="text-[10px] font-semibold text-neutral-400 whitespace-nowrap">
              {activity.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
