import { queryClient } from '@/lib/react-query'
import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes'

import { Toaster } from 'react-hot-toast'
import { ChunkErrorBoundary } from '@/shared/components/ui/error-boundary/ChunkErrorBoundary'
import { useSocketNotifications } from './socket/useSocketNotifications'

function App() {
  useSocketNotifications()

  return (
    <QueryClientProvider client={queryClient}>
      <ChunkErrorBoundary>
        <RouterProvider router={router} />
      </ChunkErrorBoundary>
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#043026',
            color: '#fff',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: '600',
            padding: '12px 24px'
          },
          success: {
            iconTheme: {
              primary: '#4ad7b0',
              secondary: '#fff'
            }
          }
        }}
      />
    </QueryClientProvider>
  )
}

export default App
