import { Outlet } from 'react-router-dom'
import CustomerHeader from '@/components/layout/customer/header/CustomerHeader'
import { AccountSidebar } from './AccountSidebar'

export function AccountLayout() {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <CustomerHeader />

      {/* Light blue banner shown in image */}
      <div className="w-full bg-mint-50/50 py-3 border-b border-mint-100">
        <div className="max-w-[1240px] mx-auto px-4 text-center">
          <p className="font-bold text-[11px] tracking-widest text-mint-1200 uppercase">
            Your last chance: Up to 50% off frames & lenses*
          </p>
        </div>
      </div>

      <div className="max-w-[1240px] mx-auto flex gap-10 px-4 py-8">
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
