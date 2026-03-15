import { useState } from 'react'
import { Glasses } from 'lucide-react'

interface ModalSidebarProps {
  productName: string
  productImage: string
  visionNeed: string | null
}

export default function ModalSidebar({ productName, productImage, visionNeed }: ModalSidebarProps) {
  const [imageError, setImageError] = useState(false)

  return (
    <div className="hidden lg:flex w-1/2 bg-[#F8F9FA] items-center justify-center p-12 relative border-r border-mint-100">
      <div className="absolute top-8 left-8">
        <h2 className="text-xl font-bold text-mint-1200 tracking-tight uppercase">
          eyewear-optic.shop
        </h2>
      </div>

      <div className="flex flex-col items-center">
        {!imageError && productImage ? (
          <img
            src={productImage}
            alt={productName}
            className="w-full max-w-md object-contain mix-blend-multiply transition-transform hover:scale-105 duration-500"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-64 h-64 bg-mint-50 rounded-full flex items-center justify-center mb-4 border-4 border-white shadow-xl animate-in fade-in duration-700">
            <Glasses className="w-32 h-32 text-primary-300" strokeWidth={1.5} />
          </div>
        )}
        <div className="mt-8 text-center">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
            {productName}
          </p>
        </div>
      </div>

      {visionNeed && (
        <div className="absolute top-8 right-8 bg-white border border-mint-200 px-4 py-2 rounded-lg shadow-sm flex items-center gap-2">
          <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
          <span className="text-sm font-bold text-mint-1200 uppercase">
            {visionNeed.replace('-', ' ')}
          </span>
        </div>
      )}
    </div>
  )
}
