import { useProfile } from '@/features/staff/hooks/useProfile'
import { Card } from '@/shared/components'

/**
 * ProfileForm Component
 * Displays profile information as read-only
 */
export default function ProfileForm() {
  const { data: profileData, isLoading } = useProfile()
  const profile = profileData?.data

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
    <Card className="p-8 border-none shadow-sm shadow-neutral-200/50">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-semibold text-neutral-900">Profile Information</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-widest pl-1">
            Full Name
          </label>
          <input
            type="text"
            value={profile?.name || ''}
            readOnly
            className="w-full px-4 py-3 bg-neutral-100 border border-neutral-200 rounded-xl text-sm font-medium text-neutral-500 cursor-default focus:outline-none"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-widest pl-1">
            Role
          </label>
          <input
            type="text"
            value={profile?.role === 'SALE_STAFF' ? 'Sales Staff' : profile?.role || ''}
            readOnly
            className="w-full px-4 py-3 bg-neutral-100 border border-neutral-200 rounded-xl text-sm font-medium text-neutral-500 cursor-default focus:outline-none"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-widest pl-1">
            Email
          </label>
          <input
            type="email"
            value={profile?.email || ''}
            readOnly
            className="w-full px-4 py-3 bg-neutral-100 border border-neutral-200 rounded-xl text-sm font-medium text-neutral-500 cursor-default focus:outline-none"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-widest pl-1">
            Phone
          </label>
          <input
            type="text"
            value={profile?.phone || ''}
            readOnly
            className="w-full px-4 py-3 bg-neutral-100 border border-neutral-200 rounded-xl text-sm font-medium text-neutral-500 cursor-default focus:outline-none"
          />
        </div>
      </div>
    </Card>
  )
}
