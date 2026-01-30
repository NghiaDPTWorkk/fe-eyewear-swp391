import { CustomerHeader, HomePage } from '@/components/layout/customer'

export const GuestHomePage = () => {
  return <HomePage header={<CustomerHeader />} />
}
