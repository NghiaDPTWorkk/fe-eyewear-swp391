import { useState, useCallback, useEffect } from 'react'
import { createPortal } from 'react-dom'
import TryOnConsentStep from './TryOnConsentStep'
import TryOnLoadingStep from './TryOnLoadingStep'
import TryOnWebcamView from './TryOnWebcamView'
import { useFaceLandmarker } from './useFaceLandmarker'

interface VirtualTryOnModalProps {
  isOpen: boolean
  onClose: () => void
  productName: string
  productImage: string
  productPrice: number
}

type TryOnStep = 'CONSENT' | 'LOADING' | 'TRYON'

export default function VirtualTryOnModal({
  isOpen,
  onClose,
  productName,
  productImage,
  productPrice
}: VirtualTryOnModalProps) {
  const [step, setStep] = useState<TryOnStep>('CONSENT')
  const [stream, setStream] = useState<MediaStream | null>(null)
  const faceLandmarker = useFaceLandmarker()

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

  const handleClose = useCallback(() => {
    console.log('[VirtualTryOnModal] handleClose triggered.')
    faceLandmarker.stopDetection()
    faceLandmarker.cleanup()
    stopStream()
    setStep('CONSENT')
    onClose()
  }, [onClose, stopStream, faceLandmarker])

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
      stopStream()
      setStep('CONSENT')
      onClose()
    }, 1000)
  }, [onClose, stopStream])

  if (!isOpen) return null

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4 transition-opacity duration-300 overflow-hidden">
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
            productImage={productImage}
            productPrice={productPrice}
            startDetection={faceLandmarker.startDetection}
            stopDetection={faceLandmarker.stopDetection}
            landmarksRef={faceLandmarker.landmarksRef}
            transformationMatricesRef={faceLandmarker.transformationMatricesRef}
          />
        )}
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}
