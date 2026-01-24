import { LAYOUT } from '@/shared/constants/layout'

export const BRAND_CONFIG = {
  name: 'OpticView',
  tagline: 'Your Vision, Our Mission',
  logo: {
    initial: 'O',
    bgColor: 'bg-primary-500',
    textColor: 'text-white'
  }
} as const

export const APP_CONFIG = {
  sidebarWidth: LAYOUT.SIDEBAR.WIDTH_PX,
  sidebarWidthNum: LAYOUT.SIDEBAR.WIDTH,
  headerHeight: LAYOUT.HEADER.HEIGHT_PX,
  animationDuration: LAYOUT.ANIMATION.NORMAL
} as const

export type BrandConfig = typeof BRAND_CONFIG
export type AppConfig = typeof APP_CONFIG
