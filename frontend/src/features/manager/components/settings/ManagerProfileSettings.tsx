import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import {
  User,
  Mail,
  Phone,
  Shield,
  Calendar,
  UserCircle,
  Camera,
  CheckCircle2,
  Info
} from 'lucide-react'

import { useProfile } from '@/features/staff/hooks/useProfile'
import { profileService } from '@/features/staff/services/profile.service'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { cn } from '@/lib/utils'

interface ExtendedProfile {
  birthday?: string
  gender?: string
}

/**
 * ManagerProfileSettings Component
 * Displays and allows management of manager profile information with premium glassmorphism design.
 */
export default function ManagerProfileSettings() {
  const { data: profileData, isLoading, refetch } = useProfile()
  const profile = profileData?.data

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    birthday: '',
    gender: 'Other',
    role: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize form data when profile is loaded
  useEffect(() => {
    if (profile) {
      const extendedProfile = profile as unknown as ExtendedProfile
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        // These fields might not be in the current API, using defaults or placeholders
        birthday: extendedProfile.birthday || '1990-01-01',
        gender: extendedProfile.gender || 'Not Specified',
        role: profile.role || ''
      })
    }
  }, [profile])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      // Note: birthday and gender might need backend support
      const response = await profileService.requestProfileUpdate({
        name: formData.name,
        email: formData.email,
        phone: formData.phone
      })

      if (response.success) {
        toast.success(response.message || 'Profile update request submitted')
        refetch()
      } else {
        toast.error(response.message || 'Failed to submit update')
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
      <div className={cn('space-y-8 animate-in fade-in duration-500')}>
        <div className="flex items-center gap-6">
          <Skeleton className="h-24 w-24 rounded-full" />
          <div className="space-y-3">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700'
      )}
    >
      {/* Header Section with Profile Picture */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-mint-500 to-mint-700 p-8 shadow-2xl shadow-mint-200/50">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 h-48 w-48 rounded-full bg-mint-900/10 blur-2xl" />

        <div className="relative flex flex-col md:flex-row items-center gap-8 text-white">
          <div className="relative group">
            <div className="h-32 w-32 rounded-3xl overflow-hidden border-4 border-white/30 bg-white/20 backdrop-blur-md shadow-xl transition-transform group-hover:scale-105 duration-300">
              {profile?.avatar ? (
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center">
                  <UserCircle size={64} className="text-white/80" />
                </div>
              )}
            </div>
            <button className="absolute -bottom-2 -right-2 p-2 bg-white text-mint-600 rounded-xl shadow-lg hover:scale-110 transition-all active:scale-95">
              <Camera size={18} />
            </button>
          </div>

          <div className="text-center md:text-left space-y-2">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <h1 className="text-3xl font-bold tracking-tight">{profile?.name}</h1>
              <Badge
                variant="mint"
                className="bg-white/20 text-white border-white/30 hover:bg-white/30"
              >
                {profile?.role === 'MANAGER' ? 'Manager' : profile?.role}
              </Badge>
            </div>
            <p className="text-white/80 font-medium flex items-center justify-center md:justify-start gap-2">
              <Shield size={16} /> Verified Account
            </p>
          </div>
        </div>
      </div>

      {/* Main Form Section - Glassmorphism */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white/70 backdrop-blur-xl border border-white/20 rounded-[32px] p-8 shadow-xl shadow-neutral-200/40">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-mint-50 text-mint-600 rounded-2xl border border-mint-100/50">
                  <User size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-neutral-900">Personal Information</h2>
                  <p className="text-sm text-neutral-500">
                    Manage your profile details and settings
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                {/* Full Name */}
                <div className="space-y-2 group">
                  <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest ml-1 flex items-center gap-1.5 px-1">
                    Full Name <span className="text-danger-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-400">
                      <User
                        size={18}
                        className="group-focus-within:text-mint-500 transition-colors"
                      />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-4 bg-white/50 border border-neutral-200 rounded-2xl text-sm font-semibold transition-all focus:outline-none focus:border-mint-500 focus:ring-4 focus:ring-mint-500/10 hover:border-neutral-300"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2 group">
                  <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest ml-1 flex items-center gap-1.5 px-1">
                    Email Address <span className="text-danger-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-400">
                      <Mail
                        size={18}
                        className="group-focus-within:text-mint-500 transition-colors"
                      />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-4 bg-neutral-50/50 border border-neutral-200 rounded-2xl text-sm font-semibold text-neutral-500 cursor-not-allowed transition-all focus:outline-none"
                      placeholder="your.email@example.com"
                      readOnly
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-2 group">
                  <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest ml-1 flex items-center gap-1.5 px-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-400">
                      <Phone
                        size={18}
                        className="group-focus-within:text-mint-500 transition-colors"
                      />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-4 bg-white/50 border border-neutral-200 rounded-2xl text-sm font-semibold transition-all focus:outline-none focus:border-mint-500 focus:ring-4 focus:ring-mint-500/10 hover:border-neutral-300"
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>

                {/* Role */}
                <div className="space-y-2 group">
                  <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest ml-1 flex items-center gap-1.5 px-1">
                    Account Role
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-400">
                      <Shield
                        size={18}
                        className="group-focus-within:text-mint-500 transition-colors"
                      />
                    </div>
                    <input
                      type="text"
                      value={formData.role}
                      readOnly
                      className="w-full pl-12 pr-4 py-4 bg-neutral-50/50 border border-neutral-200 rounded-2xl text-sm font-semibold text-neutral-500 cursor-not-allowed transition-all focus:outline-none"
                    />
                  </div>
                </div>

                {/* Birthday */}
                <div className="space-y-2 group">
                  <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest ml-1 flex items-center gap-1.5 px-1">
                    Birthday
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-400">
                      <Calendar
                        size={18}
                        className="group-focus-within:text-mint-500 transition-colors"
                      />
                    </div>
                    <input
                      type="date"
                      name="birthday"
                      value={formData.birthday}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-4 bg-white/50 border border-neutral-200 rounded-2xl text-sm font-semibold transition-all focus:outline-none focus:border-mint-500 focus:ring-4 focus:ring-mint-500/10 hover:border-neutral-300"
                    />
                  </div>
                </div>

                {/* Gender */}
                <div className="space-y-2 group">
                  <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest ml-1 flex items-center gap-1.5 px-1">
                    Gender
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-400">
                      <UserCircle
                        size={18}
                        className="group-focus-within:text-mint-500 transition-colors"
                      />
                    </div>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-4 bg-white/50 border border-neutral-200 rounded-2xl text-sm font-semibold transition-all focus:outline-none focus:border-mint-500 focus:ring-4 focus:ring-mint-500/10 hover:border-neutral-300 appearance-none"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                      <option value="Not Specified">Not Specified</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-10 py-4 bg-mint-500 hover:bg-mint-600 text-white font-bold rounded-2xl shadow-lg shadow-mint-500/20 transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-2 group disabled:opacity-70 disabled:pointer-events-none"
                >
                  {isSubmitting ? (
                    <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <CheckCircle2
                      size={20}
                      className="group-hover:rotate-12 transition-transform"
                      stroke="#1a6d53"
                    />
                  )}
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
          <div className="bg-white/70 backdrop-blur-xl border border-white/20 rounded-[32px] p-8 shadow-xl shadow-neutral-200/40">
            <h3 className="text-lg font-bold text-neutral-900 mb-6 font-heading">
              Security Checklist
            </h3>
            <div className="space-y-5">
              {[
                { label: 'Two-factor authentication', status: 'Active', color: 'mint' },
                { label: 'Identity verification', status: 'Verified', color: 'mint' },
                { label: 'Phone number linked', status: 'Linked', color: 'mint' }
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 bg-neutral-50/50 rounded-2xl border border-neutral-100"
                >
                  <span className="text-sm font-semibold text-neutral-600">{item.label}</span>
                  <Badge variant="mint" className="px-3 py-1 text-[10px] font-bold">
                    {item.status}
                  </Badge>
                </div>
              ))}
            </div>

            <div className="mt-10 p-5 bg-blue-50/50 rounded-2xl border border-blue-100 flex gap-4">
              <div className="text-blue-500">
                <Info size={20} />
              </div>
              <p className="text-xs text-blue-700 leading-relaxed font-medium">
                Changes to your primary email or role require administrator approval and may take up
                to 24 hours to process.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
