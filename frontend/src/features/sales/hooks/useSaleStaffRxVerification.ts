/**
 * Custom hook for Prescription (Rx) Verification.
 * Handles the side-by-side comparison workflow: image vs user data.
 */
import { useState, useCallback } from 'react'

// Types
export interface RxData {
  od: { sph: string; cyl: string; axis: string; add: string; pd: string }
  os: { sph: string; cyl: string; axis: string; add: string; pd: string }
}

export interface RxOrder {
  id: string
  customerName: string
  email: string
  submittedAt: string
  imageUrl: string
  userData: RxData
  status: 'pending' | 'approved' | 'rejected'
}

interface UseRxVerificationReturn {
  // State
  selectedRxId: string | null
  isComparing: boolean
  // Image viewer controls
  zoom: number
  rotation: number
  setZoom: (zoom: number) => void
  setRotation: (rotation: number) => void
  zoomIn: () => void
  zoomOut: () => void
  rotateImage: () => void
  // Actions
  selectRx: (id: string) => void
  backToList: () => void
  approveRx: (id: string, notes?: string) => void
  rejectRx: (id: string, reason: string) => void
}

export function useRxVerification(): UseRxVerificationReturn {
  // State
  const [selectedRxId, setSelectedRxId] = useState<string | null>(null)
  const [isComparing, setIsComparing] = useState(false)
  const [zoom, setZoom] = useState(100)
  const [rotation, setRotation] = useState(0)

  // Image controls
  const zoomIn = useCallback(() => {
    setZoom((prev) => Math.min(prev + 10, 200))
  }, [])

  const zoomOut = useCallback(() => {
    setZoom((prev) => Math.max(prev - 10, 50))
  }, [])

  const rotateImage = useCallback(() => {
    setRotation((prev) => prev + 90)
  }, [])

  // Select Rx for verification
  const selectRx = useCallback((id: string) => {
    setSelectedRxId(id)
    setIsComparing(true)
    // Reset image controls
    setZoom(100)
    setRotation(0)
  }, [])

  // Back to list
  const backToList = useCallback(() => {
    setSelectedRxId(null)
    setIsComparing(false)
  }, [])

  // Approve prescription (staff verified image matches user data)
  const approveRx = useCallback((id: string, notes?: string) => {
    console.log(`[RxVerification] APPROVED: ${id}`, notes)
    // TODO: API call to approve and send to packaging
    setSelectedRxId(null)
    setIsComparing(false)
  }, [])

  // Reject prescription (mismatch found)
  const rejectRx = useCallback((id: string, reason: string) => {
    console.log(`[RxVerification] REJECTED: ${id}`, reason)
    // TODO: API call to reject and notify customer
    setSelectedRxId(null)
    setIsComparing(false)
  }, [])

  return {
    selectedRxId,
    isComparing,
    zoom,
    rotation,
    setZoom,
    setRotation,
    zoomIn,
    zoomOut,
    rotateImage,
    selectRx,
    backToList,
    approveRx,
    rejectRx
  }
}
