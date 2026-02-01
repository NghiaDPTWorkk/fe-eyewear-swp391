import { useEffect } from 'react'
import { useAuthStore } from '@/store'
import {
  PersonalInfoSection,
  ChangePasswordSection,
  ContactPreferencesSection
} from '@/components/layout/customer/account/settings'
import { LazyPage } from '@/pages/LazyPage'

export function AccountSettingsPage() {
  const { user, fetchProfile, isLoading } = useAuthStore()

  useEffect(() => {
    if (!user && !isLoading) {
      fetchProfile()
    }
  }, [user, isLoading, fetchProfile])

  if (isLoading && !user) {
    return <LazyPage children={<div></div>} />
  }

  return (
    <div className="flex flex-col gap-8 pb-20">
      <div>
        <h2 className="text-[32px] font-bold text-mint-1200 mb-8">Account settings</h2>
        <PersonalInfoSection user={user} />
      </div>

      <ChangePasswordSection />

      <ContactPreferencesSection />
    </div>
  )
}
