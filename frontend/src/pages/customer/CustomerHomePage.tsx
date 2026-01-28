import CustomerHeader from '@/components/layout/customer/header/CustomerHeader'
import { HomePage } from '@/components/shared/HomePage'

export const CustomerHomePage = () => {
  return <HomePage header={<CustomerHeader />} />
}
