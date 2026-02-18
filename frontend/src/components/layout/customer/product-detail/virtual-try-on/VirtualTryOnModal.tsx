import { useState, useCallback } from 'react'
import TryOnConsentStep from './TryOnConsentStep'
import TryOnLoadingStep from './TryOnLoadingStep'
import TryOnWebcamView from './TryOnWebcamView'

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

  const stopStream = useCallback(
    (s?: MediaStream | null) => {
      const target = s ?? stream
      if (target) {
        target.getTracks().forEach((track) => track.stop())
      }
      setStream(null)
    },
    [stream]
  )

  const handleClose = useCallback(() => {
    stopStream()
    setStep('CONSENT')
    onClose()
  }, [onClose, stopStream])

  const handleAgree = useCallback(() => {
    setStep('LOADING')
  }, [])

  const handleStreamReady = useCallback((newStream: MediaStream) => {
    setStream(newStream)
    setStep('TRYON')
  }, [])

  const handleStreamError = useCallback(() => {
    stopStream()
    setStep('CONSENT')
    onClose()
  }, [onClose, stopStream])

  if (!isOpen) return null

  return (
    <>
      {step === 'CONSENT' && <TryOnConsentStep onAgree={handleAgree} onDisagree={handleClose} />}
      {step === 'LOADING' && (
        <TryOnLoadingStep onStreamReady={handleStreamReady} onError={handleStreamError} />
      )}
      {step === 'TRYON' && stream && (
        <TryOnWebcamView
          onClose={handleClose}
          stream={stream}
          productName={productName}
          productImage={productImage}
          productPrice={productPrice}
        />
      )}
    </>
  )
}
