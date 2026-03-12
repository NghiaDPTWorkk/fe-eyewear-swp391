import { PageHeader } from '@/features/staff/components/common'
import { Container } from '@/shared/components/ui-core'
import { useNavigate } from 'react-router-dom'
import { StaffProfileContent } from '@/features/staff/components/profile/StaffProfileContent'

export default function AdminProfilePage() {
  const navigate = useNavigate()

  return (
    <Container maxWidth="1400px" className="space-y-8 animate-in fade-in duration-500">
      <PageHeader
        title="Admin Profile"
        subtitle="Manage system administrator details and professional record"
        breadcrumbs={[{ label: 'Dashboard', path: '/admin/dashboard' }, { label: 'Profile' }]}
      />

      <StaffProfileContent onEdit={() => navigate('/admin/settings')} />
    </Container>
  )
}
