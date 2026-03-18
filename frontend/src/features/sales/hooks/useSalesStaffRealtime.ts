import { useCallback, useEffect, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'

/** Polling interval khi tab active (ms) */
const POLL_INTERVAL_MS = 15_000 // 15 giây

export interface RealtimeState {
  lastUpdatedAt: Date | null
  isRefreshing: boolean
  hasNewData: boolean
  secondsSinceUpdate: number
}

export function useSalesStaffRealtime() {
  const queryClient = useQueryClient()
  const [state, setState] = useState<RealtimeState>({
    lastUpdatedAt: null,
    isRefreshing: false,
    hasNewData: false,
    secondsSinceUpdate: 0
  })

  const pollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const tickTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const isActiveRef = useRef(true)
  // Ref guard to prevent concurrent refreshes (avoids stale closure in interval)
  const isRefreshingRef = useRef(false)

  // ── Refresh function ────────────────────────────────────────────────────────
  const refresh = useCallback(async () => {
    if (isRefreshingRef.current) return
    isRefreshingRef.current = true

    setState((prev) => ({ ...prev, isRefreshing: true }))
    try {
      await queryClient.invalidateQueries({ queryKey: ['sales'] })
      setState((prev) => ({
        ...prev,
        lastUpdatedAt: new Date(),
        hasNewData: false,
        secondsSinceUpdate: 0,
        isRefreshing: false
      }))
    } catch {
      setState((prev) => ({ ...prev, isRefreshing: false }))
    } finally {
      isRefreshingRef.current = false
    }
  }, [queryClient])

  // ── Polling setup ───────────────────────────────────────────────────────────
  useEffect(() => {
    const handleVisibilityChange = () => {
      isActiveRef.current = document.visibilityState === 'visible'
      if (isActiveRef.current) {
        // Tab vừa active lại → refresh ngay
        refresh()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    // Bắt đầu polling
    pollTimerRef.current = setInterval(() => {
      if (isActiveRef.current) {
        refresh()
      }
    }, POLL_INTERVAL_MS)

    // Initial update timestamp
    setState((prev) => ({ ...prev, lastUpdatedAt: new Date() }))

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      if (pollTimerRef.current) clearInterval(pollTimerRef.current)
    }
  }, [refresh])

  // ── Tick counter: "X giây trước" ────────────────────────────────────────────
  useEffect(() => {
    tickTimerRef.current = setInterval(() => {
      setState((prev) => {
        if (!prev.lastUpdatedAt) return prev
        const secs = Math.floor((Date.now() - prev.lastUpdatedAt.getTime()) / 1000)
        return { ...prev, secondsSinceUpdate: secs }
      })
    }, 1_000)

    return () => {
      if (tickTimerRef.current) clearInterval(tickTimerRef.current)
    }
  }, [])

  // ── Formatted last updated string ──────────────────────────────────────────
  const getLastUpdatedLabel = useCallback((): string => {
    if (!state.lastUpdatedAt) return 'Never'
    const s = state.secondsSinceUpdate
    if (s < 5) return 'Just now'
    if (s < 60) return `${s}s ago`
    const m = Math.floor(s / 60)
    if (m < 60) return `${m}m ago`
    return state.lastUpdatedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }, [state.lastUpdatedAt, state.secondsSinceUpdate])

  return {
    ...state,
    refresh,
    getLastUpdatedLabel,
    pollIntervalMs: POLL_INTERVAL_MS
  }
}
