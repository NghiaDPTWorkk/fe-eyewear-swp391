import React from 'react'
import { IoRefreshOutline, IoLockClosedOutline, IoRadioButtonOnOutline } from 'react-icons/io5'
import { cn } from '@/lib/utils'

interface RealtimeStatusBarProps {
  isRefreshing: boolean
  lastUpdatedLabel: string
  lockedCount: number
  onRefresh: () => void
  className?: string
}

export const RealtimeStatusBar: React.FC<RealtimeStatusBarProps> = ({
  isRefreshing,
  lastUpdatedLabel,
  lockedCount,
  onRefresh,
  className
}) => {
  return (
    <div
      className={cn(
        'flex items-center gap-3 px-4 py-2 rounded-2xl',
        'bg-white/80 backdrop-blur-sm border border-neutral-100/80 shadow-sm',
        className
      )}
    >
      {}
      <div className="flex items-center gap-1.5">
        <span className="relative flex h-2 w-2">
          <span
            className={cn(
              'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
              isRefreshing ? 'bg-amber-400' : 'bg-emerald-400'
            )}
          />
          <span
            className={cn(
              'relative inline-flex rounded-full h-2 w-2',
              isRefreshing ? 'bg-amber-500' : 'bg-emerald-500'
            )}
          />
        </span>
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
          {isRefreshing ? 'Syncing...' : 'Live'}
        </span>
      </div>

      {}
      <span className="w-px h-3 bg-neutral-200" />

      {}
      <div className="flex items-center gap-1 text-[10px] text-slate-400">
        <IoRadioButtonOnOutline size={10} className="text-slate-300" />
        <span>Updated: </span>
        <span className="font-semibold text-slate-500">{lastUpdatedLabel}</span>
      </div>

      {}
      {lockedCount > 0 && (
        <>
          <span className="w-px h-3 bg-neutral-200" />
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-amber-50 border border-amber-100">
            <IoLockClosedOutline size={10} className="text-amber-500" />
            <span className="text-[10px] font-bold text-amber-600">
              {lockedCount} locked by other staff
            </span>
          </div>
        </>
      )}

      {}
      <button
        onClick={onRefresh}
        disabled={isRefreshing}
        title="Refresh now"
        className={cn(
          'ml-auto flex items-center justify-center w-7 h-7 rounded-xl',
          'bg-slate-50 hover:bg-mint-50 border border-transparent hover:border-mint-100',
          'text-slate-400 hover:text-mint-600 transition-all duration-200',
          'disabled:opacity-40 disabled:cursor-not-allowed'
        )}
      >
        <IoRefreshOutline size={14} className={cn(isRefreshing && 'animate-spin')} />
      </button>
    </div>
  )
}
