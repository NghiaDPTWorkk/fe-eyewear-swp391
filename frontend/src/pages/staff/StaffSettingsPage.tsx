import { IoWarningOutline } from 'react-icons/io5'

import {
  ProfileForm,
  PasswordForm,
  NotificationPreferences,
  AccountInfoSidebar
} from '@/features/staff/components/settings'
import { PageHeader } from '@/features/staff/components/common'

import { useProfile } from '@/features/staff/hooks/useProfile'

interface StaffSettingsPageProps {
  dashboardPath: string
  roleName: string
}

export default function StaffSettingsPage({
  dashboardPath = '/salestaff/dashboard',
  roleName = 'Staff'
}: StaffSettingsPageProps) {
  const { data: profileData } = useProfile()
  const profile = profileData?.data

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <PageHeader
        title="Settings"
        subtitle={`Manage your ${roleName.toLowerCase()} account and preferences`}
        breadcrumbs={[{ label: 'Dashboard', path: dashboardPath }, { label: 'Settings' }]}
      />

      <div>
        <div className="mb-8 p-5 bg-amber-50/50 border border-amber-100 rounded-2xl flex gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
            <IoWarningOutline className="text-amber-600" size={20} />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-amber-900">
              Profile Update Approval Required
            </h4>
            <p className="text-sm text-amber-800/70 mt-1 leading-relaxed">
              All profile changes require{' '}
              <span className="font-semibold text-amber-900">Admin or Manager approval</span> before
              they take effect. Your updates will be submitted for review and you will be notified
              once approved.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Main Column */}
          <div className="lg:col-span-8 space-y-8">
            <ProfileForm key={profile?._id || 'loading'} />
            <PasswordForm />
            <NotificationPreferences />
          </div>

          {/* Right Sidebar Column */}
          <div className="lg:col-span-4">
            <AccountInfoSidebar />
          </div>
        </div>
      </div>
    </div>
  )
}
