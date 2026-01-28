import GuestHeader from '@/components/layout/customer/header/GuestHeader'
import { HomePage } from '@/components/shared/HomePage'

export const GuestHomePage = () => {
  return <HomePage header={<GuestHeader />} />
}
