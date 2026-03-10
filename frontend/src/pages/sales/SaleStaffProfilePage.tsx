import { PageHeader } from '@/features/staff/components/common'
import { Container } from '@/shared/components/ui-core'
import { useNavigate } from 'react-router-dom'
import { StaffProfileContent } from '@/features/staff/components/Profile/StaffProfileContent'

export default function SaleStaffProfilePage() {
  const navigate = useNavigate()

  return (
    <Container maxWidth="1400px" className="space-y-8 animate-in fade-in duration-500">
      <PageHeader
        title="My Profile"
        subtitle="View and manage your personal professional information"
        breadcrumbs={[{ label: 'Dashboard', path: '/salestaff/dashboard' }, { label: 'Profile' }]}
      />

      <StaffProfileContent onEdit={() => navigate('/salestaff/settings')} />
    </Container>
  )
}
