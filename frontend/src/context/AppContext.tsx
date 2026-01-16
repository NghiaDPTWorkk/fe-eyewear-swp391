export interface AppThemeType {
  theme: 'light' | 'dark'
  setTheme: (theme: 'light' | 'dark') => void
  language: 'vi' | 'en'
  setLanguage: (lang: 'vi' | 'en') => void
}
