import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { SidebarStaff } from '@/components/templates/staff/sidebar/SidebarStaff'
import { HeaderStaff } from '@/components/templates/staff/header/HeaderStaff'
import { UserWidgetWithLogout } from '@/components/common/staff/sidebar/UserWidgetWithLogout'
import { ThemeToggle } from '@/components/common/staff/sidebar/ThemeToggle'
import {
  IoGridOutline,
  IoReceipt,
  IoCarOutline,
  IoSettingsOutline,
  IoHelpCircleOutline,
  IoBuildOutline
} from 'react-icons/io5'
import { TbTruckDelivery } from 'react-icons/tb'
import { FaBoxesPacking } from 'react-icons/fa6'
import { NavActions, NavSearch } from '@/components/templates/staff/navbar/NavListStaff'

export default function OperationLayout() {
  const location = useLocation()
  const navigate = useNavigate()

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
          <SidebarStaff.MenuItem icon={<IoReceipt />} label="All Orders" />
          <SidebarStaff.MenuItem
            icon={<IoBuildOutline />}
            label="Technical Stations"
            active={location.pathname === '/operationstaff/prescription-orders'}
            onClick={() => navigate('/operationstaff/prescription-orders')}
          />
          <SidebarStaff.MenuItem icon={<IoCarOutline />} label="Logistics Waiting Station" />
          <SidebarStaff.MenuItem icon={<FaBoxesPacking />} label="Packing Station" />
          <SidebarStaff.MenuItem icon={<TbTruckDelivery />} label="Delivery Handover" />
        </SidebarStaff.MenuSection>

        <SidebarStaff.MenuSection label="TOOLS">
          <SidebarStaff.MenuItem icon={<IoSettingsOutline />} label="Settings" />
          <SidebarStaff.MenuItem icon={<IoHelpCircleOutline />} label="Support" />
          <ThemeToggle />
        </SidebarStaff.MenuSection>
      </SidebarStaff>

      <div className="flex-1 flex flex-col ml-[260px]">
        <HeaderStaff
          containerWidth="1200px"
          left={<NavSearch placeholder={'Search orders...'} />}
          right={<NavActions />}
        />

        <main className="p-4 bg-mint-200 h-full">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
