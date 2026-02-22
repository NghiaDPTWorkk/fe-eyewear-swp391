import type { ReactNode } from 'react'

import { Container } from '../container'

interface HeaderProps {
  containerWidth?: string
  containerJustify?: string

  // Mode 1: [Logo + NavList] | [Search + NavListIcon]
  logoNavList?: ReactNode
  searchNavListIcon?: ReactNode

  // Mode 2: Logo | NavListContent | NavListIcon
  logo?: ReactNode
  navListContent?: ReactNode
  navListIcon?: ReactNode

  leftJustify?: string
  centerJustify?: string
  rightJustify?: string
}

export default function Header({
  containerWidth = '100%',
  containerJustify,

  // Mode 1 props
  logoNavList,
  searchNavListIcon,

  // Mode 2 props
  logo,
  navListContent,
  navListIcon,

  // Custom justify
  leftJustify = 'flex-start',
  centerJustify = 'center',
  rightJustify = 'flex-end'
}: HeaderProps) {
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

  // Mode 2: 3 sections layout
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
