import { Link } from 'react-router-dom'
import { Container, Card, Button } from '@/components'
import {
  IoSearchOutline,
  IoAdd,
  IoMailOutline,
  IoCallOutline,
  IoFilter,
  IoCloudDownloadOutline
} from 'react-icons/io5'

export default function SaleStaffCustomerPage() {
  const customers = [
    {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1 (555) 000-1111',
      orders: 12,
      lastVisit: 'Oct 24, 2023',
      status: 'Active'
    },
    {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '+1 (555) 222-3333',
      orders: 4,
      lastVisit: 'Sep 12, 2023',
      status: 'Active'
    },
    {
      name: 'Alice Johnson',
      email: 'alice.j@example.com',
      phone: '+1 (555) 444-5555',
      orders: 1,
      lastVisit: 'Oct 05, 2023',
      status: 'New'
    },
    {
      name: 'Robert Brown',
      email: 'robert.b@example.com',
      phone: '+1 (555) 666-7777',
      orders: 25,
      lastVisit: 'Aug 28, 2023',
      status: 'Inactive'
    },
    {
      name: 'Emily Davis',
      email: 'emily.d@example.com',
      phone: '+1 (555) 888-9999',
      orders: 8,
      lastVisit: 'Oct 20, 2023',
      status: 'Active'
    }
  ]

  return (
    <Container>
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm mb-2 font-medium">
          <Link
            to="/salestaff/dashboard"
            className="text-neutral-400 hover:text-primary-500 transition-colors"
          >
            Dashboard
          </Link>
          <span className="text-neutral-300">/</span>
          <span className="text-primary-500 font-bold">Customer Management</span>
        </div>
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Customer Database</h1>
          <div className="flex gap-3">
            <div className="relative">
              <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search name, email, phone..."
                className="pl-10 pr-4 py-2 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 w-64"
              />
            </div>
            <Button
              variant="solid"
              colorScheme="primary"
              leftIcon={<IoAdd />}
              className="rounded-xl font-bold"
            >
              Add Customer
            </Button>
          </div>
        </div>
      </div>

      <Card className="p-0 overflow-hidden border border-neutral-200 shadow-sm">
        <div className="p-4 border-b border-neutral-100 flex justify-between items-center bg-white">
          <div className="flex items-center gap-4">
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
              Total Customers{' '}
              <span className="ml-1 px-2 py-0.5 bg-neutral-100 rounded text-neutral-600">
                1,240
              </span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              colorScheme="neutral"
              leftIcon={<IoFilter />}
              className="border-neutral-200 text-neutral-600 rounded-lg"
            >
              Filter
            </Button>
            <Button
              variant="outline"
              size="sm"
              colorScheme="neutral"
              leftIcon={<IoCloudDownloadOutline />}
              className="border-neutral-200 text-neutral-600 rounded-lg"
            >
              Export
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50/50 border-b border-neutral-100">
                <th className="px-6 py-4 text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-neutral-500 uppercase tracking-wider text-center">
                  Total Orders
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                  Last Visit
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-neutral-500 uppercase tracking-wider text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {customers.map((customer, idx) => (
                <tr key={idx} className="hover:bg-neutral-50/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center text-xs font-bold ring-2 ring-white">
                        {customer.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="text-sm font-bold text-neutral-900">{customer.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-xs text-neutral-500">
                        <IoMailOutline className="text-neutral-300" />
                        {customer.email}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-neutral-500">
                        <IoCallOutline className="text-neutral-300" />
                        {customer.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-neutral-700 text-center">
                    {customer.orders}
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-neutral-500">
                    {customer.lastVisit}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        customer.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-600'
                          : customer.status === 'New'
                            ? 'bg-blue-50 text-blue-600'
                            : 'bg-neutral-100 text-neutral-500'
                      }`}
                    >
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-xs font-bold text-primary-500 hover:text-primary-600 transition-colors uppercase tracking-widest">
                      View Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </Container>
  )
}
