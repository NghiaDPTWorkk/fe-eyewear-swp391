import { useQuery } from '@tanstack/react-query'
import { profileService } from '../services/profile.service'
import { useAuthStore } from '@/store/auth.store'

export const useProfile = () => {
  const accessToken = useAuthStore((state) => state.accessToken)

  return useQuery({
    queryKey: ['profile', accessToken],
    queryFn: () => profileService.getProfile(),
    staleTime: 300000,
    refetchOnWindowFocus: false,
    retry: 1,
    enabled: !!accessToken
  })
}
