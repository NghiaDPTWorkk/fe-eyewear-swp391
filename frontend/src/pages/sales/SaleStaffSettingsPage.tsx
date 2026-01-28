import { Container, Card, Button } from '@/components'
import { Link } from 'react-router-dom'
import {
  IoWarningOutline,
  IoSaveOutline,
  IoEyeOutline,
  IoLockClosedOutline,
  IoTrashOutline,
  IoGlobeOutline,
  IoTimeOutline,
  IoCalendarOutline,
  IoStorefrontOutline
} from 'react-icons/io5'
import { useState } from 'react'

export default function SaleStaffSettingsPage() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)

  return (
    <Container>
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm mb-2 font-medium">
          <Link
            to="/salestaff/dashboard"
            className="text-neutral-400 hover:text-primary-500 transition-colors"
          >
            Home
          </Link>
          <span className="text-neutral-300">/</span>
          <span className="text-primary-500 font-semibold">Settings</span>
        </div>
        <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">Settings</h1>
        <p className="text-neutral-500 mt-1 font-medium">Manage your account and preferences</p>
      </div>

      <div className="mb-8 p-5 bg-amber-50/50 border border-amber-100 rounded-2xl flex gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
          <IoWarningOutline className="text-amber-600" size={20} />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-amber-900">Profile Update Approval Required</h4>
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
          {/* Profile Information */}
          <Card className="p-8 border-none shadow-sm shadow-neutral-200/50">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-semibold text-neutral-900">Profile Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-widest pl-1">
                  Full Name
                </label>
                <input
                  type="text"
                  defaultValue="Staff Name"
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-xl text-sm font-medium text-neutral-900 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 focus:bg-white transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-widest pl-1">
                  Role
                </label>
                <input
                  type="text"
                  defaultValue="Operations Staff"
                  readOnly
                  className="w-full px-4 py-3 bg-neutral-100 border border-neutral-200 rounded-xl text-sm font-medium text-neutral-400 cursor-not-allowed"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-widest pl-1">
                  Email
                </label>
                <input
                  type="email"
                  defaultValue="staff@opspanel.com"
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-xl text-sm font-medium text-neutral-900 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 focus:bg-white transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-widest pl-1">
                  Phone
                </label>
                <input
                  type="text"
                  defaultValue="+1 (555) 123-4567"
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-xl text-sm font-medium text-neutral-900 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 focus:bg-white transition-all"
                />
              </div>
            </div>
            <div className="mt-8 flex justify-end">
              <Button
                variant="solid"
                colorScheme="primary"
                leftIcon={<IoSaveOutline size={18} />}
                className="h-11 rounded-xl font-semibold px-6 bg-primary-500 hover:bg-primary-600 shadow-md shadow-primary-100 transition-all active:scale-95 border-none"
              >
                Submit for Approval
              </Button>
            </div>
          </Card>

          {/* Change Password */}
          <Card className="p-8 border-none shadow-sm shadow-neutral-200/50">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center">
                <IoLockClosedOutline className="text-neutral-500" size={20} />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900">Change Password</h3>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-widest pl-1">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    placeholder="Enter current password"
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-xl text-sm font-medium text-neutral-900 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 focus:bg-white transition-all"
                  />
                  <button
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-primary-600 transition-colors"
                  >
                    <IoEyeOutline size={18} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-widest pl-1">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      placeholder="Enter new password"
                      className="w-full px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-xl text-sm font-medium text-neutral-900 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 focus:bg-white transition-all"
                    />
                    <button
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-primary-600 transition-colors"
                    >
                      <IoEyeOutline size={18} />
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-widest pl-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-xl text-sm font-medium text-neutral-900 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="p-4 bg-primary-50/50 rounded-xl text-xs font-medium text-primary-700 border border-primary-100 leading-relaxed">
                Password must be at least 8 characters and include uppercase, lowercase, number, and
                special character.
              </div>
            </div>
            <div className="mt-8 flex justify-end">
              <Button
                variant="solid"
                colorScheme="primary"
                className="h-11 rounded-xl font-semibold px-8 bg-primary-500 hover:bg-primary-600 shadow-md shadow-primary-100 transition-all active:scale-95 border-none"
              >
                Update Password
              </Button>
            </div>
          </Card>

          {/* Notification Preferences */}
          <Card className="p-8 border-none shadow-sm shadow-neutral-200/50">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-semibold text-neutral-900">Notification Preferences</h3>
            </div>

            <div className="space-y-8">
              <div>
                <h4 className="text-[11px] font-semibold text-neutral-500 uppercase tracking-widest mb-4 pl-1">
                  Email Notifications
                </h4>
                <div className="space-y-3">
                  {['New Order Received', 'Return Request Submitted', 'Priority Order Alert'].map(
                    (pref) => (
                      <label
                        key={pref}
                        className="flex justify-between items-center p-4 bg-neutral-50/50 rounded-xl border border-neutral-100 hover:border-primary-200 hover:bg-primary-50/20 transition-all cursor-pointer group"
                      >
                        <span className="text-sm font-semibold text-neutral-700 group-hover:text-neutral-900">
                          {pref}
                        </span>
                        <input
                          type="checkbox"
                          defaultChecked
                          className="w-5 h-5 rounded-lg border-neutral-300 text-primary-600 focus:ring-primary-500 transition-all cursor-pointer"
                        />
                      </label>
                    )
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-[11px] font-semibold text-neutral-500 uppercase tracking-widest mb-4 pl-1">
                  Push Notifications
                </h4>
                <div className="space-y-3">
                  {['New Order Received', 'Return Request Submitted', 'Priority Order Alert'].map(
                    (pref, i) => (
                      <label
                        key={pref}
                        className="flex justify-between items-center p-4 bg-neutral-50/50 rounded-xl border border-neutral-100 hover:border-primary-200 hover:bg-primary-50/20 transition-all cursor-pointer group"
                      >
                        <span className="text-sm font-semibold text-neutral-700 group-hover:text-neutral-900">
                          {pref}
                        </span>
                        <input
                          type="checkbox"
                          defaultChecked={i !== 0}
                          className="w-5 h-5 rounded-lg border-neutral-300 text-primary-600 focus:ring-primary-500 transition-all cursor-pointer"
                        />
                      </label>
                    )
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <Button
                variant="solid"
                colorScheme="primary"
                leftIcon={<IoSaveOutline size={18} />}
                className="h-11 rounded-xl font-semibold px-8 bg-primary-500 hover:bg-primary-600 shadow-md shadow-primary-100 transition-all active:scale-95 border-none"
              >
                Save Preferences
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Sidebar Column */}
        <div className="lg:col-span-4 space-y-8">
          <Card className="p-8 border-none shadow-sm shadow-neutral-200/50 bg-white">
            <h3 className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest mb-8">
              Account Info
            </h3>

            <div className="flex items-center gap-4 mb-8 p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
              <div className="w-12 h-12 rounded-xl bg-primary-100/50 text-primary-600 flex items-center justify-center font-bold text-lg border border-primary-200/50">
                SN
              </div>
              <div>
                <h3 className="text-sm font-bold text-neutral-900">Staff Name</h3>
                <p className="text-[10px] font-bold text-primary-600 uppercase tracking-wider mt-0.5">
                  ID: #STF-2024-001
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-2.5 px-1">
                  Account Status
                </p>
                <span className="px-4 py-1.5 bg-primary-50 text-primary-600 text-[11px] font-bold rounded-full uppercase tracking-wider border border-primary-100 shadow-sm shadow-primary-50">
                  Active
                </span>
              </div>

              <div className="pt-4 border-t border-neutral-50 space-y-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-neutral-50 flex items-center justify-center shrink-0 border border-neutral-100">
                    <IoStorefrontOutline className="text-neutral-500" size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-0.5">
                      Store Location
                    </p>
                    <p className="text-sm font-bold text-neutral-700">Downtown Branch #4</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-neutral-50 flex items-center justify-center shrink-0 border border-neutral-100">
                    <IoCalendarOutline className="text-neutral-500" size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-0.5">
                      Member Since
                    </p>
                    <p className="text-sm font-bold text-neutral-700">January 1, 2024</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-neutral-50 flex items-center justify-center shrink-0 border border-neutral-100">
                    <IoTimeOutline className="text-neutral-500" size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-0.5">
                      Last Login
                    </p>
                    <p className="text-sm font-bold text-neutral-700 leading-tight">
                      Jan 15, 2026
                      <br />
                      <span className="text-[11px] text-neutral-400">09:00 AM</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-primary-50/30 rounded-2xl border border-primary-100/50">
                <p className="text-[10px] font-bold text-primary-600 uppercase tracking-widest mb-2 px-1">
                  Session Security
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-neutral-600">Timeout</span>
                  <span className="text-xs font-bold text-primary-600 bg-white px-2 py-0.5 rounded-lg border border-primary-100">
                    30m
                  </span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-8 border-none shadow-sm shadow-neutral-200/50">
            <h3 className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest mb-8">
              System
            </h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest pl-1">
                  Language
                </label>
                <div className="relative">
                  <select className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-100 rounded-xl text-sm font-bold text-neutral-700 appearance-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all cursor-pointer">
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
                <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest pl-1">
                  Timezone
                </label>
                <div className="relative">
                  <select className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-100 rounded-xl text-sm font-bold text-neutral-700 appearance-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all cursor-pointer">
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
                <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest pl-1">
                  Date Format
                </label>
                <div className="relative">
                  <select className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-100 rounded-xl text-sm font-bold text-neutral-700 appearance-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all cursor-pointer">
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
              <h3 className="text-lg font-bold text-red-700">Danger Zone</h3>
            </div>
            <p className="text-sm text-red-600/70 mb-8 font-medium leading-relaxed">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <Button
              variant="solid"
              colorScheme="danger"
              className="w-full h-11 rounded-xl font-bold shadow-md shadow-red-200 hover:shadow-red-300 transition-all active:scale-95 bg-red-600 hover:bg-red-700 border-none px-6"
            >
              Delete Account
            </Button>
          </Card>
        </div>
      </div>
    </Container>
  )
}
