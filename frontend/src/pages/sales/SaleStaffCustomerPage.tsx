import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Container, Card } from '@/components'
import {
  IoCalendarOutline,
  IoStarOutline,
  IoPeopleOutline,
  IoChevronForward,
  IoOptionsOutline,
  IoEllipsisVertical,
  IoCallOutline,
  IoMailOutline,
  IoLinkOutline
} from 'react-icons/io5'
import CustomerCommunicationDrawer from '@/features/staff/components/CustomerCommunicationDrawer/CustomerCommunicationDrawer'

export default function SaleStaffCustomerPage() {
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const handleCustomerClick = (customer: any) => {
    setSelectedCustomer(customer)
    setIsDrawerOpen(true)
  }

  const customers = [
    {
      name: 'Esther Howard',
      activity: 'Today, 6:38 PM',
      badge: 'Going Cold',
      badgeColor: 'text-neutral-500 bg-neutral-50',
      phone: '(252) 555-0126',
      email: 'tim.jennings@example.com',
      website: 'eyewear.com',
      avatar: 'https://i.pravatar.cc/150?u=esther'
    },
    {
      name: 'Jacob Jones',
      activity: 'Today, 4:38 PM',
      badge: 'Need Follow Up',
      badgeColor: 'text-primary-600 bg-primary-50',
      phone: '(808) 555-0111',
      email: 'tim.jennings@example.com',
      website: 'eyewear.com',
      avatar: 'https://i.pravatar.cc/150?u=jacob'
    },
    {
      name: 'Albert Flores',
      activity: 'Today, 2:38 PM',
      badge: 'Fast Response',
      badgeColor: 'text-emerald-600 bg-emerald-50',
      phone: '(308) 555-0121',
      email: 'tim.jennings@example.com',
      website: 'eyewear.com',
      avatar: 'https://i.pravatar.cc/150?u=albert'
    },
    {
      name: 'Jane Cooper',
      activity: 'Today, 4:38 PM',
      badge: 'Need Follow Up',
      badgeColor: 'text-primary-600 bg-primary-50',
      phone: '(302) 555-0107',
      email: 'tim.jennings@example.com',
      website: 'eyewear.com',
      avatar: 'https://i.pravatar.cc/150?u=jane'
    },
    {
      name: 'Kristin Watson',
      activity: 'Today, 6:38 PM',
      badge: 'Need Contract Details',
      badgeColor: 'text-amber-600 bg-amber-50',
      phone: '(319) 555-0115',
      email: 'tim.jennings@example.com',
      website: 'eyewear.com',
      avatar: 'https://i.pravatar.cc/150?u=kristin'
    },
    {
      name: 'Royal Parvej',
      activity: 'Today, 2:38 PM',
      badge: 'Full Response',
      badgeColor: 'text-primary-600 bg-primary-50',
      phone: '(307) 555-0133',
      email: 'tim.jennings@example.com',
      website: 'eyewear.com',
      avatar: 'https://i.pravatar.cc/150?u=royal'
    }
  ]

  const metrics = [
    {
      label: 'Total Customers',
      value: '1,240',
      icon: <IoPeopleOutline />,
      color: 'bg-primary-500'
    },
    { label: 'High Value', value: '84', icon: <IoStarOutline />, color: 'bg-blue-500' },
    { label: 'New This Month', value: '12', icon: <IoCalendarOutline />, color: 'bg-emerald-500' },
    { label: 'On-site Now', value: '5', icon: <IoOptionsOutline />, color: 'bg-amber-500' }
  ]

  return (
    <div className="flex h-screen overflow-hidden bg-neutral-50/30 text-left">
      {/* Main Content Area */}
      <div className="flex-1 h-full overflow-y-auto no-scrollbar transition-all duration-300 ease-in-out">
        <Container className="max-w-[1400px] pb-10 min-h-full">
          <div className="pt-8 mb-8">
            <div className="flex items-center gap-2 text-sm mb-4 font-medium">
              <Link
                to="/salestaff/dashboard"
                className="text-neutral-400 hover:text-primary-500 transition-colors"
              >
                Dashboard
              </Link>
              <span className="text-neutral-300">/</span>
              <span className="text-primary-500 font-bold">Customer Management</span>
            </div>
            <h1 className="text-3xl font-bold text-neutral-800 tracking-tight">
              Customer Database
            </h1>
          </div>

          {/* Quick Metrics */}
          <div
            className={`grid gap-6 mb-10 transition-all ${isDrawerOpen ? 'grid-cols-2 lg:grid-cols-2' : 'grid-cols-2 md:grid-cols-4'}`}
          >
            {metrics.map((metric) => (
              <Card
                key={metric.label}
                className={`bg-white p-6 border-none rounded-2xl shadow-sm flex items-center gap-5 group cursor-pointer hover:shadow-md transition-all`}
              >
                <div
                  className={`p-4 ${metric.color.replace('bg-', 'bg-opacity-10 text-')} rounded-2xl text-2xl`}
                >
                  {metric.icon}
                </div>
                <div>
                  <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest leading-none mb-1.5">
                    {metric.label}
                  </div>
                  <div className="text-2xl font-bold text-neutral-800 tracking-tight">
                    {metric.value}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Customer Grid */}
          <div
            className={`grid gap-8 transition-all ${isDrawerOpen ? 'grid-cols-1 xl:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'}`}
          >
            {customers.map((customer, idx) => (
              <Card
                key={idx}
                className={`p-8 border-none shadow-sm hover:shadow-xl transition-all duration-300 group relative bg-white rounded-[32px] cursor-pointer ring-2 ${selectedCustomer?.name === customer.name ? 'ring-primary-500 shadow-md transform scale-[1.02]' : 'ring-transparent hover:ring-primary-50'}`}
                onClick={() => handleCustomerClick(customer)}
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex gap-4">
                    <img
                      src={customer.avatar}
                      className="w-14 h-14 rounded-full object-cover ring-4 ring-neutral-50/50"
                      alt={customer.name}
                    />
                    <div className="pt-1">
                      <h3 className="text-lg font-bold text-neutral-800 leading-tight mb-1 group-hover:text-primary-600 transition-colors">
                        {customer.name}
                      </h3>
                      <p className="text-xs text-neutral-400 font-medium tracking-wide">
                        {customer.activity}
                      </p>
                    </div>
                  </div>
                  <button
                    className="p-2 text-neutral-300 hover:text-neutral-500 transition-colors rounded-full hover:bg-neutral-50"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <IoEllipsisVertical size={20} />
                  </button>
                </div>

                <div className="mb-8">
                  <div
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold text-center transition-colors ${customer.badgeColor}`}
                  >
                    {customer.badge}
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="flex items-center gap-4 text-neutral-500 group-hover:text-neutral-700 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-neutral-50 flex items-center justify-center text-neutral-400 group-hover:bg-primary-50 group-hover:text-primary-500 transition-colors">
                      <IoCallOutline className="text-lg" />
                    </div>
                    <span className="text-sm font-semibold">{customer.phone}</span>
                  </div>
                  <div className="flex items-center gap-4 text-neutral-500 group-hover:text-neutral-700 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-neutral-50 flex items-center justify-center text-neutral-400 group-hover:bg-primary-50 group-hover:text-primary-500 transition-colors">
                      <IoMailOutline className="text-lg" />
                    </div>
                    <span className="text-sm font-semibold truncate">{customer.email}</span>
                  </div>
                  <div className="flex items-center gap-4 text-neutral-500 group-hover:text-neutral-700 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-neutral-50 flex items-center justify-center text-neutral-400 group-hover:bg-primary-50 group-hover:text-primary-500 transition-colors">
                      <IoLinkOutline className="text-lg" />
                    </div>
                    <span className="text-sm font-semibold">{customer.website}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-16 flex justify-center">
            <div className="flex items-center gap-3 p-2 bg-white rounded-2xl shadow-sm">
              <button className="p-3 hover:bg-neutral-50 rounded-xl transition-colors text-neutral-400">
                <IoChevronForward className="rotate-180" />
              </button>
              {[1, 2, 3].map((page) => (
                <button
                  key={page}
                  className={`w-12 h-12 rounded-xl text-sm font-bold transition-all ${
                    page === 1
                      ? 'bg-primary-500 text-white shadow-lg shadow-primary-200'
                      : 'text-neutral-400 hover:bg-neutral-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button className="p-3 hover:bg-neutral-50 rounded-xl transition-colors text-neutral-400">
                <IoChevronForward />
              </button>
            </div>
          </div>
        </Container>
      </div>

      {/* Side Panel Drawer (Inline) */}
      <div
        className={`${isDrawerOpen ? 'w-[400px] border-l border-neutral-200' : 'w-0 border-none'} bg-white h-full transition-all duration-300 ease-in-out shrink-0 shadow-xl z-20 overflow-hidden relative`}
      >
        <div className="absolute inset-0 w-[400px]">
          <CustomerCommunicationDrawer
            isOpen={true}
            onClose={() => setIsDrawerOpen(false)}
            customer={selectedCustomer}
            variant="inline"
          />
        </div>
      </div>
    </div>
  )
}
