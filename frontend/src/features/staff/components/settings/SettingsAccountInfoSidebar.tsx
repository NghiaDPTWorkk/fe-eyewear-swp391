import { useState } from 'react'
import { useProfile } from '@/features/staff/hooks/useProfile'
import { Card, Button } from '@/shared/components/ui-core'
import ConfirmationModal from '@/shared/components/ui-core/confirm-modal/ConfirmationModal'
import { toast } from 'react-hot-toast'
import {
  IoStorefrontOutline,
  IoCalendarOutline,
  IoTimeOutline,
  IoGlobeOutline,
  IoTrashOutline
} from 'react-icons/io5'
import { CustomSelect } from '@/shared/components/ui-core/select/CustomSelect'

export default function AccountInfoSidebar() {
  const { data: profileData, isLoading } = useProfile()
  const profile = profileData?.data
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const handleDeleteAccount = () => {
    setIsDeleteModalOpen(false)
    toast.success(
      () => (
        <div className="flex flex-col gap-1">
          <p className="font-bold text-slate-900">Request Submitted</p>
          <p className="text-xs text-slate-500 font-medium">
            Your account deletion is waiting for Admin approval.
          </p>
        </div>
      ),
      {
        duration: 6000,
        icon: (
          <div className="w-10 h-10 rounded-full bg-mint-50 flex items-center justify-center text-mint-600 shadow-sm border border-mint-100 flex-shrink-0 animate-bounce">
            <IoTimeOutline size={20} />
          </div>
        ),
        style: {
          borderRadius: '24px',
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(226, 232, 240, 0.8)',
          boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
          padding: '16px 20px',
          maxWidth: '400px'
        }
      }
    )
  }

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
                <p className="text-sm font-semibold text-neutral-700">
                  {profile?.role === 'SALE_STAFF' ? 'Main Store' : 'Central Office'}
                </p>
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

      {/* System Settings */}
      <Card className="p-8 border-none shadow-sm shadow-neutral-200/50">
        <h3 className="text-[11px] font-medium text-neutral-500 uppercase tracking-widest mb-8">
          System
        </h3>
        <div className="space-y-6">
          <CustomSelect
            label="Language"
            icon={<IoGlobeOutline size={18} />}
            value="English"
            options={[
              { value: 'English', label: 'English', icon: <span className="text-[10px]">EN</span> },
              {
                value: 'Vietnamese',
                label: 'Vietnamese (Tiếng Việt)',
                icon: <span className="text-[10px]">VN</span>
              }
            ]}
            onChange={() => {}}
          />

          <CustomSelect
            label="Timezone"
            icon={<IoTimeOutline size={18} />}
            value="UTC-5"
            options={[
              { value: 'UTC-5', label: 'UTC-5 (EST)' },
              { value: 'UTC+7', label: 'UTC+7 (ICT) - Saigon' },
              { value: 'UTC+0', label: 'UTC+0 (GMT)' }
            ]}
            onChange={() => {}}
          />

          <CustomSelect
            label="Date Format"
            icon={<IoCalendarOutline size={18} />}
            value="MM/DD/YYYY"
            options={[
              { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
              { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
              { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' }
            ]}
            onChange={() => {}}
          />
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="p-8 border border-red-100 shadow-sm shadow-red-50 bg-white rounded-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
            <IoTrashOutline className="text-red-600" size={20} />
          </div>
          <h3 className="text-lg font-semibold text-red-700">Danger Zone</h3>
        </div>
        <p className="text-sm text-red-600/70 mb-8 font-normal leading-relaxed">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <Button
          variant="solid"
          colorScheme="danger"
          onClick={() => setIsDeleteModalOpen(true)}
          className="w-full h-11 rounded-xl font-semibold shadow-md shadow-rose-100 hover:shadow-rose-200 transition-all active:scale-95 bg-rose-600 hover:bg-rose-700 border-none px-6 cursor-pointer"
        >
          Delete Account
        </Button>
      </Card>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteAccount}
        title="Delete Your Account?"
        message="Are you absolutely sure? This will submit a permanent deletion request for your staff account. This action is IRREVERSIBLE and requires Admin/Manager approval before final execution."
        confirmText="Request Deletion"
        cancelText="Keep Account"
        type="danger"
      />
    </div>
  )
}
