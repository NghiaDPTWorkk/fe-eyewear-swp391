import { useProfile } from '@/features/staff/hooks/useProfile'
import { Card } from '@/shared/components/ui-core'
import {
  IoStorefrontOutline,
  IoCalendarOutline,
  IoTimeOutline,
  IoGlobeOutline
} from 'react-icons/io5'

export default function AccountInfoSidebar() {
  const { data: profileData, isLoading } = useProfile()
  const profile = profileData?.data
  const getInitials = (name: string): string => {
    if (!name) return '??'
    const words = name.trim().split(' ')
    if (words.length === 1) return words[0].substring(0, 2).toUpperCase()
    return (words[0][0] + words[words.length - 1][0]).toUpperCase()
  }

  if (isLoading) {
    return (
      <Card className="p-8 border-none shadow-sm shadow-neutral-200/50 bg-white">
        <div className="animate-pulse space-y-6">
          <div className="h-4 w-24 bg-neutral-100 rounded"></div>
          <div className="flex items-center gap-4 p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
            <div className="w-12 h-12 rounded-xl bg-neutral-200"></div>
            <div className="space-y-2">
              <div className="h-4 w-32 bg-neutral-200 rounded"></div>
              <div className="h-3 w-20 bg-neutral-100 rounded"></div>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      {/* Account Info */}
      <Card className="p-8 border-none shadow-sm shadow-neutral-200/50 bg-white">
        <h3 className="text-[11px] font-medium text-neutral-500 uppercase tracking-widest mb-8">
          Account Info
        </h3>

        <div className="flex items-center gap-4 mb-8 p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
          <div className="w-12 h-12 rounded-xl bg-primary-100/50 text-primary-600 flex items-center justify-center font-semibold text-lg border border-primary-200/50">
            {profile ? getInitials(profile.name) : '??'}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-neutral-900">
              {profile?.name || 'Staff Member'}
            </h3>
            <p className="text-[10px] font-medium text-primary-600 uppercase tracking-wider mt-0.5">
              ID: #{profile?._id.substring(profile._id.length - 8).toUpperCase() || 'STF-XXXX'}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-[10px] font-medium text-neutral-500 uppercase tracking-widest mb-2.5 px-1">
              Account Status
            </p>
            <span className="px-4 py-1.5 bg-green-50 text-green-600 text-[11px] font-medium rounded-full uppercase tracking-wider border border-green-100 shadow-sm shadow-green-50">
              Active
            </span>
          </div>

          <div className="pt-4 border-t border-neutral-50 space-y-4">
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-neutral-50 flex items-center justify-center shrink-0 border border-neutral-100">
                <IoStorefrontOutline className="text-neutral-500" size={16} />
              </div>
              <div>
                <p className="text-[10px] font-medium text-neutral-500 uppercase tracking-widest mb-0.5">
                  Store Location
                </p>
                <p className="text-sm font-semibold text-neutral-700">Downtown Vision</p>
              </div>
            </div>
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-neutral-50 flex items-center justify-center shrink-0 border border-neutral-100">
                <IoCalendarOutline className="text-neutral-500" size={16} />
              </div>
              <div>
                <p className="text-[10px] font-medium text-neutral-500 uppercase tracking-widest mb-0.5">
                  Member Since
                </p>
                <p className="text-sm font-semibold text-neutral-700">
                  {profile?.createdAt || 'N/A'}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-neutral-50 flex items-center justify-center shrink-0 border border-neutral-100">
                <IoTimeOutline className="text-neutral-500" size={16} />
              </div>
              <div>
                <p className="text-[10px] font-medium text-neutral-500 uppercase tracking-widest mb-0.5">
                  Last Login
                </p>
                <p className="text-sm font-semibold text-neutral-700 leading-tight">
                  {profile?.lastLogin || 'Recently'}
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-primary-50/30 rounded-2xl border border-primary-100/50">
            <p className="text-[10px] font-medium text-primary-600 uppercase tracking-widest mb-2 px-1">
              Session Security
            </p>
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-neutral-600">Timeout</span>
              <span className="text-xs font-medium text-primary-600 bg-white px-2 py-0.5 rounded-lg border border-primary-100">
                30m
              </span>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-8 border-none shadow-sm shadow-neutral-200/50 bg-white">
        <h3 className="text-[11px] font-bold text-neutral-900 uppercase tracking-widest mb-5">
          System
        </h3>
        <div className="space-y-5">
          <div className="flex items-center gap-3.5 group">
            <div className="w-9 h-9 rounded-xl bg-neutral-50 flex items-center justify-center shrink-0 border border-neutral-100 transition-colors group-hover:bg-primary-50">
              <IoGlobeOutline className="text-neutral-500 group-hover:text-primary-600" size={16} />
            </div>
            <div>
              <p className="text-[10px] font-medium text-neutral-500 uppercase tracking-widest mb-0.5">
                Language
              </p>
              <p className="text-sm font-semibold text-neutral-700">English</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 group">
            <div className="w-9 h-9 rounded-xl bg-neutral-50 flex items-center justify-center shrink-0 border border-neutral-100 transition-colors group-hover:bg-primary-50">
              <IoTimeOutline className="text-neutral-500 group-hover:text-primary-600" size={16} />
            </div>
            <div>
              <p className="text-[10px] font-medium text-neutral-500 uppercase tracking-widest mb-0.5">
                Timezone
              </p>
              <p className="text-sm font-semibold text-neutral-700">UTC-5 (EST)</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 group">
            <div className="w-9 h-9 rounded-xl bg-neutral-50 flex items-center justify-center shrink-0 border border-neutral-100 transition-colors group-hover:bg-primary-50">
              <IoCalendarOutline
                className="text-neutral-500 group-hover:text-primary-600"
                size={16}
              />
            </div>
            <div>
              <p className="text-[10px] font-medium text-neutral-500 uppercase tracking-widest mb-0.5">
                Date Format
              </p>
              <p className="text-sm font-semibold text-neutral-700">MM/DD/YYYY</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
