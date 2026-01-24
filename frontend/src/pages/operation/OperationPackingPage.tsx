import { Container } from '@/components'
import OrderTable from '@/components/staff/ordertable/OrderTable'

export default function PackingPage() {
  return (
    <Container>
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
          <span>Cardboard</span>
          <span>/</span>
          <span className="text-gray-600 font-medium">Packing Station</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Packing Station</h1>
        <p className="text-gray-500 mt-1">Finalize orders and prepare them for delivery.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-0">
          <OrderTable hiddenColumns={['WAITING FOR']} />
        </div>
      </div>
    </Container>
  )
}
