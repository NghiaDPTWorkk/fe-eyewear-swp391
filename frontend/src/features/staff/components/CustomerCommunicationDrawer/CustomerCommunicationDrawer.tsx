import { IoClose, IoSend, IoCheckmarkDoneOutline, IoWarningOutline } from 'react-icons/io5'
import { Card, Button } from '@/components'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface Customer {
  name: string
  avatar: string
  email: string
  phone: string
}

interface CustomerCommunicationDrawerProps {
  isOpen: boolean
  onClose: () => void
  customer: Customer | null
  variant?: 'overlay' | 'inline'
  hideHeader?: boolean
}

const ORDER_HISTORY = [
  {
    id: 'ORD-7782',
    date: 'Oct 24',
    frames: 'Ray-Ban Aviator',
    status: 'In Progress',
    price: '$245.00',
    urgent: false
  },
  {
    id: 'ORD-9921',
    date: 'Sep 12',
    frames: 'Oakley Holbrook',
    status: 'Completed',
    price: '$189.00',
    urgent: false
  },
  {
    id: 'ORD-3329',
    date: 'Aug 05',
    frames: 'Gucci GG0061S',
    status: 'Follow Up',
    price: '$450.00',
    urgent: true
  }
]

export default function CustomerCommunicationDrawer({
  isOpen,
  onClose,
  customer,
  variant = 'overlay',
  hideHeader = false
}: CustomerCommunicationDrawerProps) {
  const [activeTab, setActiveTab] = useState<'chat' | 'orders'>('chat')

  if (!isOpen || !customer) return null

  const DrawerContent = (
    <div
      className={cn(
        'relative w-full bg-white h-full flex flex-col',
        variant === 'overlay'
          ? 'max-w-md shadow-2xl animate-in slide-in-from-right duration-300'
          : 'border-l border-neutral-200'
      )}
    >
      {!hideHeader && (
        <>
          <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white shrink-0 z-10">
            <div className="flex items-center gap-3">
              <img
                src={customer.avatar}
                alt={customer.name}
                className="w-10 h-10 rounded-full object-cover border border-gray-200"
              />
              <div>
                <h3 className="font-semibold text-gray-900">{customer.name}</h3>
                <p className="text-xs text-mint-500 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-mint-500"></span> Online
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-mint-50 rounded-full text-gray-400 hover:text-mint-600 transition-all active:scale-95"
            >
              <IoClose size={24} />
            </button>
          </div>

          <div className="flex border-b border-gray-100 shrink-0">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 py-3 text-sm font-semibold transition-all border-b-2 ${activeTab === 'chat' ? 'border-mint-500 text-mint-600' : 'border-transparent text-gray-500 hover:text-mint-600'}`}
            >
              Messages
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex-1 py-3 text-sm font-semibold transition-all border-b-2 ${activeTab === 'orders' ? 'border-mint-500 text-mint-600' : 'border-transparent text-gray-500 hover:text-mint-600'}`}
            >
              Active Orders
            </button>
          </div>
        </>
      )}

      <div className="flex-1 overflow-hidden relative bg-gray-50">
        {activeTab === 'chat' && (
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4">
              <div className="text-center text-xs text-gray-400 my-4">Today, Oct 27</div>

              <div className="flex gap-3 max-w-[85%]">
                <img src={customer.avatar} className="w-8 h-8 rounded-full self-end mb-1" />
                <div>
                  <div className="bg-white p-3 rounded-2xl rounded-bl-none shadow-sm border border-gray-100 text-sm text-gray-700">
                    Hi, I was wondering if my order #ORD-7782 is ready for pickup?
                  </div>
                  <span className="text-[10px] text-gray-400 ml-1 mt-1 block">10:42 AM</span>
                </div>
              </div>

              <div className="flex gap-3 max-w-[85%] ml-auto flex-row-reverse">
                <div className="w-8 h-8 bg-mint-100 rounded-full flex items-center justify-center text-[10px] font-semibold text-mint-600 self-end mb-1">
                  Me
                </div>
                <div>
                  <div className="bg-mint-600 p-3 rounded-2xl rounded-br-none shadow-sm text-sm text-white">
                    Hello {customer.name.split(' ')[0]}! Let me check that for you right away.
                  </div>
                  <span className="text-[10px] text-gray-400 mr-1 mt-1 block text-right flex justify-end gap-1 items-center">
                    10:44 AM <IoCheckmarkDoneOutline className="text-mint-500" />
                  </span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-white border-t border-gray-100 shrink-0">
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 bg-gray-100 border-0 rounded-full px-4 py-2.5 text-sm focus:ring-2 focus:ring-mint-500/20 focus:border-mint-500 focus:bg-white transition-all outline-none"
                />
                <Button className="rounded-full w-10 h-10 p-0 flex items-center justify-center bg-mint-600 hover:bg-mint-700 text-white shadow-lg shadow-mint-100 active:scale-95 transition-all">
                  <IoSend size={16} className="ml-0.5" />
                </Button>
              </div>
            </div>

            <div className="p-3 bg-mint-50 border-t border-mint-100 shrink-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-mint-800 uppercase tracking-wide mb-0.5">
                    Focus Order
                  </p>
                  <p className="text-sm font-semibold text-gray-900">Ray-Ban Aviator (ORD-7782)</p>
                </div>
                <span className="px-2 py-1 bg-white text-mint-600 text-xs font-semibold rounded shadow-sm border border-mint-100">
                  PROCESSING
                </span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="h-full overflow-y-auto no-scrollbar p-4 space-y-3">
            {ORDER_HISTORY.map((order) => (
              <Card
                key={order.id}
                className="p-4 border border-gray-100 shadow-sm hover:shadow-md hover:border-mint-200 transition-all cursor-pointer group rounded-xl"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className="h-8 w-8 rounded-lg bg-mint-50 text-mint-600 flex items-center justify-center font-semibold text-xs">
                      PO
                    </span>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm group-hover:text-mint-600 transition-colors">
                        {order.id}
                      </h4>
                      <p className="text-[10px] text-gray-500">{order.date}</p>
                    </div>
                  </div>
                  {order.urgent && <IoWarningOutline className="text-amber-500 animate-pulse" />}
                </div>

                <div className="py-2 border-t border-dashed border-gray-100 mt-2">
                  <p className="text-sm font-semibold text-gray-800">{order.frames}</p>
                  <p className="text-xs text-gray-500">Prescription Lenses • Anti-glare</p>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <span className="font-semibold text-gray-900 text-sm">{order.price}</span>
                  <span
                    className={`px-2 py-1 rounded-md text-[10px] font-semibold uppercase ${
                      order.status === 'Completed'
                        ? 'bg-mint-50 text-mint-600'
                        : order.status === 'In Progress'
                          ? 'bg-blue-50 text-blue-600'
                          : 'bg-amber-50 text-amber-600'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )

  if (variant === 'inline') {
    return DrawerContent
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      {DrawerContent}
    </div>
  )
}
