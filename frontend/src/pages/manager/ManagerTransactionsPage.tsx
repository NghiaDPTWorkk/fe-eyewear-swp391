import React, { useState } from 'react'
import { Container } from '@/components'
import { PageHeader } from '@/features/sales/components/common'
import { IoSearchOutline, IoPrintOutline, IoEllipsisVertical } from 'react-icons/io5'

// Types for our mocked data
interface TransactionItemData {
  id: string
  orderCode: string
  customer: string
  date: string
  time: string
  total: number
  status: 'Accepted' | 'Completed' | 'Error' | 'New'
  items: Array<{
    name: string
    qty: number
    price: number
    category?: string
    note?: string
    image?: string
  }>
}

const mockTransactions: TransactionItemData[] = [
  {
    id: 'TR_748256',
    orderCode: '#DD945632',
    customer: 'Ariel Hikmat',
    date: 'Wed, July 12, 2024',
    time: '06:12 PM',
    total: 87.34,
    status: 'Accepted',
    items: [
      { name: 'Scrambled eggs with toast', qty: 1, price: 16.99 },
      { name: 'Smoked Salmon Bagel', qty: 2, price: 38.98 },
      { name: 'Classic Lemonade', qty: 1, price: 16.99 }
    ]
  },
  {
    id: 'TR_992144',
    orderCode: '#DD945252',
    customer: 'Ariel Hikmat',
    date: 'Wed, July 12, 2024',
    time: '06:12 PM',
    total: 57.87,
    status: 'Completed',
    items: [
      {
        name: 'Classic Cheeseburger',
        qty: 1,
        price: 10.99,
        category: 'Fastfood',
        note: 'Less Onion',
        image: '🍔'
      },
      { name: 'Fish and Chips', qty: 2, price: 10.99, category: 'Fastfood', image: '🍟' },
      {
        name: 'Greek Gyro Plate',
        qty: 1,
        price: 13.99,
        category: 'Drink',
        note: 'Less Ice',
        image: '🌯'
      }
    ]
  },
  {
    id: 'TR_881233',
    orderCode: '#DD96213',
    customer: 'Ariel Hikmat',
    date: 'Wed, July 12, 2024',
    time: '06:19 PM',
    total: 86.96,
    status: 'Error',
    items: [
      { name: 'Vegetarian Pad Thai', qty: 1, price: 16.99 },
      { name: 'Shrimp Tacos', qty: 2, price: 19.49 },
      { name: 'Belgian Waffles', qty: 1, price: 38.98 }
    ]
  },
  {
    id: 'TR_112099',
    orderCode: '#DD945632',
    customer: 'Paul Rey',
    date: 'Wed, July 12, 2024',
    time: '06:18 PM',
    total: 97.96,
    status: 'New',
    items: [
      { name: 'Margherita Pizza', qty: 1, price: 16.99 },
      { name: 'Belgian Waffles', qty: 2, price: 38.98 },
      { name: 'Virgin Mojito', qty: 1, price: 16.99 }
    ]
  }
]

const StatusBadge: React.FC<{ status: TransactionItemData['status'] }> = ({ status }) => {
  const styles = {
    Accepted: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    Completed: 'bg-mint-50 text-mint-600 border-mint-100',
    Error: 'bg-red-50 text-red-600 border-red-100',
    New: 'bg-amber-50 text-amber-600 border-amber-100'
  }
  return (
    <span
      className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${styles[status]}`}
    >
      {status}
    </span>
  )
}

const TransactionCard: React.FC<{
  transaction: TransactionItemData
  isSelected: boolean
  onSelect: () => void
}> = ({ transaction, isSelected, onSelect }) => (
  <div
    onClick={onSelect}
    className={`bg-white rounded-[32px] border p-6 transition-all cursor-pointer group ${
      isSelected
        ? 'border-mint-500 shadow-xl shadow-mint-100 ring-1 ring-mint-500/10'
        : 'border-neutral-100 hover:border-mint-200 hover:shadow-lg'
    }`}
  >
    {/* Card Header */}
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-semibold ${
            transaction.status === 'Completed'
              ? 'bg-mint-100 text-mint-600'
              : 'bg-slate-100 text-slate-600'
          }`}
        >
          {transaction.customer
            .split(' ')
            .map((n) => n[0])
            .join('')}
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-900 leading-none mb-1">
            {transaction.customer}
          </h4>
          <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest leading-none">
            Order {transaction.orderCode}
          </p>
        </div>
      </div>
      <StatusBadge status={transaction.status} />
    </div>

    {/* Date/Time Row */}
    <div className="flex justify-between items-center mb-6 pt-4 border-t border-neutral-50">
      <p className="text-[11px] font-medium text-neutral-400">{transaction.date}</p>
      <p className="text-[11px] font-semibold text-gray-700">{transaction.time}</p>
    </div>

    {/* Items List (Simplified) */}
    <div className="space-y-3 mb-6">
      <div className="flex justify-between text-[10px] font-semibold text-neutral-400 uppercase tracking-widest border-b border-neutral-50 pb-2">
        <span>Items</span>
        <div className="flex gap-8">
          <span>Qty</span>
          <span className="w-12 text-right">Price</span>
        </div>
      </div>
      {transaction.items.map((item, idx) => (
        <div key={idx} className="flex justify-between items-center text-xs">
          <span className="font-medium text-gray-700 truncate pr-4">{item.name}</span>
          <div className="flex gap-10 shrink-0">
            <span className="font-semibold text-gray-900 w-4 text-center">{item.qty}</span>
            <span className="font-semibold text-gray-900 w-12 text-right">
              ${item.price.toFixed(2)}
            </span>
          </div>
        </div>
      ))}
    </div>

    {/* Total and Actions */}
    <div className="pt-6 border-t-2 border-dashed border-neutral-100">
      <div className="flex justify-between items-center mb-6">
        <span className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Total</span>
        <span className="text-xl font-bold text-gray-900 font-primary">
          ${transaction.total.toFixed(2)}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <button className="py-2.5 rounded-2xl bg-neutral-50 text-[11px] font-semibold text-neutral-500 uppercase tracking-wider hover:bg-neutral-100 transition-all">
          See Details
        </button>
        <button className="py-2.5 rounded-2xl bg-mint-600 text-white text-[11px] font-bold uppercase tracking-wider shadow-lg shadow-mint-100/50 hover:bg-mint-700 transition-all active:scale-95">
          Pay Bills
        </button>
      </div>
    </div>
  </div>
)

const DetailSidebar: React.FC<{ transaction: TransactionItemData }> = ({ transaction }) => (
  <div className="bg-white rounded-[40px] border border-neutral-100 shadow-sm p-8 flex flex-col animate-in fade-in slide-in-from-right-4 duration-500">
    <div className="flex items-center justify-between mb-8">
      <h3 className="text-xl font-bold text-gray-900 font-heading">Order Details</h3>
      <div className="flex items-center gap-2 px-3 py-1.5 bg-mint-50 rounded-full border border-mint-100">
        <div className="w-1.5 h-1.5 rounded-full bg-mint-500 animate-pulse" />
        <span className="text-[10px] font-semibold text-mint-600 uppercase tracking-widest">
          {transaction.status}
        </span>
        <svg
          className="w-3 h-3 text-mint-400 ml-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>

    <div className="mb-8 p-1">
      <p className="text-sm font-medium text-gray-800 mb-1">
        Recipient: <span className="font-semibold">{transaction.customer}</span>
      </p>
      <p className="text-xs font-medium text-neutral-400 mb-2">
        {transaction.date} at {transaction.time}
      </p>
      <p className="text-[10px] font-semibold text-neutral-300 uppercase tracking-widest">
        {transaction.orderCode}
      </p>
    </div>

    {/* Items Area */}
    <div className="space-y-6 mb-8">
      {transaction.items.map((item, idx) => (
        <div key={idx} className="flex gap-4 items-start group">
          <div className="w-16 h-16 rounded-2xl bg-neutral-50 border border-neutral-100 flex items-center justify-center text-3xl group-hover:scale-105 transition-transform shrink-0">
            {item.image || '📦'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start mb-1 gap-2">
              <h5 className="text-sm font-semibold text-gray-900 truncate pr-2">{item.name}</h5>
              <span className="text-sm font-semibold text-gray-900 shrink-0">
                ${item.price.toFixed(2)}
              </span>
            </div>
            <p className="text-[10px] font-medium text-neutral-400 uppercase tracking-widest mb-1">
              {item.category || 'Category'}
            </p>
            {item.note && (
              <p className="text-[10px] font-medium text-mint-600 italic">Note: {item.note}</p>
            )}
            {item.qty > 1 && (
              <p className="text-[10px] font-semibold text-gray-600 mt-1">
                {item.qty}x ${(item.price / item.qty).toFixed(2)}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>

    {/* Pricing Calculation Section */}
    <div className="space-y-4 pt-8 border-t border-neutral-50 mb-8">
      <div className="flex justify-between items-center text-xs font-medium text-neutral-400">
        <span>Items ({transaction.items.length})</span>
        <span className="font-semibold text-gray-700">${transaction.total.toFixed(2)}</span>
      </div>
      <div className="flex justify-between items-center text-xs font-medium text-neutral-400">
        <span>Tax (10%)</span>
        <span className="font-semibold text-gray-700">${(transaction.total * 0.1).toFixed(2)}</span>
      </div>
      <div className="flex justify-between items-center pt-4">
        <span className="text-base font-semibold text-gray-900 uppercase tracking-widest">
          Total
        </span>
        <span className="text-2xl font-bold text-gray-900 font-primary">
          ${(transaction.total * 1.1).toFixed(2)}
        </span>
      </div>
    </div>

    {/* Action Buttons */}
    <div className="flex gap-3">
      <button className="flex-1 py-4 bg-mint-600 text-white rounded-[24px] text-sm font-bold shadow-xl shadow-mint-100 hover:bg-mint-700 transition-all active:scale-95 flex items-center justify-center gap-2">
        <IoPrintOutline size={18} />
        Print Bill
      </button>
      <button className="w-14 py-4 h-14 bg-white border border-neutral-100 rounded-[24px] flex items-center justify-center text-neutral-400 hover:text-gray-900 hover:border-neutral-200 transition-all">
        <IoEllipsisVertical size={20} />
      </button>
    </div>
  </div>
)

export default function ManagerTransactionsPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const selectedTransaction = mockTransactions.find((t) => t.id === selectedId)

  return (
    <Container className="max-w-none pt-4 pb-12 px-6 bg-white min-h-[calc(100vh-64px)] rounded-3xl shadow-sm border border-neutral-100">
      <PageHeader
        title="Transactions"
        subtitle="Manage and track all store financial activities."
        breadcrumbs={[
          { label: 'Dashboard', path: '/manager/dashboard' },
          { label: 'Transactions' }
        ]}
      />

      {/* Top Controls Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10 px-4">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <IoSearchOutline
              className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by name, order or etc"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-neutral-100 rounded-2xl text-[13px] font-medium focus:outline-none focus:ring-4 focus:ring-mint-500/10 focus:border-mint-500 transition-all shadow-sm"
            />
          </div>

          <div className="relative">
            <select className="px-6 py-3.5 bg-white border border-neutral-100 rounded-2xl text-[13px] font-bold text-gray-700 outline-none hover:border-mint-200 cursor-pointer shadow-sm appearance-none pr-12 min-w-[140px]">
              <option>All</option>
              <option>Success</option>
              <option>Pending</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        <button className="w-full md:w-auto px-8 py-3.5 bg-slate-800 text-white rounded-2xl text-sm font-bold shadow-xl shadow-slate-100 hover:bg-slate-900 transition-all flex items-center justify-center gap-2">
          <span className="text-xl leading-none">+</span> New Order
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 px-4">
        {/* Main Card Grid */}
        <div
          className={`transition-all duration-500 ${
            selectedId ? 'lg:col-span-8' : 'lg:col-span-12'
          }`}
        >
          <div
            className={`grid gap-6 pb-8 transition-all duration-500 ${
              selectedId
                ? 'grid-cols-1 md:grid-cols-2'
                : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
            }`}
          >
            {mockTransactions.map((t) => (
              <TransactionCard
                key={t.id}
                transaction={t}
                isSelected={selectedId === t.id}
                onSelect={() => setSelectedId(t.id === selectedId ? null : t.id)}
              />
            ))}
          </div>
        </div>

        {/* Right Detail Sidebar */}
        {selectedTransaction && (
          <div className="lg:col-span-4 animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="sticky top-4">
              <DetailSidebar transaction={selectedTransaction} />
            </div>
          </div>
        )}
      </div>
    </Container>
  )
}
