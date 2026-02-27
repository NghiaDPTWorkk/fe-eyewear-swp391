import { useRouteError, isRouteErrorResponse, useNavigate } from 'react-router-dom'
import { Container, Button } from '@/components'
import { IoAlertCircleOutline, IoHomeOutline, IoRefreshOutline } from 'react-icons/io5'

export default function RootErrorPage() {
  const error = useRouteError()
  const navigate = useNavigate()

  let errorMessage: string
  let errorStatus: number | string = 'Error'

  if (isRouteErrorResponse(error)) {
    errorMessage = error.statusText || error.data?.message || 'Page not found'
    errorStatus = error.status
  } else if (error instanceof Error) {
    errorMessage = error.message
  } else if (typeof error === 'string') {
    errorMessage = error
  } else {
    console.error(error)
    errorMessage = 'An unexpected error occurred'
  }

  return (
    <Container className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl border border-neutral-100 shadow-2xl p-8 md:p-12 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 mx-auto mb-8 shadow-inner">
          <IoAlertCircleOutline size={48} />
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2 font-primary">
          {errorStatus}
        </h1>
        <p className="text-gray-500 mb-8 font-medium leading-relaxed">
          {errorMessage === 'An unexpected error occurred'
            ? "Something went wrong on our end. We're working on fixing it."
            : errorMessage}
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="solid"
            className="flex-1 rounded-xl h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all active:scale-95 flex items-center justify-center gap-2"
            onClick={() => navigate('/')}
          >
            <IoHomeOutline size={20} />
            Back to Home
          </Button>
          <Button
            variant="outline"
            className="flex-1 rounded-xl h-12 border-neutral-200 hover:bg-neutral-50 text-neutral-600 font-bold transition-all active:scale-95 flex items-center justify-center gap-2"
            onClick={() => window.location.reload()}
          >
            <IoRefreshOutline size={20} />
            Try Again
          </Button>
        </div>

        <div className="mt-12 pt-8 border-t border-neutral-50">
          <p className="text-[10px] font-bold text-neutral-300 uppercase tracking-[0.2em]">
            OpticView Internal System
          </p>
        </div>
      </div>
    </Container>
  )
}
