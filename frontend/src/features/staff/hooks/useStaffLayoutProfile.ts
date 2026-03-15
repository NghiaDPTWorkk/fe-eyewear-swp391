import { useProfile } from './useProfile'
import { getInitials } from '@/shared/utils'

export const useStaffLayoutProfile = () => {
  const { data: profileData, isLoading, isError } = useProfile()
  const profile = profileData?.data

  const userName = profile?.name || 'Loading...'
  const userEmail = profile?.email || ''
  const rawRole = profile?.role || ''

  const formatRole = (role?: string) => {
    if (!role) return 'Loading...'
    return role
      .toLowerCase()
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  const userRole = formatRole(rawRole)

  const userInitials = profile?.name ? getInitials(profile.name) : '...'

  return {
    profile,
    userName,
    userEmail,
    userRole,
    userInitials,
    isLoading,
    isError
  }
}
