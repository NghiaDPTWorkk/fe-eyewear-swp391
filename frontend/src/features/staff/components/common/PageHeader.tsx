/**
 * PageHeader Component
 * Consistent header with breadcrumb navigation for all Staff pages.
 */
import { Link } from 'react-router-dom'
import { STYLES, TYPOGRAPHY } from '../../constants/staffDesignSystem'

interface BreadcrumbItem {
  label: string
  path?: string
}

interface PageHeaderProps {
  title: string
  subtitle?: string
  breadcrumbs: BreadcrumbItem[]
  noMargin?: boolean
}

export default function PageHeader({ title, subtitle, breadcrumbs, noMargin }: PageHeaderProps) {
  return (
    <div className={noMargin ? '' : 'mb-3'}>
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm mb-1 font-medium">
        {breadcrumbs.map((item, index) => {
          const isLast = index === breadcrumbs.length - 1
          return (
            <span key={item.label} className="flex items-center gap-2">
              {item.path && !isLast ? (
                <Link to={item.path} className={STYLES.breadcrumbLink}>
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? STYLES.breadcrumbActive : STYLES.breadcrumbLink}>
                  {item.label}
                </span>
              )}
              {!isLast && <span className={STYLES.breadcrumbSeparator}>/</span>}
            </span>
          )
        })}
      </div>

      {/* Title */}
      <h1 className={TYPOGRAPHY.pageTitle}>{title}</h1>
      {subtitle && <p className={TYPOGRAPHY.pageSubtitle}>{subtitle}</p>}
    </div>
  )
}
