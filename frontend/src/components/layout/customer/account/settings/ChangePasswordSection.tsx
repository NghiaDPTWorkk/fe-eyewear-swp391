import { Card, Input, Button } from '@/shared/components/ui'
import { Lock, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { authService } from '@/features/auth/services/auth.service'
import { toast } from 'react-hot-toast'
import { useAuthStore } from '@/store'
import { type User } from '@/shared/types'

export const ChangePasswordSection = () => {
  const user = useAuthStore((state) => state.user) as User | null
  const isLocalLinked = user?.providers?.includes('local') ?? true

  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const handleUpdatePassword = async () => {
    const { oldPassword, newPassword, confirmPassword } = formData

    if (isLocalLinked && !oldPassword) {
      toast.error('Vui lòng nhập mật khẩu cũ')
      return
    }

    if (!newPassword || !confirmPassword) {
      toast.error('Vui lòng nhập đầy đủ thông tin mật khẩu mới')
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error('Mật khẩu mới và xác nhận mật khẩu không khớp')
      return
    }

    if (newPassword.length < 8) {
      toast.error('Mật khẩu mới phải có ít nhất 8 ký tự')
      return
    }

    setIsLoading(true)
    try {
      const payload: { newPassword: string; oldPassword?: string } = { newPassword }
      if (isLocalLinked) {
        payload.oldPassword = oldPassword
      }

      const response = await authService.changePasswordCustomer(payload)

      if (response.success) {
        toast.success(response.message || 'Cập nhật mật khẩu thành công!')
        setFormData({
          oldPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
      } else {
        toast.error(response.message || 'Cập nhật mật khẩu thất bại')
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật mật khẩu'
      toast.error(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="p-10 !rounded-[24px]">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 border border-orange-100/50">
          <Lock size={20} />
        </div>
        <h3 className="text-xl font-bold text-mint-1200">Change password</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 max-w-4xl">
        {isLocalLinked && (
          <>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-eyewear ml-1">
                Current password *
              </label>
              <Input
                type={showCurrentPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={formData.oldPassword}
                onChange={(e) => setFormData({ ...formData, oldPassword: e.target.value })}
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
          </>
        )}

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-eyewear ml-1">New password *</label>
          <Input
            type={showNewPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={formData.newPassword}
            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
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
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
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
        <Button
          onClick={handleUpdatePassword}
          isLoading={isLoading}
          className="bg-primary-500 hover:bg-primary-600 text-white px-8 h-12 rounded-lg font-bold uppercase tracking-wider text-sm shadow-md shadow-primary-100"
        >
          Update Password
        </Button>
      </div>
    </Card>
  )
}
