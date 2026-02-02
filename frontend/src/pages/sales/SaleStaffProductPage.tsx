import { Link } from 'react-router-dom'
import { Container, Button } from '@/components'
import {
  IoAdd,
  IoChevronDown,
  IoFilterOutline,
  IoSettingsOutline,
  IoEllipsisVertical,
  IoChevronForward
} from 'react-icons/io5'

export default function SaleStaffProductPage() {
  const metrics = [
    { title: 'Total Products', value: '1,240', trend: '+12%', subtext: '+48 from last month' },
    {
      title: 'Low Stock Items',
      value: '12',
      trend: '+5%',
      trendColor: 'text-rose-500 bg-rose-50',
      subtext: '+2 compared to last week'
    },
    {
      title: 'Out of Stock',
      value: '6',
      trend: '-2%',
      trendColor: 'text-emerald-500 bg-emerald-50',
      subtext: '-3 compared to yesterday'
    },
    { title: 'Avg. Profit Margin', value: '42%', trend: '+0.5%', subtext: '+2% from last year' }
  ]

  const products = [
    {
      id: '1004',
      category: 'Backpack',
      date: 'Since Aug, 2021',
      name: 'Noveli Backpack',
      email: 'noveli.info@eyewear.com',
      brand: 'Noveli Team',
      price: '¥ 489.00',
      stock: '350 items',
      status: 'Active'
    },
    {
      id: '2317',
      category: 'Sling Bag',
      date: 'Since Mar, 2021',
      name: 'Noveli Sling Bag',
      email: 'sling.bag@eyewear.com',
      brand: 'Product Team',
      price: '¥ 289.00',
      stock: '150 items',
      status: 'Active'
    },
    {
      id: '4241',
      category: 'Wallet',
      date: 'Since Feb, 2022',
      name: 'Noveli Brown Wallet',
      email: 'wallet.br@eyewear.com',
      brand: 'Design Team',
      price: '¥ 189.00',
      stock: '200 items',
      status: 'Active'
    },
    {
      id: '1007',
      category: 'Backpack',
      date: 'Since Apr, 2023',
      name: 'Noveli Sport Bag',
      email: 'sport.bag@eyewear.com',
      brand: 'Sport Team',
      price: '¥ 489.00',
      stock: '310 items',
      status: 'Active'
    }
  ]

  return (
    <Container className="max-w-[1600px] bg-[#f8f9fa] min-h-screen pb-10">
      {/* Breadcrumb Path */}
      <div className="flex items-center gap-2 text-sm pt-8 px-2 font-medium">
        <Link
          to="/salestaff/dashboard"
          className="text-neutral-400 hover:text-primary-500 transition-colors"
        >
          Dashboard
        </Link>
        <span className="text-neutral-300">/</span>
        <span className="text-primary-500 font-semibold">Product Management</span>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 pt-6">
        {metrics.map((m, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border-none">
            <div className="text-sm font-medium text-neutral-500 mb-4">{m.title}</div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl font-semibold text-neutral-800">{m.value}</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${m.trendColor || 'text-emerald-500 bg-emerald-50'}`}
              >
                {m.trend}
              </span>
            </div>
            <div className="text-xs text-neutral-400 font-medium">{m.subtext}</div>
          </div>
        ))}
      </div>

      {/* Main List Container */}
      <div className="bg-white rounded-[32px] shadow-sm overflow-hidden min-h-[600px] border-none">
        {/* Header Bar */}
        <div className="px-10 py-8 flex flex-col md:flex-row justify-between items-center gap-4 bg-white">
          <h2 className="text-2xl font-semibold text-[#0a1d37]">Product List</h2>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              leftIcon={<IoFilterOutline />}
              className="rounded-xl text-sm border-neutral-100 h-11 px-6 font-semibold text-[#3d4465] hover:bg-neutral-50 transition-colors"
            >
              Filter
            </Button>
            <Button
              colorScheme="primary"
              leftIcon={<IoAdd />}
              className="rounded-xl text-sm h-11 px-6 font-semibold bg-[#6EE7B7] hover:bg-[#5CD6A6] border-none shadow-sm"
            >
              Add Product
            </Button>
            <Button className="p-2 text-neutral-300 hover:text-neutral-500 transition-colors">
              <IoSettingsOutline size={22} className="opacity-60" />
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#fcfdfe] text-[10px] font-medium text-[#a4a9c1] uppercase tracking-widest border-b border-neutral-50/50">
              <tr>
                <th className="pl-10 px-6 py-5">
                  Product Name <IoChevronDown className="inline text-[10px] ml-1 opacity-50" />
                </th>
                <th className="px-6 py-5">
                  Category <IoChevronDown className="inline text-[10px] ml-1 opacity-50" />
                </th>
                <th className="px-6 py-5">
                  Brand <IoChevronDown className="inline text-[10px] ml-1 opacity-50" />
                </th>
                <th className="px-6 py-5">
                  Price <IoChevronDown className="inline text-[10px] ml-1 opacity-50" />
                </th>
                <th className="px-6 py-5">
                  Stock <IoChevronDown className="inline text-[10px] ml-1 opacity-50" />
                </th>
                <th className="px-6 py-5">
                  Status <IoChevronDown className="inline text-[10px] ml-1 opacity-50" />
                </th>
                <th className="pr-10 py-5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50/50">
              {products.map((p, idx) => (
                <tr key={idx} className="hover:bg-neutral-50/30 transition-colors group">
                  <td className="pl-10 px-6 py-6">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-[#0a1d37] mb-0.5">{p.name}</span>
                      <span className="text-[11px] text-[#a4a9c1] font-medium">{p.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-[#3d4465] mb-0.5">
                        {p.category}
                      </span>
                      <span className="text-[11px] text-[#a4a9c1] font-medium">{p.date}</span>
                    </div>
                  </td>
                  <td className="px-6 py-6 font-medium text-[#3d4465] text-sm">{p.brand}</td>
                  <td className="px-6 py-6 font-medium text-[#0a1d37] text-sm tracking-tight">
                    {p.price}
                  </td>
                  <td className="px-6 py-6 font-medium text-[#0a1d37] text-sm tracking-tight">
                    {p.stock}
                  </td>
                  <td className="px-6 py-6">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold bg-[#f1fcf6] text-[#63b38e] border border-[#e2f7eb]">
                      <div className="w-1 h-1 rounded-full bg-[#63b38e]" />
                      {p.status}
                    </span>
                  </td>
                  <td className="pr-10 py-6 text-right">
                    <Button className="text-neutral-300 hover:text-neutral-500 transition-colors">
                      <IoEllipsisVertical />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-10 py-10 flex justify-between items-center text-[11px] font-semibold text-[#a4a9c1] uppercase tracking-widest bg-white">
          <div className="flex items-center gap-1.5 p-1.5 bg-neutral-50/50 rounded-2xl border border-neutral-100">
            <Button className="w-9 h-9 flex items-center justify-center hover:bg-white hover:shadow-sm rounded-xl transition-all text-neutral-400">
              <IoChevronForward className="rotate-180" size={14} />
            </Button>
            <Button className="w-9 h-9 rounded-xl bg-white shadow-sm text-[#63b38e] flex items-center justify-center border border-neutral-100/50">
              1
            </Button>
            <Button className="w-9 h-9 rounded-xl hover:bg-white hover:shadow-sm flex items-center justify-center transition-all border border-transparent">
              2
            </Button>
            <Button className="w-9 h-9 rounded-xl hover:bg-white hover:shadow-sm flex items-center justify-center transition-all border border-transparent">
              3
            </Button>
            <Button className="w-9 h-9 flex items-center justify-center hover:bg-white hover:shadow-sm rounded-xl transition-all text-neutral-400">
              <IoChevronForward size={14} />
            </Button>
          </div>
          <span className="opacity-80">Page 1 of 10</span>
        </div>
      </div>
    </Container>
  )
}
