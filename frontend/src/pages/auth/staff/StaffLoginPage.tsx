import { LoginForm } from '@/components/layout/login-form'

export const StaffLoginPage = () => {
  return (
    <div className="flex min-h-screen w-full">
      {/* Left Side - Login Form */}
      <div className="flex w-full flex-col justify-center bg-white px-8 py-12 lg:w-1/2 lg:px-16">
        <div className="mx-auto w-full max-w-md">
          {/* Logo */}
          <div className="mb-8 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary-400 to-primary-600">
              <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" />
                <path d="M2 17L12 22L22 17" opacity="0.7" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-primary-600">Eyewear</span>
          </div>

          {/* Form */}
          <div>
            <h1 className="mb-2 text-3xl font-bold text-primary-950">Sign In</h1>
            <p className="mb-6 text-sm text-gray-eyewear">
              Internal Access Only. Sign in to manage operations and services with OpticView
              Eyewear.
            </p>

            <LoginForm role="staff" />
          </div>
        </div>
      </div>

      {/* Right Side - Dashboard Preview */}
      <div className="hidden w-1/2 flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-primary-50 via-primary-100 to-primary-200 p-12 lg:flex">
        {/* Decorative Hexagons */}
        <div className="absolute right-20 top-10 h-24 w-24 rotate-12 opacity-30">
          <svg viewBox="0 0 100 100" className="h-full w-full text-primary-300">
            <polygon
              points="50 1 95 25 95 75 50 99 5 75 5 25"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        </div>
        <div className="absolute bottom-20 left-10 h-16 w-16 -rotate-6 opacity-40">
          <svg viewBox="0 0 100 100" className="h-full w-full text-primary-400">
            <polygon
              points="50 1 95 25 95 75 50 99 5 75 5 25"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        </div>
        <div className="absolute left-1/4 top-1/3 h-12 w-12 rotate-45 opacity-20">
          <svg viewBox="0 0 100 100" className="h-full w-full text-primary-500">
            <polygon
              points="50 1 95 25 95 75 50 99 5 75 5 25"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-lg text-center">
          <div className="mb-8 rounded-2xl bg-white p-4 shadow-2xl">
            <img
              src={`data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600'%3E%3Crect fill='%23f0f9ff' width='800' height='600'/%3E%3Crect fill='%234ad7b0' x='50' y='50' width='700' height='80' rx='10'/%3E%3Crect fill='%23e0f2fe' x='50' y='150' width='340' height='180' rx='10'/%3E%3Crect fill='%23e0f2fe' x='410' y='150' width='340' height='180' rx='10'/%3E%3Crect fill='%233b82f6' x='70' y='170' width='300' height='140' rx='8'/%3E%3Ctext x='90' y='200' fill='white' font-size='20' font-weight='bold'%3EDashboard%3C/text%3E%3Crect fill='%2360a5fa' x='90' y='220' width='200' height='60' rx='4'/%3E%3Crect fill='%2393c5fd' x='90' y='290' width='150' height='10' rx='2'/%3E%3Crect fill='%23bfdbfe' x='430' y='170' width='300' height='60' rx='4'/%3E%3Crect fill='%23dbeafe' x='430' y='240' width='300' height='80' rx='4'/%3E%3Crect fill='%2322c55e' x='50' y='350' width='340' height='200' rx='10'/%3E%3Crect fill='%23fbbf24' x='410' y='350' width='340' height='200' rx='10'/%3E%3C/svg%3E`}
              alt="Dashboard Preview"
              className="w-full"
            />
          </div>
          <h2 className="mb-4 text-3xl font-bold text-primary-950">
            Easy-to-Use Dashboard for Managing Your Business.
          </h2>
          <p className="text-gray-eyewear">
            Streamline Your Business Management with Our User-Friendly Dashboard. Simplify complex
            tasks, track key metrics, and make informed decisions effortlessly.
          </p>
        </div>
      </div>
    </div>
  )
}
