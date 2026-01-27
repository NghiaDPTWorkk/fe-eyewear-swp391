import { Container, Card, Button } from '@/components'
import {
  IoSearchOutline,
  IoNotificationsOutline,
  IoWarningOutline,
  IoSaveOutline,
  IoEyeOutline
} from 'react-icons/io5'

export default function SaleStaffSettingsPage() {
  return (
    <Container>
      {/* Search Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-full max-w-lg">
          <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search orders, customers, products..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary-500/20"
          />
        </div>
        <div className="flex items-center gap-4">
          <IoNotificationsOutline size={20} className="text-neutral-400 cursor-pointer" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px] font-bold">
              AM
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-neutral-900">Anna Morgan</div>
              <div className="text-[10px] text-neutral-400 font-medium">Operations Manager</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-neutral-500">Manage your account and preferences</p>
      </div>

      {/* Alert Banner */}
      <div className="mb-6 p-4 bg-amber-50 border border-amber-100 rounded-xl flex gap-3">
        <IoWarningOutline className="text-amber-500 mt-0.5" size={20} />
        <div>
          <h4 className="text-sm font-bold text-amber-800">Profile Update Approval Required</h4>
          <p className="text-xs text-amber-700/80 mt-1 leading-relaxed">
            All profile changes require <span className="font-bold">Admin or Manager approval</span>{' '}
            before they take effect. Your updates will be submitted for review and you will be
            notified once approved.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left Column - Forms */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Profile Information */}
          <Card className="p-6 border border-neutral-100 shadow-sm">
            <h3 className="text-lg font-bold text-neutral-800 mb-6">Profile Information</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                  Full Name
                </label>
                <input
                  type="text"
                  defaultValue="Staff Name"
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-1 focus:ring-primary-500/20"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                  Role
                </label>
                <input
                  type="text"
                  defaultValue="Operations Staff"
                  readOnly
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-100 rounded-xl text-sm font-medium text-neutral-400 cursor-not-allowed"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                  Email
                </label>
                <input
                  type="email"
                  defaultValue="staff@opspanel.com"
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-1 focus:ring-primary-500/20"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                  Phone
                </label>
                <input
                  type="text"
                  defaultValue="+1 (555) 123-4567"
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-1 focus:ring-primary-500/20"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <Button
                variant="solid"
                colorScheme="primary"
                leftIcon={<IoSaveOutline />}
                className="rounded-xl font-bold px-6"
              >
                Submit for Approval
              </Button>
            </div>
          </Card>

          {/* Change Password */}
          <Card className="p-6 border border-neutral-100 shadow-sm">
            <h3 className="text-lg font-bold text-neutral-800 mb-6">Change Password</h3>
            <div className="space-y-6">
              <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-50">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      placeholder="Enter current password"
                      className="w-full px-4 py-2.5 bg-white border border-neutral-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-1 focus:ring-primary-500/20"
                    />
                    <IoEyeOutline className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 cursor-pointer" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      placeholder="Enter new password"
                      className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-1 focus:ring-primary-500/20"
                    />
                    <IoEyeOutline className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 cursor-pointer" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-1 focus:ring-primary-500/20"
                  />
                </div>
              </div>

              <div className="p-3 bg-blue-50/30 rounded-lg text-[10px] font-medium text-blue-600 border border-blue-50">
                Password must be at least 8 characters and include uppercase, lowercase, number, and
                special character.
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <Button variant="solid" colorScheme="primary" className="rounded-xl font-bold px-6">
                Update Password
              </Button>
            </div>
          </Card>

          {/* Notification Preferences */}
          <Card className="p-6 border border-neutral-100 shadow-sm">
            <h3 className="text-lg font-bold text-neutral-800 mb-6">Notification Preferences</h3>
            <div className="space-y-4">
              <h4 className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-4">
                Email Notifications
              </h4>
              {['New Order Received', 'Return Request Submitted', 'Priority Order Alert'].map(
                (pref) => (
                  <div
                    key={pref}
                    className="flex justify-between items-center p-4 bg-neutral-50/50 rounded-xl border border-neutral-50"
                  >
                    <span className="text-sm font-bold text-neutral-700">{pref}</span>
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-4 h-4 rounded border-neutral-200 text-primary-600 focus:ring-primary-500"
                    />
                  </div>
                )
              )}
            </div>
          </Card>
        </div>

        {/* Right Column - Info & Sidebar */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Account Info */}
          <Card className="p-6 border border-neutral-100 shadow-sm bg-neutral-50/10">
            <h3 className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-6">
              Account Info
            </h3>
            <div className="space-y-6">
              <div>
                <p className="text-[10px] font-bold text-neutral-300 uppercase tracking-wider mb-2">
                  Account Status
                </p>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-500 text-[10px] font-bold rounded-full uppercase">
                  Active
                </span>
              </div>
              <div>
                <p className="text-[10px] font-bold text-neutral-300 uppercase tracking-wider mb-2">
                  Member Since
                </p>
                <p className="text-sm font-bold text-neutral-700">January 1, 2024</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-neutral-300 uppercase tracking-wider mb-2">
                  Last Login
                </p>
                <p className="text-sm font-bold text-neutral-700">January 15, 2026 09:00 AM</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-neutral-300 uppercase tracking-wider mb-2">
                  Session Timeout
                </p>
                <p className="text-sm font-bold text-neutral-700">30 minutes</p>
              </div>
            </div>
          </Card>

          {/* System Settings */}
          <Card className="p-6 border border-neutral-100 shadow-sm bg-neutral-50/10">
            <h3 className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-6">
              System
            </h3>
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-neutral-300 uppercase tracking-wider">
                  Language
                </label>
                <select className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg text-sm font-medium">
                  <option>English</option>
                  <option>Tiếng Việt</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-neutral-300 uppercase tracking-wider">
                  Timezone
                </label>
                <select className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg text-sm font-medium">
                  <option>UTC-5 (EST)</option>
                  <option>UTC+7 (ICT)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-neutral-300 uppercase tracking-wider">
                  Date Format
                </label>
                <select className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg text-sm font-medium">
                  <option>MM/DD/YYYY</option>
                  <option>DD/MM/YYYY</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Danger Zone */}
          <Card className="p-6 border border-red-100 shadow-sm bg-red-50/10">
            <h3 className="text-base font-bold text-red-700 mb-2">Danger Zone</h3>
            <p className="text-xs text-red-600/70 mb-6 font-medium leading-relaxed">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <Button
              variant="solid"
              colorScheme="danger"
              className="w-full rounded-xl font-bold py-3 shadow-lg shadow-red-200"
            >
              Delete Account
            </Button>
          </Card>
        </div>
      </div>
    </Container>
  )
}
