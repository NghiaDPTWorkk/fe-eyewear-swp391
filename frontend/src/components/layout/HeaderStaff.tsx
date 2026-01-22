import type { ReactNode } from 'react'
import { Container } from './container'

/**
 * HeaderStaff Component - Flexible header layout with left, center, and right sections
 *
 * @example
 * // Basic usage with all three sections
 * <HeaderStaff
 *   left={<Logo />}
 *   center={<SearchBar />}
 *   right={<UserMenu />}
 * />
 *
 * @example
 * // Without center section (optional)
 * <HeaderStaff
 *   left={<Logo />}
 *   right={<UserMenu />}
 * />
 *
 * @example
 * // Custom container width and justify
 * <HeaderStaff
 *   containerWidth="100%"
 *   containerJustify="space-around"
 *   left={<Logo />}
 *   center={<SearchBar />}
 *   right={<UserMenu />}
 * />
 *
 * Layout structure:
 * - Outer wrapper: Container with customizable maxWidth (default: 70%)
 * - Left section: Wrapped in div with "flex justify-end" (right-aligned content)
 * - Center section: Wrapped in div with "flex-1" (takes remaining space)
 * - Right section: Wrapped in div (standard block)
 */
interface HeaderStaffProps {
  /** Container max width, default: '70%' */
  containerWidth?: string
  /** Override Container's justify-content CSS property */
  containerJustify?: string
  /** Left section content (optional) - will be right-aligned within its container */
  left?: ReactNode
  /** Center section content (optional) - will expand to fill available space */
  center?: ReactNode
  /** Right section content (required) */
  right: ReactNode
}

export function HeaderStaff({
  containerWidth = '70%',
  containerJustify,
  left,
  center,
  right
}: HeaderStaffProps) {
  return (
    <header className="w-full border-b border-gray-300">
      <Container maxWidth={containerWidth} justify={containerJustify}>
        <div className="flex items-center justify-between w-full h-[60px] gap-4">
          {left && <div className="flex justify-end">{left}</div>}

          {center && <div className="flex-1">{center}</div>}

          <div>{right}</div>
        </div>
      </Container>
    </header>
  )
}
