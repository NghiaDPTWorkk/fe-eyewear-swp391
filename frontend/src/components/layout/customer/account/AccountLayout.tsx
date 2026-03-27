import { Outlet } from 'react-router-dom'
import { AccountSidebar } from './AccountSidebar'

export function AccountLayout() {
  return (
    <div className="min-h-screen bg-mint-100 animate-in fade-in duration-700">
      <div className="max-w-[1240px] mx-auto flex gap-10 px-4 animate-in slide-in-from-bottom-4 duration-1000">
        <aside className="hidden lg:block shrink-0">
          <AccountSidebar />
        </aside>

        <main className="flex-1 min-w-0 pt-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
