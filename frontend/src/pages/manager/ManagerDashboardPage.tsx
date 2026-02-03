import { Container } from '@/components'
import { StatCard } from './components/dashboard/StatCard'
import { SalesTarget } from './components/dashboard/SalesTarget'
import { DashboardChart } from './components/dashboard/DashboardChart'
import { PromoBanner } from './components/dashboard/PromoBanner'
import { CustomerGrowth } from './components/dashboard/CustomerGrowth'
import { PopularProducts } from './components/dashboard/PopularProducts'
import {
  IoTrendingUpOutline,
  IoPeopleOutline,
  IoSwapHorizontalOutline,
  IoCubeOutline
} from 'react-icons/io5'

export default function ManagerDashboardPage() {
  return (
    <Container className="max-w-none px-2 pt-2 pb-8">
      <div className="mb-6 px-4">
        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight font-heading">
          Dashboard
        </h1>
        <p className="text-gray-500 text-sm font-normal leading-relaxed">Dashboard Overview</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-10 px-4">
        {/* Row 1: Sales Target + Stats Column */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-1 gap-6">
          <SalesTarget />
        </div>

        {/* Right Stats Column */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          <StatCard
            label="Total Revenue"
            value="$81,000"
            variant="mint"
            trend={{ value: '10.8%', isPositive: true }}
            icon={<IoTrendingUpOutline />}
          />
          <StatCard
            label="Total Customer"
            value="5,000"
            trend={{ value: '1.5%', isPositive: true }}
            icon={<IoPeopleOutline />}
          />
          <StatCard
            label="Total Orders"
            value="12,000"
            trend={{ value: '3.6%', isPositive: true }}
            icon={<IoSwapHorizontalOutline />}
          />
          <StatCard
            label="Total Product"
            value="5,000"
            trend={{ value: '1.5%', isPositive: false }}
            icon={<IoCubeOutline />}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-10 px-4">
        {/* Row 2: Charts + Promo */}
        <div className="lg:col-span-3">
          <DashboardChart />
        </div>
        <div className="lg:col-span-2">
          <PromoBanner />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 px-4">
        {/* Row 3: Customer Growth + Popular Products */}
        <div className="lg:col-span-2">
          <CustomerGrowth />
        </div>
        <div className="lg:col-span-3">
          <PopularProducts />
        </div>
      </div>
    </Container>
  )
}
