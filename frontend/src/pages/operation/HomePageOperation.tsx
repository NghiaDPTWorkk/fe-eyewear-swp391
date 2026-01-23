import { SidebarStaff } from '@/components/layout/staff-core/SidebarStaff'
import { HeaderStaff } from '@/components/layout/staff-core/HeaderStaff'
import { NavSearch, NavActions } from '@/components/common/staff/NavListStaff'
import { UserWidgetWithLogout } from '@/components/layout/staff-core/sidebar/UserWidgetWithLogout'
import { ThemeToggle } from '@/components/layout/staff-core/sidebar/ThemeToggle'
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

export default function HomePageOperation() {
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
          <SidebarStaff.MenuItem icon={<IoGridOutline />} label="Dashboard" />
          <SidebarStaff.MenuItem icon={<IoReceipt />} label="All Orders" />
          <SidebarStaff.MenuItem icon={<IoBuildOutline />} label="Technical Stations" />
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
        <HeaderStaff containerWidth="1200px" left={<NavSearch />} right={<NavActions />} />

        <main className="flex-1 overflow-auto p-6 bg-gray-50">
          <div className="text-sm text-gray-600 mb-2">Dashboard / Order Management</div>
          <h1 className="text-2xl font-semibold mb-6">Order List</h1>
          <div className="bg-white p-6 rounded-lg shadow">
            <p>Content goes here...</p>
          </div>
        </main>
      </div>
    </div>
  )
}
