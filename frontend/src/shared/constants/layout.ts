export const LAYOUT = {
  SIDEBAR: {
    WIDTH: 260,
    WIDTH_PX: '260px',
    COLLAPSED_WIDTH: 64,
    COLLAPSED_WIDTH_PX: '64px'
  },

  HEADER: {
    HEIGHT: 64,
    HEIGHT_PX: '64px'
  },

  SPACING: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    '2xl': 32,
    '3xl': 48
  },

  PAGE: {
    PADDING: 24,
    PADDING_PX: '24px'
  },

  SECTION: {
    GAP: 16,
    GAP_PX: '16px'
  },

  CARD: {
    PADDING: 12,
    PADDING_PX: '12px'
  },

  ANIMATION: {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500
  },

  Z_INDEX: {
    DROPDOWN: 1000,
    STICKY: 1020,
    FIXED: 1030,
    MODAL_BACKDROP: 1040,
    MODAL: 1050,
    POPOVER: 1060,
    TOOLTIP: 1070
  }
} as const

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
} as const

export type LayoutConstants = typeof LAYOUT
export type Breakpoints = typeof BREAKPOINTS
