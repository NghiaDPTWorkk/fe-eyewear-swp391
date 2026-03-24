import { useState, useCallback, useEffect } from 'react'
import { createPortal } from 'react-dom'
import TryOnConsentStep from './TryOnConsentStep'
import TryOnLoadingStep from './TryOnLoadingStep'
import TryOnWebcamView from './TryOnWebcamView'
import { useFaceLandmarker } from './useFaceLandmarker'
import type { Variant } from '@/shared/types/variant.types'

interface VirtualTryOnModalProps {
  isOpen: boolean
  onClose: () => void
  productName: string
  // For multiple variants support
  variants?: Variant[]
  initialVariantIndex?: number
  onVariantSelect?: (index: number) => void
  // Fallbacks if no variants provided
  productImage: string
  productPrice: number
  virTryOnUrl?: string | null
  // Actions
  onAddToCart: (variant?: Variant) => void
  onAddToWishlist: () => void
  isFavorite: boolean
}

type TryOnStep = 'CONSENT' | 'LOADING' | 'TRYON'

export default function VirtualTryOnModal({
  isOpen,
  onClose,
  productName,
  variants = [],
  initialVariantIndex = 0,
  onVariantSelect,
  productImage,
  productPrice,
  virTryOnUrl,
  onAddToCart,
  onAddToWishlist,
  isFavorite
}: VirtualTryOnModalProps) {
  const [step, setStep] = useState<TryOnStep>('CONSENT')
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(initialVariantIndex)
  const faceLandmarker = useFaceLandmarker()

  // Update selected variant when initial variant changes (e.g. if opened with different variant)
  useEffect(() => {
    if (isOpen) {
      setSelectedVariantIdx(initialVariantIndex)
    }
  }, [isOpen, initialVariantIndex])

  const handleVariantSelect = useCallback(
    (idx: number) => {
      setSelectedVariantIdx(idx)
      onVariantSelect?.(idx)
    },
    [onVariantSelect]
  )

  // Debug global errors
  useEffect(() => {
    const handleError = (e: ErrorEvent) => {
      console.error('[GLOBAL ERROR]:', e.error)
    }
    window.addEventListener('error', handleError)
    return () => window.removeEventListener('error', handleError)
  }, [])

  // Lock scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      console.log('[VirtualTryOnModal] OPENED - scroll locked.')
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const stopStream = useCallback(
    (s?: MediaStream | null) => {
      const target = s ?? stream
      if (target) {
        console.log('[VirtualTryOnModal] Stopping camera tracks.')
        target.getTracks().forEach((track) => track.stop())
      }
      setStream(null)
    },
    [stream]
  )

  useEffect(() => {
    if (!isOpen) {
      console.log('[VirtualTryOnModal] isOpen turned false, cleaning up.')
      faceLandmarker.stopDetection()
      faceLandmarker.cleanup()
      stopStream()
      setStep('CONSENT')
    }
  }, [isOpen, faceLandmarker, stopStream])

  const handleClose = useCallback(() => {
    console.log('[VirtualTryOnModal] handleClose triggered.')
    onClose()
  }, [onClose])

  const handleAgree = useCallback(() => {
    console.log('[VirtualTryOnModal] handleAgree (CONSENT -> LOADING).')
    setStep('LOADING')
  }, [])

  const handleReady = useCallback((newStream: MediaStream) => {
    console.log('[VirtualTryOnModal] handleReady (LOADING -> TRYON).')
    setStream(newStream)
    setStep('TRYON')
  }, [])

  const handleLoadError = useCallback(() => {
    console.error('[VirtualTryOnModal] handleLoadError.')
    // Don't close immediately to let the user see the error toast
    setTimeout(() => {
      onClose()
    }, 1000)
  }, [onClose])

  if (!isOpen) return null

  // Current product info based on selected variant if available
  const currentVariant = variants[selectedVariantIdx]
  const displayImage = currentVariant?.imgs?.[0] || productImage
  const displayPrice = currentVariant?.price ?? productPrice
  const displayVirTryOnUrl = currentVariant?.virTryOnUrl ?? virTryOnUrl

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4 transition-opacity duration-300 overflow-hidden text-mint-1200">
      <div className="w-full h-full flex items-center justify-center animate-fade-in-up">
        {step === 'CONSENT' && <TryOnConsentStep onAgree={handleAgree} onDisagree={handleClose} />}
        {step === 'LOADING' && (
          <TryOnLoadingStep
            key="loading-step"
            onReady={handleReady}
            onError={handleLoadError}
            initModel={faceLandmarker.initModel}
          />
        )}
        {step === 'TRYON' && stream && (
          <TryOnWebcamView
            key="webcam-view"
            onClose={handleClose}
            stream={stream}
            productName={productName}
            productImage={displayImage}
            productPrice={currentVariant?.finalPrice ?? displayPrice}
            virTryOnUrl={displayVirTryOnUrl}
            variants={variants}
            selectedVariantIdx={selectedVariantIdx}
            onVariantSelect={handleVariantSelect}
            startDetection={faceLandmarker.startDetection}
            stopDetection={faceLandmarker.stopDetection}
            landmarksRef={faceLandmarker.landmarksRef}
            transformationMatricesRef={faceLandmarker.transformationMatricesRef}
            onAddToCart={() => onAddToCart(currentVariant)}
            onAddToWishlist={onAddToWishlist}
            isFavorite={isFavorite}
          />
        )}
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}
