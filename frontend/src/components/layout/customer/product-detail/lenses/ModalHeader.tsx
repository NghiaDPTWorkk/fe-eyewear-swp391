import { X, ChevronLeft } from 'lucide-react'

interface ModalHeaderProps {
  currentStep: string
  onBack: () => void
  onClose: () => void
  showBackButton: boolean
  steps: string[]
}

export default function ModalHeader({
  currentStep,
  onBack,
  onClose,
  showBackButton,
  steps
}: ModalHeaderProps) {
  return (
    <div className="flex justify-between items-center p-6 border-b border-mint-100">
      {showBackButton ? (
        <button
          onClick={onBack}
          className="p-2 hover:bg-mint-50 rounded-full transition-colors group"
          title="Back"
        >
          <ChevronLeft className="w-6 h-6 text-mint-1200 group-hover:scale-110 transition-transform" />
        </button>
      ) : (
        <div className="w-10" />
      )}

      <div className="flex-1 flex justify-center">
        <div className="flex gap-2">
          {steps.map((s) => (
            <div
              key={s}
              className={`h-1.5 w-10 rounded-full transition-all duration-300 ${
                currentStep === s ? 'bg-primary-500' : 'bg-mint-100'
              }`}
            />
          ))}
        </div>
      </div>

      <button
        onClick={onClose}
        className="p-2 hover:bg-mint-50 rounded-full transition-colors group"
        title="Close"
      >
        <X className="w-6 h-6 text-mint-1200 group-hover:scale-110 transition-transform" />
      </button>
    </div>
  )
}
