/**
 * PasswordForm Component
 * Change password form with visibility toggles
 */
import { useState } from 'react'
import { Card, Button } from '@/components'
import { IoLockClosedOutline, IoEyeOutline } from 'react-icons/io5'

export default function PasswordForm() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)

  return (
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
  )
}
