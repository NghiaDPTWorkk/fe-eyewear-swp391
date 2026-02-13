import { useEffect } from 'react'
import { useAuthStore } from '@/store'
import {
  PersonalInfoSection,
  ChangePasswordSection,
  ContactPreferencesSection
} from '@/components/layout/customer/account/settings'
import { LazyPage } from '@/pages/LazyPage'
import type { User } from '@/shared/types'

export function AccountSettingsPage() {
  const { user, fetchProfile, isLoading, error } = useAuthStore()
  const currentUser = user as User | null

  useEffect(() => {
    if (!user && !isLoading && !error) {
      fetchProfile()
    }
  }, [user, isLoading, fetchProfile, error])

  if (isLoading && !user) {
    return <LazyPage children={<div></div>} />
  }

  return (
    <div className="flex flex-col gap-8 pb-20">
      <div>
        <h2 className="text-[32px] font-bold text-mint-1200 mb-8">Account settings</h2>
        <PersonalInfoSection user={currentUser} />
      </div>

      <ChangePasswordSection />

      <ContactPreferencesSection />
    </div>
  )
}
