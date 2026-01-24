import { Link } from 'react-router-dom'
import { IoBriefcaseOutline, IoCartOutline, IoArrowForward } from 'react-icons/io5'

export const CustomerHomePage = () => {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-mint-500 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-6">
            <span className="text-white font-bold text-3xl">O</span>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-neutral-900 tracking-tight">
          OpticView System
        </h2>
        <p className="mt-2 text-center text-sm text-neutral-600">
          Select your workspace to continue
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 sm:px-0">
          {/* Operation Staff Card */}
          <Link
            to="/operationstaff/dashboard"
            className="group relative bg-white overflow-hidden rounded-2xl shadow-sm border border-neutral-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-8"
          >
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-mint-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500" />

            <div className="relative">
              <div className="w-14 h-14 bg-mint-100 rounded-xl flex items-center justify-center text-mint-600 mb-6 group-hover:bg-mint-500 group-hover:text-white transition-colors duration-300">
                <IoBriefcaseOutline className="text-3xl" />
              </div>

              <h3 className="text-xl font-bold text-neutral-900 group-hover:text-mint-600 transition-colors">
                Operation Staff
              </h3>
              <p className="mt-2 text-neutral-500 text-sm leading-relaxed">
                Manage orders, prescriptions, logistics, and technical operations.
              </p>

              <div className="mt-6 flex items-center text-mint-600 font-medium text-sm group-hover:translate-x-2 transition-transform">
                Access Dashboard <IoArrowForward className="ml-2" />
              </div>
            </div>
          </Link>

          {/* Sales Staff Card */}
          <Link
            to="/salestaff/dashboard"
            className="group relative bg-white overflow-hidden rounded-2xl shadow-sm border border-neutral-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-8"
          >
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-blue-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500" />

            <div className="relative">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300">
                <IoCartOutline className="text-3xl" />
              </div>

              <h3 className="text-xl font-bold text-neutral-900 group-hover:text-blue-600 transition-colors">
                Sales Staff
              </h3>
              <p className="mt-2 text-neutral-500 text-sm leading-relaxed">
                Create orders, manage customers, and track sales performance.
              </p>

              <div className="mt-6 flex items-center text-blue-600 font-medium text-sm group-hover:translate-x-2 transition-transform">
                Access Dashboard <IoArrowForward className="ml-2" />
              </div>
            </div>
          </Link>
        </div>

        <div className="mt-12 text-center">
          <p className="text-neutral-400 text-xs">
            &copy; 2024 OpticView System. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}
