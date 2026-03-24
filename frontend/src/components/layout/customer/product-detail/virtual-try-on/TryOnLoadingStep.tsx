import { useEffect, useRef } from 'react'
import { Video, ShieldCheck } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface TryOnLoadingStepProps {
  onReady: (stream: MediaStream) => void
  onError: () => void
  initModel: () => Promise<void>
}

export default function TryOnLoadingStep({ onReady, onError, initModel }: TryOnLoadingStepProps) {
  const hasRequested = useRef(false)

  useEffect(() => {
    if (hasRequested.current) return
    hasRequested.current = true

    const initialize = async () => {
      console.log('[TryOnLoadingStep] Initialization START.')
      try {
        console.log('[TryOnLoadingStep] 1. Requesting CAMERA/USER_MEDIA...')
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false
        })
        console.log('[TryOnLoadingStep] Camera READY.')

        console.log('[TryOnLoadingStep] 2. Initializing AI MODEL...')
        await initModel()
        console.log('[TryOnLoadingStep] Model READY.')

        // Small delay so the user sees the loading animation finished
        setTimeout(() => {
          console.log('[TryOnLoadingStep] Triggering onReady callback.')
          onReady(stream)
        }, 300)
      } catch (err) {
        console.error('[TryOnLoadingStep] Initialization FAILED:', err)
        toast.error(
          'Failed to initialize Virtual Try-On. Please allow camera permissions and try again.'
        )
        onError()
      }
    }

    initialize()
  }, [onReady, onError, initModel])

  return (
    <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden">
      <div className="px-8 py-10 flex flex-col items-center text-center">
        {/* Camera icon with spinning ring */}
        <div className="relative mb-8">
          <div className="w-20 h-20 rounded-full border-[3px] border-mint-300 border-t-primary-500 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Video className="w-8 h-8 text-gray-eyewear" />
          </div>
        </div>

        <h2 className="text-lg font-heading font-bold text-mint-1200 mb-2">
          Initializing AI Engine
        </h2>
        <p className="text-sm text-gray-eyewear mb-6">
          Loading face detection model & calibrating camera...
        </p>

        {/* Animated dots */}
        <div className="flex gap-2 mb-8">
          <span
            className="w-2.5 h-2.5 rounded-full bg-primary-400 animate-bounce"
            style={{ animationDelay: '0ms' }}
          />
          <span
            className="w-2.5 h-2.5 rounded-full bg-primary-400 animate-bounce"
            style={{ animationDelay: '150ms' }}
          />
          <span
            className="w-2.5 h-2.5 rounded-full bg-primary-400 animate-bounce"
            style={{ animationDelay: '300ms' }}
          />
        </div>

        {/* Privacy badge */}
        <div className="flex items-center gap-2 text-xs text-gray-eyewear font-bold uppercase tracking-widest">
          <ShieldCheck className="w-4 h-4 text-primary-500" />
          Privacy-First Processing
        </div>
      </div>
    </div>
  )
}
