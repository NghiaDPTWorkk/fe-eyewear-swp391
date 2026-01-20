import type { ReactNode } from 'react'
import { Container } from './container' // Import from barrel export

interface HeaderItem {
  component: ReactNode
  width: string
}

interface HeaderProps {
  items: HeaderItem[]
}

export function Header({ items }: HeaderProps) {
  return (
    <header className="header-wrapper" style={{ width: '100%', borderBottom: '1px solid #ddd' }}>
      <Container>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            height: '60px'
          }}
        >
          {items.map((item, index) => (
            <div key={index} style={{ width: item.width }}>
              {item.component}
            </div>
          ))}
        </div>
      </Container>
    </header>
  )
}
