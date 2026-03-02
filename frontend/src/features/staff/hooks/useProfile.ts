import { useQuery } from '@tanstack/react-query'
import { profileService } from '../services/profile.service'
import { useAuthStore } from '@/store/auth.store'

/**
 * Hook để lấy thông tin profile của admin/staff đang đăng nhập
 *
 * NOTE: The access token is included in the queryKey to ensure each logged-in
 * user gets their own isolated cache entry. Switching accounts (e.g. SALE_STAFF
 * → MANAGER) will always fetch fresh profile data instead of reusing the
 * previous user's cached profile.
 *
 * @returns {Object} Query result với data chứa thông tin profile
 * @returns {AdminAccount} data.data - Thông tin profile (name, email, phone, avatar, role, citizenId)
 * @returns {boolean} isLoading - Trạng thái đang tải
 * @returns {boolean} isError - Trạng thái lỗi
 * @returns {Error} error - Chi tiết lỗi nếu có
 *
 * @example
 * const { data: profileData, isLoading, isError } = useProfile()
 *
 * if (isLoading) return <div>Loading...</div>
 * if (isError) return <div>Error loading profile</div>
 *
 * const profile = profileData?.data
 * console.log(profile.name)  // "Nguyễn Văn OPERATION_STAFF"
 * console.log(profile.email) // "oper@gmail.com"
 * console.log(profile.avatar) // "https://..."
 */
export const useProfile = () => {
  // Include the token in the query key so switching accounts always triggers a fresh fetch
  const accessToken = useAuthStore((state) => state.accessToken)

  return useQuery({
    queryKey: ['profile', accessToken],
    queryFn: () => profileService.getProfile(),
    staleTime: 300000, // Cache 5 phút (profile ít thay đổi)
    refetchOnWindowFocus: false, // Không refetch khi focus lại window
    retry: 1, // Chỉ retry 1 lần nếu fail
    enabled: !!accessToken // Chỉ fetch khi có token
  })
}
