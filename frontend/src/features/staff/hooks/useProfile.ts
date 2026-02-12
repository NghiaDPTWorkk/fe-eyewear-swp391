import { useQuery } from '@tanstack/react-query'
import { profileService } from '../services/profile.service'

/**
 * Hook để lấy thông tin profile của admin/staff đang đăng nhập
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
 * console.log(profile.name) // "Nguyễn Văn OPERATION_STAFF"
 * console.log(profile.email) // "oper@gmail.com"
 * console.log(profile.avatar) // "https://..."
 */
export const useProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => profileService.getProfile(),
    staleTime: 300000, // Cache 5 phút (profile ít thay đổi)
    refetchOnWindowFocus: false, // Không refetch khi focus lại window
    retry: 1 // Chỉ retry 1 lần nếu fail
  })
}
