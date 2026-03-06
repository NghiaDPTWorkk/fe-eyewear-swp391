import { useState } from 'react'
import { IoShieldCheckmarkOutline } from 'react-icons/io5'
import toast from 'react-hot-toast'

import { profileService } from '@/features/staff/services/profile.service'
import { Card, Button } from '@/shared/components'
import { useLogout } from '@/shared/hooks/useLogout'

/**
 * PasswordForm Component
 * Security settings for password update
 */
export default function PasswordForm() {
  const { handleLogout } = useLogout()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const handleSubmit = async () => {
    // Basic validation
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      toast.error('Please fill in all password fields')
      return
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match')
      return
    }

    if (formData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    try {
      const response = await profileService.changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      })

      if (response.success) {
        toast.success(response.message || 'Password updated successfully. Logging out...')
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
        setTimeout(() => {
          handleLogout()
        }, 1500)
      } else {
        toast.error(response.message || 'Failed to update password')
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Something went wrong'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

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
            value={formData.currentPassword}
            onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
            className="w-full px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 focus:bg-white transition-all cursor-pointer"
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
              value={formData.newPassword}
              onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
              className="w-full px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 focus:bg-white transition-all cursor-pointer"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-widest pl-1">
              Confirm New Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="w-full px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 focus:bg-white transition-all cursor-pointer"
            />
          </div>
        </div>
      </div>
      <div className="mt-8 flex justify-end">
        <Button
          variant="solid"
          colorScheme="primary"
          onClick={handleSubmit}
          isLoading={loading}
          leftIcon={<IoShieldCheckmarkOutline size={18} />}
          className="h-11 rounded-xl font-semibold px-6 bg-mint-500 hover:bg-mint-600 shadow-md shadow-mint-100 transition-all active:scale-95 border-none"
        >
          Update Password
        </Button>
      </div>
    </Card>
  )
}
