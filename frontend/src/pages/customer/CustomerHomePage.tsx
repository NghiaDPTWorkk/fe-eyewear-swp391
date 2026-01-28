import CustomerHeader from '@/components/layout/customer/header/CustomerHeader'
import { HomePage } from '@/components/layout/customer'

export const CustomerHomePage = () => {
  return <HomePage header={<CustomerHeader />} />
}
