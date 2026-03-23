import { useCallback, useEffect, useRef, useState } from 'react'

const CHANNEL_NAME = 'sale_staff_invoice_locks'
const LOCK_TTL_MS = 30_000

type LockEntry = {
  sessionId: string
  invoiceId: string
  lockedAt: number
  staffId?: string
}

type LockMessage =
  | { type: 'LOCK'; payload: LockEntry }
  | { type: 'UNLOCK'; payload: { sessionId: string; invoiceId: string } }
  | { type: 'HEARTBEAT'; payload: { sessionId: string; invoiceId: string; lockedAt: number } }

const SESSION_ID = `ss_${Math.random().toString(36).slice(2)}_${Date.now()}`

export function useInvoiceLock(currentStaffId?: string) {
  const [lockedInvoices, setLockedInvoices] = useState<Map<string, LockEntry>>(new Map())

  const myLocksRef = useRef<Set<string>>(new Set())
  const channelRef = useRef<BroadcastChannel | null>(null)
  const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (typeof BroadcastChannel === 'undefined') return

    const ch = new BroadcastChannel(CHANNEL_NAME)
    channelRef.current = ch

    ch.onmessage = (event: MessageEvent<LockMessage>) => {
      const msg = event.data
      if (!msg?.type) return

      setLockedInvoices((prev) => {
        const next = new Map(prev)

        if (msg.type === 'LOCK') {
          const { sessionId, invoiceId } = msg.payload

          if (sessionId === SESSION_ID) return prev
          next.set(invoiceId, msg.payload)
        }

        if (msg.type === 'UNLOCK') {
          const { sessionId, invoiceId } = msg.payload
          if (sessionId === SESSION_ID) return prev
          const existing = prev.get(invoiceId)
          if (existing?.sessionId === sessionId) {
            next.delete(invoiceId)
          }
        }

        if (msg.type === 'HEARTBEAT') {
          const { sessionId, invoiceId, lockedAt } = msg.payload
          if (sessionId === SESSION_ID) return prev
          const existing = prev.get(invoiceId)
          if (existing?.sessionId === sessionId) {
            next.set(invoiceId, { ...existing, lockedAt })
          }
        }

        return next
      })
    }

    const cleanupInterval = setInterval(() => {
      const now = Date.now()
      setLockedInvoices((prev) => {
        let changed = false
        const next = new Map(prev)
        for (const [invoiceId, entry] of next) {
          if (now - entry.lockedAt > LOCK_TTL_MS) {
            next.delete(invoiceId)
            changed = true
          }
        }
        return changed ? next : prev
      })
    }, 5_000)

    const myLocksSnapshot = myLocksRef.current

    return () => {
      for (const invoiceId of myLocksSnapshot) {
        ch.postMessage({
          type: 'UNLOCK',
          payload: { sessionId: SESSION_ID, invoiceId }
        } satisfies LockMessage)
      }
      myLocksSnapshot.clear()
      ch.close()
      channelRef.current = null
      clearInterval(cleanupInterval)
    }
  }, [])

  useEffect(() => {
    heartbeatRef.current = setInterval(() => {
      if (!channelRef.current) return
      for (const invoiceId of myLocksRef.current) {
        channelRef.current.postMessage({
          type: 'HEARTBEAT',
          payload: { sessionId: SESSION_ID, invoiceId, lockedAt: Date.now() }
        } satisfies LockMessage)
      }
    }, 10_000)

    return () => {
      if (heartbeatRef.current) clearInterval(heartbeatRef.current)
    }
  }, [])

  const acquireLock = useCallback(
    (invoiceId: string): boolean => {
      const existing = lockedInvoices.get(invoiceId)
      if (existing && existing.sessionId !== SESSION_ID) {
        const isExpired = Date.now() - existing.lockedAt > LOCK_TTL_MS
        if (!isExpired) return false
      }

      const entry: LockEntry = {
        sessionId: SESSION_ID,
        invoiceId,
        lockedAt: Date.now(),
        staffId: currentStaffId
      }

      myLocksRef.current.add(invoiceId)
      channelRef.current?.postMessage({ type: 'LOCK', payload: entry } satisfies LockMessage)
      return true
    },
    [lockedInvoices, currentStaffId]
  )

  const releaseLock = useCallback((invoiceId: string) => {
    myLocksRef.current.delete(invoiceId)
    channelRef.current?.postMessage({
      type: 'UNLOCK',
      payload: { sessionId: SESSION_ID, invoiceId }
    } satisfies LockMessage)
  }, [])

  const isLockedByOther = useCallback(
    (invoiceId: string): boolean => {
      const entry = lockedInvoices.get(invoiceId)
      if (!entry) return false
      if (entry.sessionId === SESSION_ID) return false
      const isExpired = Date.now() - entry.lockedAt > LOCK_TTL_MS
      return !isExpired
    },
    [lockedInvoices]
  )

  const getLockInfo = useCallback(
    (invoiceId: string): LockEntry | undefined => {
      const entry = lockedInvoices.get(invoiceId)
      if (!entry) return undefined
      if (entry.sessionId === SESSION_ID) return undefined
      const isExpired = Date.now() - entry.lockedAt > LOCK_TTL_MS
      return isExpired ? undefined : entry
    },
    [lockedInvoices]
  )

  return {
    acquireLock,
    releaseLock,
    isLockedByOther,
    getLockInfo,

    lockedCount: lockedInvoices.size
  }
}
