import { Outlet } from 'react-router-dom'
import { ChatBot } from '@/shared/components/ui/chatbot/ChatBot'

export const CustomerLayout = () => {
  return (
    <>
      <Outlet />
      <ChatBot />
    </>
  )
}

export default CustomerLayout
