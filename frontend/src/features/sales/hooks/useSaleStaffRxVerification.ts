import { useState, useCallback } from 'react'
import { invoiceService } from '../services/invoiceService'

export function useRxVerification() {
  const [SelectedRxId, setSelectedRxId] = useState<string | null>(null)
  const [isComparing, setIsComparing] = useState(false)
  const [zoom, setZoom] = useState(100)
  const [rotation, setRotation] = useState(0)

  const zoomIn = useCallback(() => setZoom((prev) => Math.min(prev + 10, 200)), [])
  const zoomOut = useCallback(() => setZoom((prev) => Math.max(prev - 10, 50)), [])
  const rotateImage = useCallback(() => setRotation((prev) => prev + 90), [])

  const SelectRx = useCallback((id: string) => {
    setSelectedRxId(id)
    setIsComparing(true)
    setZoom(100)
    setRotation(0)
  }, [])

  const backToList = useCallback(() => {
    setSelectedRxId(null)
    setIsComparing(false)
  }, [])

  const approveRx = useCallback(async (invoiceId: string) => {
    try {
      await invoiceService.approveInvoice(invoiceId)
      setSelectedRxId(null)
      setIsComparing(false)
      return true
    } catch {
      return false
    }
  }, [])

  const rejectRx = useCallback(async (invoiceId: string) => {
    try {
      await invoiceService.rejectInvoice(invoiceId)
      setSelectedRxId(null)
      setIsComparing(false)
      return true
    } catch {
      return false
    }
  }, [])

  return {
    SelectedRxId,
    isComparing,
    zoom,
    rotation,
    setZoom,
    setRotation,
    zoomIn,
    zoomOut,
    rotateImage,
    SelectRx,
    backToList,
    approveRx,
    rejectRx
  }
}
