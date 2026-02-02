import { useState } from 'react'
import type { VisionNeed, LensSelectionState, PrescriptionData } from './types'
import StepVisionNeed from './StepVisionNeed'
import StepLensChoice from './StepLensChoice'
import StepPrescriptionOption from './StepPrescriptionOption'
import StepManualPrescription from './StepManualPrescription'
import StepSavedPrescription from './StepSavedPrescription'
import ModalSidebar from './ModalSidebar'
import ModalHeader from './ModalHeader'
import { Button } from '@/components'

interface LensSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (selection: LensSelectionState) => void
  productName: string
  productImage: string
  productType: string
}

type Step = 'VISION_NEED' | 'LENS_CHOICE' | 'PRESCRIPTION_OPTION' | 'MANUAL_RX' | 'SAVED_RX'

const ALL_STEPS: Step[] = ['VISION_NEED', 'LENS_CHOICE', 'PRESCRIPTION_OPTION', 'MANUAL_RX']

export default function LensSelectionModal({
  isOpen,
  onClose,
  onConfirm,
  productName,
  productImage,
  productType
}: LensSelectionModalProps) {
  const [step, setStep] = useState<Step>(
    productType === 'lens' ? 'PRESCRIPTION_OPTION' : 'VISION_NEED'
  )
  const [state, setState] = useState<LensSelectionState>({
    visionNeed: null,
    lensId: null,
    prescription: null,
    useSavedPrescription: false
  })

  if (!isOpen) return null

  const handleVisionNeedSelect = (need: VisionNeed) => {
    setState((prev) => ({ ...prev, visionNeed: need }))
    if (need === 'non-prescription') {
      onConfirm({ ...state, visionNeed: need })
      onClose()
    } else {
      setStep('LENS_CHOICE')
    }
  }

  const handleLensSelect = (lensId: string) => {
    setState((prev) => ({ ...prev, lensId }))
    setStep('PRESCRIPTION_OPTION')
  }

  const handleBack = () => {
    if (step === 'LENS_CHOICE') setStep('VISION_NEED')
    else if (step === 'PRESCRIPTION_OPTION') {
      if (productType === 'lens') onClose()
      else setStep('LENS_CHOICE')
    } else if (step === 'MANUAL_RX' || step === 'SAVED_RX') setStep('PRESCRIPTION_OPTION')
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="bg-white w-full max-w-5xl h-[90vh] rounded-3xl overflow-hidden flex shadow-2xl animate-in zoom-in-95 duration-300">
        <ModalSidebar
          key={productImage}
          productName={productName}
          productImage={productImage}
          visionNeed={state.visionNeed}
        />

        <div className="w-full lg:w-1/2 flex flex-col h-full bg-white relative">
          <ModalHeader
            currentStep={step}
            onBack={handleBack}
            onClose={onClose}
            showBackButton={
              step !== 'VISION_NEED' && (productType !== 'lens' || step !== 'PRESCRIPTION_OPTION')
            }
            steps={ALL_STEPS}
          />

          <div className="flex-1 overflow-y-auto overflow-x-hidden p-8 lg:p-12 custom-scrollbar">
            {step === 'VISION_NEED' && <StepVisionNeed onSelect={handleVisionNeedSelect} />}
            {step === 'LENS_CHOICE' && <StepLensChoice onSelect={handleLensSelect} />}
            {step === 'PRESCRIPTION_OPTION' && (
              <StepPrescriptionOption
                onSelect={(opt: 'manual' | 'saved') =>
                  setStep(opt === 'manual' ? 'MANUAL_RX' : 'SAVED_RX')
                }
              />
            )}
            {step === 'MANUAL_RX' && (
              <StepManualPrescription
                onSubmit={(rx: PrescriptionData) => {
                  onConfirm({ ...state, prescription: rx, useSavedPrescription: false })
                  onClose()
                }}
              />
            )}
            {step === 'SAVED_RX' && (
              <StepSavedPrescription
                onSelect={(rx: PrescriptionData) => {
                  onConfirm({ ...state, prescription: rx, useSavedPrescription: true })
                  onClose()
                }}
              />
            )}
          </div>

          <div className="p-8 border-t border-mint-100 bg-[#F8F9FA]/50 flex justify-between items-center">
            <Button className="text-sm font-bold text-primary-500 hover:underline uppercase tracking-wider transition-all">
              Add insurance benefits
            </Button>
            <div className="text-right">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                Frame Price
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-xs font-bold text-mint-1200">$</span>
                <span className="text-2xl font-bold text-mint-1200 tracking-tight">117.50</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
