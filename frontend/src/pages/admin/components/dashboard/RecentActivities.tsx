import React, { useEffect, useState } from 'react'
import {
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
  IoTimeOutline,
  IoCreateOutline
} from 'react-icons/io5'
import { profileRequestService } from '@/shared/services/admin/profileRequestService'
import type { ProfileRequest } from '@/shared/types'
import { useNavigate } from 'react-router-dom'

export const RecentActivities: React.FC = () => {
  const navigate = useNavigate()
  const [activities, setActivities] = useState<ProfileRequest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await profileRequestService.getProfileRequests(1, 5)
        if (response.success) {
          setActivities(response.data.profileRequestList)
        }
      } catch (error) {
        console.error('Failed to fetch recent activities:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchActivities()
  }, [])

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'PENDING':
        return {
          icon: <IoTimeOutline size={16} />,
          bg: 'bg-amber-50',
          color: 'text-amber-500',
          label: 'Profile update requested'
        }
      case 'APPROVED':
        return {
          icon: <IoCheckmarkCircleOutline size={16} />,
          bg: 'bg-mint-50',
          color: 'text-mint-600',
          label: 'Profile update approved'
        }
      case 'REJECTED':
        return {
          icon: <IoCloseCircleOutline size={16} />,
          bg: 'bg-red-50',
          color: 'text-red-500',
          label: 'Profile update rejected'
        }
      default:
        return {
          icon: <IoCreateOutline size={16} />,
          bg: 'bg-neutral-50',
          color: 'text-neutral-500',
          label: 'Profile activity'
        }
    }
  }

  return (
    <div className="bg-white p-6 md:p-8 rounded-3xl border border-neutral-100 shadow-sm">
      <div className="flex justify-between items-center mb-8">
        <div>
          <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest mb-1 leading-none">
            Recent Activities
          </p>
          <h3 className="text-lg font-bold text-gray-900 font-primary">Profile Requests</h3>
        </div>
        <button
          onClick={() => navigate('/admin/request-update-profile')}
          className="px-4 py-1.5 bg-neutral-50 rounded-xl text-[11px] font-semibold text-neutral-600 border border-neutral-100 hover:bg-neutral-100 transition-colors"
        >
          View All
        </button>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="py-10 flex flex-col items-center justify-center gap-2">
            <div className="w-8 h-8 border-2 border-mint-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest">
              Loading...
            </p>
          </div>
        ) : activities.length > 0 ? (
          activities.map((activity) => {
            const config = getStatusConfig(activity.status)
            return (
              <div
                key={activity._id}
                onClick={() => navigate(`/admin/request-update-profile/${activity._id}`)}
                className="flex items-center gap-4 p-3 rounded-2xl hover:bg-neutral-50 transition-all group cursor-pointer"
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${config.bg} ${config.color} group-hover:scale-110 transition-transform`}
                >
                  {config.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{config.label}</p>
                  <p className="text-[11px] font-medium text-neutral-400 truncate">
                    By {activity.name} ({activity.email})
                  </p>
                </div>
                <span className="text-[10px] font-semibold text-neutral-400 whitespace-nowrap">
                  {activity.createdAt}
                </span>
              </div>
            )
          })
        ) : (
          <p className="text-sm text-center py-10 text-neutral-400">No recent activities found.</p>
        )}
      </div>
    </div>
  )
}
