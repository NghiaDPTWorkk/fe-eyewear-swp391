import { IoWarningOutline } from 'react-icons/io5'
import {
  ProfileForm,
  PasswordForm,
  NotificationPreferences,
  AccountInfoSidebar
} from '@/features/staff/components/settings'
import { PageHeader } from '@/features/staff/components/common'
import { useProfile } from '@/features/staff/hooks/useProfile'

export default function OperationSettingPage() {
  const { data: profileData, isLoading } = useProfile()
  const profile = profileData?.data

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-emerald-100"></div>
          <div className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <PageHeader
        title="Settings"
        subtitle="Manage your operation staff account and preferences"
        breadcrumbs={[
          { label: 'Dashboard', path: '/operation-staff/dashboard' },
          { label: 'Settings' }
        ]}
      />

      <div className="max-w-[1400px] mx-auto">
        {/* Verification Banner */}
        <div className="mb-8 p-6 bg-gradient-to-r from-amber-50/80 to-orange-50/80 backdrop-blur-md border border-amber-100 rounded-[2rem] flex gap-5 shadow-sm shadow-amber-200/20">
          <div className="w-12 h-12 rounded-2xl bg-white/80 flex items-center justify-center shrink-0 shadow-sm border border-amber-100/50">
            <IoWarningOutline className="text-amber-500" size={24} />
          </div>
          <div className="flex-1">
            <h4 className="text-base font-bold text-amber-900">
              Profile Update Approval Required
            </h4>
            <p className="text-sm text-amber-800/80 mt-1.5 leading-relaxed font-medium">
              To maintain system integrity, all profile changes require{' '}
              <span className="font-bold text-amber-900 underline decoration-amber-300 decoration-2 underline-offset-2">Admin or Manager approval</span> before
              they take effect. Your updates will be securely submitted for review.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-8 h-full">
            <ProfileForm key={profile?._id || 'loading'} />
            <PasswordForm />
            <NotificationPreferences />
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-4 sticky top-8">
            <AccountInfoSidebar />
          </div>
        </div>
      </div>
    </div>
  )
}
