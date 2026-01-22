import type { ReactNode } from 'react'
import { Container } from './container'

interface HeaderStaffProps {
  containerWidth?: string
  logo?: ReactNode
  search?: ReactNode
  iconList: ReactNode
}

export function HeaderStaff({ containerWidth = '70%', logo, search, iconList }: HeaderStaffProps) {
  return (
    <header className="w-full border-b border-gray-300">
      <Container maxWidth={containerWidth}>
        <div className="flex items-center justify-between w-full h-[60px] gap-4">
          {logo && <div className="flex-none">{logo}</div>}

          {search && <div className="flex-1">{search}</div>}

          <div className="flex-none">{iconList}</div>
        </div>
      </Container>
    </header>
  )
}
