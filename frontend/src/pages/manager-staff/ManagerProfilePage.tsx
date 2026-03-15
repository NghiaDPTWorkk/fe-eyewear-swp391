import { StaffProfileContent } from '@/features/staff/components/profile/StaffProfileContent'
import { Link, useNavigate } from 'react-router-dom'
import { IoChevronForward } from 'react-icons/io5'
import { Container } from '@/shared/components'

export default function ManagerProfilePage() {
  const navigate = useNavigate()

  return (
    <Container className="max-w-6xl mx-auto space-y-6 py-6 font-sans">
      {}
      <div className="flex items-center gap-2 text-sm mb-6 px-1">
        <Link
          to="/manager/dashboard"
          className="text-neutral-500 hover:text-neutral-700 transition-colors font-medium cursor-pointer"
        >
          Dashboard
        </Link>
        <IoChevronForward className="text-neutral-400" />
        <span className="text-mint-600 font-semibold">My Profile</span>
      </div>

      <StaffProfileContent onEdit={() => navigate('/manager/profile')} />
    </Container>
  )
}
