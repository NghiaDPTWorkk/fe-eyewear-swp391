import { 
  IoPersonOutline, 
  IoMailOutline, 
  IoCallOutline, 
  IoCalendarOutline 
} from 'react-icons/io5'
import type { AdminAccount } from '@/shared/types'

interface ProfileDetailCardProps {
  profile: AdminAccount | undefined
  userInitials: string
  onEditProfile: () => void
  onChangePassword: () => void
}

export default function ProfileDetailCard({ 
  profile, 
  userInitials, 
  onEditProfile, 
  onChangePassword 
}: ProfileDetailCardProps) {
  return (
    <div className="relative overflow-hidden bg-white border border-neutral-100 rounded-[32px] shadow-sm p-8 md:p-10">
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary-50/50 rounded-full blur-3xl opacity-50" />

      <div className="relative flex flex-col md:flex-row items-center gap-8 md:gap-12">
        {/* Avatar Area */}
        <div className="relative group">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white text-4xl md:text-5xl font-bold shadow-2xl shadow-primary-200 border-4 border-white">
            {userInitials}
          </div>
          <div
            className="absolute bottom-2 right-2 w-8 h-8 bg-emerald-500 border-4 border-white rounded-full shadow-lg"
            title="Online"
          />
        </div>

        {/* User Info */}
        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
            <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 tracking-tight">
              {profile?.name}
            </h1>
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary-100 text-primary-700 text-xs font-bold uppercase tracking-widest border border-primary-200 self-center md:self-auto">
              {profile?.role === 'OPERATION_STAFF' ? 'Operation Staff' : profile?.role}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-neutral-500 mb-6">
            <div className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-neutral-50 flex items-center justify-center group-hover:bg-primary-50 transition-colors">
                <IoMailOutline className="w-5 h-5 group-hover:text-primary-500" />
              </div>
              <span className="text-sm font-medium">{profile?.email}</span>
            </div>
            <div className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-neutral-50 flex items-center justify-center group-hover:bg-primary-50 transition-colors">
                <IoCallOutline className="w-5 h-5 group-hover:text-primary-500" />
              </div>
              <span className="text-sm font-medium">{profile?.phone || 'No phone number'}</span>
            </div>
            <div className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-neutral-50 flex items-center justify-center group-hover:bg-primary-50 transition-colors">
                <IoCalendarOutline className="w-5 h-5 group-hover:text-primary-500" />
              </div>
              <span className="text-sm font-medium">
                Joined: {new Date(profile?.createdAt || '').toLocaleDateString('vi-VN')}
              </span>
            </div>
            <div className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-neutral-50 flex items-center justify-center group-hover:bg-primary-50 transition-colors">
                <IoPersonOutline className="w-5 h-5 group-hover:text-primary-500" />
              </div>
              <span className="text-sm font-medium">ID: {profile?.citizenId || 'N/A'}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 w-full md:w-auto">
          <button
            onClick={onEditProfile}
            className="px-6 py-3 bg-neutral-900 text-white rounded-2xl font-semibold hover:bg-neutral-800 transition-all shadow-lg shadow-neutral-200 active:scale-95 cursor-pointer"
          >
            Edit Profile
          </button>
          <button
            onClick={onChangePassword}
            className="px-6 py-3 bg-white text-neutral-600 border border-neutral-200 rounded-2xl font-semibold hover:bg-neutral-50 transition-all active:scale-95 cursor-pointer"
          >
            Change Password
          </button>
        </div>
      </div>
    </div>
  )
}
