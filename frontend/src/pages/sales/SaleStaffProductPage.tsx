import { Link } from 'react-router-dom'
import { Container, Card, Button } from '@/components'
import { IoSearchOutline, IoAdd, IoFilter, IoCloudDownloadOutline } from 'react-icons/io5'

export default function SaleStaffProductPage() {
  const products = [
    {
      name: 'Ray-Ban Aviator Classic',
      desc: 'Gold Frame / G-15 Green Lens',
      sku: 'RB-3025-001',
      stock: 42,
      status: 'in stock',
      price: '$163.00'
    },
    {
      name: 'Oakley Plank 2.0',
      desc: 'Soft Touch Black',
      sku: 'OX-8081-01',
      stock: 5,
      status: 'low stock',
      price: '$186.00'
    },
    {
      name: 'Tom Ford Blue Block',
      desc: 'Shiny Black / Blue Block Lens',
      sku: 'TF-5555-B',
      stock: 0,
      status: 'out of stock',
      price: '$415.00'
    },
    {
      name: 'Gucci Round Metal',
      desc: 'Gold / Grey Gradient',
      sku: 'GG-0061S-01',
      stock: 18,
      status: 'in stock',
      price: '$350.00'
    },
    {
      name: 'Prada Symbole',
      desc: 'Black / Dark Grey',
      sku: 'PR-17WS-1AB5S0',
      stock: 24,
      status: 'in stock',
      price: '$460.00'
    },
    {
      name: 'Bvlgari Serpenti',
      desc: 'Black / Grey Gradient',
      sku: 'BV-8205-501/8G',
      stock: 3,
      status: 'low stock',
      price: '$380.00'
    },
    {
      name: 'Warby Parker Wilkie',
      desc: 'Eastern Bluebird Fade',
      sku: 'VP-1234-BLK',
      stock: 56,
      status: 'in stock',
      price: '$95.00'
    }
  ]

  const getStockStatusStyles = (status: string) => {
    switch (status) {
      case 'in stock':
        return 'text-emerald-500 bg-emerald-500'
      case 'low stock':
        return 'text-amber-500 bg-amber-500'
      case 'out of stock':
        return 'text-red-500 bg-red-500'
      default:
        return 'text-gray-400 bg-gray-400'
    }
  }

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
          <span className="text-primary-500 font-bold">Product Management</span>
        </div>
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Product Inventory</h1>
          <div className="flex gap-3">
            <div className="relative">
              <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search SKU, name or brand..."
                className="pl-10 pr-4 py-2 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 w-64"
              />
            </div>
            <Button
              variant="solid"
              colorScheme="primary"
              leftIcon={<IoAdd />}
              className="rounded-xl font-bold"
            >
              Add Product
            </Button>
          </div>
        </div>
      </div>

      <Card className="p-0 overflow-hidden border border-neutral-200 shadow-sm">
        <div className="p-4 border-b border-neutral-100 flex justify-between items-center bg-white">
          <div className="flex items-center gap-4">
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
              All Products{' '}
              <span className="ml-1 px-2 py-0.5 bg-neutral-100 rounded text-neutral-600">842</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-4 bg-neutral-200 rounded-full relative">
                <div className="absolute left-1 top-1 w-2 h-2 bg-white rounded-full"></div>
              </div>
              <span className="text-xs font-medium text-neutral-500 italic">Low Stock</span>
            </div>
            <div className="h-4 w-px bg-neutral-200"></div>
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
                  Thumbnail
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                  Stock Level
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-neutral-500 uppercase tracking-wider text-right">
                  Price
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {products.map((product, idx) => (
                <tr key={idx} className="hover:bg-neutral-50/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="w-12 h-10 bg-neutral-100 rounded-lg flex items-center justify-center border border-neutral-200/50">
                      <svg
                        className="w-6 h-6 text-neutral-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4.5c5 0 9 5 9 5s-4 5-9 5-9-5-9-5 4-5 9-5z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4.5l-2.5 3.5h5L12 4.5z"
                        />
                      </svg>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-neutral-900">{product.name}</div>
                    <div className="text-xs text-neutral-400 font-medium">{product.desc}</div>
                  </td>
                  <td className="px-6 py-4 text-xs font-mono text-neutral-500 uppercase">
                    {product.sku}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${getStockStatusStyles(product.status)}`}
                      ></span>
                      <span className="text-xs font-bold text-neutral-700">
                        {product.stock}{' '}
                        <span className="text-neutral-400 font-medium">{product.status}</span>
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-neutral-900 text-right">
                    {product.price}
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
