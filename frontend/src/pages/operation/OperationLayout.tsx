import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  SidebarStaff,
  HeaderStaff,
  UserWidgetWithLogout,
  ThemeToggle,
  NavActions,
  NavSearch
} from '@/components/staff'
import {
  IoGridOutline,
  IoReceipt,
  IoCarOutline,
  IoSettingsOutline,
  IoHelpCircleOutline,
  IoBuildOutline
} from 'react-icons/io5'
import { FaBoxesPacking } from 'react-icons/fa6'
import { useLayoutStore } from '@/store/layout.store'
import { cn } from '@/lib/utils'

export default function OperationLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { sidebarCollapsed } = useLayoutStore()

  return (
    <div className="flex h-screen bg-white">
      <SidebarStaff
        logo={
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-mint-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">O</span>
            </div>
            <span className="font-semibold text-gray-900">OpticView</span>
          </div>
        }
        userWidget={
          <UserWidgetWithLogout
            userInitials="SL"
            userName="Dr. Sarah L."
            userRole="Head Optometrist"
          />
        }
      >
        <SidebarStaff.MenuSection label="WORK STATIONS">
          <SidebarStaff.MenuItem
            icon={<IoGridOutline />}
            label="Dashboard"
            active={location.pathname === '/operationstaff/dashboard'}
            onClick={() => navigate('/operationstaff/dashboard')}
          />
          <SidebarStaff.MenuItem
            icon={<IoReceipt />}
            label="All Orders"
            active={location.pathname === '/operationstaff/all'}
            onClick={() => navigate('/operationstaff/all')}
          />
          <SidebarStaff.MenuItem
            icon={<IoBuildOutline />}
            label="Technical Stations"
            active={location.pathname === '/operationstaff/prescription-orders'}
            onClick={() => navigate('/operationstaff/prescription-orders')}
          />
          <SidebarStaff.MenuItem
            icon={<IoCarOutline />}
            label="Logistics Waiting Station"
            active={location.pathname === '/operationstaff/pre-orders'}
            onClick={() => navigate('/operationstaff/pre-orders')}
          />
          <SidebarStaff.MenuItem
            icon={<FaBoxesPacking />}
            label="Packing Station"
            active={location.pathname === '/operationstaff/packing'}
            onClick={() => navigate('/operationstaff/packing')}
          />
        </SidebarStaff.MenuSection>

        <SidebarStaff.MenuSection label="TOOLS">
          <SidebarStaff.MenuItem icon={<IoSettingsOutline />} label="Settings" />
          <SidebarStaff.MenuItem icon={<IoHelpCircleOutline />} label="Support" />
          <ThemeToggle />
        </SidebarStaff.MenuSection>
      </SidebarStaff>

      <div
        className={cn(
          'flex-1 flex flex-col transition-all duration-300',
          sidebarCollapsed ? 'ml-20' : 'ml-[260px]'
        )}
      >
        <HeaderStaff
          containerWidth="1200px"
          left={<NavSearch placeholder={'Search orders...'} />}
          right={<NavActions />}
        />

        <main
          className="p-4 bg-mint-200 flex-1"
          style={{ backgroundColor: 'var(--color-mint-200)' }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  )
}
