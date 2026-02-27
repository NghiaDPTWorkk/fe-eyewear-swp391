import { useState, useEffect, useCallback } from 'react'
import { IoInformationCircleOutline } from 'react-icons/io5'
import { useSearchParams } from 'react-router-dom'
import { httpClient } from '@/api'
import { ENDPOINTS } from '@/api/endpoints'

import CommunicationDrawer from '@/features/sales/components/customer/CommunicationDrawer'
import { CustomerInboxList } from '@/features/sales/components/customer/CustomerInboxList'
import { CustomerProfileInsights } from '@/features/sales/components/customer/CustomerProfileInsights'
import { PageHeader } from '@/features/staff'
import { cn } from '@/lib/utils'
import { Button, Card } from '@/shared/components/ui-core'
import { getInitials } from '@/features/sales/utils/nameUtils'

interface Customer {
  id: string
  name: string
  activity: string
  badge: string
  badgeColor: string
  phone: string
  email: string
  website: string
  avatar: string
  status: 'online' | 'offline'
  lastMessage?: string
}

interface Conversation {
  id: string
  customerId: string
  customerName: string
  lastInteractionAt: string
}

interface Message {
  id: string
  role: 'CUSTOMER' | 'AI' | 'STAFF'
  conversationId: string
  content: string
  createdAt: string
}

export default function SaleStaffCustomerPage() {
  const [searchParams] = useSearchParams()
  const customerIdParam = searchParams.get('customerId')

  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(customerIdParam)
  const [showProfile, setShowProfile] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [customers, setCustomers] = useState<Customer[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingMessages, setIsLoadingMessages] = useState(false)

  const fetchConversations = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await httpClient.get<{
        success: boolean
        data: { conversationList: Conversation[] }
      }>(ENDPOINTS.ADMIN_AI_CONVERSATIONS.LIST(searchQuery))

      if (response.success) {
        const mappedCustomers: Customer[] = response.data.conversationList.map((conv) => ({
          id: conv.id,
          name: conv.customerName,
          activity: conv.lastInteractionAt,
          badge: 'AI Chat',
          badgeColor: 'text-primary-600 bg-primary-100/50',
          phone: '',
          email: '',
          website: '',
          avatar: '', // No hardcoded link
          status: 'online',
          lastMessage: `AI Conversation - ${conv.lastInteractionAt.split(' ')[0]}`
        }))
        setCustomers(mappedCustomers)
      }
    } catch (error) {
      console.error('Failed to fetch conversations:', error)
    } finally {
      setIsLoading(false)
    }
  }, [searchQuery])

  const fetchMessages = useCallback(async (conversationId: string) => {
    setIsLoadingMessages(true)
    try {
      const response = await httpClient.get<{
        success: boolean
        data: { messageList: Message[] }
      }>(ENDPOINTS.ADMIN_AI_CONVERSATIONS.MESSAGES(conversationId))

      if (response.success) {
        setMessages(response.data.messageList)
        // Update the last message preview in the sidebar list
        if (response.data.messageList.length > 0) {
          const lastMsg = response.data.messageList[response.data.messageList.length - 1].content
          setCustomers((prev) =>
            prev.map((c) => (c.id === conversationId ? { ...c, lastMessage: lastMsg } : c))
          )
        }
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error)
    } finally {
      setIsLoadingMessages(false)
    }
  }, [])

  useEffect(() => {
    fetchConversations()
  }, [fetchConversations])

  useEffect(() => {
    if (selectedCustomerId) {
      fetchMessages(selectedCustomerId)
    } else {
      setMessages([])
    }
  }, [selectedCustomerId, fetchMessages])

  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId) || null

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col space-y-6">
      <PageHeader
        title="Customer Inbox"
        subtitle="Manage communications and provide personalized support to your clients."
        breadcrumbs={[{ label: 'Dashboard', path: '/salestaff/dashboard' }, { label: 'Customers' }]}
      />

      <Card className="flex-1 flex overflow-hidden border border-neutral-200 p-0 rounded-[32px] bg-white shadow-xl shadow-slate-200/40 ring-1 ring-neutral-100/50">
        <div className="relative border-r border-neutral-50 flex flex-col shrink-0">
          <CustomerInboxList
            customers={customers}
            selectedCustomerId={selectedCustomerId}
            setSelectedCustomerId={setSelectedCustomerId}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          {isLoading && (
            <div className="absolute inset-0 bg-white/50 flex items-center justify-center backdrop-blur-[1px]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mint-500" />
            </div>
          )}
        </div>

        <main className="flex-1 flex overflow-hidden bg-white">
          {selectedCustomer ? (
            <div className="flex-1 flex overflow-hidden">
              <div className="flex-1 flex flex-col overflow-hidden min-w-0">
                <header className="px-6 py-4 border-b border-neutral-50 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-3">
                    {selectedCustomer.avatar ? (
                      <img
                        src={selectedCustomer.avatar}
                        className="w-9 h-9 rounded-xl object-cover shrink-0"
                        alt=""
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-xl bg-mint-50 flex items-center justify-center text-[10px] font-bold text-mint-600 shrink-0 border border-mint-100 uppercase">
                        {getInitials(selectedCustomer.name)}
                      </div>
                    )}
                    <div>
                      <h2 className="text-sm font-medium text-neutral-900 leading-none mb-1">
                        {selectedCustomer.name}
                      </h2>
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span className="text-[10px] font-normal text-emerald-600 tracking-wider">
                          Online
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => setShowProfile(!showProfile)}
                    className={cn(
                      'flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-medium tracking-widest transition-all border',
                      showProfile
                        ? 'bg-primary-50 border-primary-200 text-primary-600'
                        : 'bg-white border-neutral-200 text-neutral-400 hover:bg-neutral-50'
                    )}
                  >
                    <IoInformationCircleOutline size={16} />
                    {showProfile ? 'Hide Profile' : 'Show Profile'}
                  </Button>
                </header>

                <div className="flex-1 overflow-hidden">
                  <CommunicationDrawer
                    isOpen={true}
                    onClose={() => setSelectedCustomerId(null)}
                    customer={selectedCustomer}
                    variant="inline"
                    hideHeader={true}
                    messages={messages}
                    isLoadingMessages={isLoadingMessages}
                  />
                </div>
              </div>

              <CustomerProfileInsights customer={selectedCustomer} showProfile={showProfile} />
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-neutral-400">
              <div className="w-20 h-20 rounded-full bg-neutral-50 flex items-center justify-center mb-4">
                <IoInformationCircleOutline size={40} className="text-neutral-200" />
              </div>
              <p className="text-sm font-medium">Select a customer to view conversation</p>
            </div>
          )}
        </main>
      </Card>
    </div>
  )
}
