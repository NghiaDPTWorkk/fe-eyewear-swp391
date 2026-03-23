import { ShieldCheck, X } from 'lucide-react'
import { Button } from '@/shared/components/ui'

interface TryOnConsentStepProps {
  onAgree: () => void
  onDisagree: () => void
}

export default function TryOnConsentStep({ onAgree, onDisagree }: TryOnConsentStepProps) {
  return (
    <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden">
      {/* Header with close */}
      <div className="flex justify-end p-4 pb-0">
        <button
          onClick={onDisagree}
          className="p-2 hover:bg-mint-50 rounded-full transition-colors group"
          title="Close"
        >
          <X className="w-5 h-5 text-gray-eyewear group-hover:text-mint-1200 transition-colors" />
        </button>
      </div>

      {/* Content */}
      <div className="px-8 pb-8 pt-2">
        {/* Face illustration area */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-mint-100 flex items-center justify-center">
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="20"
                cy="16"
                r="12"
                stroke="#a8e0d1"
                strokeWidth="2"
                strokeDasharray="4 3"
              />
              <circle cx="14" cy="14" r="2" fill="#a8e0d1" />
              <circle cx="26" cy="14" r="2" fill="#a8e0d1" />
              <path
                d="M14 22 Q20 28 26 22"
                stroke="#a8e0d1"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </div>
        </div>

        <h2 className="text-xl font-heading font-bold text-mint-1200 text-center mb-6">
          We detect generic points on your face, and that's it!
        </h2>

        {/* Privacy bullets */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-4 h-4 text-primary-500" />
            </div>
            <span className="text-sm text-gray-eyewear font-medium">
              No facial recognition or identification
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-4 h-4 text-primary-500" />
            </div>
            <span className="text-sm text-gray-eyewear font-medium">
              No storage or sharing of your image
            </span>
          </div>
        </div>

        <p className="text-xs text-gray-eyewear text-center mb-8">
          Please read our{' '}
          <a
            href="#"
            className="font-bold text-mint-1200 hover:text-primary-500 underline transition-colors"
          >
            privacy policy
          </a>{' '}
          before accessing the service.
        </p>

        {/* Action buttons */}
        <div className="flex gap-4">
          <Button
            variant="outline"
            colorScheme="neutral"
            size="lg"
            isFullWidth
            onClick={onDisagree}
            className="rounded-2xl h-14 border-mint-300 hover:bg-mint-50"
          >
            I disagree
          </Button>
          <Button
            variant="solid"
            colorScheme="primary"
            size="lg"
            isFullWidth
            onClick={onAgree}
            className="rounded-2xl h-14 shadow-lg hover:shadow-xl"
          >
            I agree
          </Button>
        </div>
      </div>
    </div>
  )
}
