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

  // Format role for better display
  const userRole =
    rawRole === 'SALE_STAFF'
      ? 'Sales Staff'
      : rawRole === 'MANAGER'
        ? 'Manager'
        : rawRole === 'ADMIN'
          ? 'Administrator'
          : rawRole === 'OPERATION_STAFF'
            ? 'Operation Staff'
            : rawRole || 'Loading...'

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
