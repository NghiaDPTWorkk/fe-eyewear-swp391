import { useAuthStore } from '@/store'
import { PenTool, Database, Lock } from 'lucide-react'
import { Card, Button } from '@/shared/components/ui'

interface StepPrescriptionOptionProps {
  onSelect: (option: 'manual' | 'saved') => void
}

export default function StepPrescriptionOption({ onSelect }: StepPrescriptionOptionProps) {
  const { isAuthenticated } = useAuthStore()

  // handleSavedSelect is no longer needed as logic is embedded in JSX

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <h2 className="text-3xl font-heading font-bold text-mint-1200 mb-2">
        Enter your prescription
      </h2>
      <p className="text-gray-eyewear mb-2">
        We'll create a lens tailor-made to your vision needs. Don't have a valid prescription?
      </p>
      <Button className="text-sm font-bold text-primary-500 hover:underline mb-10">
        Find Eye Doctors Near You
      </Button>

      <div className="space-y-4">
        <Card
          onClick={() => onSelect('manual')}
          className="w-full flex items-center p-6 border-2 border-mint-200 rounded-2xl hover:border-primary-500 hover:bg-primary-50 transition-all duration-300 group text-left cursor-pointer"
        >
          <div className="w-16 h-16 bg-mint-50 border border-mint-100 rounded-xl flex items-center justify-center mr-6 group-hover:bg-primary-500 transition-colors shrink-0">
            <PenTool className="w-8 h-8 text-primary-500 group-hover:text-white transition-colors" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-mint-1200 group-hover:text-primary-600 transition-colors uppercase tracking-tight">
              Manual Entry
            </h3>
            <p className="text-sm text-gray-eyewear leading-relaxed">
              Enter your prescription details manually from your doctor's report.
            </p>
          </div>
        </Card>

        <Card
          onClick={() => (isAuthenticated ? onSelect('saved') : null)}
          className={`w-full flex items-center p-6 border-2 transition-all duration-300 group text-left relative ${
            isAuthenticated
              ? 'border-mint-200 hover:border-primary-500 hover:bg-primary-50 cursor-pointer'
              : 'border-gray-100 opacity-80'
          }`}
        >
          <div
            className={`w-16 h-16 border rounded-xl flex items-center justify-center mr-6 transition-colors shrink-0 ${
              isAuthenticated
                ? 'bg-mint-50 border-mint-100 group-hover:bg-primary-500'
                : 'bg-gray-50 border-gray-100 text-gray-400'
            }`}
          >
            <Database
              className={`w-8 h-8 ${isAuthenticated ? 'text-primary-500 group-hover:text-white' : ''}`}
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3
                className={`text-lg font-bold uppercase tracking-tight ${isAuthenticated ? 'text-mint-1200 group-hover:text-primary-600' : 'text-gray-400'}`}
              >
                Use Saved Prescription
              </h3>
              {!isAuthenticated && <Lock className="w-4 h-4 text-gray-400" />}
            </div>
            <p className="text-sm text-gray-eyewear leading-relaxed">
              Quickly fill using your prescription data stored in your account.
            </p>
          </div>

          {!isAuthenticated && (
            <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] flex items-center justify-center rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity p-6 text-center">
              <div className="bg-white p-4 rounded-xl shadow-lg border border-mint-100">
                <p className="text-xs font-bold text-mint-1200 mb-2">
                  Login required to use saved prescriptions
                </p>
                <Button size="sm" onClick={() => (window.location.href = '/login')}>
                  Log In Now
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
