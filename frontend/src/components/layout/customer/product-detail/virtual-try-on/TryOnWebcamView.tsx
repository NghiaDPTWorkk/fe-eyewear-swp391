import { useEffect, useRef } from 'react'
import { X, Heart, Camera, ShoppingCart } from 'lucide-react'
import { Button } from '@/shared/components/ui'
import { VNDPrice } from '@/shared/components/ui/vnd-price/VNDPrice'
import type { NormalizedLandmark } from '@mediapipe/tasks-vision'
import GlassesOverlay from './GlassesOverlay'

interface TryOnWebcamViewProps {
  onClose: () => void
  stream: MediaStream
  productName: string
  productImage: string
  productPrice: number
  startDetection: (video: HTMLVideoElement) => void
  stopDetection: () => void
  landmarksRef: React.RefObject<NormalizedLandmark[][]>
  transformationMatricesRef: React.RefObject<Float32Array[]>
}

export default function TryOnWebcamView({
  onClose,
  stream,
  productName,
  productImage,
  productPrice,
  startDetection,
  stopDetection,
  landmarksRef,
  transformationMatricesRef
}: TryOnWebcamViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video || !stream) return

    video.srcObject = stream
    video
      .play()
      .then(() => {
        // Start face detection once video is playing
        startDetection(video)
      })
      .catch((error) => {
        if (error.name !== 'AbortError') {
          console.error('Video play error:', error)
        }
      })

    return () => {
      // Stop detection loop
      stopDetection()

      // Detach the media stream from the video element
      video.srcObject = null

      // NOTE: Do NOT stop stream tracks here — React strict mode re-runs
      // effects in dev, which would kill the stream on first mount.
      // The parent VirtualTryOnModal handles stream cleanup via handleClose.
    }
  }, [stream, startDetection, stopDetection])

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

        {/* Webcam feed + glasses overlay */}
        <div className="relative aspect-[3/4] w-full overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover scale-x-[-1]"
          />

          {/* Glasses overlay canvas */}
          <GlassesOverlay
            videoRef={videoRef}
            landmarksRef={landmarksRef}
            transformationMatricesRef={transformationMatricesRef}
            glassesImageUrl={productImage}
          />

          {/* Face guide overlay (hidden once landmarks detected) */}
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
                <VNDPrice amount={productPrice} />
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
