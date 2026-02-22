import { useState } from 'react'
import { IoInformationCircleOutline } from 'react-icons/io5'
import { useSearchParams } from 'react-router-dom'

import CommunicationDrawer from '@/features/sales/components/customer/CommunicationDrawer'
import { CustomerInboxList } from '@/features/sales/components/customer/CustomerInboxList'
import { CustomerProfileInsights } from '@/features/sales/components/customer/CustomerProfileInsights'
import { PageHeader } from '@/features/staff'
import { cn } from '@/lib/utils'
import { Button, Card } from '@/shared/components/ui-core'

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

const customers: Customer[] = [
  {
    id: 'c1',
    name: 'Esther Howard',
    activity: 'Today, 6:38 PM',
    badge: 'Going Cold',
    badgeColor: 'text-neutral-500 bg-neutral-100',
    phone: '(252) 555-0126',
    email: 'tim.jennings@example.com',
    website: 'eyewear.com',
    avatar: 'https://i.pravatar.cc/150?u=esther',
    status: 'online',
    lastMessage: 'Hi, I was wondering if my order #ORD-7782 is ready?'
  },
  {
    id: 'c2',
    name: 'Jacob Jones',
    activity: 'Today, 4:38 PM',
    badge: 'Need Follow Up',
    badgeColor: 'text-primary-600 bg-primary-100/50',
    phone: '(808) 555-0111',
    email: 'tim.jennings@example.com',
    website: 'eyewear.com',
    avatar: 'https://i.pravatar.cc/150?u=jacob',
    status: 'online',
    lastMessage: 'When can I expect the new frame collection?'
  },
  {
    id: 'c3',
    name: 'Albert Flores',
    activity: 'Today, 2:38 PM',
    badge: 'Fast Response',
    badgeColor: 'text-emerald-600 bg-emerald-100/50',
    phone: '(308) 555-0121',
    email: 'tim.jennings@example.com',
    website: 'eyewear.com',
    avatar: 'https://i.pravatar.cc/150?u=albert',
    status: 'offline',
    lastMessage: 'Thank you for the prescription update.'
  }
]

export default function SaleStaffCustomerPage() {
  const [searchParams] = useSearchParams()
  const customerIdParam = searchParams.get('customerId')

  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(customerIdParam)
  const [showProfile, setShowProfile] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId) || null

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col space-y-6">
      <PageHeader
        title="Customer Inbox"
        subtitle="Manage communications and provide personalized support to your clients."
        breadcrumbs={[{ label: 'Dashboard', path: '/salestaff/dashboard' }, { label: 'Customers' }]}
      />

      <Card className="flex-1 flex overflow-hidden border border-neutral-200 p-0 rounded-[32px] bg-white shadow-xl shadow-slate-200/40 ring-1 ring-neutral-100/50">
        <CustomerInboxList
          customers={customers}
          selectedCustomerId={selectedCustomerId}
          setSelectedCustomerId={setSelectedCustomerId}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <main className="flex-1 flex overflow-hidden bg-white">
          {selectedCustomer ? (
            <div className="flex-1 flex overflow-hidden">
              <div className="flex-1 flex flex-col overflow-hidden min-w-0">
                <header className="px-6 py-4 border-b border-neutral-50 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedCustomer.avatar}
                      className="w-9 h-9 rounded-xl object-cover"
                    />
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
