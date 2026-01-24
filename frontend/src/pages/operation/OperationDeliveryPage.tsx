import { Container } from '@/components'
import OrderTable from '@/components/staff/ordertable/OrderTable'

export default function OperationDeliveryPage() {
  return (
    <Container>
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-neutral-400 mb-2">
          <a href="/operationstaff/dashboard" className="hover:text-mint-600 transition-colors">
            Dashboard
          </a>
          <span>/</span>
          <span className="text-mint-600 font-bold">Delivery Handover</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Delivery Handover</h1>
        <p className="text-gray-500 mt-1">
          Final check and handover of orders to logistics partners.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-0">
          <OrderTable hiddenColumns={['WAITING FOR']} />
        </div>
      </div>
    </Container>
  )
}
