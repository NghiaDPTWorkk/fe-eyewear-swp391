import type { ReactNode } from 'react'
import { Container } from './container' // Import from barrel export

interface HeaderProps {
  containerWidth?: string // Default will be '70%', can override to '100%'
  logo?: ReactNode // Optional - for staff pages
  search: ReactNode // Required - search component
  iconList: ReactNode // Required - icon list component
}

export function Header({ containerWidth = '70%', logo, search, iconList }: HeaderProps) {
  return (
    <header className="header-wrapper" style={{ width: '100%', borderBottom: '1px solid #ddd' }}>
      <Container maxWidth={containerWidth}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            height: '60px',
            gap: '16px'
          }}
        >
          {logo && <div style={{ flex: '0 0 auto' }}>{logo}</div>}

          <div style={{ flex: '1 1 auto' }}>{search}</div>

          <div style={{ flex: '0 0 auto' }}>{iconList}</div>
        </div>
      </Container>
    </header>
  )
}
