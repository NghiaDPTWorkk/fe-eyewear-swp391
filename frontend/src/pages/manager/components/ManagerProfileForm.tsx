import React, { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { IoShieldCheckmarkOutline, IoInformationCircleOutline } from 'react-icons/io5'

import { useProfile } from '@/features/staff/hooks/useProfile'
import { profileService } from '@/features/staff/services/profile.service'
import { Card, Button } from '@/shared/components/ui-core'

export default function ManagerProfileForm() {
  const { data: profileData, isLoading, refetch } = useProfile()
  const profile = profileData?.data

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

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

  const getRoleDisplay = (role?: string) => {
    if (!role) return ''
    switch (role) {
      case 'MANAGER':
        return 'Manager'
      case 'SALE_STAFF':
        return 'Sales Staff'
      default:
        return role.replace('_', ' ')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

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
          <h3 className="text-xl font-bold text-slate-800 tracking-tight">Profile Information</h3>
          <p className="text-xs text-slate-400 font-medium mt-1 uppercase tracking-widest">
            Request changes to your profile
          </p>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-bold text-primary-600 bg-primary-50 px-3 py-1.5 rounded-full border border-primary-100 uppercase tracking-widest">
          <IoInformationCircleOutline size={14} /> Approval Required
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {}
        <input type="text" style={{ display: 'none' }} aria-hidden="true" />
        <input type="email" style={{ display: 'none' }} aria-hidden="true" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest pl-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 transition-all focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 cursor-pointer"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest pl-1">
              Role
            </label>
            <input
              type="text"
              value={getRoleDisplay(profile?.role)}
              readOnly
              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-semibold text-slate-400 cursor-not-allowed focus:outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest pl-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 transition-all focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 cursor-pointer"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest pl-1">
              Phone
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 transition-all focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 cursor-pointer"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            isLoading={isSubmitting}
            className="h-11 rounded-xl font-semibold px-6 bg-primary-500 hover:bg-primary-600 shadow-md shadow-primary-100 transition-all active:scale-95 border-none"
            leftIcon={<IoShieldCheckmarkOutline size={18} />}
          >
            Submit Update Request
          </Button>
        </div>
      </form>
    </Card>
  )
}
