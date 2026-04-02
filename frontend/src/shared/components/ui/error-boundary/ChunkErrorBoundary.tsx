import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasChunkError: boolean
}

/**
 * ErrorBoundary that auto-reloads the page when a dynamic import (chunk) fails.
 * This typically happens after a new deployment when the browser has cached
 * references to old chunk filenames that no longer exist on the server.
 */
export class ChunkErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasChunkError: false }
  }

  static getDerivedStateFromError(error: Error): State | null {
    // Detect chunk/dynamic import errors
    if (
      error.message.includes('Failed to fetch dynamically imported module') ||
      error.message.includes('Importing a module script failed') ||
      error.message.includes('Loading chunk') ||
      error.message.includes('Loading CSS chunk')
    ) {
      return { hasChunkError: true }
    }
    return null
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const isChunkError =
      error.message.includes('Failed to fetch dynamically imported module') ||
      error.message.includes('Importing a module script failed') ||
      error.message.includes('Loading chunk') ||
      error.message.includes('Loading CSS chunk')

    if (isChunkError) {
      // Only auto-reload ONCE. If already reloaded, show fallback UI instead.
      const hasReloaded = sessionStorage.getItem('chunk_error_reloaded')

      if (!hasReloaded) {
        sessionStorage.setItem('chunk_error_reloaded', 'true')
        window.location.reload()
      }
      // If hasReloaded is true, we already tried → don't reload again, show fallback UI
    } else {
      console.error('Unhandled error:', error, errorInfo)
    }
  }

  render() {
    if (this.state.hasChunkError) {
      // Fallback UI — shown if auto-reload already happened but error persists
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            fontFamily: 'Inter, sans-serif',
            color: '#043026',
            gap: '16px'
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              border: '4px solid #e0f2ed',
              borderTop: '4px solid #4ad7b0',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite'
            }}
          />
          <p style={{ fontSize: '14px', fontWeight: 600 }}>A new version is available</p>
          <button
            onClick={() => {
              sessionStorage.removeItem('chunk_error_reloaded')
              window.location.reload()
            }}
            style={{
              marginTop: '8px',
              padding: '10px 28px',
              fontSize: '14px',
              fontWeight: 700,
              color: '#fff',
              backgroundColor: '#4ad7b0',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer'
            }}
          >
            Reload Page
          </button>
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
      )
    }

    return this.props.children
  }
}
