import { Container, Button } from '@/shared/components/ui'
import { IoWarningOutline } from 'react-icons/io5'
import { Outlet, useNavigate } from 'react-router-dom'
import {
  ProfileForm,
  PasswordForm,
  NotificationPreferences,
  AccountInfoSidebar
} from '@/features/sales/components/settings'
import { PageHeader } from '@/features/sales/components/common'

export default function AdminSettingsPage() {
  const navigate = useNavigate()

  return (
    <Container className="pt-2 pb-8 px-2 max-w-none">
      <PageHeader
        title="Settings"
        subtitle="Manage your admin account and preferences"
        breadcrumbs={[{ label: 'Home', path: '/admin/dashboard' }, { label: 'Settings' }]}
      />
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Button
          variant="outline"
          onClick={() => navigate('/admin/dashboard')}
          className="px-4 py-2 text-sm font-medium"
        >
          Back to Dashboard
        </Button>
        <Button
          variant="outline"
          onClick={() => navigate('/admin/profile')}
          className="px-4 py-2 text-sm font-medium"
        >
          Admin Profile
        </Button>
        <Button
          variant="solid"
          colorScheme="primary"
          onClick={() => navigate('/admin/support')}
          className="px-4 py-2 text-sm font-medium shadow-sm"
        >
          Security Support
        </Button>
      </div>

      <div className="mb-8 p-6 bg-mint-50/50 border border-mint-100 rounded-3xl flex gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="w-12 h-12 rounded-2xl bg-mint-100 flex items-center justify-center shrink-0">
          <IoWarningOutline className="text-mint-700" size={24} />
        </div>
        <div className="flex-1">
          <h4 className="text-base font-bold text-mint-900 tracking-tight">Super Admin Access</h4>
          <p className="text-sm text-mint-800/80 mt-1 leading-relaxed font-medium">
            You have <span className="font-bold text-mint-900">full system access</span>. Changes
            made here will take effect immediately. Please be cautious when modifying system
            settings.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 px-4">
        {/* Left Main Column */}
        <div className="lg:col-span-8 space-y-8">
          <ProfileForm />
          <PasswordForm />
          <NotificationPreferences />
        </div>

        {/* Right Sidebar Column */}
        <div className="lg:col-span-4">
          <AccountInfoSidebar />
        </div>
      </div>

      <div className="mt-8 px-4">
        <Outlet />
      </div>
    </Container>
  )
}
