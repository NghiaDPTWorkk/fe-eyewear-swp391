import GuestHeader from '@/components/layout/customer/header/GuestHeader'
import { HomePage } from '@/components/layout/customer'

export const GuestHomePage = () => {
  return <HomePage header={<GuestHeader />} />
}
