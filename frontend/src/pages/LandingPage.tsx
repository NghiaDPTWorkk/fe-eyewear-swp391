import { useAuthStore } from '@/store'
import { GuestHomePage } from './auth/customer/GuestHomePage'
import { CustomerHomePage } from './customer/CustomerHomePage'

export const LandingPage = () => {
  const { isAuthenticated } = useAuthStore()

  return isAuthenticated ? <CustomerHomePage /> : <GuestHomePage />
}
