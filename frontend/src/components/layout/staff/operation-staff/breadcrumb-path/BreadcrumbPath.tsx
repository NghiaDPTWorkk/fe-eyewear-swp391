import { Link } from 'react-router-dom'

interface BreadcrumbProps {
  paths: string[]
}

const BreadcrumbPath = ({ paths }: BreadcrumbProps) => {
  return (
    <div className="flex items-center gap-2 text-sm mb-2 font-medium">
      {paths.map((path, index) => {
        const isLast = index === paths.length - 1

        return (
          <div key={index} className="flex items-center gap-2">
            {isLast ? (
              <span className="text-primary-500 font-bold">{path}</span>
            ) : (
              <>
                <Link
                  // Sửa lỗi đánh máy: 'operationstaff' thành 'operation-staff'
                  to={`/operation-staff/${path.toLowerCase().replace(/\s+/g, '-')}`}
                  className="text-neutral-400 hover:text-primary-500 transition-colors"
                >
                  {path}
                </Link>
                <span className="text-neutral-300">/</span>
              </>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default BreadcrumbPath
