import { useState, useEffect } from 'react'
import { Card, Input, Button } from '@/shared/components/ui'
import { User as UserIcon, Check, Mail, Phone } from 'lucide-react'
import type { User } from '@/shared/types'
import { useAuthStore } from '@/store'
import { toast } from 'react-hot-toast'

interface PersonalInfoSectionProps {
  user: User | null
}

export const PersonalInfoSection = ({ user }: PersonalInfoSectionProps) => {
  const { updateProfile } = useAuthStore()
  const [isUpdating, setIsUpdating] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    gender: 'N'
  })

  // Sync state with user data
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        gender: (user.gender as any) || 'N'
      })
    }
  }, [user])

  const handleUpdate = async () => {
    // Basic validations
    const name = formData.name.trim()
    const phone = formData.phone.trim()

    if (!name) {
      toast.error('Full name cannot be empty')
      return
    }

    if (name.length < 2) {
      toast.error('Full name must be at least 2 characters long')
      return
    }

    if (phone) {
      // Vietnamese phone number regex: starts with 0 or 84, followed by 9 digits
      const phoneRegex = /^(0|84)(3|5|7|8|9)([0-9]{8})$/
      if (!phoneRegex.test(phone)) {
        toast.error('Invalid phone number format (e.g. 0912345678)')
        return
      }
    }

    setIsUpdating(true)
    try {
      await updateProfile({
        ...formData,
        name,
        phone
      })
      toast.success('Profile updated successfully!')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile')
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <Card className="p-10 !rounded-[24px] shadow-sm border-mint-100">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-mint-50 flex items-center justify-center text-primary-500 border border-mint-100 shadow-sm shadow-mint-50/50">
          <UserIcon size={20} />
        </div>
        <h3 className="text-xl font-bold text-mint-1200">Personal information</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        {/* Full Name */}
        <div className="flex flex-col gap-2 md:col-span-2">
          <label className="text-sm font-semibold text-mint-1100 ml-1">Full name *</label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter your full name"
            className="bg-white border-mint-200 focus:border-primary-500 rounded-xl h-14"
            rightElement={
              formData.name && <Check className="w-5 h-5 text-primary-500 animate-in fade-in" />
            }
          />
        </div>

        {/* Email - Read Only */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-mint-1100 ml-1">E-mail address</label>
          <Input
            value={user?.email || ''}
            isDisabled
            placeholder="Email address"
            className="bg-neutral-50 border-neutral-200 rounded-xl h-14 text-neutral-400 cursor-not-allowed"
            leftElement={<Mail size={18} className="text-neutral-300" />}
          />
          <p className="text-[10px] text-neutral-400 mt-1 ml-1">
            Email cannot be changed for security reasons.
          </p>
        </div>

        {/* Phone Number */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-mint-1100 ml-1">Phone number</label>
          <Input
            value={formData.phone || ''}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="Enter your phone number"
            className="bg-white border-mint-200 focus:border-primary-500 rounded-xl h-14"
            leftElement={<Phone size={18} className="text-mint-400" />}
            rightElement={formData.phone && <Check className="w-5 h-5 text-primary-500" />}
          />
        </div>

        {/* Gender Selection */}
        <div className="flex flex-col gap-2 md:col-span-2">
          <label className="text-sm font-semibold text-mint-1100 ml-1">Gender</label>
          <div className="flex flex-wrap gap-4 mt-1">
            {[
              { id: 'M', label: 'Male' },
              { id: 'F', label: 'Female' },
              { id: 'N', label: 'Other' }
            ].map((option) => (
              <label
                key={option.id}
                className={`flex-1 min-w-[100px] flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                  formData.gender === option.id
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-mint-100 bg-white text-mint-900 hover:border-mint-200'
                }`}
              >
                <input
                  type="radio"
                  name="gender"
                  value={option.id}
                  checked={formData.gender === option.id}
                  onChange={() => setFormData({ ...formData, gender: option.id })}
                  className="hidden"
                />
                <span className="font-bold text-sm tracking-wide">{option.label}</span>
                {formData.gender === option.id && <Check size={16} className="text-primary-500" />}
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-10 pt-6 border-t border-mint-50">
        <Button
          onClick={handleUpdate}
          isLoading={isUpdating}
          className="bg-primary-500 hover:bg-primary-600 text-white px-10 h-14 rounded-xl font-bold uppercase tracking-widest text-sm shadow-xl shadow-primary-500/20 active:scale-[0.98] transition-all"
        >
          Save Changes
        </Button>
      </div>
    </Card>
  )
}
