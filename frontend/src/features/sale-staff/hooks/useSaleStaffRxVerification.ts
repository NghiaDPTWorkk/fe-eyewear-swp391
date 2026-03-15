import { useState, useCallback } from 'react'

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
  selectedRxId: string | null
  isComparing: boolean

  zoom: number
  rotation: number
  setZoom: (zoom: number) => void
  setRotation: (rotation: number) => void
  zoomIn: () => void
  zoomOut: () => void
  rotateImage: () => void

  selectRx: (id: string) => void
  backToList: () => void
  approveRx: (id: string, notes?: string) => void
  rejectRx: (id: string, reason: string) => void
}

export function useRxVerification(): UseRxVerificationReturn {
  const [selectedRxId, setSelectedRxId] = useState<string | null>(null)
  const [isComparing, setIsComparing] = useState(false)
  const [zoom, setZoom] = useState(100)
  const [rotation, setRotation] = useState(0)

  const zoomIn = useCallback(() => {
    setZoom((prev) => Math.min(prev + 10, 200))
  }, [])

  const zoomOut = useCallback(() => {
    setZoom((prev) => Math.max(prev - 10, 50))
  }, [])

  const rotateImage = useCallback(() => {
    setRotation((prev) => prev + 90)
  }, [])

  const selectRx = useCallback((id: string) => {
    setSelectedRxId(id)
    setIsComparing(true)

    setZoom(100)
    setRotation(0)
  }, [])

  const backToList = useCallback(() => {
    setSelectedRxId(null)
    setIsComparing(false)
  }, [])

  const approveRx = useCallback((id: string, notes?: string) => {
    console.warn(`[RxVerification] APPROVED: ${id}`, notes)

    setSelectedRxId(null)
    setIsComparing(false)
  }, [])

  const rejectRx = useCallback((id: string, reason: string) => {
    console.warn(`[RxVerification] REJECTED: ${id}`, reason)

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
