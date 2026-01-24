import { cva } from 'class-variance-authority'

export const menuItemVariants = cva(
  [
    'w-full flex items-center gap-3',
    'px-4 py-2.5 rounded-lg',
    'transition-all duration-200',
    'text-sm font-normal',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1'
  ],
  {
    variants: {
      active: {
        true: 'bg-primary-200 text-primary-800 font-medium',
        false: 'text-gray-700 hover:bg-primary-100 hover:text-gray-900'
      },
      hasDropdown: {
        true: '',
        false: ''
      }
    },
    compoundVariants: [
      {
        active: true,
        hasDropdown: true,
        className: 'bg-transparent text-gray-700 font-normal hover:bg-primary-50'
      }
    ],
    defaultVariants: {
      active: false,
      hasDropdown: false
    }
  }
)

export const menuItemIconVariants = cva('text-lg transition-colors', {
  variants: {
    active: {
      true: 'text-primary-600',
      false: 'text-gray-500'
    }
  },
  defaultVariants: {
    active: false
  }
})

export const subMenuItemVariants = cva(
  [
    'w-full text-left px-4 py-2',
    'text-sm rounded-lg',
    'transition-colors duration-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1'
  ],
  {
    variants: {
      active: {
        true: 'bg-primary-200 text-primary-800 font-medium',
        false: 'text-gray-600 hover:bg-primary-100 hover:text-gray-900'
      }
    },
    defaultVariants: {
      active: false
    }
  }
)

export const badgeVariants = cva('px-2 py-0.5 text-xs rounded font-medium', {
  variants: {
    variant: {
      default: 'bg-gray-100 text-gray-600',
      primary: 'bg-primary-100 text-primary-700',
      danger: 'bg-danger-100 text-danger-700'
    }
  },
  defaultVariants: {
    variant: 'default'
  }
})
