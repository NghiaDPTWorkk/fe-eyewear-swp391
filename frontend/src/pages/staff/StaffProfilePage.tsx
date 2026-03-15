import { PageHeader } from '@/features/staff/components/common'
import { Container } from '@/shared/components/ui-core'
import { useNavigate } from 'react-router-dom'
import { StaffProfileContent } from '@/features/staff/components/Profile/StaffProfileContent'

interface StaffProfilePageProps {
  dashboardPath: string
  settingsPath: string
}

export default function StaffProfilePage({
  dashboardPath = '/sale-staff/dashboard',
  settingsPath = '/sale-staff/settings'
}: StaffProfilePageProps) {
  const navigate = useNavigate()

  return (
    <Container maxWidth="1400px" className="space-y-8 animate-in fade-in duration-500">
      <PageHeader
        title="My Profile"
        subtitle="View and manage your personal professional information"
        breadcrumbs={[{ label: 'Dashboard', path: dashboardPath }, { label: 'Profile' }]}
      />

      <StaffProfileContent onEdit={() => navigate(settingsPath)} />
    </Container>
  )
}
