import { useCallback, useEffect, useRef, useState } from 'react'

const CHANNEL_NAME = 'sale_staff_invoice_locks'
const LOCK_TTL_MS = 30_000 // 30s – lock tự expire nếu tab bị đóng đột ngột

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

/** Tạo sessionId duy nhất cho mỗi tab (in-memory, không persist) */
const SESSION_ID = `ss_${Math.random().toString(36).slice(2)}_${Date.now()}`

export function useInvoiceLock(currentStaffId?: string) {
  /** Map invoiceId → LockEntry của các tab KHÁC */
  const [lockedInvoices, setLockedInvoices] = useState<Map<string, LockEntry>>(new Map())
  /** Set các invoiceId mà TAB NÀY đang lock */
  const myLocksRef = useRef<Set<string>>(new Set())
  const channelRef = useRef<BroadcastChannel | null>(null)
  const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // ── Khởi tạo BroadcastChannel ──────────────────────────────────────────────
  useEffect(() => {
    if (typeof BroadcastChannel === 'undefined') return // SSR / old browser guard

    const ch = new BroadcastChannel(CHANNEL_NAME)
    channelRef.current = ch

    ch.onmessage = (event: MessageEvent<LockMessage>) => {
      const msg = event.data
      if (!msg?.type) return

      setLockedInvoices((prev) => {
        const next = new Map(prev)

        if (msg.type === 'LOCK') {
          const { sessionId, invoiceId } = msg.payload
          // Bỏ qua message từ chính session này
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

    // Xóa expired locks định kỳ (mỗi 5s)
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

    // Snapshot the Set reference before cleanup – satisfies the ref-in-cleanup lint rule.
    const myLocksSnapshot = myLocksRef.current

    return () => {
      // myLocksSnapshot is captured from the enclosing effect scope (not inside cleanup),
      // so it remains stable even if the ref is reassigned later.
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

  // ── Heartbeat để refresh lockedAt, tránh false-expire ──────────────────────
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

  // ── Public API ─────────────────────────────────────────────────────────────

  /**
   * Cố gắng lock invoice. Trả về true nếu thành công, false nếu đang bị lock bởi tab khác.
   */
  const acquireLock = useCallback(
    (invoiceId: string): boolean => {
      // Kiểm tra xem invoice đã bị lock bởi session khác không
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

  /**
   * Giải phóng lock cho invoice.
   */
  const releaseLock = useCallback((invoiceId: string) => {
    myLocksRef.current.delete(invoiceId)
    channelRef.current?.postMessage({
      type: 'UNLOCK',
      payload: { sessionId: SESSION_ID, invoiceId }
    } satisfies LockMessage)
  }, [])

  /**
   * Kiểm tra xem invoice có đang bị LOCK BỞI TAB KHÁC không.
   */
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

  /**
   * Lấy thông tin lock của 1 invoice (nếu có).
   */
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
    /** Số lượng invoices đang bị lock bởi các tab khác */
    lockedCount: lockedInvoices.size
  }
}
