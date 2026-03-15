import { PageHeader } from '@/features/staff/components/common'
import { Container } from '@/shared/components/ui'
import { useNavigate } from 'react-router-dom'
import { StaffProfileContent } from '@/features/staff/components/profile/StaffProfileContent'

export default function SaleStaffProfilePage() {
  const navigate = useNavigate()

  return (
    <Container maxWidth="1400px" className="space-y-8 animate-in fade-in duration-500">
      <PageHeader
        title="My Profile"
        subtitle="View and manage your personal professional information"
        breadcrumbs={[{ label: 'Dashboard', path: '/sale-staff/dashboard' }, { label: 'Profile' }]}
      />

      <StaffProfileContent onEdit={() => navigate('/sale-staff/settings')} />
    </Container>
  )
}
