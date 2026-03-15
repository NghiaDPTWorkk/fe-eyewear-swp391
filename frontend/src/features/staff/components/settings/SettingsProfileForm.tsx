import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { IoShieldCheckmarkOutline, IoInformationCircleOutline } from 'react-icons/io5'

import { useProfile } from '@/features/staff/hooks/useProfile'
import { profileService } from '@/features/staff/services/profile.service'
import { Card, Button } from '@/shared/components/ui'

export default function ProfileForm() {
  const { data: profileData, isLoading, refetch } = useProfile()
  const profile = profileData?.data
  const staffRoles = ['SALE_STAFF', 'OPERATION_STAFF', 'MANAGER', 'ADMIN', 'SYSTEM_ADMIN']
  const isStaffRole = !!profile?.role && staffRoles.includes(profile.role)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const formatRole = (roleName?: string) => {
    if (!roleName) return ''
    return roleName
      .toLowerCase()
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || ''
      })
    }
  }, [profile])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isStaffRole) return

    if (!formData.name.trim()) {
      toast.error('Name cannot be empty')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast.error('Invalid email format')
      return
    }

    const phoneRegex = /^(0|84)\d{9,10}$/
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      toast.error('Invalid phone number (should be 10-11 digits)')
      return
    }

    setIsSubmitting(true)
    try {
      const response = await profileService.requestProfileUpdate(formData)
      if (response.success) {
        toast.success(response.message || 'Profile update request submitted for approval')
        refetch()
      } else {
        toast.error(response.message || 'Failed to submit request')
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string }
      toast.error(error.response?.data?.message || error.message || 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <Card className="p-8 border-none shadow-sm shadow-neutral-200/50">
        <div className="animate-pulse space-y-8">
          <div className="h-7 w-48 bg-neutral-200 rounded-lg"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-3">
                <div className="h-3 w-20 bg-neutral-100 rounded"></div>
                <div className="h-12 w-full bg-neutral-50 rounded-xl"></div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-8 border-none shadow-sm shadow-neutral-200/50 bg-white">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-semibold text-slate-800 tracking-tight">
            Profile Information
          </h3>
          <p className="text-xs text-slate-400 font-medium mt-1 uppercase tracking-widest">
            {isStaffRole ? 'Request changes to your profile' : 'View your profile details'}
          </p>
        </div>
        {isStaffRole && (
          <div className="flex items-center gap-2 text-[10px] font-semibold text-mint-600 bg-mint-50 px-3 py-1.5 rounded-full border border-mint-100 uppercase tracking-widest">
            <IoInformationCircleOutline size={14} /> Approval Required
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {}
        <input type="text" style={{ display: 'none' }} aria-hidden="true" />
        <input type="email" style={{ display: 'none' }} aria-hidden="true" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest pl-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              readOnly={!isStaffRole}
              className={`w-full px-4 py-3 border rounded-xl text-sm font-semibold transition-all focus:outline-none ${
                isStaffRole
                  ? 'bg-white border-slate-200 text-slate-700 focus:border-mint-500 focus:ring-4 focus:ring-mint-500/5 cursor-pointer'
                  : 'bg-slate-50 border-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest pl-1">
              Role
            </label>
            <input
              type="text"
              value={formatRole(profile?.role)}
              readOnly
              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-semibold text-slate-400 cursor-not-allowed focus:outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest pl-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              readOnly={!isStaffRole}
              className={`w-full px-4 py-3 border rounded-xl text-sm font-semibold transition-all focus:outline-none ${
                isStaffRole
                  ? 'bg-white border-slate-200 text-slate-700 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 cursor-pointer'
                  : 'bg-slate-50 border-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest pl-1">
              Phone
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              readOnly={!isStaffRole}
              className={`w-full px-4 py-3 border rounded-xl text-sm font-semibold transition-all focus:outline-none ${
                isStaffRole
                  ? 'bg-white border-slate-200 text-slate-700 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 cursor-pointer'
                  : 'bg-slate-50 border-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            />
          </div>
        </div>

        {isStaffRole && (
          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              isLoading={isSubmitting}
              className="h-11 rounded-xl font-semibold px-6 bg-mint-500 hover:bg-mint-600 shadow-md shadow-mint-100 transition-all active:scale-95 border-none"
              leftIcon={<IoShieldCheckmarkOutline size={18} />}
            >
              Submit Update Request
            </Button>
          </div>
        )}
      </form>
    </Card>
  )
}
