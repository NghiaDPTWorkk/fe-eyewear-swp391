import { useState, useRef, useEffect } from 'react'
import { FiMail } from 'react-icons/fi'
import { MdOutlineNotifications } from 'react-icons/md'
import {
  IoPersonOutline,
  IoSettingsOutline,
  IoLogOutOutline,
  IoChevronForward,
  IoTicketOutline
} from 'react-icons/io5'
import { useLocation, Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useLogout } from '@/shared/hooks/useLogout'

interface NavActionsProps {
  className?: string
  userName?: string
  userRole?: string
  userInitials?: string
  userEmail?: string
}

export function NavActions({
  className,
  userName = 'Loading...',
  userRole = 'Loading...',
  userInitials = '...',
  userEmail = ''
}: NavActionsProps) {
  const [openDropdown, setOpenDropdown] = useState<'notifications' | 'profile' | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const location = useLocation()

  // Determine base path for dynamic links
  const isOperation = location.pathname.startsWith('/operationstaff')
  const isManager = location.pathname.startsWith('/manager')
  const isAdmin = location.pathname.startsWith('/admin')

  const basePrefix = isAdmin
    ? '/admin'
    : isManager
      ? '/manager'
      : isOperation
        ? '/operationstaff'
        : '/salestaff'

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpenDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const notifications = [
    {
      id: 1,
      title: 'Return Request',
      description: 'Return #RTN-2024-089 requires your approval',
      time: '5 min ago',
      color: 'bg-red-500'
    },
    {
      id: 2,
      title: 'Rx Verification Pending',
      description: '12 prescriptions waiting for verification',
      time: '15 min ago',
      color: 'bg-amber-500'
    },
    {
      id: 3,
      title: 'New Pre-order',
      description: 'Pre-order #PRE-2024-456 has been placed',
      time: '1 hour ago',
      color: 'bg-blue-500'
    },
    {
      id: 4,
      title: 'Order Completed',
      description: 'Order #ORD-2024-1234 has been shipped',
      time: '2 hours ago',
      color: 'bg-emerald-500'
    }
  ]

  const { handleLogout } = useLogout()

  return (
    <div
      ref={containerRef}
      className={cn('flex justify-end items-center gap-4 relative w-full', className)}
    >
      <div className="flex items-center gap-4 text-neutral-500">
        <button
          className="relative p-1 hover:text-primary-500 transition-colors cursor-pointer"
          title="View Messages"
        >
          <FiMail className="text-2xl" />
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-danger-500 ring-2 ring-white"></span>
        </button>

        <div className="relative">
          <button
            onClick={() =>
              setOpenDropdown(openDropdown === 'notifications' ? null : 'notifications')
            }
            className={cn(
              'relative p-1 transition-colors cursor-pointer',
              openDropdown === 'notifications' ? 'text-primary-500' : 'hover:text-primary-500'
            )}
            title="View Notifications"
          >
            <MdOutlineNotifications className="text-2xl" />
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-primary-500 ring-2 ring-white"></span>
          </button>

          {openDropdown === 'notifications' && (
            <div className="absolute right-0 mt-6 w-80 bg-white rounded-2xl shadow-xl border border-neutral-100 py-4 z-50 animate-in fade-in zoom-in-95 duration-200">
              <div className="px-5 mb-4">
                <h3 className="text-lg font-semibold text-neutral-900">Notifications</h3>
                <p className="text-xs font-medium text-neutral-400">You have 4 unread messages</p>
              </div>

              <div className="divide-y divide-neutral-50">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="px-5 py-4 hover:bg-neutral-50 cursor-pointer transition-colors group"
                  >
                    <div className="flex gap-3">
                      <div className={cn('w-2 h-2 rounded-full mt-1.5 shrink-0', n.color)} />
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors">
                          {n.title}
                        </h4>
                        <p className="text-[13px] text-neutral-500 mt-0.5 leading-relaxed font-normal">
                          {n.description}
                        </p>
                        <p className="text-[11px] text-neutral-400 mt-1 font-medium">{n.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="px-5 pt-4 mt-2 border-t border-neutral-100">
                <button className="w-full py-2 text-sm font-semibold text-primary-500 hover:text-primary-600 transition-colors flex items-center justify-center gap-1 cursor-pointer">
                  View All Notifications
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="h-8 w-px bg-neutral-100 ml-2" />

      <div className="relative ml-auto sm:ml-0">
        <button
          onClick={() => setOpenDropdown(openDropdown === 'profile' ? null : 'profile')}
          className="flex items-center gap-3 group transition-opacity hover:opacity-80 cursor-pointer"
        >
          <div className="text-right hidden sm:block">
            <div className="text-sm font-semibold text-neutral-900 leading-tight">{userName}</div>
            <div className="text-xs text-neutral-400 font-medium">{userRole}</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-semibold border border-primary-100 shadow-sm shadow-primary-50">
            {userInitials}
          </div>
        </button>

        {openDropdown === 'profile' && (
          <div className="absolute right-0 mt-6 w-72 bg-white rounded-2xl shadow-xl border border-neutral-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 bg-white border-b border-neutral-50">
              <div className="mb-3">
                <h3 className="text-xl font-semibold text-neutral-900 leading-tight">{userName}</h3>
                <p className="text-sm font-medium text-neutral-500 truncate mt-1">{userEmail}</p>
              </div>
              <span className="px-3 py-1 bg-primary-100/50 text-primary-600 text-[11px] font-semibold uppercase tracking-wider rounded-lg border border-primary-200/30">
                {isAdmin ? 'Admin' : isManager ? 'Manager' : 'Staff'}
              </span>
            </div>

            <div className="p-3">
              {[
                { icon: IoPersonOutline, label: 'My Profile', to: `${basePrefix}/profile` },
                {
                  icon: IoTicketOutline,
                  label: 'Report History',
                  to: isManager ? `${basePrefix}/reports` : `${basePrefix}/support?tab=history`
                },
                {
                  icon: IoSettingsOutline,
                  label: 'Settings',
                  to: isManager ? `${basePrefix}/profile` : `${basePrefix}/settings`
                }
              ].map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  onClick={() => setOpenDropdown(null)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-neutral-50 group transition-all"
                >
                  <div className="w-9 h-9 rounded-lg bg-neutral-50 flex items-center justify-center group-hover:bg-white group-hover:shadow-sm border border-transparent group-hover:border-neutral-100 transition-all text-neutral-500 group-hover:text-primary-500">
                    <item.icon className="text-lg" />
                  </div>
                  <span className="text-sm font-semibold text-neutral-700 group-hover:text-neutral-900">
                    {item.label}
                  </span>
                  <IoChevronForward
                    className="ml-auto text-neutral-300 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all font-medium"
                    size={14}
                  />
                </Link>
              ))}
            </div>

            <div className="p-3 bg-neutral-50/50 border-t border-neutral-50">
              <button
                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-red-50 group transition-all cursor-pointer"
                onClick={() => {
                  setOpenDropdown(null)
                  handleLogout()
                }}
              >
                <div className="w-9 h-9 rounded-lg bg-red-50/50 flex items-center justify-center group-hover:bg-white text-red-500 shadow-sm border border-red-100/30">
                  <IoLogOutOutline className="text-lg" />
                </div>
                <span className="text-sm font-semibold text-red-600">Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
