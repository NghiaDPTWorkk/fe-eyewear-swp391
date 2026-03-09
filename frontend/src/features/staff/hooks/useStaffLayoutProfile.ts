import { useProfile } from './useProfile'
import { getInitials } from '@/shared/utils'

/**
 * Custom hook to get and format profile information for staff layouts.
 * Consolidates common logic used across Admin, Manager, and Staff layouts.
 */
export const useStaffLayoutProfile = () => {
  const { data: profileData, isLoading, isError } = useProfile()
  const profile = profileData?.data

  const userName = profile?.name || 'Loading...'
  const userEmail = profile?.email || ''
  const rawRole = profile?.role || ''

  // Format role for better display (e.g., OPERATION_STAFF -> Operation Staff)
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
