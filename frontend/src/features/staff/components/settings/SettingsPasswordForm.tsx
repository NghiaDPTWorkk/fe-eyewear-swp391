import { IoShieldCheckmarkOutline } from 'react-icons/io5'

import { Card, Button } from '@/components'

/**
 * PasswordForm Component
 * Security settings for password update
 */
export default function PasswordForm() {
  return (
    <Card className="p-8 border-none shadow-sm shadow-neutral-200/50">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-semibold text-neutral-900">Security & Password</h3>
      </div>
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-widest pl-1">
            Current Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 focus:bg-white transition-all"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-widest pl-1">
              New Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 focus:bg-white transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-widest pl-1">
              Confirm New Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 focus:bg-white transition-all"
            />
          </div>
        </div>
      </div>
      <div className="mt-8 flex justify-end">
        <Button
          variant="solid"
          colorScheme="primary"
          leftIcon={<IoShieldCheckmarkOutline size={18} />}
          className="h-11 rounded-xl font-semibold px-6 bg-primary-500 hover:bg-primary-600 shadow-md shadow-primary-100 transition-all active:scale-95 border-none"
        >
          Update Password
        </Button>
      </div>
    </Card>
  )
}
