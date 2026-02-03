import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Card, Container } from '@/shared/components/ui'
import PageHeader from '@/features/sales/components/common/PageHeader'
import {
  IoSearchOutline,
  IoCallOutline,
  IoMailOutline,
  IoChatbubbleEllipsesOutline,
  IoBagCheckOutline,
  IoStar,
  IoGlobeOutline,
  IoInformationCircleOutline
} from 'react-icons/io5'
import { cn } from '@/lib/utils'
import CommunicationDrawer from '@/features/sales/components/customer/CommunicationDrawer'

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
    <Container className="pt-2 pb-1 px-2 max-w-none h-screen flex flex-col overflow-hidden">
      <PageHeader
        title="Customer Inbox"
        subtitle="Manage communications and provide personalized support to your clients."
        breadcrumbs={[{ label: 'Dashboard', path: '/salestaff/dashboard' }, { label: 'Customers' }]}
      />

      {/* 2. Main content area (Inbox logic) */}
      <Card className="flex-1 flex overflow-hidden border border-neutral-200 shadow-sm p-0 rounded-3xl">
        {/* Left Side: Inbox List */}
        <aside className="w-[300px] lg:w-[350px] border-r border-neutral-100 bg-white flex flex-col shrink-0">
          <div className="p-5 border-b border-neutral-100 space-y-4">
            <div className="relative">
              <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-9 pr-4 py-2 bg-neutral-50 border border-transparent rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2 p-1 bg-neutral-50 rounded-xl">
              <button className="flex-1 py-1.5 px-3 bg-white text-gray-800 text-[11px] font-medium rounded-lg shadow-sm border border-neutral-100">
                Focused
              </button>
              <button className="flex-1 py-1.5 px-3 text-neutral-400 text-[11px] font-medium rounded-lg hover:text-gray-600 transition-colors">
                Other
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar">
            {customers.map((customer) => (
              <div
                key={customer.id}
                onClick={() => setSelectedCustomerId(customer.id)}
                className={cn(
                  'px-5 py-4 flex gap-4 cursor-pointer transition-all border-l-[3px]',
                  selectedCustomerId === customer.id
                    ? 'bg-primary-50/40 border-primary-500'
                    : 'bg-white border-transparent hover:bg-neutral-50/50'
                )}
              >
                <div className="relative shrink-0">
                  <img
                    src={customer.avatar}
                    className="w-12 h-12 rounded-2xl object-cover shadow-sm"
                    alt={customer.name}
                  />
                  {customer.status === 'online' && (
                    <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-[3px] border-white bg-emerald-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm font-semibold text-neutral-800 truncate">
                      {customer.name}
                    </h3>
                    <span className="text-[10px] text-neutral-400 font-medium whitespace-nowrap ml-2">
                      6:32 PM
                    </span>
                  </div>
                  <p className="text-[12px] text-neutral-400 truncate opacity-90 leading-tight mt-1">
                    {customer.lastMessage || 'No message yet'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Center/Right: Chat and Profile Area */}
        <main className="flex-1 flex overflow-hidden bg-white">
          {selectedCustomer ? (
            <div className="flex-1 flex overflow-hidden">
              {/* Chat Panel */}
              <div className="flex-1 flex flex-col overflow-hidden min-w-0">
                <header className="px-6 py-4 border-b border-neutral-50 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedCustomer.avatar}
                      className="w-9 h-9 rounded-xl object-cover"
                    />
                    <div>
                      <h2 className="text-sm font-semibold text-neutral-900 leading-none mb-1">
                        {selectedCustomer.name}
                      </h2>
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span className="text-[10px] font-medium text-emerald-600 tracking-wider">
                          Online
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowProfile(!showProfile)}
                    className={cn(
                      'flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-semibold tracking-widest transition-all border',
                      showProfile
                        ? 'bg-primary-50 border-primary-200 text-primary-600'
                        : 'bg-white border-neutral-200 text-neutral-400 hover:bg-neutral-50'
                    )}
                  >
                    <IoInformationCircleOutline size={16} />
                    {showProfile ? 'Hide Profile' : 'Show Profile'}
                  </button>
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

              {/* Profile Insights (Slide-in) */}
              <aside
                className={cn(
                  'bg-neutral-50/30 border-l border-neutral-100 transition-all duration-300 overflow-hidden shrink-0 h-full',
                  showProfile ? 'w-[320px] lg:w-[360px]' : 'w-0'
                )}
              >
                <div className="w-[320px] lg:w-[360px] h-full flex flex-col p-6 overflow-y-auto no-scrollbar bg-white">
                  <div className="flex flex-col items-center mb-8 text-center pt-4">
                    <div className="relative mb-5">
                      <img
                        src={selectedCustomer.avatar}
                        className="w-24 h-24 rounded-[2.5rem] object-cover ring-4 ring-neutral-50 shadow-lg"
                        alt={selectedCustomer.name}
                      />
                      <div className="absolute -bottom-1 -right-1 bg-amber-400 text-white p-2 rounded-xl shadow-md border-2 border-white">
                        <IoStar size={16} />
                      </div>
                    </div>
                    <h2 className="text-xl font-semibold text-neutral-900 mb-1">
                      {selectedCustomer.name}
                    </h2>
                    <p className="text-[11px] font-medium text-neutral-400 capitalize">
                      {selectedCustomer.activity}
                    </p>
                    <span
                      className={cn(
                        'mt-4 px-4 py-1.5 rounded-full text-[10px] font-semibold tracking-wider border',
                        selectedCustomer.badgeColor.replace('bg-', 'bg-white border-')
                      )}
                    >
                      {selectedCustomer.badge}
                    </span>
                  </div>

                  <div className="space-y-6">
                    <div className="p-5 bg-neutral-900 rounded-3xl text-white">
                      <div className="flex justify-between items-center mb-4">
                        <p className="text-[10px] font-semibold opacity-50 tracking-wider">
                          Customer Value
                        </p>
                        <IoBagCheckOutline size={18} className="opacity-50" />
                      </div>
                      <p className="text-2xl font-semibold">$4,250</p>
                      <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-[9px] font-semibold opacity-40">Orders</p>
                          <p className="text-sm font-semibold">12 Total</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-semibold opacity-40">Tier</p>
                          <p className="text-sm font-semibold text-emerald-400">Elite</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-[10px] font-semibold text-neutral-400 tracking-widest pl-1">
                        Contact Details
                      </h4>
                      <div className="space-y-4">
                        {[
                          {
                            icon: <IoMailOutline />,
                            label: 'Email',
                            value: selectedCustomer.email
                          },
                          {
                            icon: <IoCallOutline />,
                            label: 'Phone',
                            value: selectedCustomer.phone
                          },
                          { icon: <IoGlobeOutline />, label: 'Store', value: 'Downtown' }
                        ].map((info) => (
                          <div key={info.label} className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-neutral-50 flex items-center justify-center text-neutral-400 shrink-0 border border-neutral-100">
                              {info.icon}
                            </div>
                            <div className="min-w-0">
                              <p className="text-[10px] font-semibold text-neutral-400 tracking-tight leading-none mb-1">
                                {info.label}
                              </p>
                              <p className="text-sm font-semibold text-neutral-800 truncate">
                                {info.value}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-gray-50/30">
              <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center text-neutral-200 mb-6 border border-neutral-100">
                <IoChatbubbleEllipsesOutline size={40} />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">Select a Customer</h3>
              <p className="text-sm text-neutral-500 max-w-xs mx-auto opacity-70">
                Start a consultation or check order progress by selecting a conversation from the
                sidebar.
              </p>
            </div>
          )}
        </main>
      </Card>
    </Container>
  )
}
