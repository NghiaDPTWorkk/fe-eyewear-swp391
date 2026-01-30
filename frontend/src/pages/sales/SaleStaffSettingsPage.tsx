import { Container, Card, Button } from '@/components'
import {
  IoSearchOutline,
  IoNotificationsOutline,
  IoWarningOutline,
  IoSaveOutline,
  IoEyeOutline,
  IoStorefrontOutline,
  IoCalendarOutline,
  IoTimeOutline,
  IoGlobeOutline,
  IoTrashOutline
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

        {/* Right Sidebar Column */}
        <div className="lg:col-span-4 space-y-8">
          <Card className="p-8 border-none shadow-sm shadow-neutral-200/50 bg-white">
            <h3 className="text-[11px] font-semibold text-neutral-500 uppercase tracking-widest mb-8">
              Account Info
            </h3>

            <div className="flex items-center gap-4 mb-8 p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
              <div className="w-12 h-12 rounded-xl bg-primary-100/50 text-primary-600 flex items-center justify-center font-semibold text-lg border border-primary-200/50">
                SN
              </div>
              <div>
                <h3 className="text-sm font-semibold text-neutral-900">Staff Name</h3>
                <p className="text-[10px] font-medium text-primary-600 uppercase tracking-wider mt-0.5">
                  ID: #STF-2024-001
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-[10px] font-semibold text-neutral-500 uppercase tracking-widest mb-2.5 px-1">
                  Account Status
                </p>
                <span className="px-4 py-1.5 bg-primary-50 text-primary-600 text-[11px] font-semibold rounded-full uppercase tracking-wider border border-primary-100 shadow-sm shadow-primary-50">
                  Active
                </span>
              </div>

              <div className="pt-4 border-t border-neutral-50 space-y-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-neutral-50 flex items-center justify-center shrink-0 border border-neutral-100">
                    <IoStorefrontOutline className="text-neutral-500" size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-neutral-500 uppercase tracking-widest mb-0.5">
                      Store Location
                    </p>
                    <p className="text-sm font-semibold text-neutral-700">Downtown Branch #4</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-neutral-50 flex items-center justify-center shrink-0 border border-neutral-100">
                    <IoCalendarOutline className="text-neutral-500" size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-neutral-500 uppercase tracking-widest mb-0.5">
                      Member Since
                    </p>
                    <p className="text-sm font-semibold text-neutral-700">January 1, 2024</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-neutral-50 flex items-center justify-center shrink-0 border border-neutral-100">
                    <IoTimeOutline className="text-neutral-500" size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-neutral-500 uppercase tracking-widest mb-0.5">
                      Last Login
                    </p>
                    <p className="text-sm font-semibold text-neutral-700 leading-tight">
                      Jan 15, 2026
                      <br />
                      <span className="text-[11px] text-neutral-400">09:00 AM</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-primary-50/30 rounded-2xl border border-primary-100/50">
                <p className="text-[10px] font-semibold text-primary-600 uppercase tracking-widest mb-2 px-1">
                  Session Security
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-neutral-600">Timeout</span>
                  <span className="text-xs font-semibold text-primary-600 bg-white px-2 py-0.5 rounded-lg border border-primary-100">
                    30m
                  </span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-8 border-none shadow-sm shadow-neutral-200/50">
            <h3 className="text-[11px] font-semibold text-neutral-500 uppercase tracking-widest mb-8">
              System
            </h3>
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-widest pl-1">
                  Language
                </label>
                <div className="relative">
                  <select className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-100 rounded-xl text-sm font-medium text-neutral-700 appearance-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all cursor-pointer">
                    <option>English</option>
                    <option>Vietnamese</option>
                  </select>
                  <IoGlobeOutline
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500"
                    size={18}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-widest pl-1">
                  Timezone
                </label>
                <div className="relative">
                  <select className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-100 rounded-xl text-sm font-medium text-neutral-700 appearance-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all cursor-pointer">
                    <option>UTC-5 (EST)</option>
                    <option>UTC+7 (ICT)</option>
                  </select>
                  <IoTimeOutline
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500"
                    size={18}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-widest pl-1">
                  Date Format
                </label>
                <div className="relative">
                  <select className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-100 rounded-xl text-sm font-medium text-neutral-700 appearance-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all cursor-pointer">
                    <option>MM/DD/YYYY</option>
                    <option>DD/MM/YYYY</option>
                  </select>
                  <IoCalendarOutline
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500"
                    size={18}
                  />
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-8 border border-red-100 shadow-sm shadow-red-50 bg-red-50/10 rounded-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
                <IoTrashOutline className="text-red-600" size={20} />
              </div>
              <h3 className="text-lg font-semibold text-red-700">Danger Zone</h3>
            </div>
            <p className="text-sm text-red-600/70 mb-8 font-medium leading-relaxed">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <Button
              variant="solid"
              colorScheme="danger"
              className="w-full h-11 rounded-xl font-semibold shadow-md shadow-red-200 hover:shadow-red-300 transition-all active:scale-95 bg-red-600 hover:bg-red-700 border-none px-6"
            >
              Delete Account
            </Button>
          </Card>
        </div>
      </div>
    </Container>
  )
}
