import { useCallback, useEffect, useRef, useState } from 'react'
import { useAuthStore } from '@/store/auth.store'

const CHANNEL_NAME = 'order_verification_locks'
const LOCK_KEY_PREFIX = 'ovl_'
const LOCK_TTL_MS = 60_000
const HEARTBEAT_INTERVAL = 15_000

type LockData = {
  sessionId: string
  staffId: string
  staffName: string
  lockedAt: number
}

type ChannelMessage =
  | { type: 'LOCK'; orderId: string; data: LockData }
  | { type: 'UNLOCK'; orderId: string; sessionId: string }
  | { type: 'HEARTBEAT'; orderId: string; sessionId: string; lockedAt: number }

const SESSION_ID = `s_${Math.random().toString(36).slice(2)}_${Date.now()}`

function getLockFromStorage(orderId: string): LockData | null {
  try {
    const raw = localStorage.getItem(LOCK_KEY_PREFIX + orderId)
    if (!raw) return null
    const data: LockData = JSON.parse(raw)
    if (Date.now() - data.lockedAt > LOCK_TTL_MS) {
      localStorage.removeItem(LOCK_KEY_PREFIX + orderId)
      return null
    }
    return data
  } catch {
    return null
  }
}

function setLockInStorage(orderId: string, data: LockData) {
  localStorage.setItem(LOCK_KEY_PREFIX + orderId, JSON.stringify(data))
}

function removeLockFromStorage(orderId: string) {
  localStorage.removeItem(LOCK_KEY_PREFIX + orderId)
}

export type LockStatus = { locked: false } | { locked: true; staffName: string; lockedAt: number }

export function useOrderVerificationLock(orderId: string) {
  const staffId = SESSION_ID
  const staffName = useAuthStore(
    (s) => (s as any).profile?.name || (s as any).user?.name || 'Staff'
  )

  const [lockStatus, setLockStatus] = useState<LockStatus>({ locked: false })
  const channelRef = useRef<BroadcastChannel | null>(null)
  const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const isOwnerRef = useRef(false)

  const refreshLockStatus = useCallback(() => {
    const existing = getLockFromStorage(orderId)
    if (!existing || existing.sessionId === SESSION_ID) {
      setLockStatus({ locked: false })
    } else {
      setLockStatus({ locked: true, staffName: existing.staffName, lockedAt: existing.lockedAt })
    }
  }, [orderId])

  useEffect(() => {
    if (!orderId) return
    if (typeof BroadcastChannel === 'undefined') return

    const ch = new BroadcastChannel(CHANNEL_NAME)
    channelRef.current = ch

    ch.onmessage = (e: MessageEvent<ChannelMessage>) => {
      const msg = e.data
      if (!msg || msg.orderId !== orderId) return

      if (msg.type === 'LOCK') {
        if (msg.data.sessionId === SESSION_ID) return
        setLockInStorage(orderId, msg.data)
        setLockStatus({ locked: true, staffName: msg.data.staffName, lockedAt: msg.data.lockedAt })
      }

      if (msg.type === 'UNLOCK') {
        if (msg.sessionId === SESSION_ID) return
        removeLockFromStorage(orderId)
        setLockStatus({ locked: false })
      }

      if (msg.type === 'HEARTBEAT') {
        if (msg.sessionId === SESSION_ID) return
        const existing = getLockFromStorage(orderId)
        if (existing && existing.sessionId === msg.sessionId) {
          setLockInStorage(orderId, { ...existing, lockedAt: msg.lockedAt })
          setLockStatus({ locked: true, staffName: existing.staffName, lockedAt: msg.lockedAt })
        }
      }
    }

    refreshLockStatus()

    return () => {
      ch.close()
      channelRef.current = null
    }
  }, [orderId, refreshLockStatus])

  const acquireLock = useCallback((): boolean => {
    const existing = getLockFromStorage(orderId)

    if (existing && existing.sessionId !== SESSION_ID) {
      setLockStatus({ locked: true, staffName: existing.staffName, lockedAt: existing.lockedAt })
      return false
    }

    const lockData: LockData = {
      sessionId: SESSION_ID,
      staffId,
      staffName,
      lockedAt: Date.now()
    }

    setLockInStorage(orderId, lockData)
    isOwnerRef.current = true

    channelRef.current?.postMessage({
      type: 'LOCK',
      orderId,
      data: lockData
    } satisfies ChannelMessage)

    setLockStatus({ locked: false })
    return true
  }, [orderId, staffId, staffName])

  const releaseLock = useCallback(() => {
    if (!isOwnerRef.current) return
    removeLockFromStorage(orderId)
    isOwnerRef.current = false

    channelRef.current?.postMessage({
      type: 'UNLOCK',
      orderId,
      sessionId: SESSION_ID
    } satisfies ChannelMessage)
  }, [orderId])

  useEffect(() => {
    heartbeatRef.current = setInterval(() => {
      if (!isOwnerRef.current) return
      const now = Date.now()
      const existing = getLockFromStorage(orderId)
      if (existing) {
        setLockInStorage(orderId, { ...existing, lockedAt: now })
      }
      channelRef.current?.postMessage({
        type: 'HEARTBEAT',
        orderId,
        sessionId: SESSION_ID,
        lockedAt: now
      } satisfies ChannelMessage)
    }, HEARTBEAT_INTERVAL)

    return () => {
      if (heartbeatRef.current) clearInterval(heartbeatRef.current)
    }
  }, [orderId])

  useEffect(() => {
    const handleUnload = () => releaseLock()
    window.addEventListener('beforeunload', handleUnload)
    return () => {
      window.removeEventListener('beforeunload', handleUnload)

      if (isOwnerRef.current) releaseLock()
    }
  }, [releaseLock])

  return {
    lockStatus,
    acquireLock,
    releaseLock
  }
}
