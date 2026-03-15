import { useRef } from 'react'
import { useProfile } from '../../hooks/useProfile'
import { Card, Button } from '@/shared/components/ui'
import {
  IoMailOutline,
  IoCallOutline,
  IoIdCardOutline,
  IoTimeOutline,
  IoCalendarOutline,
  IoCameraOutline,
  IoShieldCheckmarkOutline
} from 'react-icons/io5'
import toast from 'react-hot-toast'

interface StaffProfileContentProps {
  onEdit?: () => void
  showSystemActivity?: boolean
}

export const StaffProfileContent = ({
  onEdit,
  showSystemActivity = true
}: StaffProfileContentProps) => {
  const { data: profileData, isLoading } = useProfile()
  const profile = profileData?.data
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      toast.success('Image selected: ' + file.name + '. Admin approval required to update.')
      console.log('Selected file:', file)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="w-12 h-12 border-4 border-mint-500/20 border-t-mint-500 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12 items-stretch">
      {}
      <Card className="lg:col-span-4 p-8 border-none shadow-xl shadow-slate-200/40 bg-white rounded-[32px] flex flex-col items-center relative overflow-hidden group h-full">
        <div className="absolute top-0 left-0 w-full h-32 bg-mint-50/50 -z-0" />

        <div className="relative mt-8 mb-6">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleImageUpload}
          />
          <div className="w-32 h-32 rounded-[40px] border-4 border-white shadow-2xl overflow-hidden bg-mint-100 flex items-center justify-center text-4xl font-semibold text-mint-600 relative z-10 transition-transform duration-500 group-hover:scale-105">
            {profile?.avatar ? (
              <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
            ) : null}
            <span className="absolute inset-0 flex items-center justify-center opacity-80 tracking-tighter -z-10">
              {profile?.name
                ?.split(' ')
                .filter(Boolean)
                .map((n: string) => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2)}
            </span>
          </div>
          <button
            onClick={handleImageClick}
            className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-2xl shadow-lg border border-slate-100 flex items-center justify-center text-slate-500 hover:text-mint-600 transition-all z-20 hover:scale-110 active:scale-95 cursor-pointer"
          >
            <IoCameraOutline size={20} />
          </button>
        </div>

        <div className="text-center relative z-10 space-y-2">
          <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">{profile?.name}</h2>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-mint-50 text-mint-600 rounded-full text-[10px] font-semibold uppercase tracking-widest border border-mint-100 shadow-sm">
            <IoShieldCheckmarkOutline size={14} />
            {profile?.role?.replace('_', ' ')}
          </div>
        </div>

        <div className="w-full mt-10 pt-10 border-t border-slate-50 space-y-6">
          <div className="flex items-center gap-4 group/item">
            <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover/item:bg-mint-50 group-hover/item:text-mint-600 transition-all border border-slate-50">
              <IoMailOutline size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-0.5">
                Email Address
              </p>
              <p className="text-sm font-semibold text-slate-700 truncate">{profile?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 group/item">
            <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover/item:bg-mint-50 group-hover/item:text-mint-600 transition-all border border-slate-50">
              <IoCallOutline size={20} />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-0.5">
                Phone Number
              </p>
              <p className="text-sm font-semibold text-slate-700">{profile?.phone}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 group/item">
            <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover/item:bg-mint-50 group-hover/item:text-mint-600 transition-all border border-slate-50">
              <IoIdCardOutline size={20} />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-0.5">
                Citizen ID
              </p>
              <p className="text-sm font-semibold text-slate-700 font-mono tracking-tighter">
                {profile?.citizenId}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {}
      <div className="lg:col-span-8 flex flex-col gap-8">
        {showSystemActivity && (
          <Card className="p-10 border-none shadow-xl shadow-slate-200/40 bg-white rounded-[32px] flex-1 font-sans">
            <h3 className="text-lg font-semibold text-slate-900 tracking-tight mb-8">
              System Activity
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-2 py-4">
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 rounded-[20px] bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100 shadow-sm">
                  <IoCalendarOutline size={28} />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.15em] mb-1.5">
                    Account Created
                  </p>
                  <p className="text-lg font-semibold text-slate-800">{profile?.createdAt}</p>
                  <p className="text-xs text-slate-400 font-medium mt-1">
                    First registered in system
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-5">
                <div className="w-14 h-14 rounded-[20px] bg-mint-50/50 flex items-center justify-center text-mint-600 border border-mint-100 shadow-sm">
                  <IoTimeOutline size={28} />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.15em] mb-1.5">
                    Last System Access
                  </p>
                  <p className="text-lg font-semibold text-slate-800">{profile?.lastLogin}</p>
                  <p className="text-xs text-mint-600 font-medium mt-1">Verified secure session</p>
                </div>
              </div>
            </div>
          </Card>
        )}

        <Card className="p-10 border-none shadow-xl shadow-slate-200/40 bg-white rounded-[32px] overflow-hidden relative flex-1 flex flex-col font-sans">
          <div className="absolute right-0 top-0 w-64 h-64 bg-slate-50 -mr-32 -mt-32 rounded-full opacity-50" />
          <h3 className="text-lg font-semibold text-slate-900 tracking-tight mb-4 relative z-10">
            Professional Summary
          </h3>
          <p className="text-slate-500 leading-relaxed max-w-2xl relative z-10 font-normal flex-1">
            Internal staff profile for the Eyewear Management System. This information is used for
            internal tracking, task assignment, and system auditing purposes. Some fields can only
            be modified by the System Administrator or Branch Manager.
          </p>
          <div className="mt-8 flex gap-4 relative z-10">
            <Button
              variant="outline"
              className="px-8 h-12 rounded-2xl text-xs font-semibold uppercase tracking-widest border-slate-200 text-slate-500 hover:bg-slate-50"
            >
              Download Resume
            </Button>
            {onEdit && (
              <Button
                onClick={onEdit}
                className="px-8 h-12 rounded-2xl text-xs font-semibold uppercase tracking-widest bg-mint-600 hover:bg-mint-700 text-white shadow-lg shadow-mint-100 active:scale-95 transition-all"
              >
                Edit Professional Info
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
