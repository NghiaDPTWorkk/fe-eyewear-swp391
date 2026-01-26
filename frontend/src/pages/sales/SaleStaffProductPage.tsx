import { Container, Card } from '@/components'

export default function SaleStaffProductPage() {
  return (
    <Container>
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm mb-2 font-medium">
          <a
            href="/salestaff/dashboard"
            className="text-neutral-400 hover:text-primary-500 transition-colors"
          >
            Dashboard
          </a>
          <span className="text-neutral-300">/</span>
          <span className="text-primary-500 font-bold">Products</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Product Catalog</h1>
        <p className="text-gray-500 mt-1">Browse and manage eyewear inventory.</p>
      </div>

      <Card className="p-12 text-center border-dashed bg-neutral-50/50">
        <h3 className="text-lg font-medium text-neutral-600">Product List Placeholder</h3>
        <p className="text-neutral-400 mt-2">
          Product management features will be implemented here.
        </p>
      </Card>
    </Container>
  )
}
