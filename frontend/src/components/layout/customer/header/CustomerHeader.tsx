import { Container } from '@/components'
import type { ReactNode } from 'react'

interface CustomerHeaderProps {
  containerWidth?: string
  containerJustify?: string

  logoNavList?: ReactNode
  searchNavListIcon?: ReactNode

  logo?: ReactNode
  navListContent?: ReactNode
  navListIcon?: ReactNode

  leftJustify?: string
  centerJustify?: string
  rightJustify?: string
}

export default function CustomerHeader({
  containerWidth = '100%',
  containerJustify,
  logoNavList,
  searchNavListIcon,
  logo,
  navListContent,
  navListIcon,
  leftJustify = 'flex-start',
  centerJustify = 'center',
  rightJustify = 'flex-end'
}: CustomerHeaderProps) {
  const isMode1 = logoNavList !== undefined || searchNavListIcon !== undefined
  const isMode2 = logo !== undefined || navListContent !== undefined || navListIcon !== undefined

  if (isMode1 && !isMode2) {
    return (
      <header className="w-full border-b border-gray-300">
        <Container maxWidth={containerWidth} justify={containerJustify}>
          <div className="flex items-center justify-between w-full h-[60px] gap-4">
            {logoNavList && (
              <div className="flex items-center gap-4" style={{ justifyContent: leftJustify }}>
                {logoNavList}
              </div>
            )}

            {searchNavListIcon && (
              <div className="flex items-center gap-4" style={{ justifyContent: rightJustify }}>
                {searchNavListIcon}
              </div>
            )}
          </div>
        </Container>
      </header>
    )
  }

  return (
    <header className="w-full bg-white border-b border-mint-300 sticky top-0 z-50 shadow-sm">
      <Container maxWidth={containerWidth} justify={containerJustify}>
        <div className="flex items-center justify-between w-full h-[70px] gap-4">
          {logo && (
            <div className="flex" style={{ justifyContent: leftJustify }}>
              {logo}
            </div>
          )}

          {navListContent && (
            <div className="flex-1 flex" style={{ justifyContent: centerJustify }}>
              {navListContent}
            </div>
          )}

          {navListIcon && (
            <div className="flex" style={{ justifyContent: rightJustify }}>
              {navListIcon}
            </div>
          )}
        </div>
      </Container>
    </header>
  )
}
