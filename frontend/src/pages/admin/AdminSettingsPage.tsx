import { Container } from '@/components'
import { IoWarningOutline } from 'react-icons/io5'
import { Link, Outlet, useNavigate } from 'react-router-dom'
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
        <Link
          to="/admin/dashboard"
          className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-600 transition hover:border-indigo-200 hover:text-indigo-600"
        >
          Back to dashboard
        </Link>
        <Link
          to="/admin/profile"
          className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-600 transition hover:border-indigo-200 hover:text-indigo-600"
        >
          Admin profile
        </Link>
        <button
          type="button"
          onClick={() => navigate('/admin/support')}
          className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-indigo-700"
        >
          Security support
        </button>
      </div>

      <div className="mb-8 p-5 bg-indigo-50/50 border border-indigo-100 rounded-2xl flex gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0">
          <IoWarningOutline className="text-indigo-600" size={20} />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-indigo-900">Super Admin Access</h4>
          <p className="text-sm text-indigo-800/70 mt-1 leading-relaxed">
            You have <span className="font-semibold text-indigo-900">full system access</span>.
            Changes made here will take effect immediately. Please be cautious when modifying system
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
