import { Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/shared/components/ui'

export const EmptyCart = () => {
  const navigate = useNavigate()

  return (
    <div className="max-w-md mx-auto text-center py-20">
      <div className="w-24 h-24 bg-mint-300 rounded-full flex items-center justify-center mx-auto mb-6">
        <Trash2 className="w-10 h-10 text-gray-eyewear" />
      </div>
      <h1 className="text-3xl font-heading font-bold text-mint-1200 mb-4">Your bag is empty</h1>
      <p className="text-gray-eyewear mb-8">
        Looks like you haven't added anything to your bag yet. Explore our collection to find your
        perfect pair.
      </p>
      <Button
        size="lg"
        onClick={() => navigate('/eyeglasses')}
        className="px-10 py-4 rounded-xl shadow-lg"
      >
        Start Shopping
      </Button>
    </div>
  )
}
