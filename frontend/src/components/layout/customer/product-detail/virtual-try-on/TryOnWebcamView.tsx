import { useEffect, useRef } from 'react'
import { X, Heart, Camera, ShoppingCart } from 'lucide-react'
import { Button } from '@/shared/components/ui'

interface TryOnWebcamViewProps {
  onClose: () => void
  stream: MediaStream
  productName: string
  productImage: string
  productPrice: number
}

export default function TryOnWebcamView({
  onClose,
  stream,
  productName,
  productImage,
  productPrice
}: TryOnWebcamViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video || !stream) return

    video.srcObject = stream
    video.play().catch(console.error)

    return () => {
      video.srcObject = null
    }
  }, [stream])

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div
        className="relative w-full max-w-md bg-black rounded-3xl overflow-hidden shadow-2xl animate-fade-in-up flex flex-col"
        style={{ maxHeight: '85vh' }}
      >
        {/* Top overlay buttons */}
        <div className="absolute top-0 left-0 right-0 z-10 flex justify-between items-start p-3">
          {/* Menu dots */}
          <button className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors">
            <div className="flex gap-0.5">
              <span className="w-1 h-1 rounded-full bg-white" />
              <span className="w-1 h-1 rounded-full bg-white" />
              <span className="w-1 h-1 rounded-full bg-white" />
            </div>
          </button>

          <div className="flex flex-col gap-2">
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors group"
            >
              <X className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
            </button>
            <button className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors group">
              <Heart className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>

        {/* Webcam feed */}
        <div className="relative aspect-[3/4] w-full overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover scale-x-[-1]"
          />

          {/* Face guide overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-44 h-56 rounded-[50%] border-2 border-dashed border-white/15" />
          </div>
        </div>

        {/* Bottom product bar */}
        <div className="bg-white px-4 py-3 flex items-center gap-3">
          <button className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center hover:bg-primary-600 transition-colors flex-shrink-0 shadow-md">
            <Camera className="w-5 h-5 text-white" />
          </button>

          <div className="flex items-center gap-2 flex-1 min-w-0">
            {productImage && (
              <img
                src={productImage}
                alt={productName}
                className="w-9 h-9 rounded-lg object-cover border border-mint-200 flex-shrink-0"
              />
            )}
            <div className="min-w-0">
              <p className="text-xs font-bold text-mint-1200 truncate">{productName}</p>
              <p className="text-xs text-gray-eyewear">
                ${productPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          <Button
            size="sm"
            className="rounded-xl shadow-md flex-shrink-0 px-4"
            leftIcon={<ShoppingCart className="w-3.5 h-3.5" />}
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  )
}
