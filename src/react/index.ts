// React exports
export { CookieProvider, useCookieConsent } from './CookieProvider'
export { CookieBanner } from './components/CookieBanner'
export { CookieDetails } from './components/CookieDetails'

// Core types (مفيدة للمطورين)
export type {
  CookieConsentConfig,
  CookieCategory,
  ConsentState,
  ConsentDecision,
  BannerMode,
  BannerPosition,
  Theme,
  Language,
} from '../core/types'

// Core helpers
export { clearConsent } from '../core/storage'
export { DEFAULT_CATEGORIES } from '../core/consent'
