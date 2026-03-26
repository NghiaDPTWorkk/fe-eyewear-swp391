import { Outlet, useLocation, ScrollRestoration } from 'react-router-dom'
import { ChatBot } from '@/shared/components/ui/chatbot/ChatBot'
import CustomerHeader from '@/components/layout/customer/header/CustomerHeader'
import { Footer } from '@/components/layout/customer/homepage/components'

export const CustomerLayout = () => {
  const location = useLocation()
  const isHomePage = location.pathname === '/' || location.pathname === ''

  return (
    <div className="flex flex-col min-h-screen">
      <ScrollRestoration />
      <CustomerHeader isTranslucent={isHomePage} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ChatBot />
    </div>
  )
}

export default CustomerLayout
