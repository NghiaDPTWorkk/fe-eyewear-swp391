import { Card, Input, Button } from '@/components'
import { Lock, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

export const ChangePasswordSection = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  return (
    <Card className="p-10 !rounded-[24px]">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 border border-orange-100/50">
          <Lock size={20} />
        </div>
        <h3 className="text-xl font-bold text-mint-1200">Change password</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 max-w-4xl">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-eyewear ml-1">Current password *</label>
          <Input
            type={showCurrentPassword ? 'text' : 'password'}
            placeholder="••••••••"
            className="bg-white border-primary-500 rounded-xl h-14"
            rightElement={
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="p-2 hover:bg-neutral-50 rounded-full transition-colors text-gray-400 hover:text-primary-500"
              >
                {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            }
          />
        </div>

        <div className="hidden md:block" />

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-eyewear ml-1">New password *</label>
          <Input
            type={showNewPassword ? 'text' : 'password'}
            placeholder="••••••••"
            className="bg-white border-primary-500 rounded-xl h-14"
            rightElement={
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="p-2 hover:bg-neutral-50 rounded-full transition-colors text-gray-400 hover:text-primary-500"
              >
                {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            }
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-eyewear ml-1">
            Confirm new password *
          </label>
          <Input
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="••••••••"
            className="bg-white border-primary-500 rounded-xl h-14"
            rightElement={
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="p-2 hover:bg-neutral-50 rounded-full transition-colors text-gray-400 hover:text-primary-500"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            }
          />
        </div>
      </div>

      <div className="mt-10">
        <Button className="bg-primary-500 hover:bg-primary-600 text-white px-8 h-12 rounded-lg font-bold uppercase tracking-wider text-sm shadow-md shadow-primary-100">
          Update Password
        </Button>
      </div>
    </Card>
  )
}
