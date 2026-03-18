import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  IoStatsChartOutline,
  IoFileTrayFullOutline,
  IoTimeOutline,
  IoCheckmarkCircleOutline,
  IoAlertCircleOutline
} from 'react-icons/io5'
import { useProfile } from '@/features/staff/hooks/useProfile'
import { useOrderCountStore } from '@/store'
import { Container } from '@/shared/components/ui/container/Container'
import { cn } from '@/lib/utils'
import ProfileDetailCard from '@/components/layout/staff/operation-staff/profile-detail-card/ProfileDetailCard'

export default function OperationPersonalProfile() {
  const { data: profileData, isLoading: isProfileLoading } = useProfile()
  const { counts } = useOrderCountStore()
  const navigate = useNavigate()

  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const profile = profileData?.data

  const userInitials = profile?.name
    ? profile.name
        .split(' ')
        .map((word) => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'OP'

  const stats = [
    {
      label: 'Total Orders Handled',
      value: counts.all,
      icon: <IoFileTrayFullOutline className="w-6 h-6" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      label: 'Completed Tasks',
      value: counts.completed,
      icon: <IoCheckmarkCircleOutline className="w-6 h-6" />,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    },
    {
      label: 'Performance Rate',
      value: '98%',
      icon: <IoStatsChartOutline className="w-6 h-6" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ]

  const activityHistory = [
    {
      id: 1,
      type: 'Order Processed',
      target: '#ORD-2024-1234',
      time: '2024-03-05 09:30 AM',
      status: 'success'
    },
    {
      id: 2,
      type: 'Invoice Generated',
      target: '#INV-2024-5678',
      time: '2024-03-05 10:15 AM',
      status: 'success'
    },
    {
      id: 3,
      type: 'Status Updated',
      target: '#ORD-2024-9012',
      time: '2024-03-04 02:45 PM',
      status: 'warning'
    }
  ]

  if (isProfileLoading) {
    return (
      <Container className="py-8 animate-pulse">
        <div className="h-48 bg-gray-100 rounded-3xl mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-100 rounded-2xl" />
          ))}
        </div>
      </Container>
    )
  }

  return (
    <Container className="py-8 space-y-8">
      {/* Header Section */}
      <ProfileDetailCard
        profile={profile}
        userInitials={userInitials}
        onEditProfile={() => navigate('/operation-staff/settings')}
        onChangePassword={() => navigate('/operation-staff/settings')}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="group bg-white p-6 rounded-[24px] border border-neutral-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={cn('p-4 rounded-2xl', stat.bgColor, stat.color)}>{stat.icon}</div>
              <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">
                +12% vs last month
              </span>
            </div>
            <div>
              <div className="text-2xl font-bold text-neutral-900 mb-1">{stat.value}</div>
              <div className="text-sm font-medium text-neutral-400">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Activity Tracker Section */}
      <div className="bg-white rounded-[32px] border border-neutral-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-neutral-50 bg-neutral-50/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-1">Work Activity Tracker</h2>
            <p className="text-sm text-neutral-500">Track and review your daily performance</p>
          </div>

          {/* Date Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-white p-2 border border-neutral-200 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between sm:justify-start gap-2 px-3">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-tight">
                From
              </span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="text-sm font-semibold text-neutral-900 border-none focus:ring-0 outline-none p-0 cursor-pointer text-right sm:text-left"
              />
            </div>
            <div className="hidden sm:block w-px h-6 bg-neutral-200" />
            <div className="sm:hidden h-px w-full bg-neutral-100" />
            <div className="flex items-center justify-between sm:justify-start gap-2 px-3">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-tight">
                To
              </span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="text-sm font-semibold text-neutral-900 border-none focus:ring-0 outline-none p-0 cursor-pointer text-right sm:text-left"
              />
            </div>
            <button className="w-full sm:w-10 h-10 bg-primary-500 text-white rounded-xl flex items-center justify-center hover:bg-primary-600 transition-colors shadow-lg shadow-primary-200 cursor-pointer">
              <IoStatsChartOutline className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-8">
          <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:ml-[2.25rem] md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-neutral-100 before:to-transparent">
            {activityHistory.map((activity) => (
              <div key={activity.id} className="relative flex items-center gap-6 group">
                <div
                  className={cn(
                    'flex items-center justify-center w-11 h-11 rounded-full border-4 border-white shadow-md z-10 shrink-0',
                    activity.status === 'success'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-amber-500 text-white'
                  )}
                >
                  {activity.status === 'success' ? (
                    <IoCheckmarkCircleOutline className="w-6 h-6" />
                  ) : (
                    <IoAlertCircleOutline className="w-6 h-6" />
                  )}
                </div>
                <div className="flex-1 bg-neutral-50 group-hover:bg-white rounded-[24px] p-5 border border-transparent group-hover:border-neutral-100 group-hover:shadow-lg group-hover:shadow-neutral-100/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-neutral-900 mb-1">{activity.type}</h4>
                    <span className="text-sm font-semibold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-lg border border-primary-100">
                      {activity.target}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-neutral-400">
                      <IoTimeOutline className="w-4 h-4" />
                      <span className="text-xs font-medium">{activity.time}</span>
                    </div>
                    <button className="text-xs font-bold text-neutral-500 hover:text-primary-500 uppercase tracking-widest transition-colors cursor-pointer">
                      Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 pt-8 border-t border-neutral-50 text-center">
            <button className="text-sm font-bold text-neutral-400 hover:text-primary-500 transition-colors uppercase tracking-widest cursor-pointer">
              Load more activity
            </button>
          </div>
        </div>
      </div>
    </Container>
  )
}
